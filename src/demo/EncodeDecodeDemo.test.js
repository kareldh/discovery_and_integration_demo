// demo that tries to find all nodes of OpenStreetMap
// in a specific bounding box: <bounds minlat="51.2093400" minlon="4.3917700" maxlat="51.2140400" maxlon="4.4034600"/>
// on the wegenregister Antwerpen

import MapDataBase from "../utils/OpenLR/map/MapDataBase";
import {loadNodesLineStringsWegenregsterAntwerpen} from "../data/LoadTestData";
import WegenregisterAntwerpenIntegration from "../utils/OpenLRData/WegenregisterAntwerpenIntegration";
import {loadOsmTestData} from "../utils/OpenLR/test/Helperfunctions";
import {
    fetchRoutableTile, filterHighwayData, getMappedElements, getRoutableTilesNodesAndLines,
    parseToJson
} from "../data/api";
import OSMIntegration from "../utils/OpenLRData/OSMIntegration";
import LineEncoder from "../utils/OpenLR/coder/LineEncoder";
import OpenLRDecoder from "../utils/OpenLR/Decoder";
import RoutableTilesIntegration from "../utils/OpenLRData/RoutableTilesIntegration";

function osmToWegenregister(){
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

test('demo osm to wegenregister',(done)=>{
    expect.assertions(1);
    osmToWegenregister().then((res)=>{
        console.log(res);
        expect(res).toBeDefined();
        done();
    });
});

function osmToOsm(){
    return new Promise(resolve=>{
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
                                    let decoded = OpenLRDecoder.decode(locations[i],osmMapDataBase);
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
                            let errorSum = errorTimes.length > 0 ? errorTimes.reduce((previous, current)=> current += previous) : 0;
                            console.log("decoded lines: ",decodedLines.length,"decode errors:",decodeErrors,
                                "in time:",t2-t1,"ms,",
                                "mean time:",sum/times.length,"ms,",
                                "error mean time",errorTimes.length > 0 ? errorSum/errorTimes.length : 0,"ms,"
                            );

                            resolve({
                                encodedLocations: locations.length,
                                encodeErrors: encodeErrors,
                                decodedLines: decodedLines.length,
                                decodeErrors: decodeErrors
                            })
                        })})})});
        });
}

test('demo osm to osm',(done)=>{
    expect.assertions(1);
    osmToOsm().then((res)=>{
        console.log(res);
        expect(res).toBeDefined();
        done();
    });
});

function wegenregisterToWegenregister(){
    return new Promise(resolve=>{
        loadNodesLineStringsWegenregsterAntwerpen().then(features => {
            let wegenregisterMapDataBase = new MapDataBase();
            WegenregisterAntwerpenIntegration.initMapDataBase(wegenregisterMapDataBase,features);

            let locations = [];
            let encodeErrors = 0;
            let encodeErrorTypes = {};

            let decodedLines = [];
            let decodeErrors = 0;
            let decodeErrorTypes = {};

            let erroneousLocations = [];

            let i = 0;
            let encodeTimes = [];
            let encodeErrorTimes = [];
            let t1 = performance.now();
            for(let id in wegenregisterMapDataBase.lines){
                if(wegenregisterMapDataBase.lines.hasOwnProperty(id) && i<1000){
                    let t3;
                    let t4;
                    try {
                        t3 = performance.now();
                        let location = LineEncoder.encode(wegenregisterMapDataBase,[wegenregisterMapDataBase.lines[id]],0,0);
                        t4 = performance.now();
                        locations.push(location);
                        encodeTimes.push(t4-t3);
                    }
                    catch (err){
                        t4 = performance.now();
                        if(encodeErrorTypes[err] === undefined){
                            encodeErrorTypes[err] = 0;
                        }
                        encodeErrorTypes[err]++;
                        encodeErrors++;
                        encodeErrorTimes.push(t4-t3);
                    }
                }
                i++;
            }
            let t2 = performance.now();
            let total = encodeTimes.reduce((previous, current)=> current += previous);
            let errorTotal = encodeErrorTimes.length > 0 ? encodeErrorTimes.reduce((previous, current)=> current += previous) : 0;
            console.log("encoded locations: ",locations.length,"encode errors:",encodeErrors,
                "in time:",t2-t1,"ms",
                "mean time:",total/encodeTimes.length,"ms,",
                "error mean time",encodeErrorTimes.length > 0 ? errorTotal/encodeErrorTimes.length : 0,"ms,"
            );
            console.log(encodeErrorTypes);

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
                    if(decodeErrorTypes[err] === undefined){
                        decodeErrorTypes[err] = 0;
                    }
                    decodeErrorTypes[err]++;
                    decodeErrors++;
                    errorTimes.push(t4-t3);
                    erroneousLocations.push(locations[i]);
                }
            }
            t2 = performance.now();
            let sum = times.reduce((previous, current)=> current += previous);
            let errorSum = errorTimes.length > 0 ? errorTimes.reduce((previous, current)=> current += previous) : 0;
            console.log("decoded lines: ",decodedLines.length,"decode errors:",decodeErrors,
                "in time:",t2-t1,"ms,",
                "mean time:",sum/times.length,"ms,",
                "error mean time",errorTimes.length > 0 ? errorSum/errorTimes.length : 0,"ms,"
            );
            console.log(decodeErrorTypes);

            resolve({
                encodedLocations: locations.length,
                encodeErrors: encodeErrors,
                decodedLines: decodedLines.length,
                decodeErrors: decodeErrors
            })
        });
    });
}

