import geojsonrbush from 'geojson-rbush'
import {polygon,lineString} from '@turf/helpers'

export default class RbushLineSearchTree{
    constructor(lines){
        this.tree = geojsonrbush();
        this.addLines(lines);
    }

    //one line === Line object
    addLines(lines){
        let data = [];

        //todo: maybe this could already be made in the openlr integration classes to speed this up
        for(let id in lines){
            if(lines.hasOwnProperty(id)){
                if(lines[id].getStartNode() === undefined || lines[id].getEndNode() === undefined){
                    throw lines[id];
                }
                data.push(lineString([
                    [lines[id].getStartNode().getLongitudeDeg(),lines[id].getStartNode().getLatitudeDeg()],
                    [lines[id].getEndNode().getLongitudeDeg(),lines[id].getEndNode().getLatitudeDeg()]
                ],{id: id}));
            }
        }
        this.tree.load(data);
    }

    addData(data){
        this.tree.load(data);
    }

    //todo: remove lines

    //dist given in meters
    //uses an approximate square bounding box around the given point, so it is possible that lines are returned that
    //are further than dist away. It is still necessary to iterate the returned lines and calculate their real distance.
    findCloseBy(lat,long,dist){
        let earthRadius = 6371000;
        let latDiff = this.toDegrees(dist/earthRadius);
        let longDiff = this.toDegrees(dist/(Math.cos(this.toRadians(lat)) * earthRadius));
        let latUpper = lat+latDiff;
        let latLower = lat-latDiff;
        let longUpper = long+longDiff;
        let longLower = long-longDiff;
        let p = polygon([[[longLower,latLower],[longLower,latUpper],[longUpper,latUpper],[longUpper,latLower],[longLower,latLower]]]);
        let r = this.tree.search(p);
        return r.features;
    }

    toRadians(degrees){
        return degrees * Math.PI / 180;
    }

    toDegrees(radians){
        return radians / Math.PI * 180
    }
}