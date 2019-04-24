//todo: ook mogelijkheid om aan database een nieuwe tile toe te voegen
//todo: moet ook oude tile kunnen wegnemen?
//currently uses the nodes and ways it is given, doesn't care if those are coming from a single or multiple tiles

import MapDataBase from "../OpenLR/map/MapDataBase";
import Line from "../OpenLR/map/Line";
import Node from "../OpenLR/map/Node";

export default class RoutableTilesIntegration{
    static initMapDataBase(nodes,ways,relations){
        let openLRLines = {};
        let openLRNodes = {};
        let osmNodes = {};
        let refToNodeId = {};
        for(let id in nodes){
            if(nodes.hasOwnProperty(id)){
                let openLRNode = new Node(id,nodes[id].lat,nodes[id].long);
                osmNodes[openLRNode.getID()] = openLRNode;
                for(let i=0;i<nodes[id].ref.length;i++){
                    refToNodeId[nodes[id].ref[i]] = nodes[id].id;
                }
            }
        }
        for(let id in ways){
            if(ways.hasOwnProperty(id)){
                for(let i =0;i<ways[id].nodes.length-1;i++){
                    if(ways[id].highway !== undefined){
                        // add a line from this node to the next one
                        // the id of the line is created out of the id of the way + underscore + id of the start node (since these lines aren't directly identified in RoutableTiles)
                        let openLRLine = new Line(id+"_"+refToNodeId[ways[id].nodes[i]],osmNodes[refToNodeId[ways[id].nodes[i]]],osmNodes[refToNodeId[ways[id].nodes[i+1]]]);
                        openLRLine.frc = RoutableTilesIntegration.getFRC(ways[id]);
                        openLRLine.fow = RoutableTilesIntegration.getFRC(ways[id]);
                        openLRLines[openLRLine.getID()] = openLRLine;
                        if(ways[id].oneway === undefined || ways[id].oneway === "osm:no"){
                            // since OSM doesn't have directed lines for it's roads, we will add the line in the other direction, so it is always present both as an input line and an output line in a node
                            let reverseOpenLRLine = new Line(id+"_"+refToNodeId[ways[id].nodes[i]]+"_1",osmNodes[refToNodeId[ways[id].nodes[i+1]]],osmNodes[refToNodeId[ways[id].nodes[i]]]);
                            reverseOpenLRLine.frc = RoutableTilesIntegration.getFRC(ways[id]);
                            reverseOpenLRLine.fow = RoutableTilesIntegration.getFRC(ways[id]);
                            openLRLines[reverseOpenLRLine.getID()] = reverseOpenLRLine;
                        }
                        //since we only want to keep the nodes that are part of the road network, and not the other nodes of OSM, so we will add only those in the openLRNodes map
                        openLRNodes[refToNodeId[ways[id].nodes[i]]] = osmNodes[refToNodeId[ways[id].nodes[i]]];
                        openLRNodes[refToNodeId[ways[id].nodes[i+1]]] = osmNodes[refToNodeId[ways[id].nodes[i+1]]];
                    }
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
