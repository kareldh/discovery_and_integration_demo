import MapDataBase from "../map/MapDataBase";
import {
    generateRealisticLengthTestNetwork, generateStraightLaneTestData, generateTestNetwork,
    mapNodesLinesToID
} from "./Helperfunctions";
import LineEncoder from "../coder/LineEncoder";
import Line from "../map/Line";
import Node from "../map/Node";
import Location from "../coder/Location";
import Encoder from "../Encoder";
import {locationTypeEnum} from "../map/Enum";
import {BinaryEncoder, BinaryDecoder, Serializer, LocationReference} from 'openlr-js';

test('encode doesn\'t crash with lane existing of single line',()=>{
    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.singleLineLane.locationLines;
    let encoded = LineEncoder.encode(mapDataBase,locLines,0,0);
    expect(encoded.LRPs.length).toEqual(2);
});

test('encode doesn\'t crash with lane existing of two lines',()=>{
    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.doubleLineLane.locationLines;
    let encoded = LineEncoder.encode(mapDataBase,locLines,0,0);
    expect(encoded.LRPs.length).toEqual(2);
});

test('encode doesn\'t crash with lane existing of two lines and valid offsets',()=>{
    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.doubleLineLane.locationLines;
    let encoded = LineEncoder.encode(mapDataBase,locLines,10,5);
    expect(encoded.LRPs.length).toEqual(2);
});

test('encode doesn\'t crash with lane existing of two lines and invalid offsets',()=>{
    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.doubleLineLane.locationLines;
    let encoded = LineEncoder.encode(mapDataBase,locLines,5,10);
    expect(encoded.LRPs.length).toEqual(2);
});

test('encode 4 lines no offsets no expansions',()=>{
    let network = generateRealisticLengthTestNetwork();
    let data = mapNodesLinesToID(network.nodes,network.lines);
    let mapDataBase = new MapDataBase(data.lines,data.nodes);
    let LRPs = LineEncoder.encode(mapDataBase,[network.lines[9],network.lines[26],network.lines[7],network.lines[19],network.lines[23],network.lines[5]],0,0);
    expect(LRPs.LRPs.length).toEqual(4);
    expect(LRPs.LRPs[0].lat).toEqual(network.lines[9].getStartNode().getLatitudeDeg());
    expect(LRPs.LRPs[0].long).toEqual(network.lines[9].getStartNode().getLongitudeDeg());
    expect(LRPs.LRPs[0].distanceToNext).toEqual(network.lines[9].getLength()+network.lines[26].getLength());
    expect(LRPs.LRPs[1].lat).toEqual(network.lines[7].getStartNode().getLatitudeDeg());
    expect(LRPs.LRPs[1].long).toEqual(network.lines[7].getStartNode().getLongitudeDeg());
    expect(LRPs.LRPs[1].distanceToNext).toEqual(network.lines[7].getLength());
    expect(LRPs.LRPs[2].lat).toEqual(network.lines[19].getStartNode().getLatitudeDeg());
    expect(LRPs.LRPs[2].long).toEqual(network.lines[19].getStartNode().getLongitudeDeg());
    expect(LRPs.LRPs[2].distanceToNext).toEqual(network.lines[19].getLength()+network.lines[23].getLength()+network.lines[5].getLength());
    expect(LRPs.LRPs[3].lat).toEqual(network.lines[5].getEndNode().getLatitudeDeg());
    expect(LRPs.LRPs[3].long).toEqual(network.lines[5].getEndNode().getLongitudeDeg());
    expect(LRPs.LRPs[3].distanceToNext).toEqual(0);
    expect(LRPs.posOffset).toEqual(0);
    expect(LRPs.negOffset).toEqual(0);
});

test('encode 4 lines no offsets with expansion',()=>{
    let network = generateRealisticLengthTestNetwork();
    let data = mapNodesLinesToID(network.nodes,network.lines);
    let mapDataBase = new MapDataBase(data.lines,data.nodes);
    let LRPs = LineEncoder.encode(mapDataBase,[network.lines[26],network.lines[7],network.lines[19],network.lines[23]],0,0);
    //the startnodes of line 26 and line 23 are not valid, so they both should be expanded to include node 6 (line 18) and node 9 (line22)
    expect(LRPs.LRPs.length).toEqual(4);
    expect(LRPs.LRPs[0].lat).toEqual(network.lines[9].getStartNode().getLatitudeDeg());
    expect(LRPs.LRPs[0].long).toEqual(network.lines[9].getStartNode().getLongitudeDeg());
    expect(LRPs.LRPs[0].distanceToNext).toEqual(network.lines[9].getLength()+network.lines[26].getLength());
    expect(LRPs.LRPs[1].lat).toEqual(network.lines[7].getStartNode().getLatitudeDeg());
    expect(LRPs.LRPs[1].long).toEqual(network.lines[7].getStartNode().getLongitudeDeg());
    expect(LRPs.LRPs[1].distanceToNext).toEqual(network.lines[7].getLength());
    expect(LRPs.LRPs[2].lat).toEqual(network.lines[19].getStartNode().getLatitudeDeg());
    expect(LRPs.LRPs[2].long).toEqual(network.lines[19].getStartNode().getLongitudeDeg());
    expect(LRPs.LRPs[2].distanceToNext).toEqual(network.lines[19].getLength()+network.lines[23].getLength()+network.lines[5].getLength());
    expect(LRPs.LRPs[3].lat).toEqual(network.lines[5].getEndNode().getLatitudeDeg());
    expect(LRPs.LRPs[3].long).toEqual(network.lines[5].getEndNode().getLongitudeDeg());
    expect(LRPs.LRPs[3].distanceToNext).toEqual(0);
    expect(LRPs.posOffset).toEqual(network.lines[9].getLength());
    expect(LRPs.negOffset).toEqual(network.lines[5].getLength());
});

