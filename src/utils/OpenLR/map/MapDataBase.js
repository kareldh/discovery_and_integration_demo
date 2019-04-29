import RbushNodeSearchTree from '../SearchTree/RbushNodeSearchTree';
import RbushLineSearchTree from "../SearchTree/RbushLineSearchTree";

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
        this.nodeSearchTree = new RbushNodeSearchTree(nodes);
        this.lineSearchTree = new RbushLineSearchTree(lines);
    }

    setData(
        lines={},nodes={},boundingBox = {
            left: undefined,
            top: undefined,
            right: undefined,
            bottom: undefined
        },turnRestrictions = false
    )
    {
        this.numberOfNodes = lines.length;
        this.numberOfLines = nodes.length;
        this.turnResctrictions = turnRestrictions;
        this.mapBoundingBox = boundingBox;
        this.lines = lines;
        this.nodes = nodes;
        this.nodeSearchTree = new RbushNodeSearchTree(nodes);
        this.lineSearchTree = new RbushLineSearchTree(lines);
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
        let possibleNodes = this.nodeSearchTree.findCloseBy(lat,long,dist);
        possibleNodes.forEach((node)=>{
            let distance = this.nodes[node[2]].getDistance(lat,long);
            if(distance <= dist){
                resNodes.push({node: this.nodes[node[2]], dist: distance})
            }
        });
        return resNodes;
    }

    findLinesCloseByCoordinate(lat,long,dist){
        let resLines = [];
        let possibleLines = this.lineSearchTree.findCloseBy(lat,long,dist);
        possibleLines.forEach((line)=>{
            let distance = this.lines[line.id].distanceToPoint(lat,long);
            if(distance <= dist){
                resLines.push({line: this.lines[line.id], dist: distance})
            }
        });
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