import axios from 'axios';
import ldfetch from "ldfetch";
import {DATASET_URL} from "./const";
import {tile2boundingBox} from "../../tileUtils";


export function loadNodesLineStringsWegenregisterAntwerpen(){
    return new Promise((resolve, reject) => {
        axios.get(process.env.REACT_APP_WEGENREGISTER_ANTWERPEN_URL)
            .then((data) => { resolve(data.data.features) })
            .catch((error) => { reject(error) })
    });
}

export function fetchRoutableTile(z, x, y) {
    return new Promise((resolve,reject) => {
        try{
            let fetch = new ldfetch({headers: {accept: 'application/ld+json'}});
            fetch.get(DATASET_URL + z + "/" + x + "/" + y).then(
                response => {
                    resolve(response)
                }
            )
        }
        catch(e){
            reject(e);
        }
    });
}

export function fetchOsmData(latLower,latUpper,longLower,longUpper) {
    return new Promise((resolve, reject) => {
        axios.get("https://api.openstreetmap.org/api/0.6/map?bbox="+longLower+","+latLower+","+longUpper+","+latUpper)
            .then((data) => resolve(data.data))
            .catch((error) => {
                reject(error)
            })
    })
}

export function fetchOsmTileData(zoom,tileX,tileY) {
    let boundingBox = tile2boundingBox(tileX,tileY,zoom);
    return fetchOsmData(boundingBox.latLower,boundingBox.latUpper,boundingBox.longLower,boundingBox.longUpper)
}