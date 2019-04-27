import {loadNodesLineStringsWegenregsterAntwerpen} from "../../../data/LoadTestData";
import WegenregisterAntwerpenIntegration from "../WegenregisterAntwerpenIntegration";

test("initMapDatabase",(done)=>{
    expect.assertions(3);
    loadNodesLineStringsWegenregsterAntwerpen().then(features => {
         let mapDatabase = WegenregisterAntwerpenIntegration.initMapDataBase(features);
         expect(mapDatabase).toBeDefined();
         expect(mapDatabase.lines).not.toEqual({});
         expect(mapDatabase.nodes).not.toEqual({});
         done();
    });
});