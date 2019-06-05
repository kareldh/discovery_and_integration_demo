import {generateRealisticLengthTestNetwork, mapNodesLinesToID} from "./Helperfunctions";
import MapDataBase from "../map/MapDataBase";
import LineEncoder from "../coder/LineEncoder";
import LineDecoder from "../coder/LineDecoder";

test('decoder 4 LRPs no offsets perfect candidates',()=>{
    let decoderProperties = {
        dist: 35,    //maximum distance of a candidate node to a LRP
        bearDiff: 60, //maximum difference between the bearing of a candidate node and that of a LRP
        frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
        lfrcnpDiff: 2, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
        distanceToNextDiff: 100, //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
        alwaysUseProjections: false,
        useFrcFow: true,
        distMultiplier: 40,
        frcMultiplier: 10,
        fowMultiplier: 20,
        bearMultiplier: 30,
        maxSPSearchRetries: 50
    };
    let network = generateRealisticLengthTestNetwork();
    let data = mapNodesLinesToID(network.nodes,network.lines);
    let mapDataBase = new MapDataBase(data.lines,data.nodes);
    let lines = [network.lines[26],network.lines[7],network.lines[19],network.lines[23]];
    let LRPs = LineEncoder.encode(mapDataBase,lines,0,0);
    let decoded = LineDecoder.decode(mapDataBase,LRPs.LRPs,LRPs.posOffset,LRPs.negOffset,decoderProperties);
    expect(decoded.lines.length).toEqual(lines.length);
    expect(decoded.lines[0].getID()).toEqual(network.lines[26].getID());
    expect(decoded.lines[1].getID()).toEqual(network.lines[7].getID());
    expect(decoded.lines[2].getID()).toEqual(network.lines[19].getID());
    expect(decoded.lines[3].getID()).toEqual(network.lines[23].getID());
    expect(decoded.negOffset).toEqual(0);
    expect(decoded.posOffset).toEqual(0);
});

test('findCandidatesOrProjections 4 LRPs no offsets perfect candidates',()=>{
    let decoderProperties = {
        dist: 50,    //maximum distance of a candidate node to a LRP
        bearDiff: 15, //maximum difference between the bearing of a candidate node and that of a LRP
        frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
        lfrcnpDiff: 2, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
        distanceToNextDiff: 100, //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
        alwaysUseProjections: false,
        useFrcFow: true,
        distMultiplier: 40,
        frcMultiplier: 10,
        fowMultiplier: 20,
        bearMultiplier: 30,
        maxSPSearchRetries: 50
    };
    let network = generateRealisticLengthTestNetwork();
    let data = mapNodesLinesToID(network.nodes,network.lines);
    let mapDataBase = new MapDataBase(data.lines,data.nodes);
    let LRPs = LineEncoder.encode(mapDataBase,[network.lines[26],network.lines[7],network.lines[19],network.lines[23]],0,0);
    let candidates = LineDecoder.findCandidatesOrProjections(mapDataBase,LRPs.LRPs,decoderProperties);
    expect(candidates[0].length).toEqual(1);
    expect(candidates[0][0].node.getID()).toEqual(network.nodes[8].getID());
    expect(candidates[0][0].dist).toEqual(0);
    expect(candidates[1].length).toEqual(1);
    expect(candidates[1][0].node.getID()).toEqual(network.nodes[7].getID());
    expect(candidates[1][0].dist).toEqual(0);
    expect(candidates[2].length).toEqual(1);
    expect(candidates[2][0].node.getID()).toEqual(network.nodes[6].getID());
    expect(candidates[2][0].dist).toEqual(0);
    expect(candidates[3].length).toEqual(1);
    expect(candidates[3][0].node.getID()).toEqual(network.nodes[5].getID());
    expect(candidates[3][0].dist).toEqual(0);
});

