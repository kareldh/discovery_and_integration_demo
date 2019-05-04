import Dijkstra from "./Dijkstra";
import {locationTypeEnum} from "../map/Enum";
import LRPNodeHelper from "./LRPNodeHelper";
import {configProperties} from "./CoderSettings";

export default class LineEncoder {
    static encode(mapDataBase,linesToEncode,posOffset,negOffset){
        let lines = linesToEncode.slice();
        let lrpLines = [];
        let shortestPaths = [];
        let offsets = {
            posOffset: Math.round(posOffset*configProperties.internalPrecision),
            negOffset: Math.round(negOffset*configProperties.internalPrecision)
        };

        // 1: check validity of the location and offsets to be encoded
        LineEncoder.checkValidityAndAdjustOffsets(lines,offsets);

        // 2: adjust start and end nodes of the location to represent valid map nodes
        let expanded = this.adjustToValidStartEnd(mapDataBase,lines,offsets); //lines[expanded.front] to lines[lines.length-1-expanded.back] can NOT be used, the full path should be used in SP calculation!!!
        lrpLines.push(lines[0]);

        // 3: determine coverage of the location by a shortest-path
        let shortestPath;
        // 4: check whether the calculated shortest-path covers the location completely
        let checkResult;
        if(lines.length === 1){
            //if there is only line, the sp calculation would return the line in the other direction of the given line (but wouldn't be used further in the algoritm
            shortestPath = {
                lines: [],
                length: 0
            };
            checkResult = {
                fullyCovered: true,
                lrpIndexInSP: 1,
                lrpIndexInLoc: 1
            }
        }
        else{
            shortestPath = Dijkstra.shortestPath(lines[0].getEndNode(),lines[lines.length-1].getStartNode());
            checkResult = this.checkShortestPathCoverage(1,lines,shortestPath.lines,lines.length-1);
        }
        shortestPaths.push(shortestPath);

        //location not completely covered, intermediate LRPs needed
        LineEncoder.addLRPsUntilFullyCovered(checkResult,lines,lrpLines,shortestPaths,shortestPath,expanded);
        // 7: concatenate the calculated shortest-paths for a complete coverage of the location and
        // form an ordered list of location reference points (from the start to the end of the location)
        let concatenatedSPResult = this.concatenateAndValidateShortestPaths(lrpLines,shortestPaths,offsets);
        checkResult = this.checkShortestPathCoverage(0,lines,concatenatedSPResult.shortestPath,lines.length);
        if(!checkResult.fullyCovered){
            throw Error("something went wrong with determining the concatenated shortest path");
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
                this.removeLRPatFront(lrpLines,offsets,concatenatedSPResult.distanceBetweenFirstTwo);
                concatenatedSPResult = this.concatenateAndValidateShortestPaths(lrpLines,shortestPaths,offsets);
            }
            if(concatenatedSPResult.wrongNegOffset){
                //remove LRP at the end
                this.removeLRPatEnd(lrpLines,offsets,concatenatedSPResult.distanceBetweenLastTwo);
                concatenatedSPResult = this.concatenateAndValidateShortestPaths(lrpLines,shortestPaths,offsets);
            }
            if(concatenatedSPResult.wrongIntermediateDistance){
                //add intermediate LRPs
                this.addIntermediateLRPs(lrpLines,lines);
                //todo
                throw Error("not yet supported");
            }
            //check if the location is still fully covered
            checkResult = this.checkShortestPathCoverage(0,lines,concatenatedSPResult.shortestPath,lines.length);
            if(!checkResult.fullyCovered){
                throw Error("something went wrong while making the concatenated shortest path valid");
            }
        }

