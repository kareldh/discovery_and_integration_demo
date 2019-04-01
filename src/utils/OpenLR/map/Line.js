import pointToLineDistance from '@turf/point-to-line-distance';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import along from '@turf/along';
import {point,lineString,feature} from '@turf/helpers'
import {fowEnum} from "./Enum";

export default class Line {
    constructor(startNode,endNode,id){
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

    getLineLength(){
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

    getGeoCoordinateAlongLine(distanceAlong){
        let line = lineString(
            [this.startNode.getLatitudeDeg(),this.startNode.getLongitudeDeg()],
            [this.endNode.getLatitudeDeg(), this.endNode.getLongitudeDeg()]
        );
        let along = along(line,distanceAlong,{units: 'meters'});
        return along.geometry;
        //todo aanpassen aan {lat: lon: }
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
        let line = lineString(
            [this.startNode.getLatitudeDeg(),this.startNode.getLongitudeDeg()],
            [this.endNode.getLatitudeDeg(), this.endNode.getLongitudeDeg()]
        );
        let snapped = nearestPointOnLine(line,pt,{units: 'meters'});
        return snapped.properties.location;
    }
}