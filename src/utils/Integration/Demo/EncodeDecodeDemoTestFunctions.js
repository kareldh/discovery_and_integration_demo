// demo that tries to find all nodes of OpenStreetMap
// in a specific bounding box: <bounds minlat="51.2093400" minlon="4.3917700" maxlat="51.2140400" maxlon="4.4034600"/>
// on the wegenregister Antwerpen

import MapDataBase from "../OpenLR/map/MapDataBase";
import WegenregisterAntwerpenIntegration from "../OpenLRIntegration/WegenregisterAntwerpenIntegration";
import {loadOsmTestData} from "../Data/LoadTestData";
import {
    filterHighwayData, getMappedElements, getRoutableTilesNodesAndLines,
    parseToJson
} from "../Data/ParseData";
import OSMIntegration from "../OpenLRIntegration/OSMIntegration";
import LineEncoder from "../OpenLR/coder/LineEncoder";
import OpenLRDecoder from "../OpenLR/Decoder";
import RoutableTilesIntegration from "../OpenLRIntegration/RoutableTilesIntegration";
import {LinesDirectlyToLRPs} from "../OpenLR/experimental/LinesDirectlyToLRPs";
import {configProperties} from "../OpenLR/coder/CoderSettings";
import {fetchRoutableTile, loadNodesLineStringsWegenregsterAntwerpen} from "../Data/LoadData";

export let decoderPropertiesAlwaysProj = {
    dist: 15,    //maximum distance (in meter) of a candidate node to a LRP
    bearDiff: 60, //maximum difference (in degrees) between the bearing of a candidate node and that of a LRP
    frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 3, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 40, //maximum difference (in meter) between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: true,
    useFrcFow: true,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 1000,
    maxDecodeRetries: 2,
    distMultiplierForRetry: 2
};

export let decoderProperties = {
    dist: 15,    //maximum distance (in meter) of a candidate node to a LRP
    bearDiff: 60, //maximum difference (in degrees) between the bearing of a candidate node and that of a LRP
    frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 3, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 40, //maximum difference (in meter) between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: false,
    useFrcFow: true,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 1000,
    maxDecodeRetries: 2,
    distMultiplierForRetry: 2
};

let maxDecodedLines = 10;
let maxDecodedLinesHigh = 10;
let wegenregisterLineLengthLimit = 5;
let maxAmountOfWegenregisterLines = 1000;
let minLineLength = 0; // in meter

function _fromOneToOther(fromDataBase,toDataBase,decoderProperties,encodeFunction){
    console.log("Encoder Lines:",Object.keys(fromDataBase.lines).length,"Decoder Lines:",Object.keys(toDataBase.lines).length);

    let locations = [];
    let encodeErrors = 0;
    let encodeErrorTypes = {};

    let decodedLines = [];
    let decodeErrors = 0;
    let decodeErrorTypes = {};

    let erroneousLocations = [];

    let encodeTimes = [];
    let encodeErrorTimes = [];
    let t1 = performance.now();
    for(let id in fromDataBase.lines){
        if(fromDataBase.lines.hasOwnProperty(id) && fromDataBase.lines[id].getLength() >= minLineLength*configProperties.internalPrecision){
            let t3;
            let t4;
            try {
                t3 = performance.now();
                let location = encodeFunction(fromDataBase,id);
                t4 = performance.now();
                locations.push(location);
                encodeTimes.push(t4-t3);
            }
            catch (err){
                // console.warn(err);
                encodeErrors++;
                if(encodeErrorTypes[err] === undefined){
                    encodeErrorTypes[err] = 0;
                }
                encodeErrorTypes[err]++;
                encodeErrorTimes.push(t4-t3);
            }
        }
    }
    let t2 = performance.now();
    let total = encodeTimes.length > 0 ? encodeTimes.reduce((previous, current)=> current += previous) : 0;
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
            let decoded = OpenLRDecoder.decode(locations[i],toDataBase,decoderProperties);
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
    let sum = times.length > 0 ? times.reduce((previous, current)=> current += previous) : 0;
    let errorSum = errorTimes.length > 0 ? errorTimes.reduce((previous, current)=> current += previous) : 0;
    console.log("decoded lines: ",decodedLines.length,"decode errors:",decodeErrors,
        "in time:",t2-t1,"ms,",
        "mean time:",sum/times.length,"ms,",
        "error mean time",errorSum/errorTimes.length,"ms,"
    );
    console.log(decodeErrorTypes);

    console.warn(erroneousLocations[0]);

    for(let i=0;i<decodedLines.length;i++){
        expect(decodedLines[i].lines.length).toBeGreaterThan(0);
    }

    return {
        encodedLocations: locations.length,
        encodeErrors: encodeErrors,
        decodedLines: decodedLines.length,
        decodeErrors: decodeErrors
    };
}

