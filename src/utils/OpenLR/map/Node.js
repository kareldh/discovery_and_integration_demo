import distance from '@turf/distance';
import {point} from '@turf/helpers'

export default class Node{
    constructor(id=0,lat=0,long=0,incomingLines=[],outgoingLines=[]){
        this.id = id;
        this.lat = lat;
        this.long = long;
        this.incomingLines = incomingLines;
        this.outgoingLines = outgoingLines;
        this.setLines(incomingLines,outgoingLines);
    }

    setLines(incomingLines,outgoingLines){
        this.incomingLines = incomingLines;
        this.outgoingLines = outgoingLines;
        //todo: overbodig?
        this.lines = incomingLines.concat(outgoingLines.filter(function (outLine) {
            incomingLines.forEach(function (inLine) {
                if(inLine.id === outLine.id){
                    return false
                }
            });
            return true;
        }));
    }

    getLatitudeDeg(){
        return this.lat;
    }

    getLongitudeDeg(){
        return this.long;
    }

    getConnectedLines(){
        return this.lines;
    }

    getNumberConnectedLines(){
        return this.lines.length;
    }

    getOutgoingLines(){
        return this.outgoingLines;
    }

    getIncomingLines(){
        return this.incomingLines;
    }

    getID(){
        return this.id;
    }

    getGeoCoordinates(){
        return { lat: this.lat, lon: this.long };
    }

    getDistance(lat,long){
        let from = point([
            this.long,
            this.lat
        ]);
        let to = point([
            long,
            lat
        ]);
        return distance(from,to,{units: "meters"});
    }
}