test('encode 4 lines with expansion and valid offsets',()=>{
    let network = generateRealisticLengthTestNetwork();
    let data = mapNodesLinesToID(network.nodes,network.lines);
    let mapDataBase = new MapDataBase(data.lines,data.nodes);
    let LRPs = LineEncoder.encode(mapDataBase,[network.lines[26],network.lines[7],network.lines[19],network.lines[23]],30,30);
    //the startnodes of line 26 and line 23 are not valid, so they both should be expanded to include node 6 (line 18) and node 9 (line22)
    expect(LRPs.LRPs.length).toEqual(4);
    expect(LRPs.LRPs[0].lat).toEqual(network.lines[9].getStartNode().getLatitudeDeg());
    expect(LRPs.LRPs[0].long).toEqual(network.lines[9].getStartNode().getLongitudeDeg());
    expect(LRPs.LRPs[0].distanceToNext).toEqual(network.lines[9].getLength()+network.lines[26].getLength());
    expect(LRPs.LRPs[1].lat).toEqual(network.lines[7].getStartNode().getLatitudeDeg());
    expect(LRPs.LRPs[1].long).toEqual(network.lines[7].getStartNode().getLongitudeDeg());
    expect(LRPs.LRPs[1].distanceToNext).toEqual(network.lines[7].getLength());
    expect(LRPs.LRPs[2].lat).toEqual(network.lines[19].getStartNode().getLatitudeDeg());
    expect(LRPs.LRPs[2].long).toEqual(network.lines[19].getStartNode().getLongitudeDeg());
    expect(LRPs.LRPs[2].distanceToNext).toEqual(network.lines[19].getLength()+network.lines[23].getLength()+network.lines[5].getLength());
    expect(LRPs.LRPs[3].lat).toEqual(network.lines[5].getEndNode().getLatitudeDeg());
    expect(LRPs.LRPs[3].long).toEqual(network.lines[5].getEndNode().getLongitudeDeg());
    expect(LRPs.LRPs[3].distanceToNext).toEqual(0);
    expect(LRPs.posOffset).toEqual(network.lines[9].getLength()+30);
    expect(LRPs.negOffset).toEqual(network.lines[5].getLength()+30);
});

test('encode 4 lines with expansion and invalid pos offset',()=>{
    let network = generateRealisticLengthTestNetwork();
    let data = mapNodesLinesToID(network.nodes,network.lines);
    let mapDataBase = new MapDataBase(data.lines,data.nodes);
    let LRPs = LineEncoder.encode(mapDataBase,[network.lines[26],network.lines[7],network.lines[19],network.lines[23]],network.lines[26].getLength()+30,0);
    //the startnodes of line 26 and line 23 are not valid, so they both should be expanded to include node 6 (line 18) and node 9 (line22)
    //but the posOffset > the length of line 26 so it will be omitted and the next line 7's end node is valid, so no front expansion needed
    expect(LRPs.LRPs.length).toEqual(3);
    expect(LRPs.LRPs[0].lat).toEqual(network.lines[7].getStartNode().getLatitudeDeg());
    expect(LRPs.LRPs[0].long).toEqual(network.lines[7].getStartNode().getLongitudeDeg());
    expect(LRPs.LRPs[0].distanceToNext).toEqual(network.lines[7].getLength());
    expect(LRPs.LRPs[1].lat).toEqual(network.lines[19].getStartNode().getLatitudeDeg());
    expect(LRPs.LRPs[1].long).toEqual(network.lines[19].getStartNode().getLongitudeDeg());
    expect(LRPs.LRPs[1].distanceToNext).toEqual(network.lines[19].getLength()+network.lines[23].getLength()+network.lines[5].getLength());
    expect(LRPs.LRPs[2].lat).toEqual(network.lines[5].getEndNode().getLatitudeDeg());
    expect(LRPs.LRPs[2].long).toEqual(network.lines[5].getEndNode().getLongitudeDeg());
    expect(LRPs.LRPs[2].distanceToNext).toEqual(0);
    expect(LRPs.posOffset).toEqual(30);
    expect(LRPs.negOffset).toEqual(network.lines[5].getLength());
});

test('encode 4 lines with expansion and invalid neg offset',()=>{
    let network = generateRealisticLengthTestNetwork();
    let data = mapNodesLinesToID(network.nodes,network.lines);
    let mapDataBase = new MapDataBase(data.lines,data.nodes);
    let LRPs = LineEncoder.encode(mapDataBase,[network.lines[26],network.lines[7],network.lines[19],network.lines[23]],0,network.lines[23].getLength()+30);
    //the startnodes of line 26 and line 23 are not valid, so they both should be expanded to include node 6 (line 18) and node 9 (line22)
    //but the negOffset > the length of line 23 so it will be omitted and the next line 19's end node is valid, so no end expansion needed
    console.info(LRPs.LRPs);
    expect(LRPs.LRPs.length).toEqual(2);
    expect(LRPs.LRPs[0].lat).toEqual(network.lines[9].getStartNode().getLatitudeDeg());
    expect(LRPs.LRPs[0].long).toEqual(network.lines[9].getStartNode().getLongitudeDeg());
    expect(LRPs.LRPs[0].distanceToNext).toEqual(network.lines[9].getLength()+network.lines[26].getLength()+network.lines[7].getLength()+network.lines[19].getLength());
    expect(LRPs.LRPs[1].lat).toEqual(network.lines[19].getEndNode().getLatitudeDeg());
    expect(LRPs.LRPs[1].long).toEqual(network.lines[19].getEndNode().getLongitudeDeg());
    expect(LRPs.LRPs[1].distanceToNext).toEqual(0);
    expect(LRPs.posOffset).toEqual(network.lines[9].getLength());
    expect(LRPs.negOffset).toEqual(30);
});

