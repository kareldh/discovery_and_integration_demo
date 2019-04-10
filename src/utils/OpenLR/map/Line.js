import pointToLineDistance from '@turf/point-to-line-distance';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import along from '@turf/along';
import {point,lineString} from '@turf/helpers'
import distance from "@turf/distance/index";
import bearing from '@turf/bearing'
import {fowEnum} from "./Enum";
import {configProperties} from "../coder/CoderSettings";


export default class Line {
    constructor(id,startNode,endNode){
        this.startNode = startNode;
        this.endNode = endNode;
        this.id = id;
        this.fow = fowEnum.UNDEFINED;
        this.frc = undefined;
        this.pointAlongLine = undefined;
        this.lineLength = undefined;
        this.prevLines = [];
        this.nextLines = [];
        this.shape = undefined;
        this.turnRestriction = undefined;
        this.bearing = undefined;
        this.reverseBearing = undefined;
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

    getPointAlongLine(){
        return this.pointAlongLine;
    }

    getLength(){
        if(this.lineLength === undefined && this.startNode !== undefined && this.endNode !== undefined){
            let from = point([
                this.startNode.getLatitudeDeg(),
                this.startNode.getLongitudeDeg()
            ]);
            let to = point([
                this.endNode.getLatitudeDeg(),
                this.endNode.getLongitudeDeg()
            ]);
            this.lineLength = Math.round(distance(from,to,{units: "meters"})); //work with integer values
        }
        return this.lineLength;
    }

    getID(){
        return this.id;
    }

    getPrevLines(){
        return this.prevLines;
    }

    getNextLines(){
        return this.nextLines;
    }

    getShapeCoordinates(){
        return this.shape;
    }

    getNames(){
        //optional, undefined
    }

    getTurnRestriction(){
        return this.turnRestriction;
    }

    getGeoCoordinateAlongLine(distanceAlong){
        let line = lineString([
            [this.startNode.getLatitudeDeg(),this.startNode.getLongitudeDeg()],
            [this.endNode.getLatitudeDeg(), this.endNode.getLongitudeDeg()]
        ]);

        let distAlong = along(line,distanceAlong,{units: 'meters'});
        //return distAlong.geometry;
        return {
            lat: distAlong.geometry.coordinates[0],
            long: distAlong.geometry.coordinates[1]
        }
    }

    distanceToPoint(lat,long){
        let pt = point([lat,long]);
        let line = lineString(
            [this.startNode.getLatitudeDeg(),this.startNode.getLongitudeDeg()],
            [this.endNode.getLatitudeDeg(), this.endNode.getLongitudeDeg()]
        );
        return pointToLineDistance(pt,line, {units: 'meters'});
    }

    measureAlongLine(lat,long){
        let pt = point([lat,long]);
        let line = lineString([
            [this.startNode.getLatitudeDeg(),this.startNode.getLongitudeDeg()],
            [this.endNode.getLatitudeDeg(), this.endNode.getLongitudeDeg()]
        ]);
        let snapped = nearestPointOnLine(line,pt,{units: 'meters'});
        return {
            lat: snapped.geometry.coordinates[0],
            long: snapped.geometry.coordinates[1]
        }
    }

    getBearing(){
        if(this.bearing === undefined){
            let startNode = point([this.startNode.getLatitudeDeg(), this.startNode.getLongitudeDeg()]);
            let bearPoint;
            if(this.lineLength <= configProperties.bearDist){
                bearPoint = point([this.endNode.getLatitudeDeg(), this.endNode.getLongitudeDeg()]);
            }
            else{
                let bearDistLoc = this.getGeoCoordinateAlongLine(configProperties.bearDist);
                bearPoint = point([bearDistLoc.lat,bearDistLoc.long]);
            }

            let calcBear = bearing(startNode, bearPoint);
            if(calcBear < 0){
                // bear is always positive, counterclockwise
                calcBear += 360;
            }
            this.bearing = calcBear;
        }
        return this.bearing;
    }

    getReverseBearing(){
        if(this.reverseBearing === undefined){
            let startNode = point([this.endNode.getLatitudeDeg(), this.endNode.getLongitudeDeg()]);
            let bearPoint;
            if(this.lineLength <= configProperties.bearDist){
                bearPoint = point([this.startNode.getLatitudeDeg(), this.startNode.getLongitudeDeg()]);
            }
            else{
                let bearDistLoc = this.getGeoCoordinateAlongLine(this.lineLength-configProperties.bearDist);
                bearPoint = point([bearDistLoc.lat,bearDistLoc.long]);
            }

            let calcBear = bearing(startNode, bearPoint);
            if(calcBear < 0){
                // bear is always positive, counterclockwise
                calcBear += 360;
            }
            this.reverseBearing = calcBear;
        }
        return this.reverseBearing;
    }
}