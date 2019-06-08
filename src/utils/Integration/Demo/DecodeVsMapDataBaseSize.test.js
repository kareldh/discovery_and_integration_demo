/**
 * @jest-environment node
 */

import {fetchRoutableTile, loadNodesLineStringsWegenregisterAntwerpen} from "../Data/LoadData";
import {filterHighwayData, getMappedElements, getRoutableTilesNodesAndLines, parseToJson} from "../Data/ParseData";
import MapDataBase from "../OpenLR/map/MapDataBase";
import RoutableTilesIntegration from "../OpenLRIntegration/RoutableTilesIntegration";
import {_fromOneToOther, _fromOneToSame, decoderProperties} from "./EncodeDecodeDemoTestFunctions";
import LineEncoder from "../OpenLR/coder/LineEncoder";
import {loadOsmTestData} from "../Data/LoadTestData";
import OSMIntegration from "../OpenLRIntegration/OSMIntegration";
import WegenregisterAntwerpenIntegration from "../OpenLRIntegration/WegenregisterAntwerpenIntegration";
import {getTileXYForLocation} from "../../tileUtils";

//test the impact of the amount on lines in the mapdatabase vs the decoding speed

function testDecodeInTilesSame(decoderProperties,tiles){
    return new Promise(resolve=>{
        let mapDatabase = new MapDataBase();
        let promises = [];
        tiles.forEach(tile =>{
            promises.push(
                new Promise(resolve=>{
                    fetchRoutableTile(14,tile.x,tile.y)
                        .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                            .then((nodesAndLines)=> {
                                let data = RoutableTilesIntegration.getNodesLines(nodesAndLines.nodes,nodesAndLines.lines);
                                mapDatabase.addData(data.lines,data.nodes);
                                resolve();
                            });
                        })})
            );
        });

        Promise.all(promises).then(()=>{
            console.log("Database lines:",Object.keys(mapDatabase.lines).length);
            let result = _fromOneToSame(mapDatabase,decoderProperties,(fromDataBase,id)=>{return LineEncoder.encode(fromDataBase,[fromDataBase.lines[id]],0,0);},undefined,undefined,false);

            resolve(result);
        });
    });
}

function decodeInTilesSame(xAmount,yAmount){
    return new Promise(resolve => {
        let tiles = [];
        for(let i=0;i<yAmount;i++){
            for(let j=0;j<xAmount;j++){
                tiles.push({x:8392-j,y:5469+i})
            }
        }
        testDecodeInTilesSame(decoderProperties,tiles)
            .then((res)=>{
                console.log("Amount of tiles:",xAmount*yAmount,"Mean decode time:",res.meanDecodeTime,"EncodedLines:",res.encodedLocations,"DecodedLines:",res.decodedLines);
                expect(res).toBeDefined();
                resolve();
            });
    })
}