test('checkValidityAndAdjustOffsets with end adjustments',()=>{
    let startData = generateStraightLaneTestData();
    let locLines = startData.doubleLineLane.locationLines;
    console.log(locLines[1].getLength());
    let offsets = {posOffset: 5, negOffset: 10};
    let expected = locLines[0];
    LineEncoder.checkValidityAndAdjustOffsets(locLines,offsets);
    expect(offsets).toEqual({posOffset:5,negOffset:6});
    expect(locLines).toEqual([expected]);
});

test('checkValidityAndAdjustOffsets without adjustments',()=>{
    let startData = generateStraightLaneTestData();
    let locLines = startData.doubleLineLane;
    let offsets = {posOffset: 5, negOffset: 5};
    LineEncoder.checkValidityAndAdjustOffsets(locLines,offsets);
    expect(offsets).toEqual({posOffset:5,negOffset:5});
    expect(locLines).toEqual(locLines);
});

test('checkValidityAndAdjustOffsets with start adjustments',()=>{
    let startData = generateStraightLaneTestData();
    let locLines = startData.doubleLineLane.locationLines;
    console.log(locLines[0].getLength());
    let offsets = {posOffset: 17, negOffset: 2};
    let expected = locLines[1];
    LineEncoder.checkValidityAndAdjustOffsets(locLines,offsets);
    expect(offsets).toEqual({posOffset:1,negOffset:2});
    expect(locLines).toEqual([expected]);
});

test('checkValidityAndAdjustOffsets with unconnected lanes',()=>{
    let startData = generateStraightLaneTestData();
    let locLines = startData.unconnectedLane.locationLines;
    let offsets = {posOffset: 0, negOffset: 0};
    expect(()=>{LineEncoder.checkValidityAndAdjustOffsets(locLines,offsets)}).toThrow(Error("line isn't a connected path"));
});

test('checkValidityAndAdjustOffsets offsets longer then path',()=>{
    let startData = generateStraightLaneTestData();
    let locLines = startData.doubleLineLane.locationLines;
    let offsets = {posOffset: 30, negOffset: 30};
    let l1 = locLines[0].getLength();
    let l2 = locLines[1].getLength();
    expect(()=>{LineEncoder.checkValidityAndAdjustOffsets(locLines,offsets)}).toThrow(Error("offsets longer than path: path="+(l1+l2)+" posOffset=30 negOffset=30"));
});

test('adjustToValidStartEnd with one invalid start node ',()=>{
    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.invalidStartNodeLane.locationLines;
    let locLinesLength = locLines.length;
    let offsets = {posOffset: 30, negOffset: 30};
    let expanded = LineEncoder.adjustToValidStartEnd(mapDataBase,locLines,offsets);
    expect(expanded).toEqual({front: 1, back: 0});
    expect(locLines.length).toEqual(locLinesLength+1);
    expect(offsets).toEqual({posOffset: 30+lines[2].getLength(), negOffset: 30});
});

test('adjustToValidStartEnd with one invalid end node ',()=>{
    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.invalidEndNodeLane.locationLines;
    let locLinesLength = locLines.length;
    let offsets = {posOffset: 30, negOffset: 30};
    let expanded = LineEncoder.adjustToValidStartEnd(mapDataBase,locLines,offsets);
    expect(expanded).toEqual({front: 0, back: 1});
    expect(locLines.length).toEqual(locLinesLength+1);
    expect(offsets).toEqual({posOffset: 30, negOffset: 30+lines[3].getLength()});
});

test('adjustToValidStartEnd with one invalid end node with 2 outgoing lines',()=>{
    let node3 = new Node(3,51.2120361,4.3974671);
    let node4 = new Node(4,51.2120058,4.3976971);
    let node5 = new Node(5,51.2120184,4.3977501);

    let line1 = new Line(1,node3,node4);
    let line2 = new Line(2,node4,node5);
    let line3 = new Line(3,node5,node4);
    let line4 = new Line(4,node4,node3);
    node3.setLines([line4],[line1]);
    node4.setLines([line1,line3],[line2,line4]);
    node5.setLines([line2],[line3]);
    let nodelist = [node3,node4,node5];
    let linelist = [line1,line2,line3,line4];

    let {nodes,lines} = mapNodesLinesToID(nodelist,linelist);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = [line1];
    let locLinesLength = locLines.length;
    let offsets = {posOffset: 30, negOffset: 30};
    let expanded = LineEncoder.adjustToValidStartEnd(mapDataBase,locLines,offsets);
    expect(expanded).toEqual({front: 0, back: 1});
    expect(locLines.length).toEqual(locLinesLength+1);
    expect(offsets).toEqual({posOffset: 30, negOffset: 30+lines[3].getLength()});
    expect(locLines[locLines.length-1].getEndNode().getID()).toEqual(node5.getID());
});

test('adjustToValidStartEnd with one invalid end node with 2 outgoing lines other line list order',()=>{
    let node3 = new Node(3,51.2120361,4.3974671);
    let node4 = new Node(4,51.2120058,4.3976971);
    let node5 = new Node(5,51.2120184,4.3977501);

    let line1 = new Line(1,node3,node4);
    let line2 = new Line(2,node4,node5);
    let line3 = new Line(3,node5,node4);
    let line4 = new Line(4,node4,node3);
    node3.setLines([line4],[line1]);
    node4.setLines([line3,line1],[line4,line2]);
    node5.setLines([line2],[line3]);
    let nodelist = [node3,node4,node5];
    let linelist = [line1,line2,line3,line4];

    let {nodes,lines} = mapNodesLinesToID(nodelist,linelist);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = [line1];
    let locLinesLength = locLines.length;
    let offsets = {posOffset: 30, negOffset: 30};
    let expanded = LineEncoder.adjustToValidStartEnd(mapDataBase,locLines,offsets);
    expect(expanded).toEqual({front: 0, back: 1});
    expect(locLines.length).toEqual(locLinesLength+1);
    expect(offsets).toEqual({posOffset: 30, negOffset: 30+lines[3].getLength()});
    expect(locLines[locLines.length-1].getEndNode().getID()).toEqual(node5.getID());
});

