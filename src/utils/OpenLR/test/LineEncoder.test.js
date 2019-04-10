import MapDataBase from "../map/MapDataBase";
import {generateStraightLaneTestData, mapNodesLinesToID} from "./Helperfunctions";
import LineEncoder from "../coder/LineEncoder";
import {BinaryEncoder, BinaryDecoder, Serializer, LocationReference} from 'openlr-js';

test('encode doesn\'t crash with lane existing of single line',()=>{
    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.locations[0].locationLines;
    let encoded = LineEncoder.encode(mapDataBase,locLines,0,0);
});

test('encode doesn\'t crash with lane existing of two lines',()=>{
    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.locations[1].locationLines;
    let encoded = LineEncoder.encode(mapDataBase,locLines,0,0);
});

test('encode doesn\'t crash with lane existing of two lines and offsets',()=>{
    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.locations[1].locationLines;
    let encoded = LineEncoder.encode(mapDataBase,locLines,5,10);
});

test('checkValidityAndAdjustOffsets with end adjustments',()=>{
    let startData = generateStraightLaneTestData();
    let locLines = startData.locations[1].locationLines;
    let offsets = {posOffset: 5, negOffset: 10};
    let expected = locLines[0];
    LineEncoder.checkValidityAndAdjustOffsets(locLines,offsets);
    expect(offsets).toEqual({posOffset:5,negOffset:4});
    expect(locLines).toEqual([expected]);
});

test('checkValidityAndAdjustOffsets without adjustments',()=>{
    let startData = generateStraightLaneTestData();
    let locLines = startData.locations[1].locationLines;
    let offsets = {posOffset: 5, negOffset: 5};
    LineEncoder.checkValidityAndAdjustOffsets(locLines,offsets);
    expect(offsets).toEqual({posOffset:5,negOffset:5});
    expect(locLines).toEqual(locLines);
});

test('checkValidityAndAdjustOffsets with start adjustments',()=>{
    let startData = generateStraightLaneTestData();
    let locLines = startData.locations[1].locationLines;
    let offsets = {posOffset: 27, negOffset: 3};
    let expected = locLines[1];
    LineEncoder.checkValidityAndAdjustOffsets(locLines,offsets);
    expect(offsets).toEqual({posOffset:1,negOffset:3});
    expect(locLines).toEqual([expected]);
});

test('encode lane existing of two lines can be binary encoded and decoded',()=>{
    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.locations[1].locationLines;
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