import Dijkstra from "./Dijkstra";
import JsonFormat from "./JsonFormat";
import {locationTypeEnum} from "../map/Enum";
import LRPNodeHelper from "./LRPNodeHelper";

export default class LineEncoder {
    static encode(mapDataBase,lines,posOffset,negOffset){
        let lrpNodes = [];
        let shortestPaths = [];
        let offsets = {
            posOffset: posOffset,
            negOffset: negOffset
        };

        // 1: check validity of the location and offsets to be encoded
        LineEncoder.checkValidityAndAdjustOffsets(lines,offsets);

        // 2: adjust start and end nodes of the location to represent valid map nodes
        let expanded = this.adjustToValidStartEnd(mapDataBase,lines,offsets);
        lrpNodes.push(lines[0].getStartNode());

        // 3: determine coverage of the location by a shortest-path
        let shortestPath = Dijkstra.shortestPath(lines[expanded.front].getStartNode(),lines[lines.length-1-expanded.back].getEndNode());
        shortestPaths.push(shortestPath);

        // 4: check whether the calculated shortest-path covers the location completely
        let checkResult = this.checkShortestPathCoverage(expanded.front,lines,shortestPath.lines);

        //location not completely covered, intermediate LRPs needed
        while(! checkResult.fullyCovered){
            // 5: Determine the position of a new intermediate location reference point so that the part of
            // the location between the start of the shortest-path calculation and the new intermediate
            // is covered completely by a shortest-path.
            if(this.nodeIsValid(lines[checkResult.lrpNodeIndexInLoc])){
                lrpNodes.push(lines[checkResult.lrpNodeIndexInLoc].getEndNode());
                // 6: go to step 3 and restart shortest path calculation between the new intermediate location
                // reference point and the end of the location
                shortestPath = Dijkstra.shortestPath(lines[checkResult.lrpNodeIndexInLoc].getEndNode(),lines[lines.length-1-expanded.back].getEndNode());
                shortestPaths.push(shortestPath);
                checkResult = this.checkShortestPathCoverage(checkResult.lrpNodeIndexInLoc+1,lines,shortestPath.lines);
            }
            else{
                //find a valid node on the shortest path that leads to the invalid node
                let validNodeResult = this.findValidNodeOnSP(shortestPath.lines,checkResult.lrpNodeIndexInSP);
                lrpNodes.push(validNodeResult.validNode);
                shortestPath = Dijkstra.shortestPath(validNodeResult.validNode,lines[lines.length-1-expanded.back].getEndNode());
                shortestPaths.push(shortestPath);
                checkResult = this.checkShortestPathCoverage(validNodeResult.lrpNodeIndexInLoc,lines,shortestPath.lines);
            }
        }

        //push the last node of the expanded location to the list of LRPs
        lrpNodes.push(lines[lines.length-1].getEndNode());

        // 7: concatenate the calculated shortest-paths for a complete coverage of the location and
        // form an ordered list of location reference points (from the start to the end of the location)
        let concatenatedSPResult = this.concatenateAndValidateShortestPaths(lrpNodes,shortestPaths,offsets);
        checkResult = this.checkShortestPathCoverage(0,lines,concatenatedSPResult.shortestPath);
        if(!checkResult.fullyCovered){
            throw "something went wrong with determining the concatenated shortest path";
        }

        // 8: check validity of the location reference path. If the location reference path is invalid then
        // go to step 9, if the location reference path is valid, then go to step 10
        while(!concatenatedSPResult.isValid){
            // 9: add a sufficient number of additional intermediate location reference points if the
            // distance between two location reference points exceeds the maximum distance.
            // Remove the start/end LR-point if the positive/negative offset value exceeds the length
            // of the corresponding path.
            if(concatenatedSPResult.wrongPosOffset){
                //remove LRP at the front
                this.removeLRPatFront(lrpNodes,shortestPaths,offsets);
                //todo: controleer dat posOffset kan worden aangepast
                concatenatedSPResult = this.concatenateAndValidateShortestPaths(lrpNodes,shortestPaths,offsets);
            }
            if(concatenatedSPResult.wrongNegOffset){
                //remove LRP at the end
                this.removeLRPatEnd(lrpNodes,shortestPaths,offsets);
                concatenatedSPResult = this.concatenateAndValidateShortestPaths(lrpNodes,shortestPaths,offsets);
            }
            if(concatenatedSPResult.wrongIntermediateDistance){
                //add intermediate LRPs
                this.addIntermediateLRPs(lrpNodes,shortestPaths,lines);
                //todo
            }
            //check if the location is still fully covered
            checkResult = this.checkShortestPathCoverage(0,lines,concatenatedSPResult.shortestPath);
            if(!checkResult.fullyCovered){
                throw "something went wrong with determining the concatenated shortest path";
            }
        }

        // 10: create physical representation of the location reference (json)
        let LRPs = LRPNodeHelper.lrpNodesToLRPs(lrpNodes,shortestPaths);
        return JsonFormat.exportJson(locationTypeEnum.LINE_LOCATION,LRPs,offsets.posOffset,offsets.negOffset);
    }

