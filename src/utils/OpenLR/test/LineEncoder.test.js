import MapDataBase from "../map/MapDataBase";
import {generateStraightLaneTestData, mapNodesLinesToID} from "./Helperfunctions";
import LineEncoder from "../coder/LineEncoder";
import Line from "../map/Line";
import Node from "../map/Node";
import {BinaryEncoder, BinaryDecoder, Serializer, LocationReference} from 'openlr-js';

test('encode doesn\'t crash with lane existing of single line',()=>{
    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.singleLineLane.locationLines;
    let encoded = LineEncoder.encode(mapDataBase,locLines,0,0);
});

test('encode doesn\'t crash with lane existing of two lines',()=>{
    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.doubleLineLane.locationLines;
    let encoded = LineEncoder.encode(mapDataBase,locLines,0,0);
});

// test('encode doesn\'t crash with lane existing of two lines and offsets',()=>{
//     let startData = generateStraightLaneTestData();
//     let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
//     let mapDataBase = new MapDataBase(lines,nodes);
//     let locLines = startData.doubleLineLane;
//     let encoded = LineEncoder.encode(mapDataBase,locLines,5,10);
// });

test('checkValidityAndAdjustOffsets with end adjustments',()=>{
    let startData = generateStraightLaneTestData();
    let locLines = startData.doubleLineLane.locationLines;
    let offsets = {posOffset: 5, negOffset: 10};
    let expected = locLines[0];
    LineEncoder.checkValidityAndAdjustOffsets(locLines,offsets);
    expect(offsets).toEqual({posOffset:5,negOffset:4});
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
    let offsets = {posOffset: 27, negOffset: 3};
    let expected = locLines[1];
    LineEncoder.checkValidityAndAdjustOffsets(locLines,offsets);
    expect(offsets).toEqual({posOffset:1,negOffset:3});
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
    expect(offsets).toEqual({posOffset: 56, negOffset: 30});
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
    expect(offsets).toEqual({posOffset: 30, negOffset: 36});
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
    expect(offsets).toEqual({posOffset: 30, negOffset: 36});
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
    expect(offsets).toEqual({posOffset: 30, negOffset: 36});
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

test('encode lane existing of two lines can be binary encoded and decoded',()=>{
    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.doubleLineLane.locationLines;
    let encoded = LineEncoder.encode(mapDataBase,locLines,0,0);

    //encode binary
    const binaryEncoder = new BinaryEncoder();
    const rawLocationReference = Serializer.deserialize(encoded);
    const locationReference = binaryEncoder.encodeDataFromRLR(rawLocationReference);
    const openLrBinary = locationReference.getLocationReferenceData();
    const openLrString = openLrBinary.toString('base64');

    const binaryDecoder = new BinaryDecoder();

    const openLrBinary2 = Buffer.from(openLrString, 'base64');
    const locationReference2 = LocationReference.fromIdAndBuffer('binary', openLrBinary2);
    const rawLocationReference2 = binaryDecoder.decodeData(locationReference2);
    const jsonObject = Serializer.serialize(rawLocationReference2);
    
    expect(jsonObject).toEqual(encoded);
});