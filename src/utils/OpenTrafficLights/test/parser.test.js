import {downloadOpenTrafficLightsTestData} from "../data";
import {getLaneDefs, parseAndStoreQuads} from "../parser";
import linestringToLatLng from "../linestringToLatLng";
import RoutableTilesIntegration from "../../Integration/OpenLRIntegration/RoutableTilesIntegration";
import {getRoutableTilesNodesAndLines} from "../../Integration/Data/ParseData";
import {fetchRoutableTile} from "../../Integration/Data/LoadData";
import MapDataBase from "../../Integration/OpenLR/map/MapDataBase";
import Node from "../../Integration/OpenLR/map/Node";
import Line from "../../Integration/OpenLR/map/Line";
import {LinesDirectlyToLRPs} from "../../Integration/OpenLR/experimental/LinesDirectlyToLRPs";
import OpenLRDecoder from "../../Integration/OpenLR/Decoder";
import {decoderProperties} from "../../Integration/OpenLR/coder/CoderSettings";

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

test('getLaneDefs linesDirectlyToLRPs',async (done)=>{
    expect.assertions(2);
    let parsed = await new Promise(resolve => {
        downloadOpenTrafficLightsTestData().then(data=>{
            parseAndStoreQuads(data).then((store)=>{
                getLaneDefs(store).then((lanes)=>{
                    let parsed = {};
                    for(let key in lanes){
                        if(lanes.hasOwnProperty(key)){
                            parsed[key] = linestringToLatLng(lanes[key]);
                        }
                    }
                    resolve(parsed);
                });
            })
        });
    });
    expect(parsed).toBeDefined();
    let linesDirectlyToLRPs = [];
    for(let key in parsed){
        if(parsed.hasOwnProperty(key)){
            let nodes = [];
            let lines = [];
            nodes.push(new Node(0,parsed[key][0][0],parsed[key][0][1]));
            for(let i=1;i<parsed[key].length;i++){
                nodes.push(new Node(i,parsed[key][i][0],parsed[key][i][1]));
                lines.push(new Line(i,nodes[i-1],nodes[i]));
            }
            linesDirectlyToLRPs.push({
                lane: key,
                LRP: LinesDirectlyToLRPs(lines)
            })
        }
    }
    console.log(linesDirectlyToLRPs);
    expect(linesDirectlyToLRPs.length).toEqual(11);
    done();
});

test('getLaneDefs linesDirectlyToLRPs decode to RoutableTiles',async (done)=>{
    expect.assertions(4);
    let mapDataBase = await new Promise(resolve => {
        fetchRoutableTile(14,8392,5469)
            .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                .then((nodesAndLines)=> {
                    let mapDatabase = new MapDataBase();
                    RoutableTilesIntegration.initMapDataBase(mapDatabase, nodesAndLines.nodes,nodesAndLines.lines);
                    resolve(mapDatabase);
                })});
    });
    await new Promise(resolve => {
        fetchRoutableTile(14,8391,5469)
            .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                .then((nodesAndLines)=> {
                    let nodesLines = RoutableTilesIntegration.getNodesLines(nodesAndLines.nodes,nodesAndLines.lines);
                    mapDataBase.addData(nodesLines.lines,nodesLines.nodes);
                    resolve(true);
                })});
    });
    let parsed = await new Promise(resolve => {
        downloadOpenTrafficLightsTestData().then(data=>{
            parseAndStoreQuads(data).then((store)=>{
                getLaneDefs(store).then((lanes)=>{
                    let parsed = {};
                    for(let key in lanes){
                        if(lanes.hasOwnProperty(key)){
                            parsed[key] = linestringToLatLng(lanes[key]);
                        }
                    }
                    resolve(parsed);
                });
            })
        });
    });
    expect(mapDataBase).toBeDefined();
    expect(parsed).toBeDefined();
    let linesDirectlyToLRPs = [];
    for(let key in parsed){
        if(parsed.hasOwnProperty(key)){
            let nodes = [];
            let lines = [];
            nodes.push(new Node(0,parsed[key][0][0],parsed[key][0][1]));
            for(let i=1;i<parsed[key].length;i++){
                nodes.push(new Node(i,parsed[key][i][0],parsed[key][i][1]));
                lines.push(new Line(i,nodes[i-1],nodes[i]));
            }
            linesDirectlyToLRPs.push({
                lane: key,
                LRP: LinesDirectlyToLRPs(lines)
            })
        }
    }
    expect(linesDirectlyToLRPs.length).toEqual(11);

    let decodedLanes = [];
    linesDirectlyToLRPs.forEach(line=>{
        let decoded = OpenLRDecoder.decode(line.LRP,mapDataBase,decoderProperties);
        decodedLanes.push({
            lane: line.lane,
            linesInRoutableTiles: decoded.lines,
            posOffset: decoded.posOffset,
            negOffset: decoded.negOffset
        });
    });
    expect(decodedLanes.length).toEqual(11);

    console.log(decodedLanes[0]);
    console.log(parsed[decodedLanes[0].lane]);

    done();
});