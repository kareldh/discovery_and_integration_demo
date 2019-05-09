import geojsonrdbush from 'geojson-rbush'
import {polygon,point} from '@turf/helpers'

export default class GeoJSONRbushNodeSearchTree{
    constructor(nodes){
        this.tree = geojsonrdbush();
        this.addNodes(nodes);
    }

    // one node === Node object
    addNodes(nodes){
        let data = [];

        //todo: maybe this could already be made in the openlr integration classes to speed te initialisation up
        //todo: this is the only differente with GeoJSONRDBushLineSearchTree so maybe this can be moved up and a single GeoRDBushSearchTree could be made
        for(let id in nodes){
            if(nodes.hasOwnProperty(id)){
                if(isNaN(nodes[id].getLongitudeDeg()) || isNaN(nodes[id].getLatitudeDeg())){
                    throw nodes[id];
                }
                let p = point([nodes[id].getLongitudeDeg(),nodes[id].getLatitudeDeg()],{id: id});
                data.push(p);
            }
        }
        this.tree.load(data);
    }

    addData(data){
        this.tree.load(data);
    }

    //todo: remove nodes

    //dist given in meters
    //uses an approximate square bounding box around the given point, so it is possible that nodes are returned that
    //are further than dist away. It is still necessary to iterate the returned nodes and calculate their real distance.
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