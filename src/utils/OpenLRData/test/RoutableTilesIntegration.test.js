import MapDataBase from "../../OpenLR/map/MapDataBase";
import RoutableTilesIntegration from "../RoutableTilesIntegration";
import {fetchRoutableTile, getRoutableTilesNodesAndLines} from "../../../data/api";
import LineEncoder from "../../OpenLR/coder/LineEncoder";
import Line from "../../OpenLR/map/Line";
import Node from "../../OpenLR/map/Node";
import {LinesDirectlyToLRPs} from "../../OpenLR/experimental/LinesDirectlyToLRPs";
import OpenLRDecoder from "../../OpenLR/Decoder";

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

test("encode way made of direct LRPs made via LinesDirectlyToLRP",(done)=>{
    expect.assertions(3);

    let decoderProperties = {
        dist: 10,    //maximum distance (in meter) of a candidate node to a LRP
        bearDiff: 60, //maximum difference (in degrees) between the bearing of a candidate node and that of a LRP
        frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
        lfrcnpDiff: 3, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
        distanceToNextDiff: 10, //maximum difference (in meter) between the found distance between 2 LRPs and the given distanceToNext of the first LRP
        alwaysUseProjections: false,
        distMultiplier: 40,
        frcMultiplier: 10,
        fowMultiplier: 20,
        bearMultiplier: 30,
        maxSPSearchRetries: 50
    };
    fetchRoutableTile(14,8392,5469)
        .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
            .then((nodesAndLines)=> {
                let mapDatabase = new MapDataBase();
                RoutableTilesIntegration.initMapDataBase(mapDatabase, nodesAndLines.nodes,nodesAndLines.lines);
                let n1 = new Node("51.21179671373275_4.399219751358033",51.21179671373275,4.399219751358033);
                let n2 = new Node("51.21178999272439_4.3991339206695566",51.21178999272439,4.3991339206695566);
                let n3 = new Node("51.21180007423658_4.39905881881714",51.21180007423658,4.39905881881714);
                let n4 = new Node("51.21182023725436_4.398962259292603",51.21182023725436,4.398962259292603);
                let n5 = new Node("51.21183703976241_4.398828148841859",51.21183703976241,4.398828148841859);
                let n6 = new Node("51.21186056326341_4.398618936538697",51.21186056326341,4.398618936538697);
                let n7 = new Node("51.212045390353026_4.397251009941102",51.212045390353026,4.397251009941102);
                let l1 = new Line("51.21179671373275_4.399219751358033_51.21178999272439_4.3991339206695566",n1,n2);
                let l2 = new Line("51.21178999272439_4.3991339206695566_51.21180007423658_4.39905881881714",n2,n3);
                let l3 = new Line("51.21180007423658_4.39905881881714_51.21182023725436_4.398962259292603",n3,n4);
                let l4 = new Line("51.21182023725436_4.398962259292603_51.21183703976241_4.398828148841859",n4,n5);
                let l5 = new Line("51.21183703976241_4.398828148841859_51.21186056326341_4.398618936538697",n5,n6);
                let l6 = new Line("51.21186056326341_4.398618936538697_51.212045390353026_4.397251009941102",n6,n7);
                let lines = [l1,l2,l3,l4,l5,l6];
                let location = LinesDirectlyToLRPs(lines);

                let decoded = OpenLRDecoder.decode(location,mapDatabase,decoderProperties);
                expect(decoded).toBeDefined();
                expect(decoded.lines.length).toEqual(1);
                expect(decoded.lines[0].getID()).toEqual("http://www.openstreetmap.org/way/4579317_http://www.openstreetmap.org/node/28929725");
                done();
            })});
});