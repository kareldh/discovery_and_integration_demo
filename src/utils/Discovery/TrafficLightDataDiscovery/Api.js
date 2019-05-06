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
        fetchCatalog(((options && options.uriPrefix)?options.uriPrefix:"")+res.nextPage).then((c)=>{
            let sets = getDataSetsFromTriples(c.triples,tags);
            let r = catalog.addCatalogPage(sets);
            resolve(r);
        });
    }).then((r2)=>{
        return (r2.currentPage !== r2.lastPage) ? fetchNextPage(r2,catalog,tags,options) : r2;
    });
}


