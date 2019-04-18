import MapDataBase from "../OpenLR/map/MapDataBase";
import Line from "../OpenLR/map/Line";
import Node from "../OpenLR/map/Node";

export default class OSMIntegration{
    static initMapDataBase(nodes,ways,relations){
        let openLRLines = {};
        let openLRNodes = {};
        for(let id in nodes){
            if(nodes.hasOwnProperty(id)){
                let openLRNode = new Node(id,nodes[id]["@_lat"],nodes[id]["@_lon"]);
                openLRNodes[openLRNode.getID()] = openLRNode;
            }
        }
        for(let id in ways){
            if(ways.hasOwnProperty(id)){
                for(let i =0;i<ways[id].nd.length-1;i++){
                    // add a line from this node to the next one
                    // the id of the line is created out of the id of the way + underscore + id of the start node (since these lines aren't directly identified in osm)
                    let openLRLine = new Line(id+"_"+ways[id].nd[i]["@_ref"],openLRNodes[ways[id].nd[i]["@_ref"]],openLRNodes[ways[id].nd[i+1]["@_ref"]]);
                    openLRLine.frc = OSMIntegration.getFRC(ways[id]);
                    openLRLine.fow = OSMIntegration.getFRC(ways[id]);
                    openLRLines[openLRLine.getID()] = openLRLine;
                }
            }
        }
        return new MapDataBase(openLRLines,openLRNodes);
    }
    
    static getFRC(osmWay){
        return undefined; //todo
    }

    static getFOW(osmWay){
        return undefined; //todo
    }
}