import geojsonrdbush from 'geojson-rbush'
import {polygon} from '@turf/helpers'

export default class GeoJSONRbushSearchTree{
    constructor(){
        this.tree = geojsonrdbush();
    }

    addData(data){
        this.tree.load(data);
    }

    //todo: remove data

    //dist given in meters
    //uses an approximate square bounding box around the given point, so it is possible that nodes/lines/data are returned that
    //are further than dist away. It is still necessary to iterate the returned nodes/lines/data and calculate their real distance.
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