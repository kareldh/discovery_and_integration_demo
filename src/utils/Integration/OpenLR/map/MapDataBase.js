import GeoJSONRbushNodeSearchTree from '../SearchTree/GeoJSONRbushNodeSearchTree';
import GeoJSONRbushLineSearchTree from "../SearchTree/GeoJSONRbushLineSearchTree";
import {configProperties} from "../coder/CoderSettings";

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
        this.turnResctrictions = turnRestrictions;
        this.mapBoundingBox = boundingBox;
        this.lines = lines;
        this.nodes = nodes;
        this.nodeSearchTree = new GeoJSONRbushNodeSearchTree(nodes);
        this.lineSearchTree = new GeoJSONRbushLineSearchTree(lines);
        this.internalPrecision = configProperties.internalPrecision;
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
        this.turnResctrictions = turnRestrictions;
        this.mapBoundingBox = boundingBox;
        this.lines = lines;
        this.nodes = nodes;
        this.nodeSearchTree = new GeoJSONRbushNodeSearchTree(nodes);
        this.lineSearchTree = new GeoJSONRbushLineSearchTree(lines);
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
        let range = Math.round(dist/this.internalPrecision);
        let possibleNodes = this.nodeSearchTree.findCloseBy(lat,long,range);
        possibleNodes.forEach((node)=>{
            let distance = this.nodes[node.properties.id].getDistance(lat,long);
            if(distance <= dist){
                resNodes.push({node: this.nodes[node.properties.id], dist: distance})
            }
        });
        return resNodes;
    }

    findLinesCloseByCoordinate(lat,long,dist){
        let resLines = [];
        let range = Math.round(dist/this.internalPrecision);
        let possibleLines = this.lineSearchTree.findCloseBy(lat,long,range);
        possibleLines.forEach((line)=>{
            let distance = this.lines[line.properties.id].distanceToPoint(lat,long);
            if(distance <= dist){
                resLines.push({line: this.lines[line.properties.id], dist: distance})
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


    addData(lines={},nodes={},boundingBox = {
        left: undefined,
        top: undefined,
        right: undefined,
        bottom: undefined
    }){
        //todo: speed this up
        //maybe change lines and nodes to not contain references, but only ids
        let nodesAdded = {};
        let linesAdded = {};
        for(let key in nodes){
            if(nodes.hasOwnProperty(key)){
                if(this.nodes[key]===undefined){
                    //this node was not yet present
                    this.nodes[key] = nodes[key];
                    nodesAdded[key]=nodes[key];
                }
            }
        }
        for(let key in lines){
            if(lines.hasOwnProperty(key)){
                if(this.lines[key]===undefined){
                    //this line was not yet present
                    lines[key].startNode = this.nodes[lines[key].getStartNode().getID()];
                    if(nodesAdded[lines[key].getStartNode().getID()] === undefined){
                        // if this node wasn't just added, this node was already present, so the line should still
                        // be added to it's outgoing lines
                        this.nodes[lines[key].getStartNode().getID()].outgoingLines.push(lines[key]);
                    }
                    lines[key].endNode = this.nodes[lines[key].getEndNode().getID()];
                    if(nodesAdded[lines[key].getEndNode().getID()] === undefined){
                        // if this node wasn't just added, this node was already present, so the line should still
                        // be added to it's incoming lines
                        this.nodes[lines[key].getEndNode().getID()].incomingLines.push(lines[key]);
                    }
                    this.lines[lines[key].getID()] = lines[key];
                    linesAdded[key]=lines[key];
                }
            }
        }
        this.nodeSearchTree.addNodes(nodesAdded);
        this.lineSearchTree.addLines(linesAdded);
        //todo: adjust bounding box
    }

    //todo: remove data
}