test.skip('decode speed in function of amount of lines (amount of routable tiles) same databases',(done)=>{
    expect.hasAssertions();
    decodeInTilesSame(1,1)
        .then(()=>decodeInTilesSame(1,10)
            .then(()=>decodeInTilesSame(2,10)
                .then(()=>decodeInTilesSame(3,10)
                    .then(()=>decodeInTilesSame(4,10)
                        .then(()=>decodeInTilesSame(5,10)
                            .then(()=>decodeInTilesSame(6,10)
                                .then(()=>decodeInTilesSame(7,10)
                                    .then(()=>decodeInTilesSame(8,10)
                                        .then(()=>decodeInTilesSame(9,10)
                                            .then(()=>decodeInTilesSame(10,10)
                                                .then(()=>done())
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
},1800000);

function testDecodeInTilesDifferent(decoderProperties,tiles){
    return new Promise(resolve=>{
        let mapDatabase = new MapDataBase();
        let promises = [];
        tiles.forEach(tile =>{
            promises.push(
                new Promise(resolve=>{
                    fetchRoutableTile(14,tile.x,tile.y)
                        .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                            .then((nodesAndLines)=> {
                                let data = RoutableTilesIntegration.getNodesLines(nodesAndLines.nodes,nodesAndLines.lines);
                                mapDatabase.addData(data.lines,data.nodes);
                                resolve();
                            });
                        })})
            );
        });

        let fromDatabase = new MapDataBase();
        promises.push(
            loadOsmTestData()
            .then((data)=>{parseToJson(data)
                .then((json)=>{getMappedElements(json)
                    .then((elements)=>{filterHighwayData(elements)
                        .then((highwayData)=>{
                            OSMIntegration.initMapDataBase(fromDatabase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        })})})})
        );

        Promise.all(promises).then(()=>{
            console.log("Database lines:",Object.keys(mapDatabase.lines).length);
            let result = _fromOneToOther(fromDatabase,mapDatabase,decoderProperties,(fromDataBase,id)=>{return LineEncoder.encode(fromDataBase,[fromDataBase.lines[id]],0,0);},false);

            resolve(result);
        });
    });
}

function decodeInTilesDifferent(xAmount,yAmount){
    return new Promise(resolve => {
        let tiles = [];
        for(let i=0;i<yAmount;i++){
            for(let j=0;j<xAmount;j++){
                tiles.push({x:8392-j,y:5469+i})
            }
        }
        testDecodeInTilesDifferent(decoderProperties,tiles)
            .then((res)=>{
                console.log("Amount of tiles:",xAmount*yAmount,"Mean decode time:",res.meanDecodeTime,"EncodedLines:",res.encodedLocations,"DecodedLines:",res.decodedLines);
                expect(res).toBeDefined();
                resolve();
            });
    })
}

test.skip('decode speed in function of amount of lines (amount of routable tiles) different databases',(done)=>{
    expect.hasAssertions();
    decodeInTilesDifferent(1,1)
        .then(()=>decodeInTilesDifferent(1,10)
            .then(()=>decodeInTilesDifferent(2,10)
                .then(()=>decodeInTilesDifferent(3,10)
                    .then(()=>decodeInTilesDifferent(4,10)
                        .then(()=>decodeInTilesDifferent(5,10)
                            .then(()=>decodeInTilesDifferent(6,10)
                                .then(()=>decodeInTilesDifferent(7,10)
                                    .then(()=>decodeInTilesDifferent(8,10)
                                        .then(()=>decodeInTilesDifferent(9,10)
                                            .then(()=>decodeInTilesDifferent(10,10)
                                                .then(()=>done())
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
},1800000);

function testDecodeInTilesSameManualCache(decoderProperties){
    let tiles = [];
    for(let i=0;i<10;i++){
        for(let j=0;j<5;j++){
            tiles.push({x:8392-j,y:5469+i})
        }
    }
    let dataOfTiles = [];

    return new Promise(resolve=>{
        let promises = [];
        tiles.forEach(tile =>{
            promises.push(
                new Promise(resolve2=>{
                    fetchRoutableTile(14,tile.x,tile.y)
                        .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                            .then((nodesAndLines)=> {
                                let data = RoutableTilesIntegration.getNodesLines(nodesAndLines.nodes,nodesAndLines.lines);
                                dataOfTiles.push(data);
                                resolve2();
                            });
                        }).catch((error)=>console.warn(error))})
            );
        });

        Promise.all(promises).then(()=>{
            for(let i=1;i<dataOfTiles.length;i+=10){
                let mapDatabase = new MapDataBase();
                for(let j=0;j<i;j++){
                    mapDatabase.addData(dataOfTiles[j].lines,dataOfTiles[j].nodes);
                }
                let result = _fromOneToSame(mapDatabase,decoderProperties,(fromDataBase,id)=>{return LineEncoder.encode(fromDataBase,[fromDataBase.lines[id]],0,0);},undefined,undefined,false);
                console.log("Database lines:",Object.keys(mapDatabase.lines).length);
                console.log("Amount of tiles:",i,"Mean decode time:",result.meanDecodeTime,"EncodedLines:",result.encodedLocations,"DecodedLines:",result.decodedLines);
            }
            resolve();
        });
    });
}

test.skip('decode speed impact by database size manual cache same',(done)=>{
    testDecodeInTilesSameManualCache(decoderProperties).then(()=>{
        console.log("completed");
        done();
    });
},120000);

function testDecodeInTilesDiffManualCache(decoderProperties){
    let tiles = [];
    for(let i=0;i<10;i++){
        for(let j=0;j<6;j++){
            tiles.push({x:8392-j,y:5469+i})
        }
    }
    let dataOfTiles = [];

    return new Promise(resolve=>{
        let promises = [];
        tiles.forEach(tile =>{
            promises.push(
                new Promise(resolve2=>{
                    fetchRoutableTile(14,tile.x,tile.y)
                        .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                            .then((nodesAndLines)=> {
                                let data = RoutableTilesIntegration.getNodesLines(nodesAndLines.nodes,nodesAndLines.lines);
                                dataOfTiles.push(data);
                                resolve2();
                            });
                        }).catch((error)=>console.warn(error))})
            );
        });

        let fromDatabase = new MapDataBase();
        promises.push(
            loadOsmTestData()
                .then((data)=>{parseToJson(data)
                    .then((json)=>{getMappedElements(json)
                        .then((elements)=>{filterHighwayData(elements)
                            .then((highwayData)=>{
                                OSMIntegration.initMapDataBase(fromDatabase,highwayData.nodes,highwayData.ways,highwayData.relations);
                            })})})})
        );

        Promise.all(promises).then(()=>{
            for(let i=1;i<dataOfTiles.length;i+=10){
                let mapDatabase = new MapDataBase();
                for(let j=0;j<i;j++){
                    mapDatabase.addData(dataOfTiles[j].lines,dataOfTiles[j].nodes);
                }
                let result = _fromOneToOther(fromDatabase,mapDatabase,decoderProperties,(fromDataBase,id)=>{return LineEncoder.encode(fromDataBase,[fromDataBase.lines[id]],0,0);},false);
                console.log("Database lines:",Object.keys(mapDatabase.lines).length);
                console.log("Amount of tiles:",i,"Mean decode time:",result.meanDecodeTime,"EncodedLines:",result.encodedLocations,"DecodedLines:",result.decodedLines);
            }
            resolve();
        });
    });
}

test.skip('decode speed impact by database size manual cache diff',(done)=>{
    testDecodeInTilesDiffManualCache(decoderProperties).then(()=>{
        console.log("completed");
        done();
    });
},120000);

test.skip('wegenregister density',(done)=>{
    loadNodesLineStringsWegenregisterAntwerpen().then(features => {
        let wegenregisterMapDataBase = new MapDataBase();
        WegenregisterAntwerpenIntegration.initMapDataBase(wegenregisterMapDataBase,features);
        let minLat;
        let minLong;
        let maxLat;
        let maxLong;
        for(let key in wegenregisterMapDataBase.nodes){
            if(wegenregisterMapDataBase.nodes.hasOwnProperty(key)){
                if(minLat === undefined || wegenregisterMapDataBase.nodes[key].getLatitudeDeg() < minLat){
                    minLat = wegenregisterMapDataBase.nodes[key].getLatitudeDeg();
                }
                if(minLong === undefined || wegenregisterMapDataBase.nodes[key].getLongitudeDeg() < minLong){
                    minLong = wegenregisterMapDataBase.nodes[key].getLongitudeDeg();
                }
                if(maxLat === undefined || wegenregisterMapDataBase.nodes[key].getLatitudeDeg() > maxLat){
                    maxLat = wegenregisterMapDataBase.nodes[key].getLatitudeDeg();
                }
                if(maxLong === undefined || wegenregisterMapDataBase.nodes[key].getLongitudeDeg() > maxLong){
                    maxLong = wegenregisterMapDataBase.nodes[key].getLongitudeDeg();
                }
            }
        }
        console.log(getTileXYForLocation(minLat,minLong,14),getTileXYForLocation(maxLat,maxLong,14));
        console.log("Database lines:",Object.keys(wegenregisterMapDataBase.lines).length,"Database nodes:",Object.keys(wegenregisterMapDataBase.nodes).length);
        done();
    });
},120000);
