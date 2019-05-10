import {fetchCatalog, fetchNextPage} from "../Api";
import Catalog from "../Catalog";
import {CATALOG_URL} from "../Config";
import {getDataSetsFromStore, getDataSetsFromTriples} from "../Data";
import {parseAndStoreQuads} from "../Parser";
import {catalog} from "../testdata/verkeerslichtCatalog";

describe("use opendata.vlaanderen catalog",()=>{
    // test('addCatalogPage',(done)=>{
    //     expect.assertions(6);
    //     fetchCatalog(CATALOG_URL).then((c)=>{
    //         expect(c).toBeDefined();
    //         let catalog = new Catalog();
    //         let sets = getDataSetsFromTriples(c.triples);
    //         let res = catalog.addCatalogPage(sets);
    //         expect(catalog).toBeDefined();
    //         expect(catalog.searchTree).toBeDefined();
    //         expect(res.currentPage).toEqual("https://opendata.vlaanderen.be/catalog.rdf?page=1");
    //         expect(res.nextPage).toEqual("https://opendata.vlaanderen.be/catalog.rdf?page=2");
    //         expect(res.lastPage).toBeDefined();
    //         done();
    //     });
    // },60000);

    test('getDataSetsByDistance',(done)=>{
        expect.assertions(9);
        fetchCatalog(CATALOG_URL).then((c)=>{
            expect(c).toBeDefined();
            let catalog = new Catalog();
            let sets = getDataSetsFromTriples(c.triples);
            catalog.addCatalogPage(sets);
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
            expect(result[0].type).toBeDefined();
            expect(result[0].geometry).toBeDefined();
            expect(result[0].properties).toBeDefined();
            done();
        });
    },60000);

    // test('add multiple pages', (done)=>{
    //     expect.assertions(7);
    //     fetchCatalog(CATALOG_URL).then(async (c)=>{
    //         expect(c).toBeDefined();
    //         let catalog = new Catalog();
    //         let sets = getDataSetsFromTriples(c.triples);
    //         let res = catalog.addCatalogPage(sets);
    //         expect(catalog).toBeDefined();
    //         expect(catalog.searchTree).toBeDefined();
    //         expect(res.currentPage).toEqual("https://opendata.vlaanderen.be/catalog.rdf?page=1");
    //         expect(res.nextPage).toEqual("https://opendata.vlaanderen.be/catalog.rdf?page=2");
    //         expect(res.lastPage).toBeDefined();
    //
    //         let last = await fetchNextPage(res,catalog,[]);
    //         expect(last.currentPage).toEqual(res.lastPage);
    //         done();
    //     });
    // },200000);
    //
    test('getDataSetsByDistance after fetching all the pages',(done)=>{
        expect.assertions(13);
        fetchCatalog(CATALOG_URL).then(async (c)=>{
            expect(c).toBeDefined();
            let catalog = new Catalog();
            let sets = getDataSetsFromTriples(c.triples);
            let res = catalog.addCatalogPage(sets);
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
            expect(result[0].type).toBeDefined();
            expect(result[0].geometry).toBeDefined();
            expect(result[0].properties).toBeDefined();
            done();
        });
    },200000);
});

describe("use custom catalog testdata",()=>{
    test('addCatalogPage',(done)=>{
        expect.assertions(6);
        let doc = catalog;
        parseAndStoreQuads(doc).then(_store=>{
            getDataSetsFromStore(_store,["verkeerslicht"]).then((r)=>{
                expect(r).toBeDefined();
                let catalog = new Catalog();
                let res = catalog.addCatalogPage(r);
                expect(catalog).toBeDefined();
                expect(catalog.searchTree).toBeDefined();
                expect(res.currentPage).not.toBeDefined();
                expect(res.nextPage).not.toBeDefined();
                expect(res.lastPage).not.toBeDefined();
                done();
            });
        });
    });

    test('getDataSetsByDistance',(done)=>{
        expect.assertions(6);
        let doc = catalog;
        parseAndStoreQuads(doc).then(_store=>{
            getDataSetsFromStore(_store,["verkeerslicht"]).then((r)=>{
                expect(r).toBeDefined();
                let catalog = new Catalog();
                let res = catalog.addCatalogPage(r);
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
    });

    test('getDataSetsInRange',(done)=>{
        expect.assertions(6);
        let doc = catalog;
        parseAndStoreQuads(doc).then(_store=>{
            getDataSetsFromStore(_store,["verkeerslicht"]).then((r)=>{
                expect(r).toBeDefined();
                let catalog = new Catalog();
                let res = catalog.addCatalogPage(r);
                expect(catalog).toBeDefined();
                expect(catalog.searchTree).toBeDefined();
                let t1 = performance.now();
                let result = catalog.getDataSetsInRange(51.206883394865606,51.2206474303833,4.39453125,4.41650390625);
                let t2 = performance.now();
                console.log("found in",t2-t1,"ms");
                // console.log(result[0].feature.geometry.coordinates);
                expect(result).toBeDefined();
                expect(result.length).toBeDefined();
                expect(result.length).not.toEqual(0);
                done();
            });
        });
    });
});