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
    dist: 5,    //maximum distance (in meter) of a candidate node to a LRP
    bearDiff: 60, //maximum difference (in degrees) between the bearing of a candidate node and that of a LRP
    frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 3, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 40, //maximum difference (in meter) between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: true,
    useFrcFow: true,
    distMultiplier: 40,
    frcMultiplier: 35,
    fowMultiplier: 40,
    bearMultiplier: 30,
    maxSPSearchRetries: 1000,
    maxDecodeRetries: 2,
    distMultiplierForRetry: 2
};

export let decoderProperties = {
    dist: 5,    //maximum distance (in meter) of a candidate node to a LRP
    bearDiff: 60, //maximum difference (in degrees) between the bearing of a candidate node and that of a LRP
    frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 3, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 40, //maximum difference (in meter) between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: false,
    useFrcFow: true,
    distMultiplier: 40,
    frcMultiplier: 35,
    fowMultiplier: 40,
    bearMultiplier: 30,
    maxSPSearchRetries: 1000,
    maxDecodeRetries: 2,
    distMultiplierForRetry: 2
};

let maxDecodedLines = 10;
let wegenregisterLineLengthLimit = 5; // in meter
let lineLengthLimitSameDataBase = 0; // in meter
let maxAmountOfWegenregisterLines = 1000;
let maxAmountOfLinesEncoded = 100;
let minLineLength = 0; // in meter
let minOffsetDiff = 1;

function clock(start) {
    if ( !start ) return process.hrtime();
    let end = process.hrtime(start);
    return Math.round((end[0]*1000) + (end[1]/1000000));
}