export function osmToWegenregister(decoderProperties){
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

                                let result = _fromOneToOther(osmMapDataBase,wegenregisterMapDataBase,decoderProperties,(fromDataBase,id)=>{return LineEncoder.encode(fromDataBase,[fromDataBase.lines[id]],0,0);});
                                resolve(result);
                            })})})});
        });
    });
}
export function routableTilesToWegenregister(decoderProperties){
    return new Promise(resolve=>{
        loadNodesLineStringsWegenregsterAntwerpen().then(features => {
            let wegenregisterMapDataBase = new MapDataBase();
            WegenregisterAntwerpenIntegration.initMapDataBase(wegenregisterMapDataBase,features);

            fetchRoutableTile(14,8392,5469)
                .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                    .then((nodesAndLines)=> {
                        let mapDatabase = new MapDataBase();
                        RoutableTilesIntegration.initMapDataBase(mapDatabase, nodesAndLines.nodes,nodesAndLines.lines);

                        let result = _fromOneToOther(mapDatabase,wegenregisterMapDataBase,decoderProperties,(fromDataBase,id)=>{return LineEncoder.encode(fromDataBase,[fromDataBase.lines[id]],0,0);});

                        resolve(result);
                    })});
        });
    });
}
export function osmToRoutableTiles(decoderProperties){
    let mapDatabase = new MapDataBase();
    return new Promise(resolve=>{
        let tilesLoaded = [];
        tilesLoaded.push(fetchRoutableTile(14,8392,5469)
            .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                .then((nodesAndLines)=> {
                    let nodesLines = RoutableTilesIntegration.getNodesLines(nodesAndLines.nodes,nodesAndLines.lines);
                    mapDatabase.addData(nodesLines.lines,nodesLines.nodes);
                })}));
        tilesLoaded.push(fetchRoutableTile(14,8391,5469)
            .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                .then((nodesAndLines)=> {
                    let nodesLines = RoutableTilesIntegration.getNodesLines(nodesAndLines.nodes,nodesAndLines.lines);
                    mapDatabase.addData(nodesLines.lines,nodesLines.nodes);
                })}));

        Promise.all(tilesLoaded).then(()=> {
            loadOsmTestData()
                .then((data)=>{parseToJson(data)
                    .then((json)=>{getMappedElements(json)
                        .then((elements)=>{filterHighwayData(elements)
                            .then((highwayData)=>{
                                let osmMapDataBase = new MapDataBase();
                                OSMIntegration.initMapDataBase(osmMapDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);

                                let result = _fromOneToOther(osmMapDataBase,mapDatabase,decoderProperties,(fromDataBase,id)=>{return LineEncoder.encode(fromDataBase,[fromDataBase.lines[id]],0,0);});
                                resolve(result);
                            })})})});
        });
    });
}
export function osmToWegenregisterNoEnc(decoderProperties){
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

                                let result = _fromOneToOther(osmMapDataBase,wegenregisterMapDataBase,decoderProperties,(fromDataBase,id)=>{return LinesDirectlyToLRPs([fromDataBase.lines[id]])});
                                resolve(result);
                            })})})});
        });
    });
}
export function routableTilesToWegenregisterNoEnc(decoderProperties){
    return new Promise(resolve=>{
        loadNodesLineStringsWegenregsterAntwerpen().then(features => {
            let wegenregisterMapDataBase = new MapDataBase();
            WegenregisterAntwerpenIntegration.initMapDataBase(wegenregisterMapDataBase,features);

            fetchRoutableTile(14,8392,5469)
                .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                    .then((nodesAndLines)=> {
                        let mapDatabase = new MapDataBase();
                        RoutableTilesIntegration.initMapDataBase(mapDatabase, nodesAndLines.nodes,nodesAndLines.lines);

                        let result = _fromOneToOther(mapDatabase,wegenregisterMapDataBase,decoderProperties,(fromDataBase,id)=>{return LinesDirectlyToLRPs([fromDataBase.lines[id]])});

                        resolve(result);
                    })});
        });
    });
}
export function osmToRoutableTilesNoEnc(decoderProperties){
    let mapDatabase = new MapDataBase();
    return new Promise(resolve=>{
        let tilesLoaded = [];
        tilesLoaded.push(fetchRoutableTile(14,8392,5469)
            .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                .then((nodesAndLines)=> {
                    let nodesLines = RoutableTilesIntegration.getNodesLines(nodesAndLines.nodes,nodesAndLines.lines);
                    mapDatabase.addData(nodesLines.lines,nodesLines.nodes);
                })}));
        tilesLoaded.push(fetchRoutableTile(14,8391,5469)
            .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                .then((nodesAndLines)=> {
                    let nodesLines = RoutableTilesIntegration.getNodesLines(nodesAndLines.nodes,nodesAndLines.lines);
                    mapDatabase.addData(nodesLines.lines,nodesLines.nodes);
                })}));

        Promise.all(tilesLoaded).then(()=> {
            loadOsmTestData()
                .then((data)=>{parseToJson(data)
                    .then((json)=>{getMappedElements(json)
                        .then((elements)=>{filterHighwayData(elements)
                            .then((highwayData)=>{
                                let osmMapDataBase = new MapDataBase();
                                OSMIntegration.initMapDataBase(osmMapDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);

                                let result = _fromOneToOther(osmMapDataBase,mapDatabase,decoderProperties,(fromDataBase,id)=>{return LinesDirectlyToLRPs([fromDataBase.lines[id]])});
                                resolve(result);
                            })})})});
        });
    });
}

