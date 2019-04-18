import ldfetch from 'ldfetch';
import {CATALOG_URL} from "./config";

export function fetchCatalog(){
    //todo: hydra nextpage tot hydra lastpage ophalen
    return new Promise((resolve) => {
        let fetch = new ldfetch({headers: {accept: 'application/rdf+xml'}});
        fetch.get(CATALOG_URL).then(
            response => {resolve(response)}
        )
    });
}



