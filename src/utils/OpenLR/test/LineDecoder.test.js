import {generateRealisticLengthTestNetwork,mapNodesLinesToID} from "./Helperfunctions";
import MapDataBase from "../map/MapDataBase";
import LineEncoder from "../coder/LineEncoder";
import LineDecoder from "../coder/LineDecoder";

test('decoder 4 LRPs no offsets perfect candidates',()=>{
    let network = generateRealisticLengthTestNetwork();
    let data = mapNodesLinesToID(network.nodes,network.lines);
    let mapDataBase = new MapDataBase(data.lines,data.nodes);
    let lines = [network.lines[26],network.lines[7],network.lines[19],network.lines[23]];
    let LRPs = LineEncoder.encode(mapDataBase,lines,0,0);
    let decoded = LineDecoder.decode(mapDataBase,LRPs.LRPs,LRPs.posOffset,LRPs.negOffset);
    expect(decoded.lines).toEqual(lines);
    expect(decoded.negOffset).toEqual(0);
    expect(decoded.posOffset).toEqual(0);
});

test('findCandidatesOrProjections 4 LRPs no offsets perfect candidates',()=>{
    let network = generateRealisticLengthTestNetwork();
    let data = mapNodesLinesToID(network.nodes,network.lines);
    let mapDataBase = new MapDataBase(data.lines,data.nodes);
    let LRPs = LineEncoder.encode(mapDataBase,[network.lines[26],network.lines[7],network.lines[19],network.lines[23]],0,0);
    let candidates = LineDecoder.findCandidatesOrProjections(mapDataBase,LRPs.LRPs);
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

test('testCandidateLine 4 LRPs no offsets perfect candidates',()=>{
    let network = generateRealisticLengthTestNetwork();
    let data = mapNodesLinesToID(network.nodes,network.lines);
    let mapDataBase = new MapDataBase(data.lines,data.nodes);
    let LRPs = LineEncoder.encode(mapDataBase,[network.lines[26],network.lines[7],network.lines[19],network.lines[23]],0,0);
    let candidateNodes = [[{node: network.nodes[8], dist: 0}], [{node: network.nodes[7], dist: 0}], [{node: network.nodes[6], dist: 0}], [{node: network.nodes[5], dist: 0}]];
    let candidateLines = LineDecoder.findCandidateLines(LRPs.LRPs,candidateNodes);
});

test('findCandidateLines 4 LRPs no offsets perfect candidates',()=>{
    let network = generateRealisticLengthTestNetwork();
    let data = mapNodesLinesToID(network.nodes,network.lines);
    let mapDataBase = new MapDataBase(data.lines,data.nodes);
    let LRPs = LineEncoder.encode(mapDataBase,[network.lines[26],network.lines[7],network.lines[19],network.lines[23]],0,0);
    let candidateNodes = [[{node: network.nodes[8], dist: 0}], [{node: network.nodes[7], dist: 0}], [{node: network.nodes[6], dist: 0}], [{node: network.nodes[5], dist: 0}]];
    let candidateLines = LineDecoder.findCandidateLines(LRPs.LRPs,candidateNodes);
    console.log(candidateLines[0]);
    expect(candidateLines[0].length).toEqual(1);
    expect(candidateLines[0][0].line.getID()).toEqual(network.lines[9].getID());
    expect(candidateLines[0][0].bearDiff).toEqual(0);
    expect(candidateLines[0][0].projected).toEqual(false);
    expect(candidateLines[0][0].lrpIndex).toEqual(0);
    expect(candidateLines[0][0].frcDiff).toEqual(undefined);
    expect(candidateLines[1].length).toEqual(1);
    expect(candidateLines[1][0].node.getID()).toEqual(network.lines[7].getID());
    expect(candidateLines[1][0].bearDiff).toEqual(0);
    expect(candidateLines[1][0].projected).toEqual(false);
    expect(candidateLines[1][0].lrpIndex).toEqual(0);
    expect(candidateLines[1][0].frcDiff).toEqual(undefined);
    expect(candidateLines[2].length).toEqual(1);
    expect(candidateLines[2][0].node.getID()).toEqual(network.lines[19].getID());
    expect(candidateLines[2][0].bearDiff).toEqual(0);
    expect(candidateLines[2][0].projected).toEqual(false);
    expect(candidateLines[2][0].lrpIndex).toEqual(0);
    expect(candidateLines[2][0].frcDiff).toEqual(undefined);
    expect(candidateLines[3].length).toEqual(1);
    expect(candidateLines[3][0].node.getID()).toEqual(network.lines[5].getID());
    expect(candidateLines[3][0].bearDiff).toEqual(0);
    expect(candidateLines[3][0].projected).toEqual(false);
    expect(candidateLines[3][0].lrpIndex).toEqual(0);
    expect(candidateLines[3][0].frcDiff).toEqual(undefined);
});