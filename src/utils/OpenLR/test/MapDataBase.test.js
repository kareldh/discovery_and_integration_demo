import MapDataBase from "../map/MapDataBase";
import { mapNodesLinesToID, generateStraightLaneTestData} from "./Helperfunctions";

test('initialize mapdatabase',()=>{
    let startData = generateStraightLaneTestData();

    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);

    let mapDataBase = new MapDataBase(lines,nodes);

    expect(mapDataBase.getAllLines().length).toEqual(lines.length);
    expect(mapDataBase.getAllNodes().length).toEqual(nodes.length);
    expect(mapDataBase.getNumberOfLines()).toEqual(lines.length);
    expect(mapDataBase.getNumberOfNodes()).toEqual(nodes.length);
    expect(mapDataBase.hasTurnRestrictions()).toEqual(false);
});