export function osmToOsm(decoderProperties){
    return new Promise(resolve=>{
        loadOsmTestData()
            .then((data)=>{parseToJson(data)
                .then((json)=>{getMappedElements(json)
                    .then((elements)=>{filterHighwayData(elements)
                        .then((highwayData)=>{
                            let osmMapDataBase = new MapDataBase();
                            OSMIntegration.initMapDataBase(osmMapDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);

                            let lineIds = [];
                            let decodeErrorIndexes = [];
                            let locations = [];
                            let encodeErrors = 0;
                            let encodeErrorTypes = {};

                            let decodedLines = [];
                            let decodeErrors = 0;
                            let decodeErrorTypes = {};

                            let erroneousLocations = [];

                            let encodeTimes = [];
                            let encodeErrorTimes = [];
                            let t1 = performance.now();
                            for(let id in osmMapDataBase.lines){
                                if(osmMapDataBase.lines.hasOwnProperty(id)){
                                    let t3;
                                    let t4;
                                    try {
                                        t3 = performance.now();
                                        let location = LineEncoder.encode(osmMapDataBase,[osmMapDataBase.lines[id]],0,0);
                                        t4 = performance.now();
                                        locations.push(location);
                                        encodeTimes.push(t4-t3);
                                        lineIds.push(id);
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
                                    let decoded = OpenLRDecoder.decode(locations[i],osmMapDataBase,decoderProperties);
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
                                    decodeErrorIndexes.push(i);
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

                            let decodedToTwo = 0;
                            let decodedToThree = 0;
                            let decodedToMoreThanThree = 0;
                            let originalLineNotPresent = 0;
                            let a = 0;
                            for(let i=0;i<locations.length;i++){
                                if(a >= decodeErrorIndexes.length || i !== decodeErrorIndexes[a]){
                                    // if(decodedLines[i].lines.length === 2){
                                    //     console.log(osmMapDataBase.lines[lineIds[i]]);
                                    //     console.log(locations[i]);
                                    //     console.log(decodedLines[i].lines);
                                    //     console.log(decodedLines[i].posOffset,decodedLines[i].negOffset);
                                    // }
                                    // expect(decodedLines[i].lines.length).toEqual(1);
                                    if(decodedLines[i-a].lines.length===2){
                                        decodedToTwo++;
                                        // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i]).toBeTruthy();
                                        if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a])){
                                            originalLineNotPresent++;
                                        }
                                        // expect((decodedLines[i].posOffset === 0 && decodedLines[i].negOffset > 0) || (decodedLines[i].posOffset > 0 && decodedLines[i].negOffset === 0)).toBeTruthy();
                                        expect((decodedLines[i-a].posOffset <= 1 && decodedLines[i-a].negOffset >= 0) || (decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset <= 1)).toBeTruthy(); //1 meter precision
                                    }
                                    else if(decodedLines[i-a].lines.length===3){
                                        decodedToThree++;
                                        // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i] || decodedLines[i].lines[2].getID() === lineIds[i]).toBeTruthy();
                                        if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a] || decodedLines[i-a].lines[2].getID() === lineIds[i-a])){
                                            originalLineNotPresent++;
                                        }
                                        // expect(decodedLines[i].posOffset > 0 && decodedLines[i].negOffset > 0).toBeTruthy();
                                        expect(decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset >= 0).toBeTruthy(); //1 meter precision
                                    }
                                    else if(decodedLines[i-a].lines.length === 1){
                                        // expect(decodedLines[i].lines[0].getID()).toEqual(lineIds[i]);
                                        if(decodedLines[i-a].lines[0].getID() !== lineIds[i-a]){
                                            originalLineNotPresent++;
                                        }
                                    }
                                    expect(decodedLines[i-a].lines.length).toBeGreaterThanOrEqual(1);
                                    expect(decodedLines[i-a].lines.length).toBeLessThanOrEqual(maxDecodedLines);
                                    if(decodedLines[i-a].lines.length > 3){
                                        decodedToMoreThanThree++;
                                    }
                                }
                                else{
                                    a++;
                                }
                            }
                            //happens because encoder moves to valid nodes, which in combination with the rounding to meters has a small loss in precision
                            //since nodes are than projected during decoding, they can be projected up to half a meter to the left or right of our original line
                            console.log("decoded to two:",decodedToTwo,"decoded to three:",decodedToThree,"decoded to more",decodedToMoreThanThree);
                            console.log("original line not present",originalLineNotPresent);

                            resolve({
                                encodedLocations: locations.length,
                                encodeErrors: encodeErrors,
                                decodedLines: decodedLines.length,
                                decodeErrors: decodeErrors
                            })
                        })})})});
    });
}
export function osmToOsmNoEncoding(decoderProperties){
    return new Promise(resolve=>{
        loadOsmTestData()
            .then((data)=>{parseToJson(data)
                .then((json)=>{getMappedElements(json)
                    .then((elements)=>{filterHighwayData(elements)
                        .then((highwayData)=>{
                            let osmMapDataBase = new MapDataBase();
                            OSMIntegration.initMapDataBase(osmMapDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);

                            let lineIds = [];
                            let decodeErrorIndexes = [];
                            let locations = [];
                            let encodeErrors = 0;
                            let encodeErrorTypes = {};

                            let decodedLines = [];
                            let decodeErrors = 0;
                            let decodeErrorTypes = {};

                            let erroneousLocations = [];

                            let encodeTimes = [];
                            let encodeErrorTimes = [];
                            let t1 = performance.now();
                            for(let id in osmMapDataBase.lines){
                                if(osmMapDataBase.lines.hasOwnProperty(id)){
                                    let t3;
                                    let t4;
                                    try {
                                        t3 = performance.now();
                                        let location = LinesDirectlyToLRPs([osmMapDataBase.lines[id]]);
                                        t4 = performance.now();
                                        locations.push(location);
                                        encodeTimes.push(t4-t3);
                                        lineIds.push(id);
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
                                    let decoded = OpenLRDecoder.decode(locations[i],osmMapDataBase,decoderProperties);
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
                                    decodeErrorIndexes.push(i);
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

                            let decodedToTwo = 0;
                            let decodedToThree = 0;
                            let decodedToMoreThanThree = 0;
                            let originalLineNotPresent = 0;
                            let a = 0;
                            for(let i=0;i<locations.length;i++){
                                if(a >= decodeErrorIndexes.length || i !== decodeErrorIndexes[a]){
                                    // if(decodedLines[i].lines.length === 2){
                                    //     console.log(osmMapDataBase.lines[lineIds[i]]);
                                    //     console.log(locations[i]);
                                    //     console.log(decodedLines[i].lines);
                                    //     console.log(decodedLines[i].posOffset,decodedLines[i].negOffset);
                                    // }
                                    // expect(decodedLines[i].lines.length).toEqual(1);
                                    if(decodedLines[i-a].lines.length===2){
                                        decodedToTwo++;
                                        // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i]).toBeTruthy();
                                        if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a])){
                                            originalLineNotPresent++;
                                        }
                                        // expect((decodedLines[i].posOffset === 0 && decodedLines[i].negOffset > 0) || (decodedLines[i].posOffset > 0 && decodedLines[i].negOffset === 0)).toBeTruthy();
                                        expect((decodedLines[i-a].posOffset <= 1 && decodedLines[i-a].negOffset >= 0) || (decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset <= 1)).toBeTruthy(); //1 meter precision
                                    }
                                    else if(decodedLines[i-a].lines.length===3){
                                        decodedToThree++;
                                        // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i] || decodedLines[i].lines[2].getID() === lineIds[i]).toBeTruthy();
                                        if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a] || decodedLines[i-a].lines[2].getID() === lineIds[i-a])){
                                            originalLineNotPresent++;
                                        }
                                        // expect(decodedLines[i].posOffset > 0 && decodedLines[i].negOffset > 0).toBeTruthy();
                                        expect(decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset >= 0).toBeTruthy(); //1 meter precision
                                    }
                                    else if(decodedLines[i-a].lines.length === 1){
                                        // expect(decodedLines[i].lines[0].getID()).toEqual(lineIds[i]);
                                        if(decodedLines[i-a].lines[0].getID() !== lineIds[i-a]){
                                            originalLineNotPresent++;
                                        }
                                    }
                                    expect(decodedLines[i-a].lines.length).toBeGreaterThanOrEqual(1);
                                    expect(decodedLines[i-a].lines.length).toBeLessThanOrEqual(maxDecodedLines);
                                    if(decodedLines[i-a].lines.length > 3){
                                        decodedToMoreThanThree++;
                                    }
                                }
                                else{
                                    a++;
                                }
                            }
                            //happens because encoder moves to valid nodes, which in combination with the rounding to meters has a small loss in precision
                            //since nodes are than projected during decoding, they can be projected up to half a meter to the left or right of our original line
                            console.log("decoded to two:",decodedToTwo,"decoded to three:",decodedToThree,"decoded to more",decodedToMoreThanThree);
                            console.log("original line not present",originalLineNotPresent);

                            resolve({
                                encodedLocations: locations.length,
                                encodeErrors: encodeErrors,
                                decodedLines: decodedLines.length,
                                decodeErrors: decodeErrors
                            })
                        })})})});
    });
}

