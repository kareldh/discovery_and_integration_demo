import {loadNodesLineStringsWegenregsterAntwerpen} from "../../../data/LoadTestData";
import WegenregisterAntwerpenIntegration from "../WegenregisterAntwerpenIntegration";
import MapDataBase from "../../OpenLR/map/MapDataBase";

test("initMapDatabase",(done)=>{
    expect.assertions(3);
    loadNodesLineStringsWegenregsterAntwerpen().then(features => {
         let mapDatabase = new MapDataBase();
         WegenregisterAntwerpenIntegration.initMapDataBase(mapDatabase,features);
         expect(mapDatabase).toBeDefined();
         expect(mapDatabase.lines).not.toEqual({});
         expect(mapDatabase.nodes).not.toEqual({});
         done();
    });
});