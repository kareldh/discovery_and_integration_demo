import Heap from 'heap'
import {frcEnum} from "../map/Enum";

export default class Dijkstra{
    static shortestPath(startNode,endNode,options){
        if(startNode.getID() === endNode.getID()){
            return {
                lines: [],
                length: 0 //integer value in meter!
            }
        }

        let minLengths = {};
        let followedLine = {};

        let heap = new Heap(function (a, b) {
            if(a[0] < b[0]){
                return -1;
            }
            if(b[0] < a[0]){
                return 1;
            }
            return 0;
        });

        // push start node on heap with length 0
        heap.push([0,startNode]);
        minLengths[startNode.getID()] = 0;
        while(heap.size() > 0){
            let heapTop = heap.pop();
            let currentNode = heapTop[1];

            currentNode.getOutgoingLines().forEach(function (line) {
                let length = minLengths[currentNode.getID()] + line.getLength();
                if(length<0){
                    throw Error("negative line length found for line: "+line.getID());
                }
                let validLine = (options === undefined || line.getFRC() === undefined)? 1 : 0 ||
                    (options.lfrcnp !== undefined
                    && options.lfrcnpDiff !== undefined
                    && line.getFRC() !== undefined
                    && line.getFRC() >= frcEnum.FRC_0 && line.getFRC() <= frcEnum.FRC_7
                    && line.getFRC() <= options.lfrcnpDiff+options.lfrcnp);
                if(validLine && (minLengths[line.getEndNode().getID()] === undefined
                    || minLengths[line.getEndNode().getID()] > length)){
                    minLengths[line.getEndNode().getID()] = length;
                    followedLine[line.getEndNode().getID()] = line;
                    if(options !== undefined && options.maxDist !== undefined){
                        // if a max distance is given, the shortest path can not be longer than this max distance
                        // (which means that nodes that have a eagle's eye distance longer than this max distance)
                        // which means that nodes that have a distance that already is longer than this max distance
                        // will never be part of the shortest path we want to calculate, and the shortest path found
                        // in this way would always be discarded since the total distance would always be longer than
                        // the max distance (which is the distanceToNextLrp + decoderProperties.dist)
                        // so we can speed up this SP calculation by not taking these nodes into account
                        if(length <= options.maxDist){
                            heap.push([length,line.getEndNode()]);
                        }
                    }
                    else{
                        heap.push([length,line.getEndNode()]);
                    }
                }
            });
        }

        let shortestPathLines = [];
        let lastStep = endNode;

        while(lastStep.getID() !== startNode.getID() && followedLine[lastStep.getID()] !== undefined){
            let line = followedLine[lastStep.getID()];
            shortestPathLines.unshift(line);
            lastStep = line.getStartNode();
        }

        //if length is 0, and lines = [], the startnode was equal to the endnode
        //if length is undefined and lines = [], there isn't a path between the startnode and endnode
        if(minLengths[endNode.getID()] === 0){
            throw Error("Something went wrong during Shortest Path calculation, probably because lines exist with 0 or negative lengths");
        }
        return {
            lines: shortestPathLines,
            length: minLengths[endNode.getID()] //integer value in meter!
        }
    }
}