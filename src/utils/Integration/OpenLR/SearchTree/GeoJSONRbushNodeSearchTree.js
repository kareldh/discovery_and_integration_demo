import {point} from '@turf/helpers'
import GeoJSONRbushSearchTree from "./GeoJSONRbushSearchTree";

export default class GeoJSONRbushNodeSearchTree extends GeoJSONRbushSearchTree{
    constructor(nodes){
        super();
        this.addNodes(nodes);
    }

    // one node === Node object
    addNodes(nodes){
        let data = [];

        //todo: maybe this could already be made in the openlr integration classes to speed te initialisation up
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

    //todo: remove nodes
}