test('demo wegenregister to wegenregister',(done)=>{
    expect.assertions(1);
    wegenregisterToWegenregister().then((res)=>{
        console.log(res);
        expect(res).toBeDefined();
        done();
    });
});

function routableTilesToRoutableTiles(){
    return new Promise(resolve=>{
        fetchRoutableTile(14,8392,5469)
            .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                .then((nodesAndLines)=> {
                    let mapDatabase = new MapDataBase();
                    RoutableTilesIntegration.initMapDataBase(mapDatabase, nodesAndLines.nodes,nodesAndLines.lines);

                    let locations = [];
                    let encodeErrors = 0;
                    let encodeErrorTypes = {};

                    let decodedLines = [];
                    let decodeErrors = 0;
                    let decodeErrorTypes = {};

                    let erroneousLocations = [];

                    let t1 = performance.now();
                    for(let id in mapDatabase.lines){
                        if(mapDatabase.lines.hasOwnProperty(id)){
                            try {
                                let location = LineEncoder.encode(mapDatabase,[mapDatabase.lines[id]],0,0);
                                locations.push(location);
                            }
                            catch (err){
                                // console.warn(err);
                                // console.warn(mapDatabase.lines[id]);
                                if(encodeErrorTypes[err] === undefined){
                                    encodeErrorTypes[err] = 0;
                                }
                                encodeErrorTypes[err]++;
                                encodeErrors++;
                            }
                        }
                    }
                    let t2 = performance.now();
                    console.log("encoded locations: ",locations.length,"encode errors:",encodeErrors,"in time:",t2-t1,"ms");
                    console.log(encodeErrorTypes);

                    let times = [];
                    let errorTimes = [];
                    t1 = performance.now();
                    for(let i=0;i<locations.length;i++){
                        let t3;
                        let t4;
                        try {
                            t3 = performance.now();
                            let decoded = OpenLRDecoder.decode(locations[i],mapDatabase);
                            t4 = performance.now();
                            decodedLines.push(decoded);
                            times.push(t4-t3);
                        }
                        catch (err){
                            if(decodeErrorTypes[err] === undefined){
                                decodeErrorTypes[err] = 0;
                            }
                            decodeErrorTypes[err]++;
                            t4 = performance.now();
                            decodeErrors++;
                            errorTimes.push(t4-t3);
                            erroneousLocations.push(locations[i]);
                        }
                    }
                    t2 = performance.now();
                    let sum = times.reduce((previous, current)=> current += previous);
                    let errorSum = errorTimes.length > 0 ? errorTimes.reduce((previous, current)=> current += previous) : 0;
                    console.log("decoded lines: ",decodedLines.length,"decode errors:",decodeErrors,
                        "in time:",t2-t1,"ms,",
                        "mean time:",sum/times.length,"ms,",
                        "error mean time",errorTimes.length > 0 ? errorSum/errorTimes.length : 0,"ms,"
                    );
                    console.log(decodeErrorTypes);

                    resolve({
                        encodedLocations: locations.length,
                        encodeErrors: encodeErrors,
                        decodedLines: decodedLines.length,
                        decodeErrors: decodeErrors
                    })
                });
        })});
}

test('demo RoutableTiles to RoutableTiles',(done)=>{
    expect.assertions(1);
    routableTilesToRoutableTiles().then((res)=>{
        console.log(res);
        expect(res).toBeDefined();
        done();
    });
});