        // 10: create physical representation of the location reference (json)
        let LRPs = LRPNodeHelper.lrpLinesToLRPs(lrpLines,shortestPaths);
        return {
            type:locationTypeEnum.LINE_LOCATION,
            LRPs: LRPs,
            posOffset: Math.round(offsets.posOffset/configProperties.internalPrecision),
            negOffset: Math.round(offsets.negOffset/configProperties.internalPrecision)
        };
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
                throw Error("line isn't a connected path");
            }
            if(offsets.posOffset + offsets.negOffset >= pathLength){
                throw Error("offsets longer than path: path="+pathLength+" posOffset="+offsets.posOffset+ " negOffset="+offsets.negOffset);
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

        let pathLength = {length: 0};
        lines.forEach(function (line) {
           pathLength.length+=line.getLength();
        });
        // check if map has turn restrictions, detect invalid nodes according rule 4 of the whitepaper
        if(!mapDataBase.hasTurnRestrictions() && !mapDataBase.hasTurnRestrictionOnPath(lines)){ //todo: why do we need to check this?
            //node is invalid if
            //one line enters and line leaves (note: lines are directed)
            //two lines enter and two lines leave, but they are connected to only 2 adjacent nodes,
            //unless a u-turn is possible at that node
            if(lines[0] !== undefined && lines[lines.length-1] !== undefined){
                //start node expansion
                let originalStartLineId = lines[0].getID();
                while(LineEncoder.nodeIsInValid(lines[0].getStartNode())
                    && !(expanded.front > 0 && lines[0].getID() === originalStartLineId)) //detect an infinite start node expansion
                {
                    if(lines[0].getStartNode().getIncomingLines().length === 1){
                        this.expand(lines[0].getStartNode().getIncomingLines()[0],lines,pathLength,offsets,true);
                        expanded.front += 1;
                    }
                    else if(lines[0].getStartNode().getIncomingLines().length === 2){
                        // one of the outgoing lines is the second line of the location, so expansion should happen in the other direction
                        if(lines[0].getStartNode().getIncomingLines()[0].getStartNode().getID() === lines[0].getEndNode().getID()){
                            //expand to the start node of the second incoming line
                            this.expand(lines[0].getStartNode().getIncomingLines()[1],lines,pathLength,offsets,true);
                            expanded.front += 1;
                        }
                        else if(lines[0].getStartNode().getIncomingLines()[1].getStartNode().getID() === lines[0].getEndNode().getID()){
                            //expand to the start node of the first incoming line
                            this.expand(lines[0].getStartNode().getIncomingLines()[0],lines,pathLength,offsets,true);
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
                if(expanded.front > 0 && lines[0].getID() === originalStartLineId){
                    // the line lays on a loop without valid nodes, so the line has been expanded with all the lines of the loop
                    // these added lines should be removed so only the original line remains
                    LineEncoder.undoExpansion(lines,originalStartLineId,expanded,offsets,true);
                }
                let originalEndLineId = lines[lines.length-1].getID();
                //end node expansion
                while(LineEncoder.nodeIsInValid(lines[lines.length-1].getEndNode())
                    && !(expanded.back > 0 && lines[lines.length-1].getID() === originalEndLineId)) // detect an infinite end node expansion
                {
                    if(lines[lines.length-1].getEndNode().getOutgoingLines().length === 1){
                        this.expand(lines[lines.length-1].getEndNode().getOutgoingLines()[0],lines,pathLength,offsets,false);
                        expanded.back += 1;
                    }
                    else if(lines[lines.length-1].getEndNode().getOutgoingLines().length === 2){
                        // one of the incoming lines is the second-last line of the location, so expansion should happen in the other direction
                        if(lines[lines.length-1].getEndNode().getOutgoingLines()[0].getEndNode().getID() === lines[lines.length-1].getStartNode().getID()){
                            //expand to the start node of the second incoming line
                            this.expand(lines[lines.length-1].getEndNode().getOutgoingLines()[1],lines,pathLength,offsets,false);
                            expanded.back += 1;
                        }
                        else if(lines[lines.length-1].getEndNode().getOutgoingLines()[1].getEndNode().getID() === lines[lines.length-1].getStartNode().getID()){
                            //expand to the start node of the first incoming line
                            this.expand(lines[lines.length-1].getEndNode().getOutgoingLines()[0],lines,pathLength,offsets,false);
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
                if(expanded.back > 0 && lines[lines.length-1].getID() === originalEndLineId){
                    // the line lays on a loop without valid nodes, so the line has been expanded with all the lines of the loop
                    // these added lines should be removed so only the original line remains
                    LineEncoder.undoExpansion(lines,originalEndLineId,expanded,offsets,false);
                }
            }
        }
        return expanded;
        //todo what if there are turn restrictions?
    }

    static nodeIsInValid(node){
        let oneInOneOut = (node.getIncomingLines().length === 1 && node.getOutgoingLines().length === 1);
        let twoInTwoOut = (node.getIncomingLines().length === 2 && node.getOutgoingLines().length === 2);

        let expansionNeeded = false;
        if(oneInOneOut){
            //if the incoming line starts from the same node as the outgoing line ends, this node has only one sibling (border node in our graph) and thus is a valid node
            expansionNeeded = (node.getIncomingLines()[0].getStartNode().getID() !== node.getOutgoingLines()[0].getEndNode().getID());
        }
        else if(twoInTwoOut){
            //todo: if a u-turn can be made at the node, the node should be valid: turn restrictions should be known, how to implement these?
            let firstIncomingStartEqFirstOutgoingEnd = (node.getIncomingLines()[0].getStartNode().getID() === node.getOutgoingLines()[0].getEndNode().getID());
            let secondIncomingStartEqFirstOutgoingEnd = (node.getIncomingLines()[1].getStartNode().getID() === node.getOutgoingLines()[0].getEndNode().getID());
            let firstIncomingStartEqSecondOutgoingEnd = (node.getIncomingLines()[0].getStartNode().getID() === node.getOutgoingLines()[1].getEndNode().getID());
            let secondIncomingStartEqSecondOutgoingEnd = (node.getIncomingLines()[1].getStartNode().getID() === node.getOutgoingLines()[1].getEndNode().getID());

            expansionNeeded = ((firstIncomingStartEqFirstOutgoingEnd && secondIncomingStartEqSecondOutgoingEnd) || (firstIncomingStartEqSecondOutgoingEnd && secondIncomingStartEqFirstOutgoingEnd));
        }

        return expansionNeeded;
    }

    static expand(lineToAdd,lines,pathLength,offsets,positive){
        if(pathLength.length + lineToAdd.getLength() < 15000*configProperties.internalPrecision){
            pathLength.length += lineToAdd.getLength();
            if(positive){
                offsets.posOffset += lineToAdd.getLength();
                lines.unshift(lineToAdd);
            }
            else{
                offsets.negOffset += lineToAdd.getLength();
                lines.push(lineToAdd);
            }
        }
        else{
            console.log("start node expansion aborted because path length exceeding 15000m")
        }
    }

    static undoExpansion(lines,originalLineId,expanded,offsets,positive){
        if(positive){
            if(lines[0].getID() === originalLineId){
                // the first line should be the line with the same ID as originalLineId and will be shifted out first
                offsets.posOffset -= lines[0].getLength();
                expanded.front--;
                lines.shift();
            }
            else{
                throw Error("undoExpansion at start node called but was not needed");
            }
            while(lines[0].getID() !== originalLineId){
                offsets.posOffset -= lines[0].getLength();
                expanded.front--;
                lines.shift();
            }
            if(expanded.front < 0){
                throw Error("Something went wrong during reversing the start node expansion.")
            }
        }
        else {
            if(lines[lines.length-1].getID() === originalLineId){
                // the last line should be the line with the same ID as originalLineId and will be popped of first
                offsets.negOffset -= lines[lines.length-1].getLength();
                expanded.back--;
                lines.pop();
            }
            else{
                throw Error("undoExpansion at end node called but was not needed");
            }
            while(lines[lines.length-1].getID() !== originalLineId){
                offsets.negOffset -= lines[lines.length-1].getLength();
                expanded.back--;
                lines.pop();
            }
            if(expanded.back < 0){
                throw Error("Something went wrong during reversing the end node expansion.")
            }
        }
    }

    static checkShortestPathCoverage(lStartIndex,lines,shortestPath,lEndIndex){ //lEndIndex is one greater than the last index to be checked (confer length of an array)
        if(lStartIndex === undefined || lines === undefined || shortestPath === undefined || lEndIndex === undefined){
            throw Error("One of the parameters is undefined.");
        }
        if(lEndIndex>lines.length){
            throw Error("lEndIndex can't be greater than lines.length");
        }
        else if(lStartIndex > lEndIndex){
            throw Error("lStartIndex can't be greater than lEndIndex");
        }
        let spIndex = 0;
        let lIndex = lStartIndex;

        if(lStartIndex === lEndIndex-1 && shortestPath.length  === 0){
            return {
                fullyCovered: true,
                lrpIndexInSP: spIndex,
                lrpIndexInLoc: lIndex++
            }
        }
        else {
            while (lIndex < lEndIndex && spIndex < shortestPath.length
                && lines[lIndex].getID() === shortestPath[spIndex].getID()
                ) {
                spIndex++;
                lIndex++;
            }
            //if even the first line of the shortest path is not correct, a new LRP (lines[lStartIndex].getStartNode()) should be added that has the lines[lStartIndex] as outgoing line
            //if only the first line of the shortest path is correct, the next line lines[lStartIndex+1] should start in a new LRP
            //so lrpIndexInLoc indicates the index of the line of which the startnode should be a new LRP, because that is the line that didn't match the shortest path
            if (lIndex === lEndIndex && spIndex + lStartIndex === lIndex) {
                return {
                    fullyCovered: true,
                    lrpIndexInSP: spIndex,
                    lrpIndexInLoc: lIndex
                }
            }
            else {
                return {
                    fullyCovered: false,
                    lrpIndexInSP: spIndex,
                    lrpIndexInLoc: lIndex
                }
            }
        }
    }

    static addLRPsUntilFullyCovered(prevCheckResult,lines,lrpLines,shortestPaths,prevShortestPath,expanded){
        let checkResult = prevCheckResult;
        let shortestPath = prevShortestPath;
        while(! checkResult.fullyCovered){
            // 5: Determine the position of a new intermediate location reference point so that the part of
            // the location between the start of the shortest-path calculation and the new intermediate
            // is covered completely by a shortest-path.
            if(!this.nodeIsInValid(lines[checkResult.lrpIndexInLoc].getStartNode())){
                //lrpNodes.push(lines[checkResult.lrpIndexInLoc].getStartNode());
                lrpLines.push(lines[checkResult.lrpIndexInLoc]);
                // 6: go to step 3 and restart shortest path calculation between the new intermediate location
                // reference point and the end of the location
                shortestPath = Dijkstra.shortestPath(lines[checkResult.lrpIndexInLoc].getEndNode(),lines[lines.length-1].getStartNode());
                shortestPaths.push(shortestPath);
                checkResult = this.checkShortestPathCoverage(checkResult.lrpIndexInLoc+1,lines,shortestPath.lines,lines.length-1);
            }
            else{
                // console.log(checkResult);
                throw Error("startnode is invalid");
                //todo: kan dit wel voorkomen? aangezien invalid enkel gaat indien 1 in 1 uit of 2 in 2 naar zelfde -> bij deze nodes kan nooit een afwijking van sp optreden want ze hebben eigenschap dat ze verbinding tussen maar 2 nodes vormen
                //find a valid node on the shortest path that leads to the invalid node
                let validNodeResult = this.findValidNodeOnSP(shortestPath.lines,checkResult.lrpIndexInSP);
                //lrpNodes.push(validNodeResult.validNode);
                shortestPath = Dijkstra.shortestPath(validNodeResult.validNode,lines[lines.length-1].getEndNode());
                shortestPaths.push(shortestPath);
                checkResult = this.checkShortestPathCoverage(validNodeResult.lrpIndexInLoc,lines,shortestPath.lines,lines.length-1);
            }
        }

        // push the last line of the expanded location to the list of LRPs,
        // even if the expanded location contains only one line: in that case lrpLines contains the line two times
        lrpLines.push(lines[lines.length-1]);
    }

    static findValidNodeOnSP(shortestPath,endIndex){
        //the node on the endIndex was invalid, otherwise this function shouldn't have been called
        //the next unchecked node is the one before endIndex
        let possibleIndex = endIndex-1;
        let possibleNode = shortestPath[possibleIndex];


        while(possibleIndex >= 0 && this.nodeIsInValid(possibleNode)){
            possibleIndex--;
            possibleNode = shortestPath[possibleIndex];
        }

        if(possibleIndex <= 0){
            //there is no valid node except for the start node of the shortest path
            //which should have been a valid node from the beginning
            //if no valid node is found, an invalid node may be used
            return {
                validNode: shortestPath[endIndex],
                lrpIndexInLoc: endIndex
            }
        }
        else{
            return {
                validNode: possibleNode,
                lrpIndexInLoc: possibleIndex
            }
        }
    }

    static concatenateAndValidateShortestPaths(lrpLines,shortestPaths,offsets){
        if(lrpLines === undefined || shortestPaths === undefined || offsets === undefined){
            throw Error("Parameters can not be undefined");
        }
        let isValid = true;
        let distanceBetweenFirstTwoLength = lrpLines[0].getLength();
        let distanceBetweenLastTwoLength = lrpLines[lrpLines.length-1].getLength();
        let wrongPosOffset = false;
        let wrongNegOffset = false;
        let wrongIntermediateOffset = false;

        if(lrpLines.length-1 === shortestPaths.length){
            let shortestPath = [];
            if(lrpLines.length === 2 && lrpLines[0].getID() === lrpLines[1].getID()){
                // lines contains only one line, so the first 2 lines in lrpLines are the same
                // the second lrp line should not be pushed on the shortestPath
                shortestPath.push(lrpLines[0]);
            }
            else{
                for(let i=0;i<shortestPaths.length;i++){
                    shortestPath.push(lrpLines[i]);
                    if(i === shortestPaths.length-1){
                        distanceBetweenLastTwoLength += lrpLines[i].getLength();
                    }
                    let a = 0;
                    let lengthBetweenLRPs = lrpLines[i].getLength();
                    //while the start node of a line is not the next LRP node, this line can be added
                    //otherwise we should add the lines of the shortest path of that LRP node
                    while(shortestPaths[i].lines !== undefined && shortestPaths[i].lines[a] !== undefined && shortestPaths[i].lines[a].getStartNode().getID() !== lrpLines[i+1].getStartNode().getID()){
                        shortestPath.push(shortestPaths[i].lines[a]);
                        lengthBetweenLRPs += shortestPaths[i].lines[a].getLength();
                        if(i===0){
                            distanceBetweenFirstTwoLength += shortestPaths[i].lines[a].getLength();
                        }
                        if(i===shortestPaths.length-1){
                            distanceBetweenLastTwoLength += shortestPaths[i].lines[a].getLength();
                        }
                        a++;
                    }
                    if(lengthBetweenLRPs >= 15000*configProperties.internalPrecision){
                        isValid = false;
                        wrongIntermediateOffset = true;
                    }
                }
                shortestPath.push(lrpLines[lrpLines.length-1]); //add the line incoming in the last LRP
                if(lrpLines.length === 2){
                    distanceBetweenFirstTwoLength += lrpLines[lrpLines.length-1].getLength();
                }
            }
            if(distanceBetweenFirstTwoLength >=  15000*configProperties.internalPrecision || distanceBetweenLastTwoLength >= 15000*configProperties.internalPrecision){
                isValid = false;
                wrongIntermediateOffset = true;
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
                wrongIntermediateDistance: wrongIntermediateOffset,
                distanceBetweenFirstTwo: distanceBetweenFirstTwoLength,
                distanceBetweenLastTwo: distanceBetweenLastTwoLength
            }
        }
        else{
            throw Error("the amount of shortest paths is not one less than the amount of lrp nodes");
        }
    }

    static removeLRPatFront(lrpLines,offsets,length){
        //todo: noet correct, should take length of al lines on sp between first and second lrp
        if(lrpLines.length > 0
            && offsets.posOffset>=length
        ){
            offsets.posOffset -= length;
            lrpLines.shift();
        }
        else{
            throw Error("unnecessary removing of LRP at front");
        }
    }

    static removeLRPatEnd(lrpLines,offsets,length){
        if(lrpLines.length > 0
            && offsets.negOffset>=length
        ){
            offsets.negOffset -= length;
            lrpLines.pop();
        }
        else{
            throw Error("unnecessary removing of LRP at end");
        }
    }

    static addIntermediateLRPs(lrpLines,shortestPaths,lines){
        //todo
        console.warn("todo addIntermediateLRPs");
    }
}