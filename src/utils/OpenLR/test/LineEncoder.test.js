import MapDataBase from "../map/MapDataBase";
import {generateStraightLaneTestData, mapNodesLinesToID} from "./Helperfunctions";
import LineEncoder from "../coder/LineEncoder";

test('encode doesn\'t crash with lane existing of single line',()=>{
    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.locations[0].locationLines;
    LineEncoder.encode(mapDataBase,locLines,0,0);
});

test('encode doesn\'t crash with lane existing of two lines',()=>{
    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.locations[1].locationLines;
    LineEncoder.encode(mapDataBase,locLines,0,0);
});