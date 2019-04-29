import {fowEnum, frcEnum} from "../map/Enum";
import Dijkstra from "./Dijkstra";

export default class LineDecoder{


    static decode(mapDataBase,LRPs,posOffset,negOffset,decoderProperties){
        // 2: For each location reference point find candidate nodes
        let candidateNodes = LineDecoder.findCandidatesOrProjections(mapDataBase,LRPs,decoderProperties);

        // 3: For each location reference point find candidate lines
        // 4: Rate candidate lines for each location reference point
        let candidateLines = LineDecoder.findCandidateLines(LRPs,candidateNodes,decoderProperties);

        // 5: Determine shortest-path(s) between two subsequent location reference points
        // 6: Check validity of the calculated shortest-path(s)
        // 7: Concatenate shortest-path(s) to form the location
        let concatShortestPath = LineDecoder.determineShortestPaths(candidateLines,LRPs,decoderProperties);

        // 7: and trim according to the offsets
        let offsets = {posOffset: posOffset, negOffset: negOffset};
        LineDecoder.trimAccordingToOffsets(concatShortestPath,offsets);

        return {
            lines: concatShortestPath.shortestPath,
            posOffset: offsets.posOffset,
            negOffset: offsets.negOffset
        }
    }

    static findCandidatesOrProjections(mapDataBase,LRPs,decoderProperties){
        let candidates = [];
        for(let i=0;i<LRPs.length;i++){
            candidates[i] = [];
            //find nodes whereby the coordinates of the candidate nodes are close to the coordinates of the location reference point
            let nodes = mapDataBase.findNodesCloseByCoordinate(LRPs[i].lat,LRPs[i].long,decoderProperties.dist);

            //if no candidate nodes are found
            //the direct search of lines using a projection point may also be executed even if candidate nodes are found. (set in decoderProperties)
            if(nodes.length !== 0){
                Array.prototype.push.apply(candidates[i],nodes);
            }
            if(nodes.length === 0 || decoderProperties.alwaysUseProjections){
                //determine candidate line directly by projecting the LRP on a line not far away form the coordinate
                let closeByLines = mapDataBase.findLinesCloseByCoordinate(LRPs[i].lat,LRPs[i].long,decoderProperties.dist);
                if(closeByLines.length === 0 && nodes.length === 0){
                    throw Error("No candidate nodes or projected nodes can be found.");
                }
                let projectedPoints = [];
                closeByLines.forEach(function (line) {
                    let location = line.line.measureAlongLine(LRPs[i].lat,LRPs[i].long);
                    if(location.lat === line.line.getStartNode().getLatitudeDeg()
                        || location.lat === line.line.getEndNode().getLatitudeDeg()
                        || location.long === line.line.getStartNode().getLongitudeDeg()
                        || location.long === line.line.getEndNode().getLongitudeDeg()
                    ){
                        //console.log("The found projection point is the same as the start or end node of the line, so it should already be covered by the findNodesCloseByCoordinate function.");
                    }
                    else{
                        location.line = line.line;
                        location.dist = line.dist;
                        projectedPoints.push(location);
                    }

                });
                Array.prototype.push.apply(candidates[i],projectedPoints);
            }
        }
        return candidates;
    }

