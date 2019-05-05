import axios from 'axios';
import ldfetch from "ldfetch";
import {DATASET_URL} from "./const";


export function loadNodesLineStringsWegenregsterAntwerpen(){
    return new Promise(resolve => {
        axios.get("http://portaal-stadantwerpen.opendata.arcgis.com/datasets/6bad868c084a43ef8031cfe1b96956b2_297.geojson ").then(
            (data) => {
                resolve(data.data.features);
            }
        )
    });
}

export function fetchRoutableTile(z, x, y) {
    return new Promise((resolve) => {
        let fetch = new ldfetch({headers: {accept: 'application/ld+json'}});
        fetch.get(DATASET_URL + z + "/" + x + "/" + y).then(
            response => {
                resolve(response)
            }
        )
    });
}

export function fetchOsmData() {
    return new Promise((resolve, reject) => {
        axios.get("https://api.openstreetmap.org/api/0.6/map?bbox=4.3915,51.2065,4.4076,51.2169")
            .then((data) => resolve(data.data))
            .catch((error) => {
                reject(error)
            })
    })
}