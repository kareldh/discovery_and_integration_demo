import MapDataBase from "../../OpenLR/map/MapDataBase";
import RoutableTilesIntegration from "../RoutableTilesIntegration";
import {getRoutableTilesNodesAndLines} from "../../Data/ParseData";
import LineEncoder from "../../OpenLR/coder/LineEncoder";
import Line from "../../OpenLR/map/Line";
import Node from "../../OpenLR/map/Node";
import {LinesDirectlyToLRPs} from "../../OpenLR/experimental/LinesDirectlyToLRPs";
import OpenLRDecoder from "../../OpenLR/Decoder";
import {fetchRoutableTile} from "../../Data/LoadData";
import {decoderProperties} from "../../OpenLR/coder/CoderSettings";
import {fowEnum, frcEnum} from "../../OpenLR/map/Enum";

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

test("encode way at the edge of a tile, so that it's closest junction (=valid node) has one of it's roads missing and isn't valid anymore",(done)=>{
    expect.assertions(4);
    fetchRoutableTile(14,8392,5469)
        .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
            .then((nodesAndLines)=> {
                let mapDatabase = new MapDataBase();
                RoutableTilesIntegration.initMapDataBase(mapDatabase, nodesAndLines.nodes,nodesAndLines.lines);
                let encoded = LineEncoder.encode(mapDatabase,[mapDatabase.lines["http://www.openstreetmap.org/way/25380916_http://www.openstreetmap.org/node/276645317"]],0,0);
                expect(encoded).toBeDefined();
                expect(encoded.LRPs.length).toEqual(2);
                expect(encoded.posOffset).not.toEqual(0);
                expect(encoded.negOffset).not.toEqual(0);
                done();
            })});
});

test("encode way at the edge of a tile, so that it's closest junction (=valid node) has one of it's roads only present in the adjecent tile",(done)=>{
    expect.assertions(9);
    let mapDataBase = new MapDataBase();
    let promises = [
        fetchRoutableTile(14,8392,5469)
            .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                .then((nodesAndLines)=> {
                    let r = RoutableTilesIntegration.getNodesLines(nodesAndLines.nodes,nodesAndLines.lines);
                    mapDataBase.addData(r.lines,r.nodes);
                })}),
        fetchRoutableTile(14,8391,5469)
            .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                .then((nodesAndLines)=> {
                    let r = RoutableTilesIntegration.getNodesLines(nodesAndLines.nodes,nodesAndLines.lines);
                    mapDataBase.addData(r.lines,r.nodes);
                })}),
    ];
    Promise.all(promises).then(()=>{
        expect(mapDataBase).toBeDefined();
        // console.log(mapDataBase.lines["http://www.openstreetmap.org/way/25380916_http://www.openstreetmap.org/node/276645317"]);
        // console.log(mapDataBase.nodes["http://www.openstreetmap.org/node/5982844531"]);
        expect(mapDataBase.nodes["http://www.openstreetmap.org/node/5982844531"].getIncomingLines().length).toEqual(3);
        expect(mapDataBase.nodes["http://www.openstreetmap.org/node/5982844531"].getOutgoingLines().length).toEqual(3);
        let encoded = LineEncoder.encode(mapDataBase,[mapDataBase.lines["http://www.openstreetmap.org/way/25380916_http://www.openstreetmap.org/node/276645317"]],0,0);
        expect(encoded).toBeDefined();
        expect(encoded.LRPs.length).toEqual(2);
        expect(encoded.LRPs[1].lat).toEqual(Number(Math.round(mapDataBase.nodes["http://www.openstreetmap.org/node/5982844531"].getLatitudeDeg()+'e5')+'e-5'));
        expect(encoded.LRPs[1].long).toEqual(Number(Math.round(mapDataBase.nodes["http://www.openstreetmap.org/node/5982844531"].getLongitudeDeg()+'e5')+'e-5'));
        expect(encoded.posOffset).not.toEqual(0);
        expect(encoded.negOffset).toEqual(0);
        done();
    });
});