    //lat, long and bearing should never be undefined
    static findCandidateLines(LRPs,candidateNodes,decoderProperties){
        let candidateLines = [];
        for(let i=0;i<LRPs.length;i++){
            candidateLines[i] = [];
            //check the outgoing lines of the candidateNodes
            candidateNodes[i].forEach((node)=>{
                if(node.node === undefined){
                    //the node is a projection point
                    let bearDiff = i===LRPs.length-1
                        ? Math.abs(node.line.getReverseBearing()-LRPs[LRPs.length-1].bearing)
                        : Math.abs(node.line.getBearing()-LRPs[i].bearing);
                    let frcDiff;
                    if(node.line.getFRC() !== undefined && node.line.getFRC() >= frcEnum.FRC_0
                        && node.line.getFRC() <= frcEnum.FRC_7 && LRPs[i].frc !== undefined){
                        frcDiff = Math.abs(node.line.getFRC()-LRPs[i].frc);
                    }
                    // note: fow isn't hierarchical, so a difference can't be computed
                    if(bearDiff <= decoderProperties.bearDiff
                        && (frcDiff === undefined ? true : frcDiff <= decoderProperties.frcDiff)){
                        //the bearing,frc and fow values are close so this line could be a good candidate
                        let candidate = {
                            line: node.line,
                            bearDiff: bearDiff,
                            frcDiff: frcDiff,
                            lrpIndex: i,
                            projected: true,
                            rating: undefined,
                            // if the node is projected, not the full length of the line should be taken in the calculation of the distance between LRPs,
                            // but only to (or from) the location of the projected point
                            distToProjection: node.line.getStartNode().getDistance(node.lat,node.long)
                        };
                        candidate.rating = LineDecoder.rateCandidateLine(candidate,node.dist,LRPs[candidate.lrpIndex],decoderProperties);
                        candidateLines[i].push(candidate);
                    }
                }
                else{
                    //the node exists in the database and possibly has multiple outgoing lines
                    let lines = i===LRPs.length-1
                        ? node.node.getIncomingLines()
                        : node.node.getOutgoingLines();
                    //for the last LRP, check the incoming lines
                    lines.forEach((line)=>{
                        let bearDiff = i===LRPs.length-1
                            ? Math.abs(line.getReverseBearing()-LRPs[LRPs.length-1].bearing)
                            : Math.abs(line.getBearing()-LRPs[i].bearing);
                        let frcDiff;
                        if(line.getFRC() !== undefined && line.getFRC() >= frcEnum.FRC_0
                            && line.getFRC() <= frcEnum.FRC_7 && LRPs[i].frc !== undefined){
                            frcDiff = Math.abs(line.getFRC()-LRPs[i].frc);
                        }
                        if( bearDiff <= decoderProperties.bearDiff
                            && (frcDiff === undefined ? true : frcDiff <= decoderProperties.frcDiff)){
                            //the bearing,frc and fow values are close so this line could be a good candidate
                            let candidate = {
                                line: line,
                                bearDiff: bearDiff,
                                frcDiff: frcDiff,
                                lrpIndex: i,
                                projected: false,
                                rating: undefined
                            };
                            candidate.rating = LineDecoder.rateCandidateLine(candidate,node.dist,LRPs[candidate.lrpIndex],decoderProperties);
                            candidateLines[i].push(candidate);
                        }
                    });
                }
            });
            //if no candidate line can be found for a location reference point, the decoder should
            //report an error and stop further processing
            if(candidateLines[i].length === 0){
                throw Error("No candidate lines found for LRP");
            }
            LineDecoder.sortLines(candidateLines[i]);
        }
        return candidateLines;
    }

    static sortLines(lines){
        //sort candidate lines on closest matching based on distance, bearing, frc and fow
        lines.sort((a,b)=>{
            //the lower the rating, the better the match is
            return a.rating - b.rating;
        });
    }