test('adjustToValidStartEnd with one invalid start node with 2 outgoing lines',()=>{
    let node3 = new Node(3,51.2120361,4.3974671);
    let node4 = new Node(4,51.2120058,4.3976971);
    let node5 = new Node(5,51.2120184,4.3977501);

    let line1 = new Line(1,node3,node4);
    let line2 = new Line(2,node4,node5);
    let line3 = new Line(3,node5,node4);
    let line4 = new Line(4,node4,node3);
    node3.setLines([line4],[line1]);
    node4.setLines([line1,line3],[line2,line4]);
    node5.setLines([line2],[line3]);
    let nodelist = [node3,node4,node5];
    let linelist = [line1,line2,line3,line4];

    let {nodes,lines} = mapNodesLinesToID(nodelist,linelist);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = [line2];
    let locLinesLength = locLines.length;
    let offsets = {posOffset: 30, negOffset: 30};
    let expanded = LineEncoder.adjustToValidStartEnd(mapDataBase,locLines,offsets);
    expect(expanded).toEqual({front: 1, back: 0});
    expect(locLines.length).toEqual(locLinesLength+1);
    expect(offsets).toEqual({posOffset: 30+line1.getLength(), negOffset: 30});
    expect(locLines[0].getStartNode().getID()).toEqual(node3.getID());
});

test('adjustToValidStartEnd with one invalid start node with 2 outgoing lines other line list order',()=>{
    let node3 = new Node(3,51.2120361,4.3974671);
    let node4 = new Node(4,51.2120058,4.3976971);
    let node5 = new Node(5,51.2120184,4.3977501);

    let line1 = new Line(1,node3,node4);
    let line2 = new Line(2,node4,node5);
    let line3 = new Line(3,node5,node4);
    let line4 = new Line(4,node4,node3);
    node3.setLines([line4],[line1]);
    node4.setLines([line3,line1],[line4,line2]);
    node5.setLines([line2],[line3]);
    let nodelist = [node3,node4,node5];
    let linelist = [line1,line2,line3,line4];

    let {nodes,lines} = mapNodesLinesToID(nodelist,linelist);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = [line2];
    let locLinesLength = locLines.length;
    let offsets = {posOffset: 30, negOffset: 30};
    let expanded = LineEncoder.adjustToValidStartEnd(mapDataBase,locLines,offsets);
    expect(expanded).toEqual({front: 1, back: 0});
    expect(locLines.length).toEqual(locLinesLength+1);
    expect(offsets).toEqual({posOffset: 30+line1.getLength(), negOffset: 30});
    expect(locLines[0].getStartNode().getID()).toEqual(node3.getID());
});

test('node is invalid 1 in 1 out',()=>{
    let startData = generateStraightLaneTestData();
    let locLines = startData.invalidStartNodeLane.locationLines;
    let invalidNode = locLines[0].getStartNode();
    let invalid = LineEncoder.nodeIsInValid(invalidNode);
    expect(invalid).toEqual(true);
});

test('node is valid 1 in 1 out',()=>{
    let node3 = new Node(3,51.2120361,4.3974671);
    let node4 = new Node(4,51.2120058,4.3976971);

    let line1 = new Line(1,node3,node4);
    let line4 = new Line(4,node4,node3);
    node3.setLines([line4],[line1]);
    node4.setLines([line1],[line4]);

    let invalid = LineEncoder.nodeIsInValid(node3);
    expect(invalid).toEqual(false);
});

test('node is invalid 2 in 2 out',()=>{
    let node3 = new Node(3,51.2120361,4.3974671);
    let node4 = new Node(4,51.2120058,4.3976971);
    let node5 = new Node(5,51.2120184,4.3977501);

    let line1 = new Line(1,node3,node4);
    let line2 = new Line(2,node4,node5);
    let line3 = new Line(3,node5,node4);
    let line4 = new Line(4,node4,node3);
    node3.setLines([line4],[line1]);
    node4.setLines([line1,line3],[line2,line4]);
    node5.setLines([line2],[line3]);
    let invalid = LineEncoder.nodeIsInValid(node4);
    expect(invalid).toEqual(true);
});

test('node is valid 2 in 1 out',()=>{
    let node3 = new Node(3,51.2120361,4.3974671);
    let node4 = new Node(4,51.2120058,4.3976971);
    let node5 = new Node(5,51.2120184,4.3977501);

    let line1 = new Line(1,node3,node4);
    let line2 = new Line(2,node4,node5);
    let line3 = new Line(3,node5,node4);
    node3.setLines([],[line1]);
    node4.setLines([line1,line3],[line2]);
    node5.setLines([line2],[line3]);
    let invalid = LineEncoder.nodeIsInValid(node4);
    expect(invalid).toEqual(false);
});

test('node is valid 1 in 2 out',()=>{
    let node3 = new Node(3,51.2120361,4.3974671);
    let node4 = new Node(4,51.2120058,4.3976971);
    let node5 = new Node(5,51.2120184,4.3977501);

    let line1 = new Line(1,node3,node4);
    let line2 = new Line(2,node4,node5);
    let line4 = new Line(4,node4,node3);
    node3.setLines([line4],[line1]);
    node4.setLines([line1],[line2,line4]);
    node5.setLines([line2],[]);
    let invalid = LineEncoder.nodeIsInValid(node4);
    expect(invalid).toEqual(false);
});

test('node is valid 2 in 2 diff out',()=>{
    let node3 = new Node(3,51.2120361,4.3974671);
    let node4 = new Node(4,51.2120058,4.3976971);
    let node5 = new Node(5,51.2120184,4.3977501);
    let node6 = new Node(6,51.2120250,4.3978910);

    let line1 = new Line(1,node3,node4);
    let line2 = new Line(2,node4,node5);
    let line3 = new Line(3,node5,node4);
    let line4 = new Line(4,node4,node6);
    node3.setLines([],[line1]);
    node4.setLines([line1,line3],[line2,line4]);
    node5.setLines([line2],[line3]);
    node6.setLines([line4],[]);
    let invalid = LineEncoder.nodeIsInValid(node4);
    expect(invalid).toEqual(false);
});