export function wegenregisterToWegenregister(decoderProperties){
    return new Promise(resolve=>{
        loadNodesLineStringsWegenregsterAntwerpen().then(features => {
            let wegenregisterMapDataBase = new MapDataBase();
            WegenregisterAntwerpenIntegration.initMapDataBase(wegenregisterMapDataBase,features);

            let lineIds = [];
            let decodeErrorIndexes = [];
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
                if(wegenregisterMapDataBase.lines.hasOwnProperty(id) && i<maxAmountOfWegenregisterLines){
                    let t3;
                    let t4;
                    try {
                        t3 = performance.now();
                        let location = LineEncoder.encode(wegenregisterMapDataBase,[wegenregisterMapDataBase.lines[id]],0,0);
                        t4 = performance.now();
                        locations.push(location);
                        encodeTimes.push(t4-t3);
                        lineIds.push(id);
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
                    let decoded = OpenLRDecoder.decode(locations[i],wegenregisterMapDataBase,decoderProperties);
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
                    decodeErrorIndexes.push(i);
                    lineIds.splice(i,1);
                }
            }
            t2 = performance.now();
            let sum = times.length > 0 ? times.reduce((previous, current)=> current += previous) : 0;
            let errorSum = errorTimes.length > 0 ? errorTimes.reduce((previous, current)=> current += previous) : 0;
            console.log("decoded lines: ",decodedLines.length,"decode errors:",decodeErrors,
                "in time:",t2-t1,"ms,",
                "mean time:",sum/times.length,"ms,",
                "error mean time",errorTimes.length > 0 ? errorSum/errorTimes.length : 0,"ms,"
            );
            console.log(decodeErrorTypes);

            let decodedToTwo = 0;
            let decodedToThree = 0;
            let decodedToMoreThanThree = 0;
            let originalLineNotPresent = 0;
            let a = 0;
            for(let i=0;i<locations.length;i++){
                if(a >= decodeErrorIndexes.length || i !== decodeErrorIndexes[a]){
                    // if(decodedLines[i].lines.length === 2){
                    //     console.log(osmMapDataBase.lines[lineIds[i]]);
                    //     console.log(locations[i]);
                    //     console.log(decodedLines[i].lines);
                    //     console.log(decodedLines[i].posOffset,decodedLines[i].negOffset);
                    // }
                    // expect(decodedLines[i].lines.length).toEqual(1);
                    if(decodedLines[i-a].lines.length===2){
                        decodedToTwo++;
                        // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i]).toBeTruthy();
                        if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a])){
                            originalLineNotPresent++;
                        }
                        // expect((decodedLines[i].posOffset === 0 && decodedLines[i].negOffset > 0) || (decodedLines[i].posOffset > 0 && decodedLines[i].negOffset === 0)).toBeTruthy();
                        expect((decodedLines[i-a].posOffset <= 1 && decodedLines[i-a].negOffset >= 0) || (decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset <= 1)).toBeTruthy(); //1 meter precision
                    }
                    else if(decodedLines[i-a].lines.length===3){
                        decodedToThree++;
                        // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i] || decodedLines[i].lines[2].getID() === lineIds[i]).toBeTruthy();
                        if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a] || decodedLines[i-a].lines[2].getID() === lineIds[i-a])){
                            originalLineNotPresent++;
                        }
                        // expect(decodedLines[i].posOffset > 0 && decodedLines[i].negOffset > 0).toBeTruthy();
                        expect(decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset >= 0).toBeTruthy(); //1 meter precision
                    }
                    else if(decodedLines[i-a].lines.length === 1){
                        // expect(decodedLines[i].lines[0].getID()).toEqual(lineIds[i]);
                        if(decodedLines[i-a].lines[0].getID() !== lineIds[i-a]){
                            originalLineNotPresent++;
                        }
                    }
                    expect(decodedLines[i-a].lines.length).toBeGreaterThanOrEqual(1);
                    expect(decodedLines[i-a].lines.length).toBeLessThanOrEqual(maxDecodedLines);
                    if(decodedLines[i-a].lines.length > 3){
                        decodedToMoreThanThree++;
                    }
                }
                else{
                    a++;
                }
            }
            //happens because encoder moves to valid nodes, which in combination with the rounding to meters has a small loss in precision
            //since nodes are than projected during decoding, they can be projected up to half a meter to the left or right of our original line
            console.log("decoded to two:",decodedToTwo,"decoded to three:",decodedToThree,"decoded to more",decodedToMoreThanThree);
            console.log("original line not present",originalLineNotPresent);

            resolve({
                encodedLocations: locations.length,
                encodeErrors: encodeErrors,
                decodedLines: decodedLines.length,
                decodeErrors: decodeErrors
            })
        });
    });
}
export function wegenregisterToWegenregisterNoEncoding(decoderProperties){
    return new Promise(resolve=>{
        loadNodesLineStringsWegenregsterAntwerpen().then(features => {
            let wegenregisterMapDataBase = new MapDataBase();
            WegenregisterAntwerpenIntegration.initMapDataBase(wegenregisterMapDataBase,features);

            let lineIds = [];
            let decodeErrorIndexes = [];
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
                if(wegenregisterMapDataBase.lines.hasOwnProperty(id) && i<maxAmountOfWegenregisterLines){
                    let t3;
                    let t4;
                    try {
                        t3 = performance.now();
                        let location = LinesDirectlyToLRPs([wegenregisterMapDataBase.lines[id]]);
                        t4 = performance.now();
                        locations.push(location);
                        encodeTimes.push(t4-t3);
                        lineIds.push(id);
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
                    let decoded = OpenLRDecoder.decode(locations[i],wegenregisterMapDataBase,decoderProperties);
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
                    decodeErrorIndexes.push(i);
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

            let decodedToTwo = 0;
            let decodedToThree = 0;
            let decodedToMoreThanThree = 0;
            let originalLineNotPresent = 0;
            let a = 0;
            for(let i=0;i<locations.length;i++){
                if(a >= decodeErrorIndexes.length || i !== decodeErrorIndexes[a]){
                    // if(decodedLines[i].lines.length === 2){
                    //     console.log(osmMapDataBase.lines[lineIds[i]]);
                    //     console.log(locations[i]);
                    //     console.log(decodedLines[i].lines);
                    //     console.log(decodedLines[i].posOffset,decodedLines[i].negOffset);
                    // }
                    // expect(decodedLines[i].lines.length).toEqual(1);
                    if(decodedLines[i-a].lines.length===2){
                        decodedToTwo++;
                        // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i]).toBeTruthy();
                        if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a])){
                            originalLineNotPresent++;
                        }
                        // expect((decodedLines[i].posOffset === 0 && decodedLines[i].negOffset > 0) || (decodedLines[i].posOffset > 0 && decodedLines[i].negOffset === 0)).toBeTruthy();
                        expect((decodedLines[i-a].posOffset <= 1 && decodedLines[i-a].negOffset >= 0) || (decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset <= 1)).toBeTruthy(); //1 meter precision
                    }
                    else if(decodedLines[i-a].lines.length===3){
                        decodedToThree++;
                        // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i] || decodedLines[i].lines[2].getID() === lineIds[i]).toBeTruthy();
                        if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a] || decodedLines[i-a].lines[2].getID() === lineIds[i-a])){
                            originalLineNotPresent++;
                        }
                        // expect(decodedLines[i].posOffset > 0 && decodedLines[i].negOffset > 0).toBeTruthy();
                        expect(decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset >= 0).toBeTruthy(); //1 meter precision
                    }
                    else if(decodedLines[i-a].lines.length === 1){
                        // expect(decodedLines[i].lines[0].getID()).toEqual(lineIds[i]);
                        if(decodedLines[i-a].lines[0].getID() !== lineIds[i-a]){
                            originalLineNotPresent++;
                        }
                    }
                    expect(decodedLines[i-a].lines.length).toBeGreaterThanOrEqual(1);
                    expect(decodedLines[i-a].lines.length).toBeLessThanOrEqual(maxDecodedLines);
                    // if(decodedLines[i-a].lines.length > maxDecodedLines){
                    //     console.log(wegenregisterMapDataBase.lines[lineIds[i-a]]);
                    //     console.log(decodedLines[i-a]);
                    //     console.log(locations[i]);
                    // }
                    if(decodedLines[i-a].lines.length > 3){
                        decodedToMoreThanThree++;
                    }
                }
                else{
                    a++;
                }
            }
            //happens because encoder moves to valid nodes, which in combination with the rounding to meters has a small loss in precision
            //since nodes are than projected during decoding, they can be projected up to half a meter to the left or right of our original line
            console.log("decoded to two:",decodedToTwo,"decoded to three:",decodedToThree,"decoded to more",decodedToMoreThanThree);
            console.log("original line not present",originalLineNotPresent);

            resolve({
                encodedLocations: locations.length,
                encodeErrors: encodeErrors,
                decodedLines: decodedLines.length,
                decodeErrors: decodeErrors
            })
        });
    });
}

