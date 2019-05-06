import {downloadOpenTrafficLightsTestData} from "../data";
import {getLaneDefs, parseAndStoreQuads} from "../parser";

test('parseAndStoreQuads',(done)=>{
    expect.assertions(1);
    downloadOpenTrafficLightsTestData().then(data=>{
        parseAndStoreQuads(data).then((store)=>{
            // console.log(store);
            expect(store).toBeDefined();
            done();
        })
    });
});

test('getLaneDefs',(done)=>{
    expect.assertions(1);
    downloadOpenTrafficLightsTestData().then(data=>{
        parseAndStoreQuads(data).then((store)=>{
            getLaneDefs(store).then((lanes)=>{
                // console.log(lanes);
                expect(lanes).toBeDefined();
            });
            done();
        })
    });
});