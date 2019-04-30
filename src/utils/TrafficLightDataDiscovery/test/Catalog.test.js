import {fetchCatalog} from "../Api";
import Catalog from "../Catalog";

test('init',(done)=>{
    expect.assertions(3);
    fetchCatalog().then((c)=>{
        expect(c).toBeDefined();
        let catalog = new Catalog(c);
        expect(catalog).toBeDefined();
        expect(catalog.searchTree).toBeDefined();
        done();
    });
});

test('getDataSetsByPosition',(done)=>{
    expect.assertions(6);
    fetchCatalog().then((c)=>{
        expect(c).toBeDefined();
        let catalog = new Catalog(c);
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