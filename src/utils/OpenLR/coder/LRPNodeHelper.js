import LocationReferencePoint from "./LocationReferencePoint";
// import {point} from '@turf/helpers'
// import bearing from '@turf/bearing'
import {frcEnum} from "../map/Enum";
// import {configProperties} from "./CoderSettings";

export default class LRPNodeHelper{

    static lrpLinesToLRPs(lrpLines,shortestPaths){
        if(lrpLines.length<2){
            throw Error("not enough LRP lines");
        }
        let LRPs = [];
        for(let i=0;i<lrpLines.length;i++){
            let properties = {};
            let isLast = false;
            let frc = lrpLines[i].getFRC();
            let fow = lrpLines[i].getFOW();
            let lat;
            let long;
            let distanceToNext;
            let bearing;
            let lfrcnp;
            if(i < lrpLines.length-1){
                properties = this.calcProperties(shortestPaths[i].lines,lrpLines[i+1].getStartNode());
                lat = lrpLines[i].getStartNode().getLatitudeDeg();
                long = lrpLines[i].getStartNode().getLongitudeDeg();
                bearing = lrpLines[i].getBearing();
                lfrcnp = properties.lfrcnp;
                distanceToNext = lrpLines[i].getLength() + properties.pathLength;
                if(i === lrpLines.length-2 && lrpLines[lrpLines.length-2].getID() !== lrpLines[lrpLines.length-1].getID()){
                    distanceToNext+=lrpLines[lrpLines.length-1].getLength();
                }
            }
            else{
                isLast = true;
                lat = lrpLines[i].getEndNode().getLatitudeDeg();
                long = lrpLines[i].getEndNode().getLongitudeDeg();
                bearing = lrpLines[i].getReverseBearing();
                lfrcnp = frcEnum.FRC_7;
                distanceToNext = 0;
            }
            let LRP = new LocationReferencePoint(
                bearing,
                distanceToNext,
                frc,
                fow,
                lfrcnp,
                isLast,
                lat,
                long,
                i+1
            );
            LRPs.push(LRP);
        }
        return LRPs;
    }

    static calcProperties(shortestPath,nextNode){
            let i = 0;
            let pathLength = 0;
            let leastFRCtillNextPoint = frcEnum.FRC_0;
            let frcIsDefined = false;
            while(i < shortestPath.length && shortestPath[i].getStartNode() !== nextNode){
                pathLength += shortestPath[i].getLength();
                if(shortestPath[i].getFRC() !== undefined && shortestPath[i].getFRC() > leastFRCtillNextPoint){
                    leastFRCtillNextPoint = shortestPath[i].getFRC();
                    frcIsDefined = true;
                }
                i++;
            }
            console.log(pathLength);
            return {
                pathLength: pathLength,
                lfrcnp: frcIsDefined ? leastFRCtillNextPoint : frcEnum.FRC_7
            }
        }

    /*
    " The bearing (BEAR) describes the angle between the true North and a line which is defined by the
    coordinate of the LR-point and a coordinate which is BEARDIST along the line defined by the LR-point attributes.
    If the line length is less than BEARDIST then the opposite point of the line is used
    (regardless of BEARDIST). The bearing is measured in degrees and always positive (measuring
    clockwise from North). "
    <- http://www.openlr.org/data/docs/OpenLR-Whitepaper_v1.5.pdf
     */
    // static calcProperties(beardist,node,shortestPath,nextNode){
    //     //find the position beardist meters on the path, unless the next LRP is closer than 20 meters
    //     let i = 0;
    //     let pathLength = 0;
    //     let calcBear = undefined;
    //     let leastFRCtillNextPoint = frcEnum.FRC_7;
    //     while(i < shortestPath.length && shortestPath[i].getStartNode() !== nextNode){
    //         if(calcBear === undefined && pathLength+shortestPath[i].getLength() > 20){
    //             // the bearingdist point lays on this line
    //             let distanceFromLRP = beardist - pathLength;
    //             let bearDistLoc = shortestPath[i].getGeoCoordinateAlongLine(distanceFromLRP);
    //             let lrpPoint = point([node.getLatitudeDeg(), node.getLongitudeDeg()]);
    //             let bearDistPoint = point([bearDistLoc.lat,bearDistLoc.long]);
    //
    //             calcBear = bearing(lrpPoint, bearDistPoint);
    //             if(calcBear < 0){
    //                 // bear is always positive, counterclockwise
    //                 calcBear += 360;
    //             }
    //         }
    //         pathLength += shortestPath[i].getLength();
    //         if(shortestPath[i].getFRC() !== undefined && shortestPath[i].getFRC() < leastFRCtillNextPoint){
    //             leastFRCtillNextPoint = shortestPath[i].getFRC();
    //         }
    //         i++;
    //     }
    //     if(calcBear === undefined){
    //         //means that the next LRP lays earlier than the beardist point
    //         let lrpPoint = point([node.getLatitudeDeg(), node.getLongitudeDeg()]);
    //         let nextLrpPoint = point([nextNode.getLatitudeDeg(), nextNode.getLongitudeDeg()]);
    //
    //         calcBear = bearing(lrpPoint, nextLrpPoint);
    //         if(calcBear < 0){
    //             // bear is always positive, counterclockwise
    //             calcBear += 360;
    //         }
    //     }
    //     return {
    //         bearing: calcBear,
    //         pathLength: pathLength,
    //         lfrcnp: leastFRCtillNextPoint
    //     }
    // }
    //
    // static calcLastLRPProperties(beardist,prevNode,shortestPath,lastNode){
    //     //find the position beardist meters away from the end of the path, unless the previous LRP is closer than 20 meters
    //     let i = 0;
    //     let calcBear = undefined;
    //     let leastFRCtillNextPoint = frcEnum.FRC_0;
    //     while(i < shortestPath.length && shortestPath[i].getStartNode() !== lastNode){
    //         if(shortestPath[i].getFRC() !== undefined && shortestPath[i].getFRC() < leastFRCtillNextPoint){
    //             leastFRCtillNextPoint = shortestPath[i].getFRC();
    //         }
    //         i++;
    //     }
    //     i--;
    //     let reverseLength = 0;
    //     while(i > 0 && calcBear === undefined){
    //         if(reverseLength+shortestPath[i].getLength() > beardist){
    //             // the bearingdist point lays on this line
    //             let distance = reverseLength+shortestPath[i].getLength()-beardist;
    //             let bearDistLoc = shortestPath[i].getGeoCoordinateAlongLine(distance);
    //             let lrpPoint = point([lastNode.getLatitudeDeg(), lastNode.getLongitudeDeg()]);
    //             let bearDistPoint = point([bearDistLoc.lat,bearDistLoc.long]);
    //
    //             calcBear = bearing(lrpPoint, bearDistPoint);
    //             if(calcBear < 0){
    //                 // bear is always positive, counterclockwise
    //                 calcBear += 360;
    //             }
    //         }
    //         i--;
    //     }
    //     if(calcBear === undefined){
    //         //means that the previous LRP lays further than the beardist point
    //         let lrpPoint = point([lastNode.getLatitudeDeg(), lastNode.getLongitudeDeg()]);
    //         let prevLrpPoint = point([prevNode.getLatitudeDeg(), prevNode.getLongitudeDeg()]);
    //
    //         calcBear = bearing(lrpPoint, prevLrpPoint);
    //         if(calcBear < 0){
    //             // bear is always positive, counterclockwise
    //             calcBear += 360;
    //         }
    //     }
    //
    //     return {
    //         bearing: calcBear,
    //         pathLength: 0,
    //         lfrcnp: leastFRCtillNextPoint
    //     }
    // }
}