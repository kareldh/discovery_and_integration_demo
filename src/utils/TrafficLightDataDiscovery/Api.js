import ldfetch from 'ldfetch';

export function fetchCatalog(catalogUrl){
    return new Promise((resolve) => {
        let fetch = new ldfetch({headers: {accept: 'application/rdf+xml'}});
        fetch.get(catalogUrl).then(
            response => {resolve(response)}
        )
    });
}

//todo: fetching a lot of pages is really slow
export function fetchNextPage(res,catalog,tags=[]){
    return new Promise(resolve=>{
        fetchCatalog(res.nextPage).then((c)=>{
            let r = catalog.addCatalogPage(c,tags);
            resolve(r);
        });
    }).then((r2)=>{
        return (r2.currentPage !== r2.lastPage) ? fetchNextPage(r2,catalog,tags) : r2;
    });
}