    static checkValidityAndAdjustOffsets(lines,offsets){
        if(lines !== undefined && lines.length > 0){
            let pathLength = lines[0].getLength();
            let prevLineEndNode = lines[0].getEndNode();
            let i=1;
            while(i<lines.length && lines[i] !== undefined
            && lines[i].getStartNode().getID() === prevLineEndNode.getID()){
                prevLineEndNode = lines[i].getEndNode();
                pathLength+=lines[i].getLength();
                i++;
                //todo: check if also traversable from start to end
            }
            if(i !== lines.length){
                throw "line isn't a connected path";
            }
            if(offsets.posOffset + offsets.negOffset >= pathLength){
                throw "offsets longer than path: path="+pathLength+" posOffset="+offsets.posOffset+ " negOffset="+offsets.negOffset;
            }
            //remove unnecessary start or end lines
            while(lines.length>0 && offsets.posOffset >= lines[0].getLength()){
                console.log("first line should be omitted");
                offsets.posOffset -= lines[0].getLength();
                lines.shift();
            }
            while(lines.length>0 && offsets.negOffset >= lines[lines.length-1].getLength()){
                console.log("last line should be omitted");
                offsets.negOffset -= lines[lines.length-1].getLength();
                lines.pop();
            }
            //todo vereisten voor binary formaat
            //todo if(pathLength > 15km) ... happens in step 8
        }
    }

    // if this step fails, the encoding can proceed to the next step
    static adjustToValidStartEnd(mapDataBase,lines,offsets){
        let expanded = {
            front: 0,
            back: 0
        };

        let pathLength = 0;
        lines.forEach(function (line) {
           pathLength+=line.getLength();
        });
        // check if map has turn restrictions, detect invalid nodes according rule 4 of the whitepaper
        if(!mapDataBase.hasTurnRestrictions() && !mapDataBase.hasTurnRestrictionOnPath(lines)){
            //node is invalid if
            //one line enters and line leaves (note: lines are directed)
            //two lines enter and two lines leave, but they are connected to only 2 adjacent nodes,
            //unless a u-turn is possible at that node
            if(lines[0] !== undefined && lines[lines.length-1] !== undefined){
                let startLine = lines[0];
                let endLine = lines[lines.length-1];
                let startNode = startLine.getStartNode();
                let endNode = endLine.getEndNode();

                //start node expansion
                while(LineEncoder.nodeIsValid(startNode)){
                    if(startNode.getIncomingLines().length === 1){
                        this.expand(startNode.getIncomingLines()[0],startNode,startLine,lines,pathLength,offsets.posOffset);
                        expanded.front += 1;
                    }
                    else if(startNode.getIncomingLines().length === 2){
                        // one of the outgoing lines is the second line of the location, so expansion should happen in the other direction
                        if(startNode.getIncomingLines()[0].getStartNode().getID() === startLine.getEndNode().getID()){
                            //expand to the start node of the second incoming line
                            this.expand(startNode.getIncomingLines()[0],startNode,startLine,lines,pathLength,offsets.posOffset);
                            expanded.front += 1;
                        }
                        else if(startNode.getIncomingLines()[1].getStartNode().getID() === startLine.getEndNode().getID()){
                            //expand to the start node of the first incoming line
                            this.expand(startNode.getIncomingLines()[1],startNode,startLine,lines,pathLength,offsets.posOffset);
                            expanded.front += 1;
                        }
                        else{
                            console.log("something went wrong at determining the start node expansion node");
                        }
                    }
                    else{
                        console.log("something went wrong with determining if expansion is needed");
                    }
                }
                //end node expansion
                while(this.nodeIsValid(endNode)){
                    if(endNode.getIncomingLines().length === 1){
                        this.expand(endNode.getIncomingLines()[0],endNode,endLine,lines,pathLength,offsets.negOffset);
                        expanded.back += 1;
                    }
                    else if(endNode.getIncomingLines().length === 2){
                        // one of the incoming lines is the second-last line of the location, so expansion should happen in the other direction
                        if(endNode.getIncomingLines()[0].getStartNode().getID() === endLine.getStartNode().getID()){
                            //expand to the start node of the second incoming line
                            this.expand(endNode.getIncomingLines()[1],endNode,endLine,lines,pathLength,offsets.negOffset);
                            expanded.back += 1;
                        }
                        else if(endNode.getIncomingLines()[1].getStartNode().getID() === endLine.getStartNode().getID()){
                            //expand to the start node of the first incoming line
                            this.expand(endNode.getIncomingLines()[0],endNode,endLine,lines,pathLength,offsets.negOffset);
                            expanded.back += 1;
                        }
                        else{
                            console.log("something went wrong at determining the end node expansion node");
                        }
                    }
                    else{
                        console.log("something went wrong with determining if expansion is needed");
                    }
                }
                return expanded;
            }
        }
        //todo what if there are turn restrictions?
    }

