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

    //todo: versnellen via custom gegevensstructuur?
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

    //todo: versnellen via custom gegevensstructuur
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
        //todo: how to implement turn restrictions? is it a property of nodes or of lines or both?
        if(!this.turnResctrictions){
            //if database has no turn restrictions, a line should also have no turn restrictions
            return this.turnResctrictions;
        }
        //https://wiki.openstreetmap.org/wiki/Relation:restriction
        let i=0;
        while(i<lineList.length && lineList[i].getTurnRestriction() !== undefined){
            i++;
        }
        return i === lineList.length;
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