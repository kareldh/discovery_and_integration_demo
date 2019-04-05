import pointToLineDistance from '@turf/point-to-line-distance';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import along from '@turf/along';
import {point,lineString,feature} from '@turf/helpers'
import {fowEnum} from "./Enum";
import distance from "@turf/distance/index";

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
            this.lineLength = distance(from,to,{units: "meters"});
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
            lon: distAlong.geometry.coordinates[1]
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
        return snapped.properties.location;
    }
}