    static rateCandidateLine(candidateLine,distance,lrp,decoderProperties){
        let rating = 0;
        let maxRating = 0;
        // the start node, end node for the last location reference point or projection point
        // shall be as close as possible to the coordinates of the location reference point
        // let distance = Math.abs(calcDistance(matchingNode.lat,matchingNode.long,lrp.lat,lrp.long));
        distance = Math.abs(distance);
        let distanceRating = distance/decoderProperties.dist;
        rating += distanceRating * decoderProperties.distMultiplier;
        maxRating += decoderProperties.distMultiplier;
        // the functional road class of the candidate line should match the functional road class
        // of the location reference point
        if(candidateLine.frcDiff !== undefined){
            let frcRating = candidateLine.frcDiff/decoderProperties.frcDiff;
            rating += frcRating * decoderProperties.frcMultiplier;
            maxRating += decoderProperties.frcMultiplier;
        }
        // the form of way of the candidate line should match the form of way of the location reference point
        // form of way isn't hierarchical so it either does or does not match
        if(candidateLine.line.getFOW() !== undefined && candidateLine.line.getFOW() >= fowEnum.UNDEFINED
            && candidateLine.line.getFOW() <= fowEnum.OTHER && lrp.fow !== undefined && lrp.fow >= fowEnum.UNDEFINED
            && lrp.fow <= fowEnum.OTHER){
            let fowRating = candidateLine.line.getFOW() === lrp.fow ? 0 : 1;
            rating += fowRating * decoderProperties.fowMultiplier;
            maxRating += decoderProperties.fowMultiplier;
        }
        //the bearing of the candidate line should match indicated bearing angles of the location reference point
        let bearRating = candidateLine.bearDiff/decoderProperties.bearDiff;
        rating += bearRating * decoderProperties.bearMultiplier;
        maxRating += decoderProperties.bearMultiplier;
        return rating/maxRating;
    }

    static findShortestPath(startLine,endLine,lfrcnp,decoderProperties,distanceToNext){
        if(startLine.startNode === endLine.endNode){
            console.log("The first LRP starts in the same point where the second LRP ends. If no valid shortest path is found, retry with projections.");
        }
        if(startLine.getID()===endLine.getID()){
            return {lines: [], length: 0};
        }
        else{
            return Dijkstra.shortestPath(
                startLine.getEndNode(),
                endLine.getStartNode(),
                {
                    lfrcnp: lfrcnp,
                    lfrcnpDiff: decoderProperties.lfrcnpDiff,
                    maxDist: distanceToNext !== undefined ? decoderProperties.distanceToNextDiff + distanceToNext : undefined
                });
        }
    }

