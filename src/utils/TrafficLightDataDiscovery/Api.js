import ldfetch from 'ldfetch';

export function fetchCatalog(catalogUrl){
    return new Promise((resolve) => {
        let fetch = new ldfetch({headers: {accept: 'application/rdf+xml'}});
        fetch.get(catalogUrl).then(
            response => {resolve(response)}
        )
    });
}



