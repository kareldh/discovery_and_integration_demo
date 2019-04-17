import {decoderProperties} from "./CoderSettings";
import {calcDistance} from "./GeoFunctions";
import {fowEnum, frcEnum} from "../map/Enum";
import Dijkstra from "./Dijkstra";

export default class LineDecoder{


    static decode(mapDataBase,LRPs,posOffset,negOffset){
        // 2: For each location reference point find candidate nodes
        let candidateNodes = LineDecoder.findCandidatesOrProjections(mapDataBase,LRPs);

        // 3: For each location reference point find candidate lines
        // 4: Rate candidate lines for each location reference point
        let candidateLines = LineDecoder.findCandidateLines(LRPs,candidateNodes);

        // 5: Determine shortest-path(s) between two subsequent location reference points
        // 6: Check validity of the calculated shortest-path(s)
        // 7: Concatenate shortest-path(s) to form the location
        let concatShortestPath = LineDecoder.determineShortestPaths(candidateLines,LRPs);

        // 7: and trim according to the offsets
        let trimmed = LineDecoder.trimAccordingToOffsets(concatShortestPath,posOffset,negOffset);

        return {
            lines: trimmed,
            posOffset: posOffset,
            negOffset: negOffset
        }
    }

    static findCandidatesOrProjections(mapDataBase,LRPs){
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
                    let location = line.measureAlongLine(LRPs[i].lat,LRPs[i].long);
                    location.line = line;
                    projectedPoints.push(location);
                });
                Array.prototype.push.apply(candidates[i],projectedPoints);
            }
        }
        return candidates;
    }

    //lat, long and bearing should never be undefined
    static findCandidateLines(LRPs,candidateNodes){
        let candidateLines = [];
        for(let i=0;i<LRPs.length;i++){
            candidateLines[i] = [];
            //check the outgoing lines of the candidateNodes
            candidateNodes[i].forEach((n)=>{
                let node = n.node;
                if(node.getID === undefined){
                    //the node is a projection point
                    let bearDiff = i===LRPs.length-1
                        ? Math.abs(node.line.getBearing()-LRPs[i].bearing)
                        : Math.abs(node.line.getReverseBearing()-LRPs[LRPs.length-1].bearing);
                    let frcDiff;
                    if(node.line.getFRC() !== undefined && node.line.getFRC() >= frcEnum.FRC_0
                        && node.line.getFRC() <= frcEnum.FRC_7 && LRPs[i].frc !== undefined){
                        frcDiff = Math.abs(node.line.getFRC()-LRPs[i].frc);
                    }
                    // note: fow isn't hierarchical, so a difference can't be computed
                    if(bearDiff <= decoderProperties.bearDiff
                        && frcDiff === undefined ? true : frcDiff <= decoderProperties.frcDiff){
                        //the bearing,frc and fow values are close so this line could be a good candidate
                        let candidate = {
                            line: node.line,
                            bearDiff: bearDiff,
                            frcDiff: frcDiff,
                            lrpIndex: i,
                            projected: true,
                            rating: undefined
                        };
                        candidate.rating = LineDecoder.rateCandidateLine(candidate,node,LRPs[candidate.lrpIndex]);
                        candidateLines[i].push(candidate);
                    }
                }
                else{
                    //the node exists in the database and possibly has multiple outgoing lines
                    let lines = i===LRPs.length-1
                        ? node.getIncomingLines()
                        : node.getOutgoingLines();
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
                            && frcDiff === undefined ? true : frcDiff <= decoderProperties.frcDiff){
                            //the bearing,frc and fow values are close so this line could be a good candidate
                            let candidate = {
                                line: line,
                                bearDiff: bearDiff,
                                frcDiff: frcDiff,
                                lrpIndex: i,
                                projected: false,
                                rating: undefined
                            };
                            candidate.rating = LineDecoder.rateCandidateLine(candidate,node,LRPs[candidate.lrpIndex]);
                            candidateLines[i].push(candidate);
                        }
                    });
                    //if no candidate line can be found for a location reference point, the decoder should
                    //report an error and stop further processing
                    if(candidateLines[i].length === 0){
                        throw Error("No candidate lines found for LRP");
                    }
                }
            });
            candidateNodes[i] = LineDecoder.sortLines(candidateNodes[i]);
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

    static rateCandidateLine(candidateLine,matchingNode,lrp){
        let rating = 0;
        let maxRating = 0;
        // the start node, end node for the last location reference point or projection point
        // shall be as close as possible to the coordinates of the location reference point
        let distance = Math.abs(calcDistance(matchingNode.lat,matchingNode.long,lrp.lat,lrp.long));
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

    static findShortestPath(startLine,endLine,lfrcnp){
        if(startLine.getID()===endLine.getID()){
            return [startLine];
        }
        else{
            return Dijkstra.shortestPath(startLine.getEndNode(),endLine.getStartNode(),{lfrcnp: lfrcnp, lfrcnpDiff: decoderProperties.lfrcnpDiff});
        }
    }

    static calcSPforLRP(candidateLines,candidateIndexes,lrpIndex,tries,shortestPaths,LRPs){
        let shortestPath = undefined;
        if(candidateIndexes[lrpIndex]===undefined){
            candidateIndexes[lrpIndex] = 0;
        }
        if(candidateIndexes[lrpIndex+1]===undefined){
            candidateIndexes[lrpIndex+1] = 0;
        }
        let prevEndChanged = false;
        let prevEndCandidateIndex = candidateIndexes[lrpIndex+1];
        while((shortestPath === undefined
            || shortestPath.lines.length === 0
            || Math.abs(shortestPath.length-LRPs[lrpIndex].distanceToNext) >= decoderProperties.distanceToNextDiff) // check validity (step 6 of decoding)
            && tries.count < decoderProperties.maxSPSearchRetries){
            shortestPath = LineDecoder.findShortestPath(candidateLines[lrpIndex][candidateIndexes[lrpIndex]].line,candidateLines[lrpIndex+1][candidateIndexes[lrpIndex+1]].line,LRPs[lrpIndex].lfrcnp);
            if(candidateIndexes[lrpIndex+1] < candidateLines[lrpIndex+1].length-1){
                candidateIndexes[lrpIndex+1]++;
            }
            else if(candidateIndexes[lrpIndex] < candidateLines[lrpIndex].length-1){
                candidateIndexes[lrpIndex]++;
                candidateIndexes[lrpIndex+1] = prevEndCandidateIndex;
                prevEndChanged = true;
            }
            else{
                throw "could not construct a shortest path";
            }
            tries.count++;
        }
        shortestPaths[lrpIndex] = shortestPath;
        if(prevEndChanged && lrpIndex-1 >= 0){
            //we changed the start line of for this LRP, which means the end line of the last LRP is changed and it's shortest path should be recalculated
            shortestPaths[lrpIndex-1] = LineDecoder.calcSPforLRP(candidateLines,candidateIndexes,lrpIndex-1,tries,shortestPaths,LRPs);
        }
        if(shortestPath === undefined || shortestPath.length === 0){
            throw "could not construct a shortest path in time";
        }
    }

    static determineShortestPaths(candidateLines,LRPs){
        let shortestPaths = [];
        let candidateIndexes = [];
        let tries = {count: 0};
        for(let i=0;i<candidateLines.length-1;i++){
            LineDecoder.calcSPforLRP(candidateLines,candidateIndexes,i,tries,shortestPaths,LRPs);
        }

        return LineDecoder.concatSP(shortestPaths, candidateLines, candidateIndexes);
    }

    static concatSP(shortestPaths,candidateLines,candidateIndexes){
        if(shortestPaths.length !== candidateLines.length-1){
            throw "length of shortestPaths !== length of candidateLines-1";
        }
        let concatenatedShortestPath = [];
        for(let i=0;i<shortestPaths.length;i++){
            concatenatedShortestPath.push(candidateLines[i][candidateIndexes[i]]); //add the startLine of the LRP (endline if last LRP)
            for(let j=0;j<shortestPaths[i].lines.length;i++){
                concatenatedShortestPath.push(shortestPaths[i].lines[j])
            }
        }
        concatenatedShortestPath.push(candidateLines[candidateLines.length-1][candidateIndexes[candidateIndexes.length-1]]);
        return concatenatedShortestPath;
    }

    static trimAccordingToOffsets(concatShortestPath,offsets){
        if(concatShortestPath.length === 0){
            throw "can't trim empty path";
        }
        let firstLine = concatShortestPath[0];
        while(offsets.posOffset > 0 && firstLine !== undefined && firstLine.getLength()<=offsets.posOffset){
            offsets.posOffset  -= firstLine.getLength();
            concatShortestPath.shift();
            firstLine = concatShortestPath[0];
        }
        let lastLine = concatShortestPath[concatShortestPath.length-1];
        while(offsets.negOffset > 0 && lastLine !== undefined && lastLine.getLength()<=offsets.negOffset){
            offsets.negOffset -= lastLine.getLength();
            concatShortestPath.pop();
            lastLine = concatShortestPath[concatShortestPath.length-1];
        }
    }
}