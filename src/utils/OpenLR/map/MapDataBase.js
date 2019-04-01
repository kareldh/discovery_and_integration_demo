export default class MapDataBase {
    constructor(
        lines = {},
        nodes = {},
        boundingBox = {
            left: undefined,
            top: undefined,
            right: undefined,
            bottom: undefined
        },
        turnRestrictions = false
    ) {
        this.numberOfNodes = lines.length;
        this.numberOfLines = nodes.length;
        this.turnResctrictions = turnRestrictions;
        this.mapBoundingBox = boundingBox;
        this.lines = lines;
        this.nodes = nodes;
    }

    hasTurnRestrictions(){
        return this.turnResctrictions;
    }

    getLine(id){
        return this.lines[id];
    }

    getNode(id){
        return this.nodes[id];
    }

    findNodesCloseByCoordinate(lat,long,dist){
        let resNodes = [];
        for(let key in this.nodes){
            if(this.nodes.hasOwnProperty(key)){
                let distance = this.nodes[key].getDistance(lat,long);
                if( distance <= dist){
                    resNodes.push({node: this.nodes[key], dist: distance})
                }
            }
        }
        return resNodes;
    }

    findLinesCloseByCoordinate(lat,long,dist){
        let resLines = [];
        for(let key in this.lines){
            if(this.lines.hasOwnProperty(key)){
                let distance = this.lines[key].distanceToPoint(lat,long);
                if(distance <= dist){
                    resLines.push({line: this.lines[key], dist: distance})
                }
            }
        }
        return resLines;
    }

    hasTurnRestrictionOnPath(lineList){
        //todo: als een line eigenschap oneway heeft??
        // of dus als line van-naar niet als naar-van voorkomt
    }

    getAllNodes(){
        return this.nodes;
    }

    getAllLines(){
        return this.lines;
    }

    getMapBoundingBox(){
        return this.mapBoundingBox;
    }

    getNumberOfNodes(){
        return this.numberOfNodes;
    }

    getNumberOfLines(){
        return this.numberOfLines;
    }



    addNode(node){
        this.nodes[node.id] = node;
    }

    addLine(line){
        this.lines[line.id] = line;
    }
}