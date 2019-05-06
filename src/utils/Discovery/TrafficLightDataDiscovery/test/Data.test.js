import {catalog} from "../testdata/verkeerslichtCatalog";
import {parseAndStoreQuads} from "../Parser";
import {getDataSetsFromStore} from "../Data";

test('getDataSetsFromStore',(done)=>{
    expect.assertions(1);
    let doc = catalog;
    parseAndStoreQuads(doc).then(_store=>{
        getDataSetsFromStore(_store,["verkeerslicht"]).then((r)=>{
            console.log(r);
            expect(r).toBeDefined();
            done();
        });
    })
});