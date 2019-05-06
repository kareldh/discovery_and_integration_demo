import ldfetch from "ldfetch";
import {data} from "./testdata/latest"
import axios from 'axios';

export function getOpenTrafficLightsData(URL){
    return new Promise((resolve) => {
        let fetch = new ldfetch({headers: {accept: 'application/rdf+xml'}});
        fetch.get(URL).then(
            response => {resolve(response)}
        )
    });
}

export function downloadOpenTrafficLightsTestData(){
    return new Promise((resolve)=>resolve(data));
}