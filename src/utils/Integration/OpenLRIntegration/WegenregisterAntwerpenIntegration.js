// import MapDataBase from "../OpenLR/map/MapDataBase";
import Line from "../OpenLR/map/Line";
import Node from "../OpenLR/map/Node";
import {WegenregisterAntwerpenFrcWegcatMapping} from "./FRCmappings/WegenregisterAntwerpenFrcWegcatMapping";
import {frcEnum} from "../OpenLR/map/Enum";
import {WegenregisterAntwerpenFowMorfMapping} from "./FOWmappings/WegenregisterAntwerpenFowMorfMapping";

/*
This class contains a demo implementation for use of openlr in the wegenregister Antwerpen (geojson).
 */
export default class WegenregisterAntwerpenIntegration{
    static initMapDataBase(mapDataBase,features){
        let nodesLines = WegenregisterAntwerpenIntegration.getNodesLines(features);
        mapDataBase.setData(nodesLines.lines,nodesLines.nodes); //todo: set bounding box
    }

    static getNodesLines(features){
        let openLRLines = {};
        let openLRNodes = {};

        for(let i=0;i<features.length;i++){
            let directionIsUndef = features[i].properties.RIJRICHTING_AUTO === undefined || features[i].properties.RIJRICHTING_AUTO === null;
            // if(!directionIsUndef){ // skip this if al roads should be added and not only the roads for cars
                if(features[i].geometry.type === "LineString"){

                    if(features[i].geometry.coordinates.length >= 2){
                        let lat = features[i].geometry.coordinates[0][1];
                        let long = features[i].geometry.coordinates[0][0];
                        if(openLRNodes[lat+"_"+long] === undefined){
                            openLRNodes[lat+"_"+long] = new Node(lat+"_"+long,lat,long);
                        }

                        for(let j=1;j<features[i].geometry.coordinates.length;j++){
                            lat = features[i].geometry.coordinates[j][1];
                            long = features[i].geometry.coordinates[j][0];
                            if(openLRNodes[lat+"_"+long] === undefined){
                                openLRNodes[lat+"_"+long] = new Node(lat+"_"+long,lat,long);
                            }
                            let prevLat = features[i].geometry.coordinates[j-1][1];
                            let prevLong = features[i].geometry.coordinates[j-1][0];


                            if(directionIsUndef || features[i].properties.RIJRICHTING_AUTO === "enkel (mee)" || features[i].properties.RIJRICHTING_AUTO === "dubbel"){
                                openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long]
                                    = new Line(prevLat+"_"+prevLong+"_"+lat+"_"+long,openLRNodes[prevLat+"_"+prevLong],openLRNodes[lat+"_"+long]);
                                openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long].frc = WegenregisterAntwerpenIntegration.getFRC(features[i].properties);
                                openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long].fow = WegenregisterAntwerpenIntegration.getFOW(features[i].properties);
                            }
                            if(directionIsUndef || features[i].properties.RIJRICHTING_AUTO === "enkel (tegen)"  || features[i].properties.RIJRICHTING_AUTO === "dubbel"){
                                openLRLines[lat+"_"+long+"_"+prevLat+"_"+prevLong]
                                    = new Line(lat+"_"+long+"_"+prevLat+"_"+prevLong,openLRNodes[lat+"_"+long],openLRNodes[prevLat+"_"+prevLong]);
                                openLRLines[lat+"_"+long+"_"+prevLat+"_"+prevLong].frc = WegenregisterAntwerpenIntegration.getFRC(features[i].properties);
                                openLRLines[lat+"_"+long+"_"+prevLat+"_"+prevLong].fow = WegenregisterAntwerpenIntegration.getFOW(features[i].properties);
                            }
                        }
                    }
                }
            // }
        }
        return {
            nodes: openLRNodes,
            lines: openLRLines
        }
    }

    /***
     * //Depricated Code, only for testing purposes
    static initMapDataBaseDeprecatedNoRoadDirections(mapDataBase,features){
        let nodesLines = WegenregisterAntwerpenIntegration.getNodesLinesDeprecatedNoRoadDirections(features);
        mapDataBase.setData(nodesLines.lines,nodesLines.nodes);
    }

    static getNodesLinesDeprecatedNoRoadDirections(features){
        let openLRLines = {};
        let openLRNodes = {};
        for(let i=0;i<features.length;i++){

            if(features[i].geometry.type === "LineString"){
                if(features[i].geometry.coordinates.length >= 2){
                    let lat = features[i].geometry.coordinates[0][1];
                    let long = features[i].geometry.coordinates[0][0];
                    if(openLRNodes[lat+"_"+long] === undefined){
                        openLRNodes[lat+"_"+long] = new Node(lat+"_"+long,lat,long);
                    }
                    for(let j=1;j<features[i].geometry.coordinates.length;j++){
                        lat = features[i].geometry.coordinates[j][1];
                        long = features[i].geometry.coordinates[j][0];
                        if(openLRNodes[lat+"_"+long] === undefined){
                            openLRNodes[lat+"_"+long] = new Node(lat+"_"+long,lat,long);
                        }
                        let prevLat = features[i].geometry.coordinates[j-1][1];
                        let prevLong = features[i].geometry.coordinates[j-1][0];

                        openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long]
                            = new Line(prevLat+"_"+prevLong+"_"+lat+"_"+long,openLRNodes[prevLat+"_"+prevLong],openLRNodes[lat+"_"+long]);
                        openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long].frc = WegenregisterAntwerpenIntegration.getFRC(features[i].properties);
                        openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long].fow = WegenregisterAntwerpenIntegration.getFOW(features[i].properties);

                        openLRLines[lat+"_"+long+"_"+prevLat+"_"+prevLong]
                            = new Line(lat+"_"+long+"_"+prevLat+"_"+prevLong,openLRNodes[lat+"_"+long],openLRNodes[prevLat+"_"+prevLong]);
                        openLRLines[lat+"_"+long+"_"+prevLat+"_"+prevLong].frc = WegenregisterAntwerpenIntegration.getFRC(features[i].properties);
                        openLRLines[lat+"_"+long+"_"+prevLat+"_"+prevLong].fow = WegenregisterAntwerpenIntegration.getFOW(features[i].properties);

                    }
                }
            }
        }
        return {
            nodes: openLRNodes,
            lines: openLRLines
        }
    }

    static initMapDataBaseDeprecatedAllLineStrings(mapDataBase,features){
        let nodesLines = WegenregisterAntwerpenIntegration.getNodesLinesDeprecatedAllLineStrings(features);
        mapDataBase.setData(nodesLines.lines,nodesLines.nodes);
    }

    static getNodesLinesDeprecatedAllLineStrings(features){
        let openLRLines = {};
        let openLRNodes = {};
        for(let i=0;i<features.length;i++){

            if(features[i].geometry.type === "LineString"){
                if(features[i].geometry.coordinates.length >= 2){
                    let lat = features[i].geometry.coordinates[0][1];
                    let long = features[i].geometry.coordinates[0][0];
                    if(openLRNodes[lat+"_"+long] === undefined){
                        openLRNodes[lat+"_"+long] = new Node(lat+"_"+long,lat,long);
                    }
                    for(let j=1;j<features[i].geometry.coordinates.length;j++){
                        lat = features[i].geometry.coordinates[j][1];
                        long = features[i].geometry.coordinates[j][0];
                        if(openLRNodes[lat+"_"+long] === undefined){
                            openLRNodes[lat+"_"+long] = new Node(lat+"_"+long,lat,long);
                        }
                        let prevLat = features[i].geometry.coordinates[j-1][1];
                        let prevLong = features[i].geometry.coordinates[j-1][0];

                        if(features[i].properties.RIJRICHTING_AUTO === undefined || features[i].properties.RIJRICHTING_AUTO === null || features[i].properties.RIJRICHTING_AUTO === "enkel (mee)" || features[i].properties.RIJRICHTING_AUTO === "dubbel"){
                            openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long]
                                = new Line(prevLat+"_"+prevLong+"_"+lat+"_"+long,openLRNodes[prevLat+"_"+prevLong],openLRNodes[lat+"_"+long]);
                            openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long].frc = WegenregisterAntwerpenIntegration.getFRC(features[i].properties);
                            openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long].fow = WegenregisterAntwerpenIntegration.getFOW(features[i].properties);
                        }
                        if(features[i].properties.RIJRICHTING_AUTO === undefined || features[i].properties.RIJRICHTING_AUTO === null || features[i].properties.RIJRICHTING_AUTO === "enkel (tegen)"  || features[i].properties.RIJRICHTING_AUTO === "dubbel"){
                            openLRLines[lat+"_"+long+"_"+prevLat+"_"+prevLong]
                                = new Line(lat+"_"+long+"_"+prevLat+"_"+prevLong,openLRNodes[lat+"_"+long],openLRNodes[prevLat+"_"+prevLong]);
                            openLRLines[lat+"_"+long+"_"+prevLat+"_"+prevLong].frc = WegenregisterAntwerpenIntegration.getFRC(features[i].properties);
                            openLRLines[lat+"_"+long+"_"+prevLat+"_"+prevLong].fow = WegenregisterAntwerpenIntegration.getFOW(features[i].properties);
                        }

                    }
                }
            }
        }
        return {
            nodes: openLRNodes,
            lines: openLRLines
        }
    }
    */

    static getFRC(properties){
        if(properties !== undefined && properties["WEGCAT"] !== undefined){
            return WegenregisterAntwerpenFrcWegcatMapping[properties["WEGCAT"]];
        }
        else{
            return frcEnum.FRC_7;
        }
    }

    static getFOW(properties){
        if(properties !== undefined && properties["MORF"] !== undefined){
            return WegenregisterAntwerpenFowMorfMapping[properties["MORF"]];
        }
        else{
            return frcEnum.FRC_7;
        }
    }
}