    static calcSPforLRP(candidateLines,candidateIndexes,lrpIndex,tries,shortestPaths,LRPs,decoderProperties){
        let shortestPath = undefined;
        if(candidateIndexes[lrpIndex]===undefined){
            candidateIndexes[lrpIndex] = 0;
        }
        if(candidateIndexes[lrpIndex+1]===undefined){
            candidateIndexes[lrpIndex+1] = 0;
        }
        let prevEndChanged = false;
        let prevEndCandidateIndex = candidateIndexes[lrpIndex+1];
        let distanceBetweenLRP = undefined;

        let distanceBetweenLRPCompensation = 0;

        while(shortestPath === undefined   //first time shortestPath is always undefined, so this loop runs minimum 1 time
            && tries.count < decoderProperties.maxSPSearchRetries){
            shortestPath = LineDecoder.findShortestPath(candidateLines[lrpIndex][candidateIndexes[lrpIndex]].line,candidateLines[lrpIndex+1][candidateIndexes[lrpIndex+1]].line,LRPs[lrpIndex].lfrcnp,decoderProperties,LRPs[lrpIndex].distanceToNext);

            // the total length of the first line can be added to distanceBetweenLRP
            distanceBetweenLRP = candidateLines[lrpIndex][candidateIndexes[lrpIndex]].line.getLength();

            if(candidateLines[lrpIndex][candidateIndexes[lrpIndex]].distToProjection !== undefined){
                // this first line was found by using a projection, the total distance between this LRP and the next should be lowered
                // by the length at which the projection can be found
                distanceBetweenLRPCompensation += (-1 * candidateLines[lrpIndex][candidateIndexes[lrpIndex]].distToProjection);
            }

            if(candidateLines[lrpIndex+1][candidateIndexes[lrpIndex+1]].distToProjection !== undefined){
                // next line was found by using a projection, the total distance between this LRP and the next should be heightened
                // by the length at which the projection can be found
                distanceBetweenLRPCompensation += (+1 * candidateLines[lrpIndex+1][candidateIndexes[lrpIndex+1]].distToProjection);
                // if the next line was the same as this line, the length of the line should be subtracted
                // because we already added it's length to distanceBetweenLRP
                if(candidateLines[lrpIndex+1][candidateIndexes[lrpIndex+1]].line.getID() === candidateLines[lrpIndex][candidateIndexes[lrpIndex]].line.getID()){
                    distanceBetweenLRP -= candidateLines[lrpIndex+1][candidateIndexes[lrpIndex+1]].line.getLength();
                }
            }

            if(lrpIndex === LRPs.length-2
                // if this is the second last LRP
                && candidateLines[lrpIndex+1][candidateIndexes[lrpIndex+1]].line.getID() !== candidateLines[lrpIndex][candidateIndexes[lrpIndex]].line.getID()
                // and the line of this LRP isn't the same as the line of the last LRP (if it would be the same, it's length was already added)
                && candidateLines[lrpIndex+1][candidateIndexes[lrpIndex+1]].distToProjection === undefined
                // the length of the last line shouldn't be added if it was projected, because it's length is already compensated in distanceBetweenLRPCompensation
            ){
                distanceBetweenLRP += candidateLines[lrpIndex+1][candidateIndexes[lrpIndex+1]].line.getLength();
            }

            if(shortestPath.length !== undefined){
                //if the shortest path has a length, it should be added to distanceBetweenLRP
                //if it doesn't, the while loop will restart because shortestPath.length === undefined
                distanceBetweenLRP += shortestPath.length;
            }

            // console.warn(distanceBetweenLRP,distanceBetweenLRPCompensation,LRPs[lrpIndex].distanceToNext,decoderProperties.distanceToNextDiff);
            if(shortestPath === undefined
                || shortestPath.length === undefined
                || Math.abs(distanceBetweenLRP+distanceBetweenLRPCompensation-LRPs[lrpIndex].distanceToNext) >= decoderProperties.distanceToNextDiff) // check validity (step 6 of decoding)
            {
                if(candidateIndexes[lrpIndex+1] < candidateLines[lrpIndex+1].length-1){
                    //we can try a different end line (which has our preference because it can't change previous path calculations)
                    candidateIndexes[lrpIndex+1]++;
                    //manually reset shortestPath to trigger while loop rerun
                    shortestPath = undefined;
                }
                else if(candidateIndexes[lrpIndex] < candidateLines[lrpIndex].length-1){
                    //we can try a different start line (which might change the end line of the shortest path calculation of our previous LRP)
                    candidateIndexes[lrpIndex]++;
                    //we should reset the index of the end line to the previously tried end line
                    //is 0 unless this method is called recursively because our end line changed further in the LRP list
                    candidateIndexes[lrpIndex+1] = prevEndCandidateIndex;
                    prevEndChanged = true;
                    //manually reset shortestPath to trigger while loop rerun
                    shortestPath = undefined;
                }
                else{
                    throw Error("No shortest path could be found between the given LRPs with indexes " +lrpIndex +" and " + (lrpIndex+1) +
                        " You either tried to decode a loop that isn't present in the current map " +
                        "or you tried decoding a line between two points that are to close together and decoded as a single node");
                }
            }
            tries.count++;
        }
        if(shortestPath === undefined || shortestPath.length === undefined){
            throw Error("could not construct a shortest path in the given amount of tries between the given LRPs with indexes " +lrpIndex +" and " + (lrpIndex+1));
        }
        shortestPaths[lrpIndex] = shortestPath;
        if(prevEndChanged && lrpIndex-1 >= 0){
            // we changed the start line of for this LRP, which means the end line of the last LRP is changed and it's shortest path should be recalculated
            // this can happen recursively until we reach our first LRP
            shortestPaths[lrpIndex-1] = LineDecoder.calcSPforLRP(candidateLines,candidateIndexes,lrpIndex-1,tries,shortestPaths,LRPs,decoderProperties);
        }
    }

