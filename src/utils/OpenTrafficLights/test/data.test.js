import {getOpenTrafficLightsData} from "../data";

test('getOpenTrafficLightsData',(done)=>{
    expect.assertions(1);
    getOpenTrafficLightsData("https://lodi.ilabt.imec.be/observer/rawdata/latest").then(triples=>{
        expect(triples).toBeDefined();
        console.log(triples);
        done();
    })
});