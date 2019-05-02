import pointToLineDistance from '@turf/point-to-line-distance';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import along from '@turf/along';
import {point,lineString} from '@turf/helpers'
import distance from "@turf/distance/index";
import bearing from '@turf/bearing'
import {fowEnum, frcEnum} from "./Enum";
import {configProperties} from "../coder/CoderSettings";


export default class Line {
    constructor(id,startNode,endNode){
        this.startNode = startNode;
        this.endNode = endNode;
        this.id = id;
        this.fow = fowEnum.UNDEFINED;
        this.frc = frcEnum.FRC_7;
        // this.pointAlongLine = undefined;
        this.lineLength = undefined;
        // this.prevLines = [];
        // this.nextLines = [];
        // this.shape = undefined;
        this.turnRestriction = undefined;
        this.bearing = undefined;
        this.reverseBearing = undefined;
        startNode.outgoingLines.push(this);
        endNode.incomingLines.push(this);
    }

    getStartNode(){
        return this.startNode;
    }

    getEndNode(){
        return this.endNode;
    }

    getFOW(){
        return this.fow;
    }

    getFRC(){
        return this.frc;
    }

    // getPointAlongLine(){
    //     return this.pointAlongLine;
    // }

    getLength(){
        if(this.lineLength === undefined && this.startNode !== undefined && this.endNode !== undefined){
            let from = point([
                this.startNode.getLongitudeDeg(),
                this.startNode.getLatitudeDeg()
            ]);
            let to = point([
                this.endNode.getLongitudeDeg(),
                this.endNode.getLatitudeDeg()
            ]);
            this.lineLength = Math.round(distance(from,to,{units: "centimeters"})); //work with integer values in centimeter
            if(this.lineLength === 0){
                this.lineLength = 1;    //but minimum value should be 1
            }
            // this.lineLength = distance(from,to,{units: "meters"});
        }
        return this.lineLength;
    }

    getID(){
        return this.id;
    }

    // getPrevLines(){
    //     return this.prevLines;
    // }
    //
    // getNextLines(){
    //     return this.nextLines;
    // }
    //
    // getShapeCoordinates(){
    //     return this.shape;
    // }
    //
    // getNames(){
    //     //optional, undefined
    // }

    getTurnRestriction(){
        return this.turnRestriction;
    }

    getGeoCoordinateAlongLine(distanceAlong){
        let line = lineString([
            [this.startNode.getLongitudeDeg(),this.startNode.getLatitudeDeg()],
            [this.endNode.getLongitudeDeg(),this.endNode.getLatitudeDeg()]
        ]);
        let distAlong = along(line,distanceAlong,{units: 'centimeters'});
        //return distAlong.geometry;
        return {
            lat: distAlong.geometry.coordinates[1],
            long: distAlong.geometry.coordinates[0]
        }
    }

    distanceToPoint(lat,long){
        let pt = point([long,lat]);
        let line = lineString(
            [[this.startNode.getLongitudeDeg(),this.startNode.getLatitudeDeg()],
            [this.endNode.getLongitudeDeg(),this.endNode.getLatitudeDeg()]]
        );
        return Math.round(pointToLineDistance(pt,line, {units: 'centimeters'}));
    }

    measureAlongLine(lat,long){
        let pt = point([long,lat]);
        let line = lineString([
            [this.startNode.getLongitudeDeg(),this.startNode.getLatitudeDeg()],
            [this.endNode.getLongitudeDeg(),this.endNode.getLatitudeDeg()]
        ]);
        let snapped = nearestPointOnLine(line,pt,{units: 'meters'});
        return {
            lat: snapped.geometry.coordinates[1],
            long: snapped.geometry.coordinates[0]
        }
    }

    getBearing(){
        if(this.bearing === undefined){
            let startNode = point([this.startNode.getLongitudeDeg(),this.startNode.getLatitudeDeg()]);
            let bearPoint;
            if(this.getLength() <= configProperties.bearDist){
                bearPoint = point([this.endNode.getLongitudeDeg(),this.endNode.getLatitudeDeg()]);
            }
            else{
                let bearDistLoc = this.getGeoCoordinateAlongLine(configProperties.bearDist);
                bearPoint = point([bearDistLoc.long,bearDistLoc.lat]);
            }

            let calcBear = bearing(startNode, bearPoint);
            // bear is always positive, counterclockwise
            calcBear = (calcBear+360.0)%360.0;
            this.bearing = Math.round(calcBear);
        }
        return this.bearing;
    }

    getReverseBearing(){
        if(this.reverseBearing === undefined){
            let startNode = point([this.endNode.getLongitudeDeg(),this.endNode.getLatitudeDeg()]);
            let bearPoint;
            if(this.getLength() <= configProperties.bearDist){
                bearPoint = point([this.startNode.getLongitudeDeg(),this.startNode.getLatitudeDeg()]);
            }
            else{
                let bearDistLoc = this.getGeoCoordinateAlongLine(this.getLength()-configProperties.bearDist);
                bearPoint = point([bearDistLoc.long,bearDistLoc.lat]);
            }

            let calcBear = bearing(startNode, bearPoint);
            // bear is always positive, counterclockwise
            calcBear = (calcBear+360.0)%360.0;
            this.reverseBearing = Math.round(calcBear);
        }
        return this.reverseBearing;
    }
}