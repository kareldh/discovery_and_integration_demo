import {fetchCatalog} from "../Api";
import Catalog from "../Catalog";

test('init',(done)=>{
    expect.assertions(3);
    fetchCatalog().then((c)=>{
        expect(c).toBeDefined();
        let catalog = new Catalog(c);
        expect(catalog).toBeDefined();
        expect(catalog.lookup).toBeDefined();
        done();
    });
});

test('getDataSetsByPosition',(done)=>{
    expect.assertions(3);
    fetchCatalog().then((c)=>{
        expect(c).toBeDefined();
        let catalog = new Catalog(c);
        expect(catalog).toBeDefined();
        expect(catalog.lookup).toBeDefined();
        console.log(catalog.lookup.polygons[0]);
        let result = catalog.getDataSetsByPosition(51.2120497, 4.3971693,50);
        expect(result.features.length).not.toEqual(0);
        done();
    });
});