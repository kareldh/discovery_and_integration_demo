import LocationReferencePoint from "./LocationReferencePoint";
import {point} from '@turf/helpers'
import {bearing} from '@turf/bearing'
import {frcEnum} from "../map/Enum";

export default class LRPNodeHelper{

    static lrpNodesToLRPs(lrpNodes,shortestPaths){
        if(lrpNodes.length<2){
            throw "not enough LRP nodes";
        }
        let LRPs = [];
        for(let i=0;i<lrpNodes.length;i++){
            let properties = {};
            let isLast = false;
            if(i < shortestPaths.length){
                properties = this.calcProperties(20,lrpNodes[i],shortestPaths[i],lrpNodes[i+1]);
            }
            else{
                isLast = true;
                properties = this.calcLastLRPProperties(20,lrpNodes[i-1],shortestPaths[i-1],lrpNodes[i])
            }
            let LRP = new LocationReferencePoint(
                properties.bearing,
                properties.pathLength,
                lrpNodes[i].getFRC(),
                lrpNodes[i].getFOW(),
                properties.lfrcnp,
                properties.isLast,
                lrpNodes[i].getLatitudeDeg(),
                lrpNodes[i].getLongitudeDeg(),
                i+1
            );
            LRPs.push(LRP);
        }
        LRPs.push()
    }

    /*
    " The bearing (BEAR) describes the angle between the true North and a line which is defined by the
    coordinate of the LR-point and a coordinate which is BEARDIST along the line defined by the LRpoint attributes. If the line length is less than BEARDIST then the opposite point of the line is used
    (regardless of BEARDIST). The bearing is measured in degrees and always positive (measuring
    clockwise from North). "
    <- http://www.openlr.org/data/docs/OpenLR-Whitepaper_v1.5.pdf
     */
    static calcProperties(beardist,node,shortestPath,nextNode){
        //find the position beardist meters on the path, unless the next LRP is closer than 20 meters
        let i = 0;
        let pathLength = 0;
        let calcBear = undefined;
        let leastFRCtillNextPoint = frcEnum.FRC_0;
        while(i < shortestPath.length && shortestPath[i].getStartNode() !== nextNode){
            if(calcBear === undefined && pathLength+shortestPath[i].getLength() > 20){
                // the bearingdist point lays on this line
                let distanceFromLRP = beardist - pathLength;
                let bearDistLoc = shortestPath[i].getGeoCoordinateAlongLine(distanceFromLRP);
                let lrpPoint = point([node.getLatitudeDeg(), node.getLongitudeDeg()]);
                let bearDistPoint = point([bearDistLoc.lat,bearDistLoc.lon]);

                console.log(lrpPoint);

                calcBear = bearing(lrpPoint, bearDistPoint);
                if(calcBear < 0){
                    // bear is always positive, counterclockwise
                    calcBear += 360;
                }
            }
            pathLength += shortestPath[i].getLength();
            if(shortestPath[i].getFRC() !== undefined && shortestPath[i].getFRC() < leastFRCtillNextPoint){
                leastFRCtillNextPoint = shortestPath[i].getFRC();
            }
            i++;
        }
        if(calcBear === undefined){
            //means that the next LRP lays earlier than the beardist point
            let lrpPoint = point([node.getLatitudeDeg(), node.getLongitudeDeg()]);
            let nextLrpPoint = point([nextNode.getLatitudeDeg(), nextNode.getLongitudeDeg()]);
        }
        return {
            bearing: calcBear,
            pathLength: pathLength,
            lfrcnp: leastFRCtillNextPoint
        }
    }

    static calcLastLRPProperties(beardist,prevNode,shortestPath,lastNode){
        //find the position beardist meters away from the end of the path, unless the previous LRP is closer than 20 meters
        let i = 0;
        let pathLength = 0;
        let calcBear = undefined;
        let leastFRCtillNextPoint = frcEnum.FRC_0;
        while(i < shortestPath.length && shortestPath[i].getStartNode() !== lastNode){
            pathLength += shortestPath[i].getLength();
            i++;
            if(shortestPath[i].getFRC() !== undefined && shortestPath[i].getFRC() < leastFRCtillNextPoint){
                leastFRCtillNextPoint = shortestPath[i].getFRC();
            }
        }
        i--;
        let reverseLength = 0;
        while(i > 0 && calcBear === undefined){
            if(reverseLength+shortestPath[i].getLength() > 20){
                // the bearingdist point lays on this line
                let distance = reverseLength+shortestPath[i]-20;
                let bearDistLoc = shortestPath[i].getGeoCoordinateAlongLine(distance);
                let lrpPoint = point([lastNode.getLatitudeDeg(), lastNode.getLongitudeDeg()]);
                let bearDistPoint = point([bearDistLoc.lat,bearDistLoc.lon]);

                calcBear = bearing(lrpPoint, bearDistPoint);
                if(calcBear < 0){
                    // bear is always positive, counterclockwise
                    calcBear += 360;
                }
            }
        }
        if(calcBear === undefined){
            //means that the previous LRP lays further than the beardist point
            let lrpPoint = point([lastNode.getLatitudeDeg(), lastNode.getLongitudeDeg()]);
            let nextLrpPoint = point([prevNode.getLatitudeDeg(), prevNode.getLongitudeDeg()]);
        }
        return {
            bearing: calcBear,
            pathLength: pathLength,
            lfrcnp: leastFRCtillNextPoint
        }
    }
}