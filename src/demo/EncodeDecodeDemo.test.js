// demo that tries to find all nodes of OpenStreetMap
// in a specific bounding box: <bounds minlat="51.2093400" minlon="4.3917700" maxlat="51.2140400" maxlon="4.4034600"/>
// on the wegenregister Antwerpen

import MapDataBase from "../utils/OpenLR/map/MapDataBase";
import {loadNodesLineStringsWegenregsterAntwerpen} from "../data/LoadTestData";
import WegenregisterAntwerpenIntegration from "../utils/OpenLRData/WegenregisterAntwerpenIntegration";
import {loadOsmTestData} from "../utils/OpenLR/test/Helperfunctions";
import {filterHighwayData, getMappedElements, parseToJson} from "../data/api";
import OSMIntegration from "../utils/OpenLRData/OSMIntegration";
import LineEncoder from "../utils/OpenLR/coder/LineEncoder";
import OpenLRDecoder from "../utils/OpenLR/Decoder";

function demo(){
    return new Promise(resolve=>{
        loadNodesLineStringsWegenregsterAntwerpen().then(features => {
            let wegenregisterMapDataBase = new MapDataBase();
            WegenregisterAntwerpenIntegration.initMapDataBase(wegenregisterMapDataBase,features);

            loadOsmTestData()
                .then((data)=>{parseToJson(data)
                    .then((json)=>{getMappedElements(json)
                        .then((elements)=>{filterHighwayData(elements)
                            .then((highwayData)=>{
                                let osmMapDataBase = new MapDataBase();
                                OSMIntegration.initMapDataBase(osmMapDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);

                                let locations = [];
                                let encodeErrors = 0;

                                let decodedLines = [];
                                let decodeErrors = 0;

                                let erroneousLocations = [];

                                let t1 = performance.now();
                                for(let id in osmMapDataBase.lines){
                                    if(osmMapDataBase.lines.hasOwnProperty(id)){
                                        try {
                                            let location = LineEncoder.encode(osmMapDataBase,[osmMapDataBase.lines[id]],0,0);
                                            locations.push(location);
                                        }
                                        catch (err){
                                            console.warn(err);
                                            encodeErrors++;
                                        }
                                    }
                                }
                                let t2 = performance.now();
                                console.log("encoded locations: ",locations.length,"encode errors:",encodeErrors,"in time:",t2-t1,"ms");

                                let times = [];
                                let errorTimes = [];
                                t1 = performance.now();
                                for(let i=0;i<locations.length;i++){
                                    let t3;
                                    let t4;
                                    try {
                                        t3 = performance.now();
                                        let decoded = OpenLRDecoder.decode(locations[i],wegenregisterMapDataBase);
                                        t4 = performance.now();
                                        decodedLines.push(decoded);
                                        times.push(t4-t3);
                                    }
                                    catch (err){
                                        t4 = performance.now();
                                        decodeErrors++;
                                        errorTimes.push(t4-t3);
                                        erroneousLocations.push(locations[i]);
                                    }
                                }
                                t2 = performance.now();
                                let sum = times.reduce((previous, current)=> current += previous);
                                let errorSum = errorTimes.reduce((previous, current)=> current += previous);
                                console.log("decoded lines: ",decodedLines.length,"decode errors:",decodeErrors,
                                    "in time:",t2-t1,"ms,",
                                    "mean time:",sum/times.length,"ms,",
                                    "error mean time",errorSum/errorTimes.length,"ms,"
                                );

                                console.warn(erroneousLocations[0]);

                                resolve({
                                    encodedLocations: locations.length,
                                    encodeErrors: encodeErrors,
                                    decodedLines: decodedLines.length,
                                    decodeErrors: decodeErrors
                                })
                            })})})});
        });
    });
}

test('demo',(done)=>{
    expect.assertions(1);
    demo().then((res)=>{
        console.log(res);
        expect(res).toBeDefined();
        done();
    });
});