    static determineShortestPaths(candidateLines,LRPs,decoderProperties){
        let shortestPaths = [];
        let candidateIndexes = [];
        let tries = {count: 0};
        for(let i=0;i<candidateLines.length-1;i++){
            LineDecoder.calcSPforLRP(candidateLines,candidateIndexes,i,tries,shortestPaths,LRPs,decoderProperties);
        }

        return LineDecoder.concatSP(shortestPaths, candidateLines, candidateIndexes);
    }

    static concatSP(shortestPaths,candidateLines,candidateIndexes){
        if(shortestPaths.length !== candidateLines.length-1){
            throw Error("length of shortestPaths !== length of candidateLines-1");
        }
        let concatenatedShortestPath = [];
        for(let i=0;i<shortestPaths.length;i++){
            if(concatenatedShortestPath.length === 0 || candidateLines[i][candidateIndexes[i]].line.getID() !== concatenatedShortestPath[concatenatedShortestPath.length-1].getID()){
                // if the line to add isn't the same as the last line added (could be the same if two LRPs are mapped or projected on the same line)
                concatenatedShortestPath.push(candidateLines[i][candidateIndexes[i]].line); //add the startLine of the LRP (endline if last LRP)
            }
            for(let j=0;j<shortestPaths[i].lines.length;j++){
                concatenatedShortestPath.push(shortestPaths[i].lines[j])
            }
        }
        if(concatenatedShortestPath.length === 0 || candidateLines[candidateLines.length-1][candidateIndexes[candidateIndexes.length-1]].line.getID() !== concatenatedShortestPath[concatenatedShortestPath.length-1].getID()){
            // if the line to add isn't the same as the last line added (could be the same if two LRPs are mapped or projected on the same line)
            concatenatedShortestPath.push(candidateLines[candidateLines.length-1][candidateIndexes[candidateIndexes.length-1]].line); // add the line of the last LRP
        }
        return {
            shortestPath: concatenatedShortestPath,
            posProjDist: candidateLines[0][candidateIndexes[0]].distToProjection === undefined
                ? 0
                : candidateLines[0][candidateIndexes[0]].distToProjection,
            negProjDist: candidateLines[candidateLines.length-1][candidateIndexes[candidateIndexes.length-1]].distToProjection === undefined
                ? 0
                : candidateLines[candidateLines.length-1][candidateIndexes[candidateIndexes.length-1]].line.getLength() - candidateLines[candidateLines.length-1][candidateIndexes[candidateIndexes.length-1]].distToProjection
        };
    }

    static trimAccordingToOffsets(concatShortestPath,offsets){
        offsets.posOffset+=concatShortestPath.posProjDist;
        offsets.negOffset+=concatShortestPath.negProjDist;
        if(concatShortestPath.shortestPath.length === 0){
            throw Error("can't trim empty path");
        }
        let firstLine = concatShortestPath.shortestPath[0];
        while(offsets.posOffset > 0 && firstLine !== undefined && firstLine.getLength()<=offsets.posOffset){
            offsets.posOffset  -= firstLine.getLength();
            concatShortestPath.shortestPath.shift();
            firstLine = concatShortestPath.shortestPath[0];
        }
        let lastLine = concatShortestPath.shortestPath[concatShortestPath.shortestPath.length-1];
        while(offsets.negOffset > 0 && lastLine !== undefined && lastLine.getLength()<=offsets.negOffset){
            offsets.negOffset -= lastLine.getLength();
            concatShortestPath.shortestPath.pop();
            lastLine = concatShortestPath.shortestPath[concatShortestPath.shortestPath.length-1];
        }
        if(concatShortestPath.shortestPath.length === 0){
            throw Error("The remaining shortest path after trimming according to offsets is empty.");
        }
    }
}