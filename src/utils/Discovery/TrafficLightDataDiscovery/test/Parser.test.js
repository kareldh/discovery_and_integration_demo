import {catalog} from "../testdata/verkeerslichtCatalog";
import {
    getDataSets, getDistributions, getGeometries, getKeywords, getLocationIDtoDataSet, getPagingInfo,
    parseAndStoreQuads
} from "../Parser";

test('parseAndStoreQuads',(done)=>{
    expect.assertions(1);
    let doc = catalog;
    parseAndStoreQuads(doc).then(_store=>{
       expect(_store).toBeDefined();
       done();
    })
});

test('getDataSets',(done)=>{
    expect.assertions(2);
    let doc = catalog;
    parseAndStoreQuads(doc).then(_store=>{
        getDataSets(_store).then(r=>{
            console.log(r);
            expect(r).toBeDefined();
            expect(r["https://lodi.ilabt.imec.be/observer/rawdata/latest#Dataset"]).toBeDefined();
            done();
        });
    })
});

test('getDistributions',(done)=>{
    expect.assertions(2);
    let doc = catalog;
    parseAndStoreQuads(doc).then(_store=>{
        getDistributions(_store).then(r=>{
            console.log(r);
            expect(r).toBeDefined();
            expect(r.distributions["https://lodi.ilabt.imec.be/observer/rawdata/latest#Dataset"]).toBeDefined();
            done();
        });
    })
});

test('getLocationIDtoDataSet',(done)=>{
    expect.assertions(1);
    let doc = catalog;
    parseAndStoreQuads(doc).then(_store=>{
        getLocationIDtoDataSet(_store).then(r=>{
            console.log(r);
            expect(r).toBeDefined();
            done();
        });
    })
});

test('getGeometries',(done)=>{
    expect.assertions(1);
    let doc = catalog;
    parseAndStoreQuads(doc).then(_store=>{
        getGeometries(_store).then(r=>{
            console.log(r);
            expect(r).toBeDefined();
            done();
        });
    })
});

test('getKeywords',(done)=>{
    expect.assertions(2);
    let doc = catalog;
    parseAndStoreQuads(doc).then(_store=>{
        getKeywords(_store).then(r=>{
            console.log(r);
            expect(r).toBeDefined();
            expect(r["https://lodi.ilabt.imec.be/observer/rawdata/latest#Dataset"]).toBeDefined();
            done();
        });
    })
});

test('getPagingInfo',(done)=>{
    expect.assertions(2);
    let doc = catalog;
    parseAndStoreQuads(doc).then(_store=>{
        getPagingInfo(_store).then(r=>{
            console.log(r);
            expect(r).toBeDefined();
            expect(r).toEqual({
                currentPage: undefined,
                nextPage: undefined,
                lastPage: undefined
            });
            done();
        });
    })
});