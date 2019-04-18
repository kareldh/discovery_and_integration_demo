import {
    generateStraightLaneTestData, loadOsmTestData,
    mapNodesLinesToID
} from "../../OpenLR/test/Helperfunctions";
import MapDataBase from "../../OpenLR/map/MapDataBase";
import LineEncoder from "../../OpenLR/coder/LineEncoder";
import LineDecoder from "../../OpenLR/coder/LineDecoder";
import OSMIntegration from "../../OpenLRData/OSMIntegration"
import {filterHighwayData, getMappedElements, parseToJson} from "../../../data/api";

test('initMapDataBase initialization',(done)=>{
    expect.assertions(3);
    let osmDataBase;

    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        osmDataBase = OSMIntegration.initMapDataBase(highwayData.nodes,highwayData.ways,highwayData.relations);
                        expect(osmDataBase).toBeDefined();
                        expect(osmDataBase.lines.length).not.toEqual(0);
                        expect(osmDataBase.nodes.length).not.toEqual(0);
                        done();
                    })})})});
});

test('full osm integration test',(done)=>{
    expect.assertions(4);
    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.doubleLineLane.locationLines;
    let LRPs = LineEncoder.encode(mapDataBase,locLines,0,0);

    let osmDataBase;

    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        osmDataBase = OSMIntegration.initMapDataBase(highwayData.nodes,highwayData.ways,highwayData.relations);
                        expect(osmDataBase.nodes[28929726].getLatitudeDeg()).toEqual(51.2120497);
                        expect(osmDataBase.nodes[28929726].getLongitudeDeg()).toEqual(4.3971693);
                        //https://www.openstreetmap.org/api/0.6/node/28929726
                        // expect(osmDataBase.nodes[28929726].getDistance(51.2120361,4.3974671)).toEqual(20.82);

                        expect(osmDataBase).toBeDefined();
                        let decoded = LineDecoder.decode(osmDataBase,LRPs.LRPs,LRPs.posOffset,LRPs.negOffset);
                        done();
                    })})})});
});