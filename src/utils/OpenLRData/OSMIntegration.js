// import MapDataBase from "../OpenLR/map/MapDataBase";
import Line from "../OpenLR/map/Line";
import Node from "../OpenLR/map/Node";
import {fowEnum, frcEnum} from "../OpenLR/map/Enum";
import {OsmFowHighwayMapping} from "./FOWmappings/OsmFowHighwayMapping";
import {OsmFrcHighwayMapping} from "./FRCmappings/OsmFrcHighwayMapping";

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
                    openLRLine.fow = OSMIntegration.getFOW(ways[id]);
                    openLRLines[openLRLine.getID()] = openLRLine;

                    // check if OSM does specify if this is strictly a one way street
                    let oneWay = false;
                    if(Array.isArray(ways[id].tag)){
                        let i=0;
                        let oneWayTagFound = false;
                        while(!oneWayTagFound && i<ways[id].tag.length){
                            if(ways[id].tag[i]["@_k"]==="oneway"){
                                oneWayTagFound = true;
                                if(ways[id].tag[i]["@_v"]==="yes"){
                                    oneWay = true;
                                }
                            }
                            i++;
                        }
                    }
                    else if(ways[id].tag["@_k"]==="oneway" && ways[id].tag["@_v"]==="yes"){
                        oneWay = true;
                    }

                    if(!oneWay){
                        // since OSM doesn't have directed lines for it's roads, we will add the line in the other direction, so it is always present both as an input line and an output line in a node
                        let reverseOpenLRLine = new Line(id+"_"+ways[id].nd[i]["@_ref"]+"_1",osmNodes[ways[id].nd[i+1]["@_ref"]],osmNodes[ways[id].nd[i]["@_ref"]]);
                        reverseOpenLRLine.frc = OSMIntegration.getFRC(ways[id]);
                        reverseOpenLRLine.fow = OSMIntegration.getFOW(ways[id]);
                        openLRLines[reverseOpenLRLine.getID()] = reverseOpenLRLine;
                    }

                    //since we only want to keep the nodes that are part of the road network, and not the other nodes of OSM, so we will add only those in the openLRNodes map
                    openLRNodes[ways[id].nd[i]["@_ref"]] = osmNodes[ways[id].nd[i]["@_ref"]];
                    openLRNodes[ways[id].nd[i+1]["@_ref"]] = osmNodes[ways[id].nd[i+1]["@_ref"]];
                }
            }
        }
        // return new MapDataBase(openLRLines,openLRNodes);
        mapDataBase.setData(openLRLines,openLRNodes);
    }

    /*depricated, old code, only used to test that one way doesn't affect lanes that aren't one way only*/
    static initMapDataBaseDeprecatedNoOneWay(mapDataBase, nodes, ways, relations){
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
                    openLRLine.fow = OSMIntegration.getFOW(ways[id]);
                    openLRLines[openLRLine.getID()] = openLRLine;

                    // since OSM doesn't have directed lines for it's roads, we will add the line in the other direction, so it is always present both as an input line and an output line in a node
                    let reverseOpenLRLine = new Line(id+"_"+ways[id].nd[i]["@_ref"]+"_1",osmNodes[ways[id].nd[i+1]["@_ref"]],osmNodes[ways[id].nd[i]["@_ref"]]);
                    reverseOpenLRLine.frc = OSMIntegration.getFRC(ways[id]);
                    reverseOpenLRLine.fow = OSMIntegration.getFOW(ways[id]);
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
        let value = OSMIntegration._getTagsValues(osmWay,"highway");
        if(value["highway"] !== undefined && OsmFrcHighwayMapping[value["highway"]] !== undefined){
            return OsmFrcHighwayMapping[value["highway"]];
        }
        else {
            return frcEnum.FRC_7;
        }
    }

    static getFOW(osmWay){
        let value = OSMIntegration._getTagsValues(osmWay,"highway","junction","area");
        if(value["highway"] !== undefined
            && value["highway"] === "pedestrian"
            && value["area"] !== undefined
            && value["area"] === "yes")
        {
            return fowEnum.TRAFFICSQUARE;
        }
        else if(value["junction"] !== undefined && value["junction"] === "roundabout"){
            return fowEnum.ROUNDABOUT;
        }
        else if(value["highway"] !== undefined && OsmFowHighwayMapping[value["highway"]] !== undefined){
            return OsmFowHighwayMapping[value["highway"]];
        }
        else {
            return fowEnum.UNDEFINED;
        }
    }

    static _getTagsValues(osmWay,tags){
        let value = {};
        if(Array.isArray(osmWay.tag)){
            let i=0;
            while(i < osmWay.tag.length){
                if(tags.includes(osmWay.tag[i]["@_k"])){
                    if(value[osmWay.tag[i]["@_k"]] !== undefined){
                        console.warn("Multiple '",osmWay.tag[i]["@_k"],"' tags found for way:",osmWay);
                    }
                    value[osmWay.tag[i]["@_k"]] = osmWay.tag[i]["@_v"];
                }
                i++;
            }
        }
        else if(tags.includes(osmWay.tag["@_k"])){
            value[osmWay.tag["@_k"]] = osmWay.tag["@_v"];
        }
        return value;
    }
}