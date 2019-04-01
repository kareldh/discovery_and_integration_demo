export default class LineEncoder {
    encode(lines,posOffset,negOffset){
        // 1: check validity of the location and offsets to be encoded
        if(lines !== undefined && lines.length > 0){
            let pathLength = lines[0].getLength();
            let prevLineEndNode = lines[0].getEndNode();
            let i=1;
            while(i<lines.length && lines[i] !== undefined
            && lines[i].getStartNode().getID() === prevLineEndNode.getID()){
                prevLineEndNode = lines[i].getEndNode();
                i++;
                pathLength+=lines[i].getLength();
                //todo: check if also traversable from start to end
            }
            if(i !== lines.length){
                throw "line isn't a connected path";
            }
            if(posOffset + negOffset >= pathLength){
                throw "offsets longer than path";
            }
            if(posOffset >= lines[0].getLength()){
                throw "first line should be omitted";
            }
            if(negOffset >= lines[lines.length-1].getLength()){
                throw "last line should be omitted";
            }
            //todo vereisten voor binary formaat
        }
        // 2: adjust start and end nodes of the location to represent valid map nodes

    }
}