import MapDataBase from "../OpenLR/map/MapDataBase";
import Line from "../OpenLR/map/Line";
import Node from "../OpenLR/map/Node";

/*
This class contains a demo implementation for use of openlr in the wegenregister Antwerpen (geojson).
 */
export default class WegenregisterAntwerpenIntegration{
    static initMapDataBase(features){
        let openLRLines = {};
        let openLRNodes = {};

        let total = 0;
        for(let i=0;i<features.length;i++){
            //todo: gebruik properties voor bepalen frc en fow
            if(features[i].geometry.coordinates.length >= 2){
                let lat = features[i].geometry.coordinates[0][1];
                let long = features[i].geometry.coordinates[0][0];
                if(openLRNodes[lat+"_"+long] === undefined){
                    openLRNodes[lat+"_"+long] = new Node(lat+"_"+long,lat,long);
                }
                // console.log(features[i].geometry.coordinates.length);
                for(let j=1;j<features[i].geometry.coordinates.length;j++){
                    lat = features[i].geometry.coordinates[j][1];
                    long = features[i].geometry.coordinates[j][0];
                    if(openLRNodes[lat+"_"+long] === undefined){
                        openLRNodes[lat+"_"+long] = new Node(lat+"_"+long,lat,long);
                    }
                    let prevLat = features[i].geometry.coordinates[j-1][1];
                    let prevLong = features[i].geometry.coordinates[j-1][0];

                    if(features[i].properties.RIJRICHTING_AUTO !== undefined){
                        // console.log(features[i].properties.RIJRICHTING_AUTO !== undefined || features[i].properties.RIJRICHTING_AUTO !== null);
                        if(features[i].properties.RIJRICHTING_AUTO === "enkel (mee)" || features[i].properties.RIJRICHTING_AUTO === "dubbel"){
                            // if(openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long] !== undefined){
                            //     // console.error(openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long]);
                            //     console.log(prevLat,prevLong,lat,long);
                            // }
                            openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long]
                                = new Line(prevLat+"_"+prevLong+"_"+lat+"_"+long,openLRNodes[prevLat+"_"+prevLong],openLRNodes[lat+"_"+long]);
                            //todo if rijrichting is beide, dan ook omgekeerd toevoegen?
                            openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long].frc = WegenregisterAntwerpenIntegration.getFRC(features[i].properties);
                            openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long].fwo = WegenregisterAntwerpenIntegration.getFOW(features[i].properties);
                        }
                        if(features[i].properties.RIJRICHTING_AUTO === "enkel (tegen)"  || features[i].properties.RIJRICHTING_AUTO === "dubbel"){
                            // if(openLRLines[lat+"_"+long+"_"+prevLat+"_"+prevLong] !== undefined){
                            //     // console.error(openLRLines[prevLat+"_"+prevLong+"_"+lat+"_"+long]);
                            //     console.log(lat,long,prevLat,prevLong);
                            // }
                            openLRLines[lat+"_"+long+"_"+prevLat+"_"+prevLong]
                                = new Line(lat+"_"+long+"_"+prevLat+"_"+prevLong,openLRNodes[lat+"_"+long],openLRNodes[prevLat+"_"+prevLong]);
                            //todo if rijrichting is beide, dan ook omgekeerd toevoegen?
                            openLRLines[lat+"_"+long+"_"+prevLat+"_"+prevLong].frc = WegenregisterAntwerpenIntegration.getFRC(features[i].properties);
                            openLRLines[lat+"_"+long+"_"+prevLat+"_"+prevLong].fwo = WegenregisterAntwerpenIntegration.getFOW(features[i].properties);
                        }
                   }
                    total++;
                }
            }
        }
        // console.warn(total);
        // console.error(process.memoryUsage());
        // console.log(openLRLines!=={});
        return new MapDataBase(openLRLines,openLRNodes);
    }

    static getFRC(properties){
        return undefined; //todo
    }

    static getFOW(properties){
        return undefined; //todo
    }
}
