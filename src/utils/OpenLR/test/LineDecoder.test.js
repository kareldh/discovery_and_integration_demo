import {generateRealisticLengthTestNetwork,mapNodesLinesToID} from "./Helperfunctions";
import MapDataBase from "../map/MapDataBase";
import LineEncoder from "../coder/LineEncoder";

test('findCandidatesOrProjections 4 LRPs no offsets',()=>{
    let network = generateRealisticLengthTestNetwork();
    let data = mapNodesLinesToID(network.nodes,network.lines);
    let mapDataBase = new MapDataBase(data.lines,data.nodes);
    let LRPs = LineEncoder.encode(mapDataBase,[network.lines[26],network.lines[7],network.lines[19],network.lines[23]],0,0);
    console.log(LRPs);
});