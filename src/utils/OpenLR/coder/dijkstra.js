import Heap from 'heap'

export default class Dijkstra{
    static shortestPath(startNode,endNode){
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
                if(minLengths[line.getEndNode().getID()] === undefined
                    || minLengths[line.getEndNode().getID()] > length){
                    minLengths[line.getEndNode().getID()] = length;
                    followedLine[line.getEndNode().getID()] = line;
                    heap.push([length,line.getEndNode()]);
                }
            });
        }

        let shortestPathLines = [];
        let lastStep = endNode;

        while(lastStep.getID() !== startNode.getID()){
            let line = followedLine[lastStep.getID()];
            shortestPathLines.unshift(line);
            lastStep = line.getStartNode();
        }

        return shortestPathLines;
    }
}