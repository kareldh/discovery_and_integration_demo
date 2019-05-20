import {downloadOpenTrafficLightsTestData} from "../data";
import {
    getLaneDefs, getLanesAsArrayInCorrectDirection,
    parseAndStoreQuads
} from "../parser";


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

test('get lanes with correct direction (assuming al lanes start at junction in data)',(done)=>{
    expect.assertions(1);
    downloadOpenTrafficLightsTestData().then(data=>{
        parseAndStoreQuads(data).then((store)=>{
            getLanesAsArrayInCorrectDirection(store).then(lanes=>{
                console.log(lanes);
                expect(lanes).toBeDefined();
                // for(let key in lanes){
                //     if(lanes.hasOwnProperty(key)){
                //         for(let i=0;i<lanes[key].length;i++){
                //             let temp = lanes[key][i][0];
                //             lanes[key][i][0] = lanes[key][i][1];
                //             lanes[key][i][1] = temp;
                //         }
                //     }
                // }
                // console.log(lanes);
                done();
            });
        })
    });
});