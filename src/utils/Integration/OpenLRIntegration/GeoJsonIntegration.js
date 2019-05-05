import Line from "../OpenLR/map/Line";
import Node from "../OpenLR/map/Node";

export default class GeoJsonIntegration{
    static initMapDataBase(mapDataBase,features){
        let nodesLines = GeoJsonIntegration.getNodesLines(features);
        mapDataBase.setData(nodesLines.lines,nodesLines.nodes); //todo: set bounding box
    }

    static getNodesLines(features){
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
                        openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long].frc = GeoJsonIntegration.getFRC(features[i].properties);
                        openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long].fow = GeoJsonIntegration.getFOW(features[i].properties);
                    }
                }
            }
        }
        return {
            nodes: openLRNodes,
            lines: openLRLines
        }
    }

    static getFRC(properties){
        return undefined
    }

    static getFOW(properties){
        return undefined;
    }
}