test('node is valid 2 diff in 2 out',()=>{
    let node3 = new Node(3,51.2120361,4.3974671);
    let node4 = new Node(4,51.2120058,4.3976971);
    let node5 = new Node(5,51.2120184,4.3977501);
    let node6 = new Node(6,51.2120250,4.3978910);

    let line1 = new Line(1,node3,node4);
    let line2 = new Line(2,node4,node5);
    let line3 = new Line(3,node6,node4);
    let line4 = new Line(4,node4,node3);
    node3.setLines([line4],[line1]);
    node4.setLines([line1,line3],[line2,line4]);
    node5.setLines([line2],[]);
    node6.setLines([],[line3]);
    let invalid = LineEncoder.nodeIsInValid(node4);
    expect(invalid).toEqual(false);
});

test('checkShortestPathCoverage fully covered',()=>{
    let network = generateTestNetwork();
    let locationLines = [network.lines[5],network.lines[3],network.lines[4]];
    let checkResult = LineEncoder.checkShortestPathCoverage(0,locationLines,[network.lines[5],network.lines[3],network.lines[4]],3);
    expect(checkResult.fullyCovered).toEqual(true);
    expect(checkResult.lrpIndexInLoc).toEqual(3);
    expect(checkResult.lrpIndexInSP).toEqual(3);
});

test('checkShortestPathCoverage fully covered 0 path length',()=>{
    let network = generateTestNetwork();
    let locationLines = [network.lines[5],network.lines[3],network.lines[4]];
    let checkResult = LineEncoder.checkShortestPathCoverage(1,locationLines,[],2);
    expect(checkResult.fullyCovered).toEqual(true);
    expect(checkResult.lrpIndexInLoc).toEqual(1);
    expect(checkResult.lrpIndexInSP).toEqual(0);
});

test('checkShortestPathCoverage not fully covered 0 path length',()=>{
    let network = generateTestNetwork();
    let locationLines = [network.lines[5],network.lines[3],network.lines[4]];
    let checkResult = LineEncoder.checkShortestPathCoverage(1,locationLines,[],3);
    expect(checkResult.fullyCovered).toEqual(false);
    expect(checkResult.lrpIndexInLoc).toEqual(1);
    expect(checkResult.lrpIndexInSP).toEqual(0);
});

test('checkShortestPathCoverage fully covered 1 path length',()=>{
    let network = generateTestNetwork();
    let locationLines = [network.lines[5],network.lines[3],network.lines[4]];
    let checkResult = LineEncoder.checkShortestPathCoverage(2,locationLines,[network.lines[4]],3);
    expect(checkResult.fullyCovered).toEqual(true);
    expect(checkResult.lrpIndexInLoc).toEqual(3);
    expect(checkResult.lrpIndexInSP).toEqual(1);
});

test('checkShortestPathCoverage not fully covered 1 path length',()=>{
    let network = generateTestNetwork();
    let locationLines = [network.lines[5],network.lines[3],network.lines[4]];
    let checkResult = LineEncoder.checkShortestPathCoverage(2,locationLines,[network.lines[8]],3);
    expect(checkResult.fullyCovered).toEqual(false);
    expect(checkResult.lrpIndexInLoc).toEqual(2);
    expect(checkResult.lrpIndexInSP).toEqual(0);
});

test('checkShortestPathCoverage fully covered part',()=>{
    let network = generateTestNetwork();
    let locationLines = [network.lines[5],network.lines[3],network.lines[4]];
    let checkResult = LineEncoder.checkShortestPathCoverage(1,locationLines,[network.lines[3],network.lines[4]],3);
    expect(checkResult.fullyCovered).toEqual(true);
    expect(checkResult.lrpIndexInLoc).toEqual(3);
    expect(checkResult.lrpIndexInSP).toEqual(2);
});

test('checkShortestPathCoverage not fully covered',()=>{
    let network = generateTestNetwork();
    let locationLines = [network.lines[5],network.lines[3],network.lines[7]];
    let checkResult = LineEncoder.checkShortestPathCoverage(0,locationLines,[network.lines[5],network.lines[3],network.lines[4]],3);
    expect(checkResult.fullyCovered).toEqual(false);
    expect(checkResult.lrpIndexInLoc).toEqual(2);
    expect(checkResult.lrpIndexInSP).toEqual(2);
});

test('checkShortestPathCoverage not fully covered part',()=>{
    let network = generateTestNetwork();
    let locationLines = [network.lines[5],network.lines[3],network.lines[7]];
    let checkResult = LineEncoder.checkShortestPathCoverage(1,locationLines,[network.lines[3],network.lines[4]],3);
    expect(checkResult.fullyCovered).toEqual(false);
    expect(checkResult.lrpIndexInLoc).toEqual(2);
    expect(checkResult.lrpIndexInSP).toEqual(1);
});

test('checkShortestPathCoverage nothing covered',()=>{
    let network = generateTestNetwork();
    let locationLines = [network.lines[5],network.lines[3],network.lines[7]];
    let checkResult = LineEncoder.checkShortestPathCoverage(1,locationLines,[network.lines[6],network.lines[4]],3);
    expect(checkResult.fullyCovered).toEqual(false);
    expect(checkResult.lrpIndexInLoc).toEqual(1);
    expect(checkResult.lrpIndexInSP).toEqual(0);
});

