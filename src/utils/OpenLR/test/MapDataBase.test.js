import MapDataBase from "../map/MapDataBase";
import SlowMapDataBase from "../map/SlowMapDataBase";
import { mapNodesLinesToID, generateStraightLaneTestData} from "./Helperfunctions";
import {loadNodesLineStringsWegenregsterAntwerpen} from "../../../data/LoadTestData";
import WegenregisterAntwerpenIntegration from "../../OpenLRData/WegenregisterAntwerpenIntegration";

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

test('findNodesCloseByCoordinate use with a lot of nodes (from wegenregister Antwerpen)',(done)=>{
    expect.assertions(5);
    loadNodesLineStringsWegenregsterAntwerpen().then(features => {
        let slowMapDataBase = new SlowMapDataBase();
        let mapDataBase = new MapDataBase();
        WegenregisterAntwerpenIntegration.initMapDataBase(slowMapDataBase,features);
        WegenregisterAntwerpenIntegration.initMapDataBase(mapDataBase,features);
        expect(mapDataBase).toBeDefined();
        let foundNodes = mapDataBase.findNodesCloseByCoordinate(51.2120497, 4.3971693, 50);
        expect(slowMapDataBase).toBeDefined();
        let foundNodesSlow = slowMapDataBase.findNodesCloseByCoordinate(51.2120497, 4.3971693, 50);
        expect(foundNodes.length).not.toEqual(0);
        expect(foundNodesSlow.length).not.toEqual(0);
        expect(foundNodes.length).toEqual(foundNodesSlow.length);
        done();
    });
});

test('findLinesCloseByCoordinate use with a lot of lines (from wegenregister Antwerpen)',(done)=>{
    expect.assertions(5);
    loadNodesLineStringsWegenregsterAntwerpen().then(features => {
        let slowMapDataBase = new SlowMapDataBase();
        let mapDataBase = new MapDataBase();
        WegenregisterAntwerpenIntegration.initMapDataBase(slowMapDataBase,features);
        WegenregisterAntwerpenIntegration.initMapDataBase(mapDataBase,features);
        expect(mapDataBase).toBeDefined();
        let foundLines = mapDataBase.findLinesCloseByCoordinate(51.2120497, 4.3971693, 50);
        expect(slowMapDataBase).toBeDefined();
        let foundLinesSlow = slowMapDataBase.findLinesCloseByCoordinate(51.2120497, 4.3971693, 50);
        expect(foundLines.length).not.toEqual(0);
        expect(foundLinesSlow.length).not.toEqual(0);
        expect(foundLines.length).toEqual(foundLinesSlow.length);
        done();
    });
});