let performance = {};
performance.now = ()=>{
    let t = process.hrtime();
    return  Math.round((t[0]*1000) + (t[1]/1000000));
};

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
    let kortste = 100000;
    let x = 0;
    let t1 = clock();
    let linesEncoded = 0;
    for(let id in fromDataBase.lines){
        if(fromDataBase.lines.hasOwnProperty(id)
            && fromDataBase.lines[id].getLength() >= minLineLength*configProperties.internalPrecision
            && linesEncoded < maxAmountOfLinesEncoded
        ){
            let t3;
            let time4;
            try {
                if(fromDataBase.lines[id].getLength() < kortste){
                    kortste = fromDataBase.lines[id].getLength();
                }
                if(fromDataBase.lines[id].getLength() < 1*configProperties.internalPrecision){
                    x++;
                }
                t3 = clock();
                let location = encodeFunction(fromDataBase,id);
                time4 = clock(t3);
                locations.push(location);
                encodeTimes.push(time4);
                linesEncoded++;
            }
            catch (err){
                // console.warn(err);
                encodeErrors++;
                if(encodeErrorTypes[err] === undefined){
                    encodeErrorTypes[err] = 0;
                }
                encodeErrorTypes[err]++;
                encodeErrorTimes.push(time4);
            }
        }
    }
    let time2 = clock(t1);
    let total = encodeTimes.length > 0 ? encodeTimes.reduce((previous, current)=> current += previous) : 0;
    let errorTotal = encodeErrorTimes.length > 0 ? encodeErrorTimes.reduce((previous, current)=> current += previous) : 0;
    console.log("encoded locations: ",locations.length,"encode errors:",encodeErrors,
        "in time:",time2,"ms",
        "mean time:",total/encodeTimes.length,"ms,",
        "error mean time",encodeErrorTimes.length > 0 ? errorTotal/encodeErrorTimes.length : 0,"ms,"
    );
    console.log(encodeErrorTypes);
    console.log("fromDataBase chorteste:",kortste,"| Amount under 1 meter:",x);

    let times = [];
    let errorTimes = [];
    t1 = clock();
    for(let i=0;i<locations.length;i++){
        let t3;
        let time4;
        try {
            t3 = clock();
            let decoded = OpenLRDecoder.decode(locations[i],toDataBase,decoderProperties);
            time4 = clock(t3);
            decodedLines.push(decoded);
            times.push(time4);
        }
        catch (err){
            time4 = clock(t3);
            if(decodeErrorTypes[err] === undefined){
                decodeErrorTypes[err] = 0;
            }
            decodeErrorTypes[err]++;
            decodeErrors++;
            errorTimes.push(time4);
            erroneousLocations.push(locations[i]);
        }
    }
    time2 = clock(t1);
    let sum = times.length > 0 ? times.reduce((previous, current)=> current += previous) : 0;
    let errorSum = errorTimes.length > 0 ? errorTimes.reduce((previous, current)=> current += previous) : 0;
    console.log("decoded lines: ",decodedLines.length,"decode errors:",decodeErrors,
        "in time:",time2,"ms,",
        "mean time:",sum/times.length,"ms,",
        "error mean time",errorSum/errorTimes.length,"ms,"
    );
    console.log(decodeErrorTypes);

    console.warn(erroneousLocations[0]);

    for(let i=0;i<decodedLines.length;i++){
        expect(decodedLines[i].lines.length).toBeGreaterThan(0);
    }

    let kortsteTo = 100000000;
    let aantalUnder = 0;
    for(let key in toDataBase.lines){
        if(toDataBase.lines.hasOwnProperty(key)){
            if(toDataBase.lines[key].getLength() < kortsteTo){
                kortsteTo = toDataBase.lines[key].getLength();
            }
            if(toDataBase.lines[key].getLength() < 1*configProperties.internalPrecision){
                aantalUnder++;
            }
        }
    }
    console.log("toDataBase chortest:",kortsteTo,"| Amount under 1 meter:",aantalUnder);

    return {
        encodedLocations: locations.length,
        encodeErrors: encodeErrors,
        decodedLines: decodedLines.length,
        decodeErrors: decodeErrors
    };
}
function _fromOneToSame(mapDatabase,decoderProperties,encodeFunction,lineLimit,lineLengthLimit){
    console.log("Encoder Lines:",Object.keys(mapDatabase.lines).length,"Decoder Lines:",Object.keys(mapDatabase.lines).length);
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
    let linesEncoded = 0;
    let t1 = performance.now();
    for(let id in mapDatabase.lines){
        if(mapDatabase.lines.hasOwnProperty(id) && mapDatabase.lines[id].getLength() > lineLengthLimitSameDataBase*configProperties.internalPrecision
            && (lineLimit === undefined || locations.length < lineLimit)
            && (lineLengthLimit === undefined || mapDatabase.lines[id].getLength() > lineLengthLimit*configProperties.internalPrecision)
            && linesEncoded < maxAmountOfLinesEncoded
        ){
            let t3;
            let t4;
            try {
                t3 = performance.now();
                let location = encodeFunction(mapDatabase,id);
                // let location = LinesDirectlyToLRPs([mapDatabase.lines[id]]);
                t4 = performance.now();
                locations.push(location);
                encodeTimes.push(t4-t3);
                lineIds.push(id);
                linesEncoded++;
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
    let total = encodeTimes.length > 0 ? encodeTimes.reduce((previous, current)=> current += previous) : 0;
    let errorTotal = encodeErrorTimes.length > 0 ? encodeErrorTimes.reduce((previous, current)=> current += previous) : 0;
    console.log("encoded locations: ",locations.length,"encode errors:",encodeErrors,
        "in time:",t2-t1,"ms",
        "mean time:",encodeTimes.length > 0 ? total/encodeTimes.length : 0,"ms,",
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
    let sum = decodedLines.length > 0 ? times.reduce((previous, current)=> current += previous) : 0;
    let errorSum = errorTimes.length > 0 ? errorTimes.reduce((previous, current)=> current += previous) : 0;
    console.log("decoded lines: ",decodedLines.length > 0 ? decodedLines.length : 0,"decode errors:",decodeErrors,
        "in time:",t2-t1,"ms,",
        "mean time:",sum/times.length,"ms,",
        "error mean time",errorTimes.length > 0 ? errorSum/errorTimes.length : 0,"ms,"
    );
    console.log(decodeErrorTypes);

    let decodedToTwo = 0;
    let decodedToThree = 0;
    let decodedToMoreThanThree = 0;
    let originalLineNotPresent = 0;
    let minDiff = undefined;
    let maxDiff = undefined;
    let maxAmountOfLines = undefined;
    let offsetDiffs = [];
    let amountBothDiffsUnderMinOffsetDiff = 0;
    let a = 0;
    for(let i=0;i<locations.length;i++){
        if(a >= decodeErrorIndexes.length || i !== decodeErrorIndexes[a]){
            let diffBegin = undefined;
            let diffEnd = undefined;
            let originalLineIsNotPresent = false;
            if(decodedLines[i-a].lines.length === 1){
                if(decodedLines[i-a].lines[0].getID() !== lineIds[i-a]){
                    originalLineNotPresent++;
                    originalLineIsNotPresent = true;
                }
                else{
                    diffBegin = decodedLines[i-a].posOffset;
                    diffEnd = decodedLines[i-a].negOffset;
                }
            }
            else if(decodedLines[i-a].lines.length===2){
                decodedToTwo++;
                if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a])){
                    originalLineNotPresent++;
                    originalLineIsNotPresent = true;
                }
                else {
                    if(decodedLines[i-a].lines[0].getID() === lineIds[i-a]){ //the first line is the correct one
                        diffBegin = decodedLines[i - a].posOffset;
                        diffEnd = Math.round((decodedLines[i - a].negOffset*configProperties.internalPrecision - decodedLines[i-a].lines[1].getLength())/configProperties.internalPrecision);
                    }
                    else{ // the second line is the correct one
                        diffBegin = Math.round((decodedLines[i - a].posOffset*configProperties.internalPrecision - decodedLines[i-a].lines[0].getLength())/configProperties.internalPrecision);
                        diffEnd = decodedLines[i - a].negOffset;
                    }
                    // if (!((decodedLines[i - a].posOffset <= minOffsetDiff * configProperties.internalPrecision && decodedLines[i - a].negOffset >= (decodedLines[i - a].lines[1].getLength() - minOffsetDiff * configProperties.internalPrecision)) || (decodedLines[i - a].posOffset >= (decodedLines[i - a].lines[0].getLength() - minOffsetDiff * configProperties.internalPrecision) && decodedLines[i - a].negOffset <= minOffsetDiff * configProperties.internalPrecision))) {
                    //     // console.log("Line encoded: ",lineIds[i]);
                    //     // console.log("Original Line:",mapDatabase.lines[lineIds[i]]);
                    //     // console.log("Encoded location:",locations[i]);
                    //     // console.log("Decoded location:",decodedLines[i-a]);
                    //     // console.log("First line result:",decodedLines[i - a].lines[0]);
                    //     // console.log("Second line result:",decodedLines[i - a].lines[1]);
                    // }
                    // expect((decodedLines[i - a].posOffset <= minOffsetDiff * configProperties.internalPrecision && decodedLines[i - a].negOffset >= (decodedLines[i - a].lines[1].getLength() - minOffsetDiff * configProperties.internalPrecision)) || (decodedLines[i - a].posOffset >= (decodedLines[i - a].lines[0].getLength() - minOffsetDiff * configProperties.internalPrecision) && decodedLines[i - a].negOffset <= minOffsetDiff * configProperties.internalPrecision)).toBeTruthy(); //1 meter precision
                }
            }
            else if(decodedLines[i-a].lines.length===3){
                decodedToThree++;
                if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a] || decodedLines[i-a].lines[2].getID() === lineIds[i-a])){
                    originalLineNotPresent++;
                    originalLineIsNotPresent = true;
                }
                else{
                    expect(decodedLines[i-a].lines[1].getID() === lineIds[i-a]);
                    diffBegin = Math.round((decodedLines[i - a].posOffset*configProperties.internalPrecision - decodedLines[i-a].lines[0].getLength())/configProperties.internalPrecision);
                    diffEnd = Math.round((decodedLines[i - a].negOffset*configProperties.internalPrecision - decodedLines[i-a].lines[2].getLength())/configProperties.internalPrecision);
                }
            }
            else if(decodedLines[i-a].lines.length > 3){
                decodedToMoreThanThree++;
                let r = 0;
                while(r < decodedLines[i-a].lines.length && decodedLines[i-a].lines[r].getID() !== lineIds[i-a]){
                    r++;
                }
                if(r >= decodedLines[i-a].lines.length){
                    originalLineNotPresent++;
                    originalLineIsNotPresent = true;
                }
                else{
                    diffBegin = decodedLines[i-a].posOffset*configProperties.internalPrecision;
                    diffEnd = decodedLines[i-a].negOffset*configProperties.internalPrecision;
                    for(let x=0;x<r;x++){
                        diffBegin -= decodedLines[i-a].lines[x].getLength();
                    }
                    for(let x=r+1;x<decodedLines[i-a].lines.length;x++){
                        diffEnd -= decodedLines[i-a].lines[x].getLength();
                    }
                    diffBegin = Math.round(diffBegin/configProperties.internalPrecision);
                    diffEnd = Math.round(diffEnd/configProperties.internalPrecision);
                }
            }

            if(!originalLineIsNotPresent){
                //check the minimum and maximum offset distance deviation if the original Line is present
                if(minDiff === undefined || minDiff>Math.abs(diffBegin)){
                    minDiff = Math.abs(diffBegin);
                }
                if(minDiff === undefined || minDiff>Math.abs(diffEnd)){
                    minDiff = Math.abs(diffEnd);
                }
                if(maxDiff === undefined || maxDiff<Math.abs(diffBegin)){
                    maxDiff = Math.abs(diffBegin);
                }
                if(maxDiff === undefined || maxDiff<Math.abs(diffEnd)){
                    maxDiff = Math.abs(diffEnd);
                }

                if(Math.abs(diffBegin) > minOffsetDiff || Math.abs(diffEnd) > minOffsetDiff){
                    // console.log("Line encoded: ",lineIds[i]);
                    console.log("Original Line:",mapDatabase.lines[lineIds[i]]);
                    console.log("Encoded location:",locations[i]);
                    console.log("Decoded location:",decodedLines[i-a]);
                    console.log("Begin diff:",diffBegin,"End diff:",diffEnd);
                }

                expect(diffBegin).toBeDefined();
                expect(diffEnd).toBeDefined();
                offsetDiffs.push(Math.abs(diffBegin));
                offsetDiffs.push(Math.abs(diffEnd));

                if(Math.abs(diffBegin) <= minOffsetDiff && Math.abs(diffEnd) <= minOffsetDiff){
                    amountBothDiffsUnderMinOffsetDiff++;
                }

                //check the precision of the offset values (Are they under minOffsetDiff?)
                // expect(Math.abs(diffBegin)).toBeLessThanOrEqual(minOffsetDiff);
                // expect(Math.abs(diffEnd)).toBeLessThanOrEqual(minOffsetDiff);

                //check if the total amount of resulting lines after decoding is smaller than maxDecodedLines and bigger than 1
                expect(decodedLines[i-a].lines.length).toBeGreaterThanOrEqual(1);
                expect(decodedLines[i-a].lines.length).toBeLessThanOrEqual(maxDecodedLines);
                if(maxAmountOfLines === undefined || maxAmountOfLines < decodedLines[i-a].lines.length){
                    maxAmountOfLines = decodedLines[i-a].lines.length;
                }
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
    let offsetErrorSum = offsetDiffs.length > 0 ? offsetDiffs.reduce((previous, current)=> current += previous) : 0;
    console.log("Minimum offset error:",minDiff,"Maximum offset error:",maxDiff,"Mean offset error:",offsetDiffs.length > 0 ? offsetErrorSum/offsetDiffs.length : 0);
    console.log("Maximum amount of resulting lines after decoding",maxAmountOfLines);
    console.log("Amount of Lines were offsetDiff at both sides was lower than",minOffsetDiff,":",amountBothDiffsUnderMinOffsetDiff);

    return({
        encodedLocations: locations.length,
        encodeErrors: encodeErrors,
        decodedLines: decodedLines.length,
        decodeErrors: decodeErrors
    })
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

                            let result = _fromOneToSame(osmMapDataBase,decoderProperties,(fromDataBase,id)=>{return LineEncoder.encode(fromDataBase,[fromDataBase.lines[id]],0,0);});

                            resolve(result);
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

                            let result = _fromOneToSame(osmMapDataBase,decoderProperties,(fromDataBase,id)=>{return LinesDirectlyToLRPs([fromDataBase.lines[id]])});

                            resolve(result)
                        })})})});
    });
}