test('checkShortestPathCoverage undefined param',()=>{
    let network = generateTestNetwork();
    let locationLines = [network.lines[5],network.lines[3],network.lines[7]];
    expect(()=>{LineEncoder.checkShortestPathCoverage(undefined,locationLines,[network.lines[6],network.lines[4]],3)}).toThrow(Error("One of the parameters is undefined."));
    expect(()=>{LineEncoder.checkShortestPathCoverage(0,undefined,[network.lines[6],network.lines[4]],3)}).toThrow(Error("One of the parameters is undefined."));
    expect(()=>{LineEncoder.checkShortestPathCoverage(0,locationLines,undefined,3)}).toThrow(Error("One of the parameters is undefined."));
    expect(()=>{LineEncoder.checkShortestPathCoverage(0,locationLines,[network.lines[6],network.lines[4]],undefined)}).toThrow(Error("One of the parameters is undefined."));
});

test('checkShortestPathCoverage lEndIndex > lStartIndex',()=>{
    let network = generateTestNetwork();
    let locationLines = [network.lines[5],network.lines[3],network.lines[7]];
    expect(()=>{LineEncoder.checkShortestPathCoverage(10,locationLines,[network.lines[6],network.lines[4]],3)}).toThrow(Error("lStartIndex can't be greater than lEndIndex"));
});

test('checkShortestPathCoverage lEndIndex > lines.length',()=>{
    let network = generateTestNetwork();
    let locationLines = [network.lines[5],network.lines[3],network.lines[7]];
    expect(()=>{LineEncoder.checkShortestPathCoverage(0,locationLines,[network.lines[6],network.lines[4]],10)}).toThrow(Error("lEndIndex can't be greater than lines.length"));
});

test('checkShortestPathCoverage not fully covered part with lEndIndex',()=>{
    let network = generateTestNetwork();
    let locationLines = [network.lines[5],network.lines[3],network.lines[7],network[13]];
    let checkResult = LineEncoder.checkShortestPathCoverage(1,locationLines,[network.lines[3],network.lines[4]],3);
    expect(checkResult.fullyCovered).toEqual(false);
    expect(checkResult.lrpIndexInLoc).toEqual(2);
    expect(checkResult.lrpIndexInSP).toEqual(1);
});

test('checkShortestPathCoverage fully covered part with lEndIndex',()=>{
    let network = generateTestNetwork();
    let locationLines = [network.lines[5],network.lines[3],network.lines[4],network.lines[9]];
    let checkResult = LineEncoder.checkShortestPathCoverage(1,locationLines,[network.lines[3],network.lines[4]],3);
    expect(checkResult.fullyCovered).toEqual(true);
    expect(checkResult.lrpIndexInLoc).toEqual(3);
    expect(checkResult.lrpIndexInSP).toEqual(2);
});

test('addLRPsUntilFullyCovered fully covered',()=>{
    let network = generateTestNetwork();
    let checkResult = {
        fullyCovered: true,
        lrpIndexInSP: 0,
        lrpIndexInLoc: 1
    };
    let locLines = [network.lines[5],network.lines[3],network.lines[4]];
    // let lrpNodes = [network.nodes[2]];
    let lrpLines = [network.lines[5]];
    let shortestPaths = [[network.lines[3]]];
    let expanded = {front: 0, end: 0};
    LineEncoder.addLRPsUntilFullyCovered(checkResult,locLines,lrpLines,shortestPaths,[network.lines[3]],expanded);
    // expect(lrpNodes.length).toEqual(2);
    // expect(lrpNodes[1].getID()).toEqual(network.nodes[8].getID());
    expect(lrpLines.length).toEqual(2);
    expect(lrpLines[1].getID()).toEqual(network.lines[4].getID());
    expect(shortestPaths.length).toEqual(1);
});

test('addLRPsUntilFullyCovered extra lrp needed',()=>{
    let network = generateTestNetwork();
    let checkResult = {
        fullyCovered: false,
        lrpIndexInSP: 1,
        lrpIndexInLoc: 1
    };
    let locLines = [network.lines[26],network.lines[7],network.lines[19],network.lines[23]];
    // let lrpNodes = [network.nodes[9]];
    let lrpLines = [network.lines[26]];
    let shortestPaths = [[network.lines[26],network.lines[24],network.lines[23]]];
    let expanded = {front: 0, back: 0};
    LineEncoder.addLRPsUntilFullyCovered(checkResult,locLines,lrpLines,shortestPaths,[network.lines[26],network.lines[24],network.lines[23]],expanded);
    // expect(lrpNodes.length).toEqual(3);
    // expect(lrpNodes[1].getID()).toEqual(network.nodes[7].getID());
    // expect(lrpNodes[2].getID()).toEqual(network.nodes[2].getID());
    expect(lrpLines.length).toEqual(3);
    expect(lrpLines[1].getID()).toEqual(network.lines[7].getID());
    expect(lrpLines[2].getID()).toEqual(network.lines[23].getID());
    expect(shortestPaths.length).toEqual(2);
});

test('addLRPsUntilFullyCovered single lrp line location',()=>{
    let network = generateTestNetwork();
    let checkResult = {
        fullyCovered: true,
        lrpIndexInSP: 1,
        lrpIndexInLoc: 1
    };
    let locLines = [network.lines[26]];
    let lrpLines = [network.lines[26]];
    let shortestPaths = [[network.lines[13]]];
    let expanded = {front: 0, back: 0};
    LineEncoder.addLRPsUntilFullyCovered(checkResult,locLines,lrpLines,shortestPaths,[network.lines[13]],expanded);
    expect(lrpLines.length).toEqual(2);
    expect(lrpLines[0].getID()).toEqual(network.lines[26].getID());
    expect(lrpLines[1].getID()).toEqual(network.lines[26].getID());
    expect(shortestPaths.length).toEqual(1);
});

