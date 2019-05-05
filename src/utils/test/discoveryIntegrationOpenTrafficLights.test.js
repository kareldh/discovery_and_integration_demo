import {downloadOpenTrafficLightsTestData} from "../OpenTrafficLights/data";
import {getLaneDefs, parseAndStoreQuads} from "../OpenTrafficLights/parser";
import linestringToLatLng from "../OpenTrafficLights/linestringToLatLng";

test('getLaneDefs linestringToLatLng',(done)=>{
    expect.assertions(1);
    downloadOpenTrafficLightsTestData().then(data=>{
        parseAndStoreQuads(data).then((store)=>{
            getLaneDefs(store).then((lanes)=>{
                let parsed = {};
                for(let key in lanes){
                    if(lanes.hasOwnProperty(key)){
                        parsed[key] = linestringToLatLng(lanes[key]);
                    }
                }
                // console.log(parsed);
                expect(parsed).toBeDefined();
            });
            done();
        })
    });
});