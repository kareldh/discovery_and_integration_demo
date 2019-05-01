import MapDataBase from "../../OpenLR/map/MapDataBase";
import RoutableTilesIntegration from "../RoutableTilesIntegration";
import {fetchRoutableTile, getRoutableTilesNodesAndLines} from "../../../data/api";
import LineEncoder from "../../OpenLR/coder/LineEncoder";

test("initMapDatabase",(done)=>{
    expect.assertions(3);
    fetchRoutableTile(14,8392,5469)
        .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
            .then((nodesAndLines)=> {
                let mapDatabase = new MapDataBase();
                RoutableTilesIntegration.initMapDataBase(mapDatabase, nodesAndLines.nodes,nodesAndLines.lines);
                expect(mapDatabase).toBeDefined();
                expect(mapDatabase.lines).not.toEqual({});
                expect(mapDatabase.nodes).not.toEqual({});
                done();
            })});
});

test("adjustToValidStartEnd way on loop without junctions, so infinite expansion would occur if not taken care of in code",(done)=>{
    expect.assertions(2);
    fetchRoutableTile(14,8392,5469)
        .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
            .then((nodesAndLines)=> {
                let mapDatabase = new MapDataBase();
                RoutableTilesIntegration.initMapDataBase(mapDatabase, nodesAndLines.nodes,nodesAndLines.lines);
                let expanded = LineEncoder.adjustToValidStartEnd(mapDatabase,[mapDatabase.lines["http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/4691959557"]],{posOffset:0,negOffset:0});
                expect(expanded.front).toEqual(0);
                expect(expanded.back).toEqual(0);
                done();
            })});
});

test("encode way on loop without junctions, so infinite expansion would occur if not taken care of in code",(done)=>{
    expect.assertions(4);
    fetchRoutableTile(14,8392,5469)
        .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
            .then((nodesAndLines)=> {
                let mapDatabase = new MapDataBase();
                RoutableTilesIntegration.initMapDataBase(mapDatabase, nodesAndLines.nodes,nodesAndLines.lines);
                let encoded = LineEncoder.encode(mapDatabase,[mapDatabase.lines["http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/4691959557"]],0,0);
                expect(encoded).toBeDefined();
                expect(encoded.LRPs.length).toEqual(2);
                expect(encoded.posOffset).toEqual(0);
                expect(encoded.negOffset).toEqual(0);
                done();
            })});
});