test("decode impact of FRC/FOW",(done)=>{
    expect.assertions(23);

    let locationDefaultDecodedToRoad = {
        LRPs: [
            {
                bearing: 170,
                distanceToNext: 87,
                fow: 0,
                frc: 7,
                isLast: false,
                lat: 51.2122,
                lfrcnp: 7,
                long: 4.40748,
                seqNr: 1
            },
            {
                bearing: 352,
                distanceToNext: 0,
                fow: 0,
                frc: 7,
                isLast: true,
                lat: 51.21142,
                lfrcnp: 7,
                long: 4.40767,
                seqNr: 2
            }
        ],
        negOffset: 0,
        posOffset: 0,
        type: 1
    };

    let locationDefaultDecodedToFoot = {
        LRPs: [
            {
                bearing: 170,
                distanceToNext: 87,
                fow: 0,
                frc: 7,
                isLast: false,
                lat: 51.21211,
                lfrcnp: 7,
                long: 4.40749,
                seqNr: 1
            },
            {
                bearing: 352,
                distanceToNext: 0,
                fow: 0,
                frc: 7,
                isLast: true,
                lat: 51.21147,
                lfrcnp: 7,
                long: 4.40766,
                seqNr: 2
            }
        ],
        negOffset: 0,
        posOffset: 0,
        type: 1
    };

    let expectedIdsRoad = ["http://www.openstreetmap.org/way/178553514_http://www.openstreetmap.org/node/1635567707","http://www.openstreetmap.org/way/8414722_http://www.openstreetmap.org/node/27306720"];
    let expectedIdsFoot = ["http://www.openstreetmap.org/way/178553520_http://www.openstreetmap.org/node/1888840697","http://www.openstreetmap.org/way/178553520_http://www.openstreetmap.org/node/1888840692"];

    let decoderProp = {};
    for(let k in decoderProperties){
        if(decoderProperties.hasOwnProperty(k)){
            decoderProp[k] = decoderProperties[k];
        }
    }

    let mapDataBase = new MapDataBase();
    let promises = [
        fetchRoutableTile(14,8392,5469)
            .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                .then((nodesAndLines)=> {
                    let r = RoutableTilesIntegration.getNodesLines(nodesAndLines.nodes,nodesAndLines.lines);
                    mapDataBase.addData(r.lines,r.nodes);
                })})
    ];
    Promise.all(promises).then(()=>{
        // defaults to road (if frcMultiplier 10 and fowMultiplier 20)
        locationDefaultDecodedToRoad.LRPs[0].frc = frcEnum.FRC_4;
        locationDefaultDecodedToRoad.LRPs[0].fow = fowEnum.SINGLE_CARRIAGEWAY;
        locationDefaultDecodedToRoad.LRPs[1].frc = frcEnum.FRC_4;
        locationDefaultDecodedToRoad.LRPs[1].fow = fowEnum.SINGLE_CARRIAGEWAY;

        let decoded = OpenLRDecoder.decode(locationDefaultDecodedToRoad,mapDataBase,decoderProp);
        expect(decoded).toBeDefined();
        console.log(decoded);
        expect(decoded.lines.length).toEqual(2);
        expect(decoded.lines[0].getID()).toEqual(expectedIdsRoad[0]);
        expect(decoded.lines[1].getID()).toEqual(expectedIdsRoad[1]);
        expect(isNaN(decoded.posOffset)).not.toBeTruthy();
        expect(isNaN(decoded.negOffset)).not.toBeTruthy();

        //defaulted to road, should now be foot
        locationDefaultDecodedToRoad.LRPs[0].frc = frcEnum.FRC_5;
        locationDefaultDecodedToRoad.LRPs[0].fow = fowEnum.OTHER;
        locationDefaultDecodedToRoad.LRPs[1].frc = frcEnum.FRC_5;
        locationDefaultDecodedToRoad.LRPs[1].fow = fowEnum.OTHER;

        decoderProp.frcMultiplier = 35;
        decoderProp.fowMultiplier = 40;
        let decoded2 = OpenLRDecoder.decode(locationDefaultDecodedToRoad,mapDataBase,decoderProp);
        expect(decoded2).toBeDefined();
        console.log(decoded2);
        expect(decoded2.lines.length).toEqual(3);
        expect(decoded2.lines[1].getID()).toEqual(expectedIdsFoot[0]);
        expect(decoded2.lines[2].getID()).toEqual(expectedIdsFoot[1]);
        expect(isNaN(decoded2.posOffset)).not.toBeTruthy();
        expect(isNaN(decoded2.negOffset)).not.toBeTruthy();

        //defaulted to foot
        decoderProp.frcMultiplier = 35;
        decoderProp.fowMultiplier = 40;
        let decoded3 = OpenLRDecoder.decode(locationDefaultDecodedToFoot,mapDataBase,decoderProp);
        expect(decoded3).toBeDefined();
        console.log(decoded3);
        expect(decoded3.lines.length).toEqual(2);
        expect(decoded3.lines[0].getID()).toEqual(expectedIdsFoot[0]);
        expect(decoded3.lines[1].getID()).toEqual(expectedIdsFoot[1]);
        expect(isNaN(decoded3.posOffset)).not.toBeTruthy();
        expect(isNaN(decoded3.negOffset)).not.toBeTruthy();

        //defaulted to foot, should now be road
        locationDefaultDecodedToFoot.LRPs[0].frc = frcEnum.FRC_4;
        locationDefaultDecodedToFoot.LRPs[0].fow = fowEnum.SINGLE_CARRIAGEWAY;
        locationDefaultDecodedToFoot.LRPs[1].frc = frcEnum.FRC_4;
        locationDefaultDecodedToFoot.LRPs[1].fow = fowEnum.SINGLE_CARRIAGEWAY;

        decoderProp.frcMultiplier = 35;
        decoderProp.fowMultiplier = 40;
        let decoded4 = OpenLRDecoder.decode(locationDefaultDecodedToFoot,mapDataBase,decoderProp);
        expect(decoded4).toBeDefined();
        console.log(decoded4);
        expect(decoded4.lines.length).toEqual(1);
        expect(decoded4.lines[0].getID()).toEqual(expectedIdsRoad[1]);
        expect(isNaN(decoded4.posOffset)).not.toBeTruthy();
        expect(isNaN(decoded4.negOffset)).not.toBeTruthy();
        done();
    });

});