    static nodeIsValid(node){
        let oneInOneOut = (node.getIncomingLines().length === 1 && node.getOutgoingLines().length === 1);
        let twoInTwoOut = (node.getIncomingLines().length === 2 && node.getOutgoingLines().length === 2);

        let expansionNeeded = oneInOneOut || twoInTwoOut;

        if(twoInTwoOut){
            let firstIncomingStartEqFirstOutgoingEnd = (node.getIncomingLines()[0].getStartNode().getID() === node.getOutgoingLines()[0].getEndNode().getID());
            let secondIncomingStartEqFirstOutgoingEnd = (node.getIncomingLines()[1].getStartNode().getID() === node.getOutgoingLines()[0].getEndNode().getID());
            let firstIncomingStartEqSecondOutgoingEnd = (node.startNode.getIncomingLines()[0].getStartNode().getID() === node.getOutgoingLines()[1].getEndNode().getID());
            let secondIncomingStartEqSecondOutgoingEnd = (node.startNode.getIncomingLines()[1].getStartNode().getID() === node.getOutgoingLines()[1].getEndNode().getID());

            expansionNeeded &= ((firstIncomingStartEqFirstOutgoingEnd && secondIncomingStartEqSecondOutgoingEnd) || (firstIncomingStartEqSecondOutgoingEnd && secondIncomingStartEqFirstOutgoingEnd));
        }

        return expansionNeeded;
    }

    static expand(lineToAdd,lastNode,lastLine,lines,pathLength,offset){
        if(pathLength + lineToAdd.getLength() < 15000){
            pathLength += lineToAdd.getLength();
            offset += lineToAdd.getLength();
            lines.unshift(lineToAdd);
            lastLine = lineToAdd;
            lastNode = lineToAdd.getStartNode();
        }
        else{
            console.log("start node expansion aborted because path length exceeding 15000m")
        }
    }

    static checkShortestPathCoverage(lStartIndex,lines,shortestPath){
        let spIndex = 0;
        let lIndex = lStartIndex;

        while(lIndex < lines.length && spIndex < shortestPath.length
            && lines[lIndex].getID() === shortestPath[spIndex].getID()
            ){
            spIndex++;
            lIndex++;
        }
        if(spIndex + lStartIndex === lIndex){
            return {
                fullyCovered: true,
                lrpNodeIndexInSP: spIndex-1,
                lrpNodeIndexInLoc: lIndex-1
            }
        }
        else{
            return {
                fullyCovered: false,
                lrpNodeIndexInSP: spIndex-1,
                lrpNodeIndexInLoc: lIndex-1
            }
        }
    }

