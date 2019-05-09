import {parseAndStoreQuads} from "../../Parser";
import {getDataSetsFromStore} from "../../Data";
import {catalog} from "../../testdata/verkeerslichtCatalog";
import Catalog from "../../Catalog";
import RbushPolygonSearchTree from '../RbushPolygonSearchTree'
import GeoJSONRBushPolygonSearchTree from "../GeoJSONRBushPolygonSearchTree";

test('searchTree comparision',(done)=>{
    expect.assertions(13);
    parseAndStoreQuads(catalog).then(_store=>{
        getDataSetsFromStore(_store,["verkeerslicht"]).then((r)=>{
            expect(r).toBeDefined();
            let features = Catalog._createFeaturesForGeoSpatialDataSets(r);
            let featureCollection = {
                type: 'FeatureCollection',
                features: features
            };
            let t1 = performance.now();
            let rbushSearchTree = new RbushPolygonSearchTree(featureCollection);
            let result = rbushSearchTree.findCloseBy(51.2120497, 4.3971693, 0);
            let t2 = performance.now();
            console.log("found in",t2-t1,"ms using RbushPolygonSearchTree");

            let t3 = performance.now();
            let geojsonRbushSearchTree = new GeoJSONRBushPolygonSearchTree(featureCollection);
            let result2 = geojsonRbushSearchTree.findCloseBy(51.2120497, 4.3971693, 0);
            let t4 = performance.now();
            console.log("found in",t4-t3,"ms using GeoJSONRBushPolygonSearchTree");

            expect(result).toBeDefined();
            expect(result2).toBeDefined();
            expect(result.length).toBeDefined();
            expect(result.length).not.toEqual(0);
            expect(result2.length).toBeDefined();
            expect(result2.length).not.toEqual(0);

            expect(result2[0].type).toBeDefined();
            expect(result2[0].properties).toBeDefined();
            expect(result2[0].geometry).toBeDefined();
            expect(result2[0].type).toEqual(result[0].type);
            expect(result2[0].properties).toEqual(result[0].properties);
            expect(result2[0].geometry).toEqual(result[0].geometry);
            done();
        });
    });
});