export function wegenregisterToWegenregister(decoderProperties){
    return new Promise(resolve=>{
        loadNodesLineStringsWegenregsterAntwerpen().then(features => {
            let wegenregisterMapDataBase = new MapDataBase();
            WegenregisterAntwerpenIntegration.initMapDataBase(wegenregisterMapDataBase,features);

            let result = _fromOneToSame(wegenregisterMapDataBase,decoderProperties,(fromDataBase,id)=>{return LineEncoder.encode(fromDataBase,[fromDataBase.lines[id]],0,0);},maxAmountOfWegenregisterLines);

            resolve(result);
        });
    });
}
export function wegenregisterToWegenregisterNoEncoding(decoderProperties){
    return new Promise(resolve=>{
        loadNodesLineStringsWegenregsterAntwerpen().then(features => {
            let wegenregisterMapDataBase = new MapDataBase();
            WegenregisterAntwerpenIntegration.initMapDataBase(wegenregisterMapDataBase,features);

            let result = _fromOneToSame(wegenregisterMapDataBase,decoderProperties,(fromDataBase,id)=>{return LinesDirectlyToLRPs([fromDataBase.lines[id]])},maxAmountOfWegenregisterLines);

            resolve(result)
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

                    let result = _fromOneToSame(mapDatabase,decoderProperties,(fromDataBase,id)=>{return LineEncoder.encode(fromDataBase,[fromDataBase.lines[id]],0,0);});

                    resolve(result);
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

                    let result = _fromOneToSame(mapDatabase,decoderProperties,(fromDataBase,id)=>{return LinesDirectlyToLRPs([fromDataBase.lines[id]])});

                    resolve(result)
                });
            })});
}
// export function routableTilesToRoutableTiles4MeterOffsetsDiff(decoderProperties){
//     return new Promise(resolve=>{
//         fetchRoutableTile(14,8392,5469)
//             .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
//                 .then((nodesAndLines)=> {
//                     let mapDatabase = new MapDataBase();
//                     RoutableTilesIntegration.initMapDataBase(mapDatabase, nodesAndLines.nodes,nodesAndLines.lines);
//
//                     let lineIds = [];
//                     let decodeErrorIndexes = [];
//                     let locations = [];
//                     let encodeErrors = 0;
//                     let encodeErrorTypes = {};
//
//                     let decodedLines = [];
//                     let decodeErrors = 0;
//                     let decodeErrorTypes = {};
//
//                     let erroneousLocations = [];
//
//                     let encodeTimes = [];
//                     let encodeErrorTimes = [];
//                     let t1 = performance.now();
//                     for(let id in mapDatabase.lines){
//                         if(mapDatabase.lines.hasOwnProperty(id) && mapDatabase.lines[id].getLength() > lineLengthLimitSameDataBase*configProperties.internalPrecision){
//                             let t3;
//                             let t4;
//                             try {
//                                 t3 = performance.now();
//                                 let location = LineEncoder.encode(mapDatabase,[mapDatabase.lines[id]],0,0);
//                                 t4 = performance.now();
//                                 locations.push(location);
//                                 encodeTimes.push(t4-t3);
//                                 lineIds.push(id);
//                             }
//                             catch (err){
//                                 t4 = performance.now();
//                                 if(encodeErrorTypes[err] === undefined){
//                                     encodeErrorTypes[err] = 0;
//                                 }
//                                 encodeErrorTypes[err]++;
//                                 encodeErrors++;
//                                 encodeErrorTimes.push(t4-t3);
//                             }
//                         }
//                     }
//                     let t2 = performance.now();
//                     let total = encodeTimes.reduce((previous, current)=> current += previous);
//                     let errorTotal = encodeErrorTimes.length > 0 ? encodeErrorTimes.reduce((previous, current)=> current += previous) : 0;
//                     console.log("encoded locations: ",locations.length,"encode errors:",encodeErrors,
//                         "in time:",t2-t1,"ms",
//                         "mean time:",total/encodeTimes.length,"ms,",
//                         "error mean time",encodeErrorTimes.length > 0 ? errorTotal/encodeErrorTimes.length : 0,"ms,"
//                     );
//                     console.log(encodeErrorTypes);
//
//                     let times = [];
//                     let errorTimes = [];
//                     t1 = performance.now();
//                     for(let i=0;i<locations.length;i++){
//                         let t3;
//                         let t4;
//                         try {
//                             t3 = performance.now();
//                             let decoded = OpenLRDecoder.decode(locations[i],mapDatabase,decoderProperties);
//                             t4 = performance.now();
//                             decodedLines.push(decoded);
//                             times.push(t4-t3);
//                         }
//                         catch (err){
//                             if(decodeErrorTypes[err] === undefined){
//                                 decodeErrorTypes[err] = 0;
//                             }
//                             decodeErrorTypes[err]++;
//                             t4 = performance.now();
//                             decodeErrors++;
//                             errorTimes.push(t4-t3);
//                             erroneousLocations.push(locations[i]);
//                             decodeErrorIndexes.push(i);
//                             lineIds.splice(i,1);
//                         }
//                     }
//                     t2 = performance.now();
//                     let sum = times.reduce((previous, current)=> current += previous);
//                     let errorSum = errorTimes.length > 0 ? errorTimes.reduce((previous, current)=> current += previous) : 0;
//                     console.log("decoded lines: ",decodedLines.length,"decode errors:",decodeErrors,
//                         "in time:",t2-t1,"ms,",
//                         "mean time:",sum/times.length,"ms,",
//                         "error mean time",errorTimes.length > 0 ? errorSum/errorTimes.length : 0,"ms,"
//                     );
//                     console.log(decodeErrorTypes);
//
//                     let decodedToTwo = 0;
//                     let decodedToThree = 0;
//                     let decodedToMoreThanThree = 0;
//                     let originalLineNotPresent = 0;
//                     let a = 0;
//                     for(let i=0;i<locations.length;i++){
//                         if(a >= decodeErrorIndexes.length || i !== decodeErrorIndexes[a]){
//                             // if(decodedLines[i].lines.length === 2){
//                             //     console.log(osmMapDataBase.lines[lineIds[i]]);
//                             //     console.log(locations[i]);
//                             //     console.log(decodedLines[i].lines);
//                             //     console.log(decodedLines[i].posOffset,decodedLines[i].negOffset);
//                             // }
//                             // expect(decodedLines[i].lines.length).toEqual(1);
//                             if(decodedLines[i-a].lines.length===2){
//                                 decodedToTwo++;
//                                 // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i]).toBeTruthy();
//                                 if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a])){
//                                     originalLineNotPresent++;
//                                 }
//                                 // expect((decodedLines[i].posOffset === 0 && decodedLines[i].negOffset > 0) || (decodedLines[i].posOffset > 0 && decodedLines[i].negOffset === 0)).toBeTruthy();
//                                 expect((decodedLines[i-a].posOffset <= 4 && decodedLines[i-a].negOffset >= 0) || (decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset <= 4)).toBeTruthy(); //4 meter precision
//                             }
//                             else if(decodedLines[i-a].lines.length===3){
//                                 decodedToThree++;
//                                 // expect(decodedLines[i].lines[0].getID() === lineIds[i] || decodedLines[i].lines[1].getID() === lineIds[i] || decodedLines[i].lines[2].getID() === lineIds[i]).toBeTruthy();
//                                 if(!(decodedLines[i-a].lines[0].getID() === lineIds[i-a] || decodedLines[i-a].lines[1].getID() === lineIds[i-a] || decodedLines[i-a].lines[2].getID() === lineIds[i-a])){
//                                     originalLineNotPresent++;
//                                 }
//                                 // expect(decodedLines[i].posOffset > 0 && decodedLines[i].negOffset > 0).toBeTruthy();
//                                 expect(decodedLines[i-a].posOffset >= 0 && decodedLines[i-a].negOffset >= 0).toBeTruthy(); //1 meter precision
//                             }
//                             else if(decodedLines[i-a].lines.length === 1){
//                                 // expect(decodedLines[i].lines[0].getID()).toEqual(lineIds[i]);
//                                 if(decodedLines[i-a].lines[0].getID() !== lineIds[i-a]){
//                                     originalLineNotPresent++;
//                                 }
//                             }
//                             expect(decodedLines[i-a].lines.length).toBeGreaterThanOrEqual(1);
//                             expect(decodedLines[i-a].lines.length).toBeLessThanOrEqual(maxDecodedLines);
//                             if(decodedLines[i-a].lines.length > 3){
//                                 decodedToMoreThanThree++;
//                             }
//                         }
//                         else{
//                             a++;
//                         }
//                     }
//                     //happens because encoder moves to valid nodes, which in combination with the rounding to meters has a small loss in precision
//                     //since nodes are than projected during decoding, they can be projected up to half a meter to the left or right of our original line
//                     console.log("decoded to two:",decodedToTwo,"decoded to three:",decodedToThree,"decoded to more",decodedToMoreThanThree);
//                     console.log("original line not present",originalLineNotPresent);
//
//                     resolve({
//                         encodedLocations: locations.length,
//                         encodeErrors: encodeErrors,
//                         decodedLines: decodedLines.length,
//                         decodeErrors: decodeErrors
//                     })
//                 });
//             })});
// }