export function routableTilesToRoutableTiles(decoderProperties){
    return new Promise(resolve=>{
        fetchRoutableTile(14,8392,5469)
            .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                .then((nodesAndLines)=> {
                    let mapDatabase = new MapDataBase();
                    RoutableTilesIntegration.initMapDataBase(mapDatabase, nodesAndLines.nodes,nodesAndLines.lines);

                    let lineIds = [];
                    let decodeErrorIndexes = [];
                    let locations = [];
                    let encodeErrors = 0;
                    let encodeErrorTypes = {};

                    let decodedLines = [];
                    let decodeErrors = 0;
                    let decodeErrorTypes = {};

                    let erroneousLocations = [];

                    let encodeTimes = [];
                    let encodeErrorTimes = [];
                    let t1 = performance.now();
                    for(let id in mapDatabase.lines){
                        if(mapDatabase.lines.hasOwnProperty(id)){
                            let t3;
                            let t4;
                            try {
                                t3 = performance.now();
                                let location = LineEncoder.encode(mapDatabase,[mapDatabase.lines[id]],0,0);
                                t4 = performance.now();
                                locations.push(location);
                                encodeTimes.push(t4-t3);
                                lineIds.push(id);
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
                            let decoded = OpenLRDecoder.decode(locations[i],mapDatabase,decoderProperties);
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
                            decodeErrorIndexes.push(i);
                            lineIds.splice(i,1);
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

                    let decodedToTwo = 0;
                    let decodedToThree = 0;
                    let decodedToMoreThanThree = 0;
                    let originalLineNotPresent = 0;
                    let a = 0;
                    for(let i=0;i<locations.length;i++){
                        if(a >= decodeErrorIndexes.length || i !== decodeErrorIndexes[a]){
                            // if(decodedLines[i].lines.length === 2){
                            //     console.log(osmMapDataBase.lines[lineIds[i]]);
                            //     console.log(locations[i]);
                            //     console.log(decodedLines[i].lines);
                            //     console.log(decodedLines[i].posOffset,decodedLines[i].negOffset);
                            // }
                            // expect(decodedLines[i].lines.length).toEqual(1);
                            if(decodedLines[i-a].lines.length===2){
                                decodedToTwo++;
                                // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i]).toBeTruthy();
                                if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a])){
                                    originalLineNotPresent++;
                                }
                                // expect((decodedLines[i].posOffset === 0 && decodedLines[i].negOffset > 0) || (decodedLines[i].posOffset > 0 && decodedLines[i].negOffset === 0)).toBeTruthy();
                                expect((decodedLines[i-a].posOffset <= 1 && decodedLines[i-a].negOffset >= 0) || (decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset <= 1)).toBeTruthy(); //1 meter precision
                            }
                            else if(decodedLines[i-a].lines.length===3){
                                decodedToThree++;
                                // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i] || decodedLines[i].lines[2].getID() === lineIds[i]).toBeTruthy();
                                if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a] || decodedLines[i-a].lines[2].getID() === lineIds[i-a])){
                                    originalLineNotPresent++;
                                }
                                // expect(decodedLines[i].posOffset > 0 && decodedLines[i].negOffset > 0).toBeTruthy();
                                expect(decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset >= 0).toBeTruthy(); //1 meter precision
                            }
                            else if(decodedLines[i-a].lines.length === 1){
                                // expect(decodedLines[i].lines[0].getID()).toEqual(lineIds[i]);
                                if(decodedLines[i-a].lines[0].getID() !== lineIds[i-a]){
                                    originalLineNotPresent++;
                                }
                            }
                            expect(decodedLines[i-a].lines.length).toBeGreaterThanOrEqual(1);
                            expect(decodedLines[i-a].lines.length).toBeLessThanOrEqual(maxDecodedLines);
                            if(decodedLines[i-a].lines.length > 3){
                                decodedToMoreThanThree++;
                            }
                        }
                        else{
                            a++;
                        }
                    }
                    //happens because encoder moves to valid nodes, which in combination with the rounding to meters has a small loss in precision
                    //since nodes are than projected during decoding, they can be projected up to half a meter to the left or right of our original line
                    console.log("decoded to two:",decodedToTwo,"decoded to three:",decodedToThree,"decoded to more",decodedToMoreThanThree);
                    console.log("original line not present",originalLineNotPresent);

                    resolve({
                        encodedLocations: locations.length,
                        encodeErrors: encodeErrors,
                        decodedLines: decodedLines.length,
                        decodeErrors: decodeErrors
                    })
                });
            })});
}
export function routableTilesToRoutableTilesNoEncoding(decoderProperties){
    return new Promise(resolve=>{
        fetchRoutableTile(14,8392,5469)
            .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                .then((nodesAndLines)=> {
                    let mapDatabase = new MapDataBase();
                    RoutableTilesIntegration.initMapDataBase(mapDatabase, nodesAndLines.nodes,nodesAndLines.lines);

                    let lineIds = [];
                    let decodeErrorIndexes = [];
                    let locations = [];
                    let encodeErrors = 0;
                    let encodeErrorTypes = {};

                    let decodedLines = [];
                    let decodeErrors = 0;
                    let decodeErrorTypes = {};

                    let erroneousLocations = [];

                    let encodeTimes = [];
                    let encodeErrorTimes = [];
                    let t1 = performance.now();
                    for(let id in mapDatabase.lines){
                        if(mapDatabase.lines.hasOwnProperty(id)){
                            let t3;
                            let t4;
                            try {
                                t3 = performance.now();
                                let location = LinesDirectlyToLRPs([mapDatabase.lines[id]]);
                                t4 = performance.now();
                                locations.push(location);
                                encodeTimes.push(t4-t3);
                                lineIds.push(id);
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
                            let decoded = OpenLRDecoder.decode(locations[i],mapDatabase,decoderProperties);
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
                            decodeErrorIndexes.push(i);
                            lineIds.splice(i,1);
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

                    let decodedToTwo = 0;
                    let decodedToThree = 0;
                    let decodedToMoreThanThree = 0;
                    let originalLineNotPresent = 0;
                    let a = 0;
                    for(let i=0;i<locations.length;i++){
                        if(a >= decodeErrorIndexes.length || i !== decodeErrorIndexes[a]){
                            // if(decodedLines[i].lines.length === 2){
                            //     console.log(osmMapDataBase.lines[lineIds[i]]);
                            //     console.log(locations[i]);
                            //     console.log(decodedLines[i].lines);
                            //     console.log(decodedLines[i].posOffset,decodedLines[i].negOffset);
                            // }
                            // expect(decodedLines[i].lines.length).toEqual(1);
                            if(decodedLines[i-a].lines.length===2){
                                decodedToTwo++;
                                // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i]).toBeTruthy();
                                if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a])){
                                    originalLineNotPresent++;
                                }
                                // expect((decodedLines[i].posOffset === 0 && decodedLines[i].negOffset > 0) || (decodedLines[i].posOffset > 0 && decodedLines[i].negOffset === 0)).toBeTruthy();
                                expect((decodedLines[i-a].posOffset <= 1 && decodedLines[i-a].negOffset >= 0) || (decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset <= 1)).toBeTruthy(); //1 meter precision
                            }
                            else if(decodedLines[i-a].lines.length===3){
                                decodedToThree++;
                                // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i] || decodedLines[i].lines[2].getID() === lineIds[i]).toBeTruthy();
                                if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a] || decodedLines[i-a].lines[2].getID() === lineIds[i-a])){
                                    originalLineNotPresent++;
                                }
                                // expect(decodedLines[i].posOffset > 0 && decodedLines[i].negOffset > 0).toBeTruthy();
                                expect(decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset >= 0).toBeTruthy(); //1 meter precision
                            }
                            else if(decodedLines[i-a].lines.length === 1){
                                // expect(decodedLines[i].lines[0].getID()).toEqual(lineIds[i]);
                                if(decodedLines[i-a].lines[0].getID() !== lineIds[i-a]){
                                    originalLineNotPresent++;
                                }
                            }
                            expect(decodedLines[i-a].lines.length).toBeGreaterThanOrEqual(1);
                            expect(decodedLines[i-a].lines.length).toBeLessThanOrEqual(maxDecodedLines);
                            if(decodedLines[i-a].lines.length > 3){
                                decodedToMoreThanThree++;
                            }
                        }
                        else{
                            a++;
                        }
                    }
                    //happens because encoder moves to valid nodes, which in combination with the rounding to meters has a small loss in precision
                    //since nodes are than projected during decoding, they can be projected up to half a meter to the left or right of our original line
                    console.log("decoded to two:",decodedToTwo,"decoded to three:",decodedToThree,"decoded to more",decodedToMoreThanThree);
                    console.log("original line not present",originalLineNotPresent);

                    resolve({
                        encodedLocations: locations.length,
                        encodeErrors: encodeErrors,
                        decodedLines: decodedLines.length,
                        decodeErrors: decodeErrors
                    })
                });
            })});
}
export function routableTilesToRoutableTiles4MeterOffsetsDiff(decoderProperties){
    return new Promise(resolve=>{
        fetchRoutableTile(14,8392,5469)
            .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                .then((nodesAndLines)=> {
                    let mapDatabase = new MapDataBase();
                    RoutableTilesIntegration.initMapDataBase(mapDatabase, nodesAndLines.nodes,nodesAndLines.lines);

                    let lineIds = [];
                    let decodeErrorIndexes = [];
                    let locations = [];
                    let encodeErrors = 0;
                    let encodeErrorTypes = {};

                    let decodedLines = [];
                    let decodeErrors = 0;
                    let decodeErrorTypes = {};

                    let erroneousLocations = [];

                    let encodeTimes = [];
                    let encodeErrorTimes = [];
                    let t1 = performance.now();
                    for(let id in mapDatabase.lines){
                        if(mapDatabase.lines.hasOwnProperty(id)){
                            let t3;
                            let t4;
                            try {
                                t3 = performance.now();
                                let location = LineEncoder.encode(mapDatabase,[mapDatabase.lines[id]],0,0);
                                t4 = performance.now();
                                locations.push(location);
                                encodeTimes.push(t4-t3);
                                lineIds.push(id);
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
                            let decoded = OpenLRDecoder.decode(locations[i],mapDatabase,decoderProperties);
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
                            decodeErrorIndexes.push(i);
                            lineIds.splice(i,1);
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

                    let decodedToTwo = 0;
                    let decodedToThree = 0;
                    let decodedToMoreThanThree = 0;
                    let originalLineNotPresent = 0;
                    let a = 0;
                    for(let i=0;i<locations.length;i++){
                        if(a >= decodeErrorIndexes.length || i !== decodeErrorIndexes[a]){
                            // if(decodedLines[i].lines.length === 2){
                            //     console.log(osmMapDataBase.lines[lineIds[i]]);
                            //     console.log(locations[i]);
                            //     console.log(decodedLines[i].lines);
                            //     console.log(decodedLines[i].posOffset,decodedLines[i].negOffset);
                            // }
                            // expect(decodedLines[i].lines.length).toEqual(1);
                            if(decodedLines[i-a].lines.length===2){
                                decodedToTwo++;
                                // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i]).toBeTruthy();
                                if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a])){
                                    originalLineNotPresent++;
                                }
                                // expect((decodedLines[i].posOffset === 0 && decodedLines[i].negOffset > 0) || (decodedLines[i].posOffset > 0 && decodedLines[i].negOffset === 0)).toBeTruthy();
                                expect((decodedLines[i-a].posOffset <= 4 && decodedLines[i-a].negOffset >= 0) || (decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset <= 4)).toBeTruthy(); //4 meter precision
                            }
                            else if(decodedLines[i-a].lines.length===3){
                                decodedToThree++;
                                // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i] || decodedLines[i].lines[2].getID() === lineIds[i]).toBeTruthy();
                                if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a] || decodedLines[i-a].lines[2].getID() === lineIds[i-a])){
                                    originalLineNotPresent++;
                                }
                                // expect(decodedLines[i].posOffset > 0 && decodedLines[i].negOffset > 0).toBeTruthy();
                                expect(decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset >= 0).toBeTruthy(); //1 meter precision
                            }
                            else if(decodedLines[i-a].lines.length === 1){
                                // expect(decodedLines[i].lines[0].getID()).toEqual(lineIds[i]);
                                if(decodedLines[i-a].lines[0].getID() !== lineIds[i-a]){
                                    originalLineNotPresent++;
                                }
                            }
                            expect(decodedLines[i-a].lines.length).toBeGreaterThanOrEqual(1);
                            expect(decodedLines[i-a].lines.length).toBeLessThanOrEqual(maxDecodedLines);
                            if(decodedLines[i-a].lines.length > 3){
                                decodedToMoreThanThree++;
                            }
                        }
                        else{
                            a++;
                        }
                    }
                    //happens because encoder moves to valid nodes, which in combination with the rounding to meters has a small loss in precision
                    //since nodes are than projected during decoding, they can be projected up to half a meter to the left or right of our original line
                    console.log("decoded to two:",decodedToTwo,"decoded to three:",decodedToThree,"decoded to more",decodedToMoreThanThree);
                    console.log("original line not present",originalLineNotPresent);

                    resolve({
                        encodedLocations: locations.length,
                        encodeErrors: encodeErrors,
                        decodedLines: decodedLines.length,
                        decodeErrors: decodeErrors
                    })
                });
            })});
}

