import Line from "../OpenLR/map/Line";
import Node from "../OpenLR/map/Node";
import {fowEnum, frcEnum} from "../OpenLR/map/Enum";
import {OsmFowHighwayMapping} from "./FOWmappings/OsmFowHighwayMapping";
import {OsmFrcHighwayMapping} from "./FRCmappings/OsmFrcHighwayMapping";

export default class RoutableTilesIntegration{
    static initMapDataBase(mapDataBase,nodes,ways,relations){
        let nodesLines = RoutableTilesIntegration.getNodesLines(nodes,ways,relations);
        mapDataBase.setData(nodesLines.lines,nodesLines.nodes); //todo: set bounding box
    }

    static getNodesLines(nodes,ways,relations){ //todo: use relations?
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
                    // if(ways[id].highway !== undefined){ //todo: should we filter on highway data?
                        // add a line from this node to the next one
                        // the id of the line is created out of the id of the way + underscore + id of the start node (since these lines aren't directly identified in RoutableTiles)
                        let openLRLine = new Line(id+"_"+refToNodeId[ways[id].nodes[i]],osmNodes[refToNodeId[ways[id].nodes[i]]],osmNodes[refToNodeId[ways[id].nodes[i+1]]]);
                        openLRLine.frc = RoutableTilesIntegration.getFRC(ways[id]);
                        openLRLine.fow = RoutableTilesIntegration.getFOW(ways[id]);
                        openLRLines[openLRLine.getID()] = openLRLine;
                        if(ways[id].oneway === undefined || ways[id].oneway === "osm:no"){
                            // since OSM doesn't have directed lines for it's roads, we will add the line in the other direction, so it is always present both as an input line and an output line in a node
                            let reverseOpenLRLine = new Line(id+"_"+refToNodeId[ways[id].nodes[i]]+"_1",osmNodes[refToNodeId[ways[id].nodes[i+1]]],osmNodes[refToNodeId[ways[id].nodes[i]]]);
                            reverseOpenLRLine.frc = RoutableTilesIntegration.getFRC(ways[id]);
                            reverseOpenLRLine.fow = RoutableTilesIntegration.getFOW(ways[id]);
                            openLRLines[reverseOpenLRLine.getID()] = reverseOpenLRLine;
                        }
                        //since we only want to keep the nodes that are part of the road network, and not the other nodes of OSM, so we will add only those in the openLRNodes map
                        openLRNodes[refToNodeId[ways[id].nodes[i]]] = osmNodes[refToNodeId[ways[id].nodes[i]]];
                        openLRNodes[refToNodeId[ways[id].nodes[i+1]]] = osmNodes[refToNodeId[ways[id].nodes[i+1]]];
                    // }
                }
            }
        }
        return {
            nodes: openLRNodes,
            lines: openLRLines
        }
    }

    static getFRC(osmWay){
        if(osmWay.highway !== undefined && OsmFrcHighwayMapping[osmWay.highway.slice(4)] !== undefined){
            return OsmFrcHighwayMapping[osmWay.highway.slice(37).toLowerCase()];
        }
        else{
            return frcEnum.FRC_7;
        }
    }

    static getFOW(osmWay){
        // if(osmWay.highway !== undefined
        //     && osmWay.highway === "https://w3id.org/openstreetmap/terms#Pedestrian"
        //     && osmWay.area !== undefined
        //     && osmWay.area === "yes"
        // ){
        //     return fowEnum.TRAFFICSQUARE; //todo: is dit wel correct?
        // }
        // else
        if(osmWay.junction !== undefined && osmWay.junction === "roundabout"){
            return fowEnum.ROUNDABOUT;
        }
        else if(osmWay.highway !== undefined && OsmFowHighwayMapping[osmWay.highway.slice(37).toLowerCase()] !== undefined){
            return OsmFowHighwayMapping[osmWay.highway.slice(37).toLowerCase()];
        }
        else {
            return fowEnum.UNDEFINED;
        }
    }
}