export function wegenregisterToWegenregisterNoShortLines(decoderProperties){
    return new Promise(resolve=>{
        loadNodesLineStringsWegenregsterAntwerpen().then(features => {
            let wegenregisterMapDataBase = new MapDataBase();
            WegenregisterAntwerpenIntegration.initMapDataBase(wegenregisterMapDataBase,features);

            let result = _fromOneToSame(wegenregisterMapDataBase,decoderProperties,(fromDataBase,id)=>{return LineEncoder.encode(fromDataBase,[fromDataBase.lines[id]],0,0);},undefined,wegenregisterLineLengthLimit);

            resolve(result);
        });
    });
}
export function wegenregisterToWegenregisterNoEncodingNoShortLines(decoderProperties){
    return new Promise(resolve=>{
        loadNodesLineStringsWegenregsterAntwerpen().then(features => {
            let wegenregisterMapDataBase = new MapDataBase();
            WegenregisterAntwerpenIntegration.initMapDataBase(wegenregisterMapDataBase,features);

            let result = _fromOneToSame(wegenregisterMapDataBase,decoderProperties,(fromDataBase,id)=>{return LinesDirectlyToLRPs([fromDataBase.lines[id]])},undefined,wegenregisterLineLengthLimit);

            resolve(result)
        });
    });
}
