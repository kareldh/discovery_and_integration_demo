import {fetchCatalog, fetchNextPage} from "../Api";
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
        let t1 = performance.now();
        let result = catalog.getDataSetsByDistance(51.2120497, 4.3971693, 0);
        let t2 = performance.now();
        console.log("found in",t2-t1,"ms");
        // console.log(result[0].feature.geometry.coordinates);
        expect(result).toBeDefined();
        expect(result.length).toBeDefined();
        expect(result.length).not.toEqual(0);
        done();
    });
});

test('add multiple pages', (done)=>{
    expect.assertions(7);
    fetchCatalog(CATALOG_URL).then(async (c)=>{
        expect(c).toBeDefined();
        let catalog = new Catalog();
        let res = catalog.addCatalogPage(c);
        expect(catalog).toBeDefined();
        expect(catalog.searchTree).toBeDefined();
        expect(res.currentPage).toEqual("https://opendata.vlaanderen.be/catalog.rdf?page=1");
        expect(res.nextPage).toEqual("https://opendata.vlaanderen.be/catalog.rdf?page=2");
        expect(res.lastPage).toBeDefined();

        let last = await fetchNextPage(res,catalog,[]);
        expect(last.currentPage).toEqual(res.lastPage);
        done();
    });
},200000);

test('getDataSetsByDistance after fetching all the pages',(done)=>{
    expect.assertions(10);
    fetchCatalog(CATALOG_URL).then(async (c)=>{
        expect(c).toBeDefined();
        let catalog = new Catalog();
        let res = catalog.addCatalogPage(c);
        expect(catalog).toBeDefined();
        expect(catalog.searchTree).toBeDefined();
        expect(res.currentPage).toEqual("https://opendata.vlaanderen.be/catalog.rdf?page=1");
        expect(res.nextPage).toEqual("https://opendata.vlaanderen.be/catalog.rdf?page=2");
        expect(res.lastPage).toBeDefined();

        let last = await fetchNextPage(res,catalog,[]);
        expect(last.currentPage).toEqual(res.lastPage);

        let t1 = performance.now();
        let result = catalog.getDataSetsByDistance(51.2120497, 4.3971693, 0);
        let t2 = performance.now();
        console.log("found in",t2-t1,"ms");
        // console.log(result[0].feature.geometry.coordinates);
        expect(result).toBeDefined();
        expect(result.length).toBeDefined();
        expect(result.length).not.toEqual(0);
        console.log(result.length);
        done();
    });
},200000);