test('addLRPsUntilFullyCovered 2 lrp line location',()=>{
    let network = generateTestNetwork();
    let checkResult = {
        fullyCovered: true,
        lrpIndexInSP: 1,
        lrpIndexInLoc: 1
    };
    let locLines = [network.lines[26],network.lines[7]];
    let lrpLines = [network.lines[26]];
    let shortestPaths = [[]];
    let expanded = {front: 0, back: 0};
    LineEncoder.addLRPsUntilFullyCovered(checkResult,locLines,lrpLines,shortestPaths,[],expanded);
    expect(lrpLines.length).toEqual(2);
    expect(lrpLines[0].getID()).toEqual(network.lines[26].getID());
    expect(lrpLines[1].getID()).toEqual(network.lines[7].getID());
    expect(shortestPaths.length).toEqual(1);
});

//todo: test addLRPsUntilFullyCovered else structure? indien die kan voorkomen

test('concatenateAndValidateShortestPaths valid',()=>{
    let network = generateRealisticLengthTestNetwork();
    // let locLines = [network.lines[26],network.lines[7],network.lines[19],network.lines[23]];
    let lrpLines = [network.lines[26],network.lines[7],network.lines[23]];
    let shortestPaths = [{lines: [network.lines[24]]},{lines:[network.lines[19]]}];
    let offsets = {posOffset: 0, netOffset: 0};
    let concatenatedSPResult = LineEncoder.concatenateAndValidateShortestPaths(lrpLines,shortestPaths,offsets);
    expect(concatenatedSPResult.isValid).toEqual(true);
    expect(concatenatedSPResult.wrongPosOffset).toEqual(false);
    expect(concatenatedSPResult.wrongNegOffset).toEqual(false);
    expect(concatenatedSPResult.wrongIntermediateDistance).toEqual(false);
    expect(concatenatedSPResult.distanceBetweenFirstTwo).toEqual(network.lines[26].getLength());
    expect(concatenatedSPResult.distanceBetweenLastTwo).toEqual(network.lines[19].getLength()+network.lines[23].getLength()+network.lines[7].getLength());
    expect(concatenatedSPResult.shortestPath[0].getID()).toEqual(network.lines[26].getID());
    expect(concatenatedSPResult.shortestPath[1].getID()).toEqual(network.lines[7].getID());
    expect(concatenatedSPResult.shortestPath[2].getID()).toEqual(network.lines[19].getID());
    expect(concatenatedSPResult.shortestPath[3].getID()).toEqual(network.lines[23].getID());
});

test('concatenateAndValidateShortestPaths valid 2 LRP lines with wrong SP between',()=>{
    let network = generateRealisticLengthTestNetwork();
    let lrpLines = [network.lines[26],network.lines[7]];
    let shortestPaths = [{lines: [network.lines[13]]}];
    let offsets = {posOffset: 0, netOffset: 0};
    let concatenatedSPResult = LineEncoder.concatenateAndValidateShortestPaths(lrpLines,shortestPaths,offsets);
    expect(concatenatedSPResult.isValid).toEqual(true);
    expect(concatenatedSPResult.wrongPosOffset).toEqual(false);
    expect(concatenatedSPResult.wrongNegOffset).toEqual(false);
    expect(concatenatedSPResult.wrongIntermediateDistance).toEqual(false);
    expect(concatenatedSPResult.distanceBetweenFirstTwo).toEqual(network.lines[26].getLength()+network.lines[7].getLength());
    expect(concatenatedSPResult.distanceBetweenLastTwo).toEqual(network.lines[26].getLength()+network.lines[7].getLength());
    expect(concatenatedSPResult.shortestPath[0].getID()).toEqual(network.lines[26].getID());
    expect(concatenatedSPResult.shortestPath[1].getID()).toEqual(network.lines[7].getID());
});

test('concatenateAndValidateShortestPaths 1 line',()=>{
    let network = generateRealisticLengthTestNetwork();
    // let locLines = [network.lines[26],network.lines[7],network.lines[19],network.lines[23]];
    let lrpLines = [network.lines[26],network.lines[26]];
    let shortestPaths = [{lines: [network.lines[13]]}];
    let offsets = {posOffset: 0, netOffset: 0};
    let concatenatedSPResult = LineEncoder.concatenateAndValidateShortestPaths(lrpLines,shortestPaths,offsets);
    expect(concatenatedSPResult.isValid).toEqual(true);
    expect(concatenatedSPResult.wrongPosOffset).toEqual(false);
    expect(concatenatedSPResult.wrongNegOffset).toEqual(false);
    expect(concatenatedSPResult.wrongIntermediateDistance).toEqual(false);
    expect(concatenatedSPResult.distanceBetweenFirstTwo).toEqual(network.lines[26].getLength());
    expect(concatenatedSPResult.distanceBetweenLastTwo).toEqual(network.lines[26].getLength());
    expect(concatenatedSPResult.shortestPath.length).toEqual(1);
    expect(concatenatedSPResult.shortestPath[0].getID()).toEqual(network.lines[26].getID());
});

test('concatenateAndValidateShortestPaths wrongPosOffset',()=>{
    let network = generateRealisticLengthTestNetwork();
    // let locLines = [network.lines[26],network.lines[7],network.lines[19],network.lines[23]];
    let lrpLines = [network.lines[26],network.lines[7],network.lines[23]];
    let shortestPaths = [{lines: [network.lines[24]]},{lines:[network.lines[19]]}];
    let offsets = {posOffset: 10000, netOffset: 0};
    let concatenatedSPResult = LineEncoder.concatenateAndValidateShortestPaths(lrpLines,shortestPaths,offsets);
    expect(concatenatedSPResult.isValid).toEqual(false);
    expect(concatenatedSPResult.wrongPosOffset).toEqual(true);
    expect(concatenatedSPResult.wrongNegOffset).toEqual(false);
    expect(concatenatedSPResult.wrongIntermediateDistance).toEqual(false);
    expect(concatenatedSPResult.distanceBetweenFirstTwo).toEqual(network.lines[26].getLength());
    expect(concatenatedSPResult.distanceBetweenLastTwo).toEqual(network.lines[7].getLength()+network.lines[19].getLength()+network.lines[23].getLength());
    expect(concatenatedSPResult.shortestPath[0].getID()).toEqual(network.lines[26].getID());
    expect(concatenatedSPResult.shortestPath[1].getID()).toEqual(network.lines[7].getID());
    expect(concatenatedSPResult.shortestPath[2].getID()).toEqual(network.lines[19].getID());
    expect(concatenatedSPResult.shortestPath[3].getID()).toEqual(network.lines[23].getID());
});