test('rateCandidateLine 4 LRPs no offsets perfect candidates',()=>{
    let decoderProperties = {
        dist: 50,    //maximum distance of a candidate node to a LRP
        bearDiff: 15, //maximum difference between the bearing of a candidate node and that of a LRP
        frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
        lfrcnpDiff: 2, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
        distanceToNextDiff: 100, //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
        alwaysUseProjections: false,
        useFrcFow: true,
        distMultiplier: 40,
        frcMultiplier: 10,
        fowMultiplier: 20,
        bearMultiplier: 30,
        maxSPSearchRetries: 50
    };
    let network = generateRealisticLengthTestNetwork();
    let data = mapNodesLinesToID(network.nodes,network.lines);
    let mapDataBase = new MapDataBase(data.lines,data.nodes);
    let LRPs = LineEncoder.encode(mapDataBase,[network.lines[26],network.lines[7],network.lines[19],network.lines[23]],0,0);
    let rating = LineDecoder.rateCandidateLine({
        line: network.lines[26],
        bearDiff: 20,
        frcDiff: 1,
        lrpIndex: 0,
        projected: false,
        rating: undefined
    },network.nodes[8].getDistance(LRPs.LRPs[0].lat,LRPs.LRPs[0].long),LRPs.LRPs[0],decoderProperties);
    expect(rating).not.toEqual(0);
    expect(rating).toBeDefined();
    expect(rating).not.toBeNaN();
    console.log(rating); //todo, wat moet dit precies uitkomen
});

test('findCandidateLines 4 LRPs no offsets extended perfect candidates',()=>{
    let decoderProperties = {
        dist: 50,    //maximum distance of a candidate node to a LRP
        bearDiff: 15, //maximum difference between the bearing of a candidate node and that of a LRP
        frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
        lfrcnpDiff: 2, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
        distanceToNextDiff: 100, //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
        alwaysUseProjections: false,
        useFrcFow: true,
        distMultiplier: 40,
        frcMultiplier: 10,
        fowMultiplier: 20,
        bearMultiplier: 30,
        maxSPSearchRetries: 50
    };
    let network = generateRealisticLengthTestNetwork();
    let data = mapNodesLinesToID(network.nodes,network.lines);
    let mapDataBase = new MapDataBase(data.lines,data.nodes);
    let LRPs = LineEncoder.encode(mapDataBase,[network.lines[26],network.lines[7],network.lines[19],network.lines[23]],0,0);
    let candidateNodes = [[{node: network.nodes[8], dist: 0}], [{node: network.nodes[7], dist: 0}], [{node: network.nodes[6], dist: 0}], [{node: network.nodes[5], dist: 0}]];
    let candidateLines = LineDecoder.findCandidateLines(LRPs.LRPs,candidateNodes,decoderProperties);
    expect(candidateLines[0].length).toEqual(1);
    expect(candidateLines[0][0].line.getID()).toEqual(network.lines[9].getID());
    expect(candidateLines[0][0].bearDiff).toEqual(0);
    expect(candidateLines[0][0].projected).toEqual(false);
    expect(candidateLines[0][0].lrpIndex).toEqual(0);
    expect(candidateLines[0][0].frcDiff).toEqual(0);
    expect(candidateLines[1].length).toEqual(1);
    expect(candidateLines[1][0].line.getID()).toEqual(network.lines[7].getID());
    expect(candidateLines[1][0].bearDiff).toEqual(0);
    expect(candidateLines[1][0].projected).toEqual(false);
    expect(candidateLines[1][0].lrpIndex).toEqual(1);
    expect(candidateLines[1][0].frcDiff).toEqual(0);
    expect(candidateLines[2].length).toEqual(1);
    expect(candidateLines[2][0].line.getID()).toEqual(network.lines[19].getID());
    expect(candidateLines[2][0].bearDiff).toEqual(0);
    expect(candidateLines[2][0].projected).toEqual(false);
    expect(candidateLines[2][0].lrpIndex).toEqual(2);
    expect(candidateLines[2][0].frcDiff).toEqual(0);
    expect(candidateLines[3].length).toEqual(1);
    expect(candidateLines[3][0].line.getID()).toEqual(network.lines[5].getID());
    expect(candidateLines[3][0].bearDiff).toEqual(0);
    expect(candidateLines[3][0].projected).toEqual(false);
    expect(candidateLines[3][0].lrpIndex).toEqual(3);
    expect(candidateLines[3][0].frcDiff).toEqual(0);
});
