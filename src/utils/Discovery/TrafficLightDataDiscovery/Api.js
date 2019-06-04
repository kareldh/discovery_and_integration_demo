import ldfetch from 'ldfetch';
import {getDataSetsFromTriples} from "./Data";

export function fetchCatalog(catalogUrl){
    return new Promise((resolve) => {
        let fetch = new ldfetch({headers: {accept: 'application/rdf+xml'}});
        fetch.get(catalogUrl).then(
            response => {resolve(response)}
        )
    });
}

//todo: fetching a lot of pages is really slow
export function fetchNextPage(res,catalog,tags=[],options){
    return new Promise(resolve=>{
        let t1 = performance.now();
        fetchCatalog(((options && options.uriPrefix)?options.uriPrefix:"")+res.nextPage).then((c)=>{
            let t2 = performance.now();
            let sets = getDataSetsFromTriples(c.triples,tags);
            let r = catalog.addCatalogPage(sets);
            let t3 = performance.now();
            if(options && options.logging){
                console.log("page downloaded in",t2-t1,"ms","and parsed in",t3-t2,"ms");
            }
            resolve(r);
        });
    }).then((r2)=>{
        return (r2.currentPage !== r2.lastPage) ? fetchNextPage(r2,catalog,tags,options) : r2;
    });
}