    static findValidNodeOnSP(shortestPath,endIndex){
        //the node on the endIndex was invalid, otherwise this function shouldn't have been called
        //the next unchecked node is the one before endIndex
        let possibleIndex = endIndex-1;
        let possibleNode = shortestPath[possibleIndex];


        while(!this.nodeIsValid(possibleNode) && possibleIndex >= 0){
            possibleIndex--;
            possibleNode = shortestPath[possibleIndex];
        }

        if(possibleIndex <= 0){
            //there is no valid node except for the start node of the shortest path
            //which should have been a valid node from the beginning
            //if no valid node is found, an invalid node may be used
            return {
                validNode: shortestPath[endIndex],
                lrpNodeIndexInLoc: endIndex
            }
        }
        else{
            return {
                validNode: possibleNode,
                lrpNodeIndexInLoc: possibleIndex
            }
        }
    }

    static concatenateAndValidateShortestPaths(lrpNodes,shortestPaths,offsets){
        let isValid = true;
        let distanceBetweenFirstTwoLength = 0;
        let distanceBetweenLastTwoLength = 0;
        let wrongPosOffset = false;
        let wrongNegOffset = false;
        let wrongIntermediateOffset = false;

        if(lrpNodes.length-1 === shortestPaths.length){
            let shortestPath = [];
            for(let i=0;i<shortestPaths.length;i++){
                let a = 0;
                let lengthBetweenLRPs = 0;
                let line = shortestPaths[i].lines[a];
                //while the start node of a line is not the next LRP node, this line can be added
                //otherwise we should add the lines of the shortest path of that LRP node
                while(line !== undefined && line.getStartNode().getID() !== lrpNodes[i+1].getID()){
                    shortestPath.push(line);
                    lengthBetweenLRPs += line.getLength();
                    if(i===0){
                        distanceBetweenFirstTwoLength += line.getLength();
                    }
                    if(i===shortestPath.length-1){
                        distanceBetweenLastTwoLength += line.getLength();
                    }
                    a++;
                    line = shortestPaths[i].lines[a];
                }
                if(lengthBetweenLRPs >= 15000){
                    isValid = false;
                    wrongIntermediateOffset = true;
                }
            }
            //check if offset values are shorter then the distance between the first two/last two location reference points
            if(offsets.posOffset >= distanceBetweenFirstTwoLength){
                // can happen if we added extra intermediate LRPs on invalid nodes
                isValid = false;
                wrongPosOffset = true;
            }
            else if(offsets.negOffset >= distanceBetweenLastTwoLength){
                // can happen if we added extra intermediate LRPs on invalid nodes
                isValid = false;
                wrongNegOffset = true;
            }
            return {
                shortestPath: shortestPath,
                isValid: isValid,
                wrongPosOffset: wrongPosOffset,
                wrongNegOffset: wrongNegOffset,
                wrongIntermediateDistance: wrongIntermediateOffset
            }
        }
        else{
            throw "the amount of shortest paths is not equal as the amount of lrp nodes"
        }
    }

    static removeLRPatFront(lrpNodes,shortestPaths,offsets){
        if(offsets.posOffset>=shortestPaths[0].length
            && lrpNodes.length > 0 && shortestPaths.length > 0){
            offsets.posOffset -= shortestPaths[0].length;
            lrpNodes.shift();
            shortestPaths.shift();
        }
        else{
            console.log("unnecessary removing of LRP at front");
        }
    }

    static removeLRPatEnd(lrpNodes,shortestPaths,offsets){
        if(offsets.negOffset>=shortestPaths[shortestPaths.length-1].length
            && lrpNodes.length > 0 && shortestPaths.length > 0){
            offsets.negOffset -= shortestPaths[shortestPaths.length-1].length;
            lrpNodes.pop();
            shortestPaths.pop();
        }
        else{
            console.log("unnecessary removing of LRP at end");
        }
    }

    static addIntermediateLRPs(lrpNodes,shortestPaths,lines){
        //todo
        console.log("todo");
    }
}