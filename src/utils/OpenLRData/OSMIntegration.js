// import MapDataBase from "../OpenLR/map/MapDataBase";
import Line from "../OpenLR/map/Line";
import Node from "../OpenLR/map/Node";

export default class OSMIntegration{
    static initMapDataBase(mapDataBase,nodes,ways,relations){
        let openLRLines = {};
        let openLRNodes = {};
        let osmNodes = {};
        for(let id in nodes){
            if(nodes.hasOwnProperty(id)){
                let openLRNode = new Node(id,nodes[id]["@_lat"],nodes[id]["@_lon"]);
                osmNodes[openLRNode.getID()] = openLRNode;
            }
        }
        for(let id in ways){
            if(ways.hasOwnProperty(id)){
                for(let i =0;i<ways[id].nd.length-1;i++){
                    // add a line from this node to the next one
                    // the id of the line is created out of the id of the way + underscore + id of the start node (since these lines aren't directly identified in osm)
                    let openLRLine = new Line(id+"_"+ways[id].nd[i]["@_ref"],osmNodes[ways[id].nd[i]["@_ref"]],osmNodes[ways[id].nd[i+1]["@_ref"]]);
                    openLRLine.frc = OSMIntegration.getFRC(ways[id]);
                    openLRLine.fow = OSMIntegration.getFRC(ways[id]);
                    openLRLines[openLRLine.getID()] = openLRLine;
                    // since OSM doesn't have directed lines for it's roads, we will add the line in the other direction, so it is always present both as an input line and an output line in a node
                    let reverseOpenLRLine = new Line(id+"_"+ways[id].nd[i]["@_ref"]+"_1",osmNodes[ways[id].nd[i+1]["@_ref"]],osmNodes[ways[id].nd[i]["@_ref"]]);
                    reverseOpenLRLine.frc = OSMIntegration.getFRC(ways[id]);
                    reverseOpenLRLine.fow = OSMIntegration.getFRC(ways[id]);
                    openLRLines[reverseOpenLRLine.getID()] = reverseOpenLRLine;
                    //since we only want to keep the nodes that are part of the road network, and not the other nodes of OSM, so we will add only those in the openLRNodes map
                    openLRNodes[ways[id].nd[i]["@_ref"]] = osmNodes[ways[id].nd[i]["@_ref"]];
                    openLRNodes[ways[id].nd[i+1]["@_ref"]] = osmNodes[ways[id].nd[i+1]["@_ref"]];
                }
            }
        }
        // return new MapDataBase(openLRLines,openLRNodes);
        mapDataBase.setData(openLRLines,openLRNodes);
    }
    
    static getFRC(osmWay){
        return undefined; //todo
    }

    static getFOW(osmWay){
        return undefined; //todo
    }
}