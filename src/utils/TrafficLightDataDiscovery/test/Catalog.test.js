import {fetchCatalog} from "../Api";
import Catalog from "../Catalog";
import {CATALOG_URL} from "../config";

test('addCatalogPage',(done)=>{
    expect.assertions(6);
    fetchCatalog(CATALOG_URL).then((c)=>{
        expect(c).toBeDefined();
        let catalog = new Catalog();
        let res = catalog.addCatalogPage(c);
        expect(catalog).toBeDefined();
        expect(catalog.searchTree).toBeDefined();
        expect(res.currentPage).toEqual("https://opendata.vlaanderen.be/catalog.rdf?page=1");
        expect(res.nextPage).toEqual("https://opendata.vlaanderen.be/catalog.rdf?page=2");
        expect(res.lastPage).toBeDefined();
        done();
    });
});

test('getDataSetsByDistance',(done)=>{
    expect.assertions(6);
    fetchCatalog(CATALOG_URL).then((c)=>{
        expect(c).toBeDefined();
        let catalog = new Catalog();
        catalog.addCatalogPage(c);
        expect(catalog).toBeDefined();
        expect(catalog.searchTree).toBeDefined();
        let result = catalog.getDataSetsByDistance(51.2120497, 4.3971693, 0);
        // console.log(result[0].feature.geometry.coordinates);
        expect(result).toBeDefined();
        expect(result.length).toBeDefined();
        expect(result.length).not.toEqual(0);
        done();
    });
});

test('add multiple pages',(done)=>{
    jest.setTimeout(50000);
    expect.assertions(95);
    fetchCatalog(CATALOG_URL).then((c)=>{
        expect(c).toBeDefined();
        let catalog = new Catalog();
        let res = catalog.addCatalogPage(c);
        expect(catalog).toBeDefined();
        expect(catalog.searchTree).toBeDefined();
        expect(res.currentPage).toEqual("https://opendata.vlaanderen.be/catalog.rdf?page=1");
        expect(res.nextPage).toEqual("https://opendata.vlaanderen.be/catalog.rdf?page=2");
        expect(res.lastPage).toBeDefined();

        fetchNextPage(res,catalog).then((res)=>{
            console.log(res);
            done();
        });
    });
});

function fetchNextPage(res,catalog,tags=[]){
    console.log("fetch",res);
    expect(res).toBeDefined();
    return new Promise(resolve=>{
        fetchCatalog(res.nextPage).then((c)=>{
            let r = catalog.addCatalogPage(c,tags);
            if(r.currentPage !== r.lastPage){
                resolve(r);
            }
        });
    }).then((r2)=>{
        return r2 ? fetchNextPage(r2,catalog,tags) : res;
    });
}