test('concatenateAndValidateShortestPaths wrongNegOFfset',()=>{
    let network = generateRealisticLengthTestNetwork();
    // let locLines = [network.lines[26],network.lines[7],network.lines[19],network.lines[23]];
    let lrpLines = [network.lines[26],network.lines[7],network.lines[23]];
    let shortestPaths = [{lines: [network.lines[24]]},{lines:[network.lines[19]]}];
    let offsets = {posOffset: 0, negOffset: 10000};
    let concatenatedSPResult = LineEncoder.concatenateAndValidateShortestPaths(lrpLines,shortestPaths,offsets);
    expect(concatenatedSPResult.isValid).toEqual(false);
    expect(concatenatedSPResult.wrongPosOffset).toEqual(false);
    expect(concatenatedSPResult.wrongNegOffset).toEqual(true);
    expect(concatenatedSPResult.wrongIntermediateDistance).toEqual(false);
    expect(concatenatedSPResult.distanceBetweenFirstTwo).toEqual(network.lines[26].getLength());
    expect(concatenatedSPResult.distanceBetweenLastTwo).toEqual(network.lines[7].getLength()+network.lines[19].getLength()+network.lines[23].getLength());
    expect(concatenatedSPResult.shortestPath[0].getID()).toEqual(network.lines[26].getID());
    expect(concatenatedSPResult.shortestPath[1].getID()).toEqual(network.lines[7].getID());
    expect(concatenatedSPResult.shortestPath[2].getID()).toEqual(network.lines[19].getID());
    expect(concatenatedSPResult.shortestPath[3].getID()).toEqual(network.lines[23].getID());
});

test('concatenateAndValidateShortestPaths wrong shortestPaths length',()=>{
    let network = generateRealisticLengthTestNetwork();
    // let locLines = [network.lines[26],network.lines[7],network.lines[19],network.lines[23]];
    let lrpLines = [network.lines[26],network.lines[7],network.lines[23],network.lines[10]];
    let shortestPaths = [{lines: [network.lines[24]]},{lines:[network.lines[19]]}];
    let offsets = {posOffset: 0, negOffset: 0};
    expect(()=>{LineEncoder.concatenateAndValidateShortestPaths(lrpLines,shortestPaths,offsets)}).toThrow(Error("the amount of shortest paths is not one less than the amount of lrp nodes"));
});

test('removeLRPatFront',()=>{
    let network = generateRealisticLengthTestNetwork();
    let lrpLines = [network.lines[26],network.lines[7],network.lines[19],network.lines[23]];
    let offsets = {posOffset: 600, negOffset: 0};
    LineEncoder.removeLRPatFront(lrpLines,offsets,500);
    expect(lrpLines.length).toEqual(3);
    expect(lrpLines[0].getID()).toEqual(network.lines[7].getID());
    expect(offsets.posOffset).toEqual(100);
    expect(offsets.negOffset).toEqual(0);
});

test('removeLRPatFront unnecessary',()=>{
    let network = generateRealisticLengthTestNetwork();
    let lrpLines = [network.lines[26],network.lines[7],network.lines[19],network.lines[23]];
    let offsets = {posOffset: 400, negOffset: 0};
    expect(()=>{LineEncoder.removeLRPatFront(lrpLines,offsets,500)}).toThrow(Error("unnecessary removing of LRP at front"));
});

test('removeLRPatEnd',()=>{
    let network = generateRealisticLengthTestNetwork();
    let lrpLines = [network.lines[26],network.lines[7],network.lines[19],network.lines[23]];
    let offsets = {posOffset: 0, negOffset: 500};
    LineEncoder.removeLRPatEnd(lrpLines,offsets,200);
    expect(lrpLines.length).toEqual(3);
    expect(lrpLines[2].getID()).toEqual(network.lines[19].getID());
    expect(offsets.posOffset).toEqual(0);
    expect(offsets.negOffset).toEqual(300);
});

test('removeLRPatEnd unnecessary',()=>{
    let network = generateRealisticLengthTestNetwork();
    let lrpLines = [network.lines[26],network.lines[7],network.lines[19],network.lines[23]];
    let offsets = {posOffset: 0, negOffset: 300};
    expect(()=>{LineEncoder.removeLRPatEnd(lrpLines,offsets,500)}).toThrow(Error("unnecessary removing of LRP at end"));
});

test('encode lane existing of two lines can be binary encoded and decoded',()=>{
    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.doubleLineLane.locationLines;
    let location = new Location(locationTypeEnum.LINE_LOCATION,1);
    location.locationLines = locLines;
    location.posOffset = 0;
    location.negOffset = 0;
    let jsonEncoded = Encoder.encode(location,mapDataBase,0,0);

    //encode binary
    const binaryEncoder = new BinaryEncoder();
    const rawLocationReference = Serializer.deserialize(jsonEncoded);
    const locationReference = binaryEncoder.encodeDataFromRLR(rawLocationReference);
    const openLrBinary = locationReference.getLocationReferenceData();
    const openLrString = openLrBinary.toString('base64');

    const binaryDecoder = new BinaryDecoder();

    const openLrBinary2 = Buffer.from(openLrString, 'base64');
    const locationReference2 = LocationReference.fromIdAndBuffer('binary', openLrBinary2);
    const rawLocationReference2 = binaryDecoder.decodeData(locationReference2);
    const jsonObject = Serializer.serialize(rawLocationReference2);
    
    expect(jsonObject).toEqual(jsonEncoded);
});