export function wegenregisterToWegenregisterNoShortLines(decoderProperties){
    return new Promise(resolve=>{
        loadNodesLineStringsWegenregsterAntwerpen().then(features => {
            let wegenregisterMapDataBase = new MapDataBase();
            WegenregisterAntwerpenIntegration.initMapDataBase(wegenregisterMapDataBase,features);

            let lineIds = [];
            let decodeErrorIndexes = [];
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
                if(wegenregisterMapDataBase.lines.hasOwnProperty(id) && i<maxAmountOfWegenregisterLines && wegenregisterMapDataBase.lines[id].getLength() > wegenregisterLineLengthLimit*configProperties.internalPrecision){
                    let t3;
                    let t4;
                    try {
                        t3 = performance.now();
                        let location = LineEncoder.encode(wegenregisterMapDataBase,[wegenregisterMapDataBase.lines[id]],0,0);
                        t4 = performance.now();
                        locations.push(location);
                        encodeTimes.push(t4-t3);
                        lineIds.push(id);
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
                    let decoded = OpenLRDecoder.decode(locations[i],wegenregisterMapDataBase,decoderProperties);
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
                    decodeErrorIndexes.push(i);
                    lineIds.splice(i,1);
                }
            }
            t2 = performance.now();
            let sum = times.length > 0 ? times.reduce((previous, current)=> current += previous) : 0;
            let errorSum = errorTimes.length > 0 ? errorTimes.reduce((previous, current)=> current += previous) : 0;
            console.log("decoded lines: ",decodedLines.length,"decode errors:",decodeErrors,
                "in time:",t2-t1,"ms,",
                "mean time:",sum/times.length,"ms,",
                "error mean time",errorTimes.length > 0 ? errorSum/errorTimes.length : 0,"ms,"
            );
            console.log(decodeErrorTypes);

            let decodedToTwo = 0;
            let decodedToThree = 0;
            let decodedToMoreThanThree = 0;
            let originalLineNotPresent = 0;
            let a = 0;
            for(let i=0;i<locations.length;i++){
                if(a >= decodeErrorIndexes.length || i !== decodeErrorIndexes[a]){
                    // if(decodedLines[i].lines.length === 2){
                    //     console.log(osmMapDataBase.lines[lineIds[i]]);
                    //     console.log(locations[i]);
                    //     console.log(decodedLines[i].lines);
                    //     console.log(decodedLines[i].posOffset,decodedLines[i].negOffset);
                    // }
                    // expect(decodedLines[i].lines.length).toEqual(1);
                    if(decodedLines[i-a].lines.length===2){
                        decodedToTwo++;
                        // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i]).toBeTruthy();
                        if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a])){
                            originalLineNotPresent++;
                        }
                        // expect((decodedLines[i].posOffset === 0 && decodedLines[i].negOffset > 0) || (decodedLines[i].posOffset > 0 && decodedLines[i].negOffset === 0)).toBeTruthy();
                        expect((decodedLines[i-a].posOffset <= 1 && decodedLines[i-a].negOffset >= 0) || (decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset <= 1)).toBeTruthy(); //1 meter precision
                    }
                    else if(decodedLines[i-a].lines.length===3){
                        decodedToThree++;
                        // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i] || decodedLines[i].lines[2].getID() === lineIds[i]).toBeTruthy();
                        if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a] || decodedLines[i-a].lines[2].getID() === lineIds[i-a])){
                            originalLineNotPresent++;
                        }
                        // expect(decodedLines[i].posOffset > 0 && decodedLines[i].negOffset > 0).toBeTruthy();
                        expect(decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset >= 0).toBeTruthy(); //1 meter precision
                    }
                    else if(decodedLines[i-a].lines.length === 1){
                        // expect(decodedLines[i].lines[0].getID()).toEqual(lineIds[i]);
                        if(decodedLines[i-a].lines[0].getID() !== lineIds[i-a]){
                            originalLineNotPresent++;
                        }
                    }
                    expect(decodedLines[i-a].lines.length).toBeGreaterThanOrEqual(1);
                    expect(decodedLines[i-a].lines.length).toBeLessThanOrEqual(maxDecodedLinesHigh);
                    if(decodedLines[i-a].lines.length > 3){
                        decodedToMoreThanThree++;
                    }
                }
                else{
                    a++;
                }
            }
            //happens because encoder moves to valid nodes, which in combination with the rounding to meters has a small loss in precision
            //since nodes are than projected during decoding, they can be projected up to half a meter to the left or right of our original line
            console.log("decoded to two:",decodedToTwo,"decoded to three:",decodedToThree,"decoded to more",decodedToMoreThanThree);
            console.log("original line not present",originalLineNotPresent);

            resolve({
                encodedLocations: locations.length,
                encodeErrors: encodeErrors,
                decodedLines: decodedLines.length,
                decodeErrors: decodeErrors
            })
        });
    });
}
export function wegenregisterToWegenregisterNoEncodingNoShortLines(decoderProperties){
    return new Promise(resolve=>{
        loadNodesLineStringsWegenregsterAntwerpen().then(features => {
            let wegenregisterMapDataBase = new MapDataBase();
            WegenregisterAntwerpenIntegration.initMapDataBase(wegenregisterMapDataBase,features);

            let lineIds = [];
            let decodeErrorIndexes = [];
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
                if(wegenregisterMapDataBase.lines.hasOwnProperty(id) && i<maxAmountOfWegenregisterLines && wegenregisterMapDataBase.lines[id].getLength() > wegenregisterLineLengthLimit*configProperties.internalPrecision){
                    let t3;
                    let t4;
                    try {
                        t3 = performance.now();
                        let location = LinesDirectlyToLRPs([wegenregisterMapDataBase.lines[id]]);
                        t4 = performance.now();
                        locations.push(location);
                        encodeTimes.push(t4-t3);
                        lineIds.push(id);
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
                    let decoded = OpenLRDecoder.decode(locations[i],wegenregisterMapDataBase,decoderProperties);
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
                    decodeErrorIndexes.push(i);
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

            let decodedToTwo = 0;
            let decodedToThree = 0;
            let decodedToMoreThanThree = 0;
            let originalLineNotPresent = 0;
            let a = 0;
            for(let i=0;i<locations.length;i++){
                if(a >= decodeErrorIndexes.length || i !== decodeErrorIndexes[a]){
                    // if(decodedLines[i].lines.length === 2){
                    //     console.log(osmMapDataBase.lines[lineIds[i]]);
                    //     console.log(locations[i]);
                    //     console.log(decodedLines[i].lines);
                    //     console.log(decodedLines[i].posOffset,decodedLines[i].negOffset);
                    // }
                    // expect(decodedLines[i].lines.length).toEqual(1);
                    if(decodedLines[i-a].lines.length===2){
                        decodedToTwo++;
                        // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i]).toBeTruthy();
                        if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a])){
                            originalLineNotPresent++;
                        }
                        // expect((decodedLines[i].posOffset === 0 && decodedLines[i].negOffset > 0) || (decodedLines[i].posOffset > 0 && decodedLines[i].negOffset === 0)).toBeTruthy();
                        expect((decodedLines[i-a].posOffset <= 1 && decodedLines[i-a].negOffset >= 0) || (decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset <= 1)).toBeTruthy(); //1 meter precision
                    }
                    else if(decodedLines[i-a].lines.length===3){
                        decodedToThree++;
                        // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i] || decodedLines[i].lines[2].getID() === lineIds[i]).toBeTruthy();
                        if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a] || decodedLines[i-a].lines[2].getID() === lineIds[i-a])){
                            originalLineNotPresent++;
                        }
                        // expect(decodedLines[i].posOffset > 0 && decodedLines[i].negOffset > 0).toBeTruthy();
                        expect(decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset >= 0).toBeTruthy(); //1 meter precision
                    }
                    else if(decodedLines[i-a].lines.length === 1){
                        // expect(decodedLines[i].lines[0].getID()).toEqual(lineIds[i]);
                        if(decodedLines[i-a].lines[0].getID() !== lineIds[i-a]){
                            originalLineNotPresent++;
                        }
                    }
                    expect(decodedLines[i-a].lines.length).toBeGreaterThanOrEqual(1);
                    expect(decodedLines[i-a].lines.length).toBeLessThanOrEqual(maxDecodedLines);
                    // if(decodedLines[i-a].lines.length > maxDecodedLines){
                    //     console.log(wegenregisterMapDataBase.lines[lineIds[i-a]]);
                    //     console.log(decodedLines[i-a]);
                    //     console.log(locations[i]);
                    // }
                    if(decodedLines[i-a].lines.length > 3){
                        decodedToMoreThanThree++;
                    }
                }
                else{
                    a++;
                }
            }
            //happens because encoder moves to valid nodes, which in combination with the rounding to meters has a small loss in precision
            //since nodes are than projected during decoding, they can be projected up to half a meter to the left or right of our original line
            console.log("decoded to two:",decodedToTwo,"decoded to three:",decodedToThree,"decoded to more",decodedToMoreThanThree);
            console.log("original line not present",originalLineNotPresent);

            resolve({
                encodedLocations: locations.length,
                encodeErrors: encodeErrors,
                decodedLines: decodedLines.length,
                decodeErrors: decodeErrors
            })
        });
    });
}
