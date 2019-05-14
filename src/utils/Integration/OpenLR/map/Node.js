import distance from '@turf/distance';
import {point} from '@turf/helpers'
import {configProperties} from "../coder/CoderSettings";
import {internalPrecisionEnum} from "./Enum";

export default class Node{
    constructor(id=0,lat=0,long=0,incomingLines=[],outgoingLines=[]){
        this.id = id;
        this.lat = lat;
        this.long = long;
        this.incomingLines = incomingLines;
        this.outgoingLines = outgoingLines;
        this.setLines(incomingLines,outgoingLines);
        this.internalPrecision = configProperties.internalPrecision;
    }

    setLines(incomingLines,outgoingLines){
        this.incomingLines = incomingLines;
        this.outgoingLines = outgoingLines;
    }

    getLatitudeDeg(){
        return this.lat;
    }

    getLongitudeDeg(){
        return this.long;
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

    getDistance(lat,long){
        let from = point([
            this.long,
            this.lat
        ]);
        let to = point([
            long,
            lat
        ]);
        if(this.internalPrecision === internalPrecisionEnum.CENTIMETER){
            return Math.round(distance(from,to,{units: "centimeters"}));
        }
        else{
            return Math.round(distance(from,to,{units: "meters"}));
        }
    }
}