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
    expect.assertions(5);
    let osmDataBase = new MapDataBase();

    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        OSMIntegration.initMapDataBase(osmDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        expect(osmDataBase).toBeDefined();
                        expect(osmDataBase.lines.length).not.toEqual(0);
                        expect(osmDataBase.nodes.length).not.toEqual(0);
                        expect(osmDataBase.nodes[28929726].getLatitudeDeg()).toEqual(51.2120497);
                        expect(osmDataBase.nodes[28929726].getLongitudeDeg()).toEqual(4.3971693);
                        //https://www.openstreetmap.org/api/0.6/node/28929726
                        // expect(osmDataBase.nodes[28929726].getDistance(51.2120361,4.3974671)).toEqual(20.82);
                        done();
                    })})})});
});

test('full osm integration test singleLineLane',(done)=>{
    expect.assertions(4);
    let decoderProperties = {
        dist: 35,    //maximum distance of a candidate node to a LRP
        bearDiff: 60, //maximum difference between the bearing of a candidate node and that of a LRP
        frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
        lfrcnpDiff: 2, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
        distanceToNextDiff: 100, //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
        alwaysUseProjections: false,
        distMultiplier: 40,
        frcMultiplier: 10,
        fowMultiplier: 20,
        bearMultiplier: 30,
        maxSPSearchRetries: 50
    };

    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.singleLineLane.locationLines;
    let LRPs = LineEncoder.encode(mapDataBase,locLines,0,0);

    let osmDataBase = new MapDataBase();

    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        OSMIntegration.initMapDataBase(osmDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        let decoded = LineDecoder.decode(osmDataBase,LRPs.LRPs,LRPs.posOffset,LRPs.negOffset,decoderProperties);
                        expect(decoded.lines.length).toEqual(1);
                        expect(decoded.lines[0].getID()).toEqual("4579317_28929725_1");
                        expect(decoded.posOffset).toEqual(0);
                        expect(decoded.negOffset).toEqual(0);
                        done();
                    })})})});
});

test('full osm integration test singleLineLane with projections',(done)=>{
    expect.assertions(4);
    let decoderProperties = {
        dist: 35,    //maximum distance of a candidate node to a LRP
        bearDiff: 60, //maximum difference between the bearing of a candidate node and that of a LRP
        frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
        lfrcnpDiff: 2, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
        distanceToNextDiff: 100, //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
        alwaysUseProjections: true,
        distMultiplier: 40,
        frcMultiplier: 10,
        fowMultiplier: 20,
        bearMultiplier: 30,
        maxSPSearchRetries: 50
    };

    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.singleLineLane.locationLines;
    let LRPs = LineEncoder.encode(mapDataBase,locLines,0,0);

    let osmDataBase = new MapDataBase();

    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        OSMIntegration.initMapDataBase(osmDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        let decoded = LineDecoder.decode(osmDataBase,LRPs.LRPs,LRPs.posOffset,LRPs.negOffset,decoderProperties);
                        expect(decoded.lines.length).toEqual(1);
                        expect(decoded.lines[0].getID()).toEqual("4579317_28929725_1");
                        expect(decoded.posOffset).toEqual(20.14936515639738);
                        expect(decoded.negOffset).toEqual(2.958238966655955);
                        done();
                    })})})});
});

test('full osm integration test doubleLineLane',(done)=>{
    expect.assertions(4);
    let decoderProperties = {
        dist: 35,    //maximum distance of a candidate node to a LRP
        bearDiff: 60, //maximum difference between the bearing of a candidate node and that of a LRP
        frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
        lfrcnpDiff: 2, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
        distanceToNextDiff: 100, //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
        alwaysUseProjections: false,
        distMultiplier: 40,
        frcMultiplier: 10,
        fowMultiplier: 20,
        bearMultiplier: 30,
        maxSPSearchRetries: 50
    };

    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.doubleLineLane.locationLines;
    let LRPs = LineEncoder.encode(mapDataBase,locLines,0,0);

    let osmDataBase = new MapDataBase();

    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        OSMIntegration.initMapDataBase(osmDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        let decoded = LineDecoder.decode(osmDataBase,LRPs.LRPs,LRPs.posOffset,LRPs.negOffset,decoderProperties);
                        expect(decoded.lines.length).toEqual(1);
                        expect(decoded.lines[0].getID()).toEqual("4579317_28929725_1");
                        expect(decoded.posOffset).toEqual(0);
                        expect(decoded.negOffset).toEqual(osmDataBase.lines["4579317_28929725_1"].getLength()-40.34184067201833);
                        done();
                    })})})});
});

test('osm integration findCandidatesOrProjections 35 dist',(done)=>{
    expect.assertions(19);
    let decoderProperties = {
        dist: 35,    //maximum distance of a candidate node to a LRP
        bearDiff: 60, //maximum difference between the bearing of a candidate node and that of a LRP
        frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
        lfrcnpDiff: 2, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
        distanceToNextDiff: 100, //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
        alwaysUseProjections: false,
        distMultiplier: 40,
        frcMultiplier: 10,
        fowMultiplier: 20,
        bearMultiplier: 30,
        maxSPSearchRetries: 50
    };

    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.doubleLineLane.locationLines;
    let LRPs = LineEncoder.encode(mapDataBase,locLines,0,0);

    let osmDataBase = new MapDataBase();

    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        OSMIntegration.initMapDataBase(osmDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        expect(osmDataBase.nodes[28929726].getLatitudeDeg()).toEqual(51.2120497);
                        expect(osmDataBase.nodes[28929726].getLongitudeDeg()).toEqual(4.3971693);

                        expect(osmDataBase).toBeDefined();
                        let candidateNodes = LineDecoder.findCandidatesOrProjections(osmDataBase,LRPs.LRPs,decoderProperties);
                        // the first LRP should have a real node, the second LRP should have two projected points
                        expect(candidateNodes[0].length).toEqual(2);
                        expect(candidateNodes[0][1].node).toBeDefined();
                        expect(candidateNodes[0][1].node.id).toEqual("28929726");
                        expect(candidateNodes[0][1].node.lat).toEqual(51.2120497);
                        expect(candidateNodes[0][1].node.long).toEqual(4.3971693);
                        expect(candidateNodes[0][0].node).toBeDefined();
                        expect(candidateNodes[0][0].node.id).toEqual("5917934406");
                        expect(candidateNodes[0][0].node.lat).toEqual(51.2118663);
                        expect(candidateNodes[0][0].node.long).toEqual(4.3971962);
                        expect(candidateNodes[1].length).toEqual(2);
                        expect(candidateNodes[1][0].node).toBeUndefined();
                        expect(candidateNodes[1][0].line).toBeDefined();
                        expect(candidateNodes[1][0].line.getID()).toEqual("4579317_28929725");
                        expect(candidateNodes[1][1].node).toBeUndefined();
                        expect(candidateNodes[1][1].line).toBeDefined();
                        expect(candidateNodes[1][1].line.getID()).toEqual("4579317_28929725_1");
                        done();
                    })})})});
});

test('osm integration findCandidatesOrProjections 50 dist',(done)=>{
    expect.assertions(21);
    let decoderProperties = {
        dist: 50,    //maximum distance of a candidate node to a LRP
        bearDiff: 60, //maximum difference between the bearing of a candidate node and that of a LRP
        frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
        lfrcnpDiff: 2, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
        distanceToNextDiff: 100, //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
        alwaysUseProjections: false,
        distMultiplier: 40,
        frcMultiplier: 10,
        fowMultiplier: 20,
        bearMultiplier: 30,
        maxSPSearchRetries: 50
    };

    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.doubleLineLane.locationLines;
    let LRPs = LineEncoder.encode(mapDataBase,locLines,0,0);

    let osmDataBase = new MapDataBase();

    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        OSMIntegration.initMapDataBase(osmDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        expect(osmDataBase.nodes[28929726].getLatitudeDeg()).toEqual(51.2120497);
                        expect(osmDataBase.nodes[28929726].getLongitudeDeg()).toEqual(4.3971693);

                        expect(osmDataBase).toBeDefined();
                        let candidateNodes = LineDecoder.findCandidatesOrProjections(osmDataBase,LRPs.LRPs,decoderProperties);
                        // the first LRP should have a real node, the second LRP should have two projected points
                        expect(candidateNodes[0].length).toEqual(2);
                        expect(candidateNodes[0][1].node).toBeDefined();
                        expect(candidateNodes[0][1].node.id).toEqual("28929726");
                        expect(candidateNodes[0][1].node.lat).toEqual(51.2120497);
                        expect(candidateNodes[0][1].node.long).toEqual(4.3971693);
                        expect(candidateNodes[0][0].node).toBeDefined();
                        expect(candidateNodes[0][0].node.id).toEqual("5917934406");
                        expect(candidateNodes[0][0].node.lat).toEqual(51.2118663);
                        expect(candidateNodes[0][0].node.long).toEqual(4.3971962);
                        expect(candidateNodes[1].length).toEqual(2);
                        expect(candidateNodes[1][1].node).toBeDefined();
                        expect(candidateNodes[1][1].node.id).toEqual("28929726");
                        expect(candidateNodes[1][1].node.lat).toEqual(51.2120497);
                        expect(candidateNodes[1][1].node.long).toEqual(4.3971693);
                        expect(candidateNodes[1][0].node).toBeDefined();
                        expect(candidateNodes[1][0].node.id).toEqual("5917934406");
                        expect(candidateNodes[1][0].node.lat).toEqual(51.2118663);
                        expect(candidateNodes[1][0].node.long).toEqual(4.3971962);
                        done();
                    })})})});
});

test('osm integration findCandidatesOrProjections 50 dist always project',(done)=>{
    expect.assertions(33);
    let decoderProperties = {
        dist: 50,    //maximum distance of a candidate node to a LRP
        bearDiff: 60, //maximum difference between the bearing of a candidate node and that of a LRP
        frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
        lfrcnpDiff: 2, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
        distanceToNextDiff: 100, //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
        alwaysUseProjections: true,
        distMultiplier: 40,
        frcMultiplier: 10,
        fowMultiplier: 20,
        bearMultiplier: 30,
        maxSPSearchRetries: 50
    };

    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.doubleLineLane.locationLines;
    let LRPs = LineEncoder.encode(mapDataBase,locLines,0,0);

    let osmDataBase = new MapDataBase();

    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        OSMIntegration.initMapDataBase(osmDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        expect(osmDataBase.nodes[28929726].getLatitudeDeg()).toEqual(51.2120497);
                        expect(osmDataBase.nodes[28929726].getLongitudeDeg()).toEqual(4.3971693);

                        expect(osmDataBase).toBeDefined();
                        let candidateNodes = LineDecoder.findCandidatesOrProjections(osmDataBase,LRPs.LRPs,decoderProperties);
                        // the first LRP should have a real node, the second LRP should have two projected points
                        expect(candidateNodes[0].length).toEqual(8);
                        expect(candidateNodes[0][1].node).toBeDefined();
                        expect(candidateNodes[0][1].node.id).toEqual("28929726");
                        expect(candidateNodes[0][1].node.lat).toEqual(51.2120497);
                        expect(candidateNodes[0][1].node.long).toEqual(4.3971693);
                        expect(candidateNodes[0][0].node).toBeDefined();
                        expect(candidateNodes[0][0].node.id).toEqual("5917934406");
                        expect(candidateNodes[0][0].node.lat).toEqual(51.2118663);
                        expect(candidateNodes[0][0].node.long).toEqual(4.3971962);
                        expect(candidateNodes[0][2].node).toBeUndefined();
                        expect(candidateNodes[0][2].line).toBeDefined();
                        expect(candidateNodes[0][2].line.getID()).toEqual("4579317_28929725");
                        expect(candidateNodes[0][3].node).toBeUndefined();
                        expect(candidateNodes[0][3].line).toBeDefined();
                        expect(candidateNodes[0][3].line.getID()).toEqual("4579317_28929725_1");
                        expect(candidateNodes[1].length).toEqual(8);
                        expect(candidateNodes[1][1].node).toBeDefined();
                        expect(candidateNodes[1][1].node.id).toEqual("28929726");
                        expect(candidateNodes[1][1].node.lat).toEqual(51.2120497);
                        expect(candidateNodes[1][1].node.long).toEqual(4.3971693);
                        expect(candidateNodes[1][0].node).toBeDefined();
                        expect(candidateNodes[1][0].node.id).toEqual("5917934406");
                        expect(candidateNodes[1][0].node.lat).toEqual(51.2118663);
                        expect(candidateNodes[1][0].node.long).toEqual(4.3971962);
                        expect(candidateNodes[1][2].node).toBeUndefined();
                        expect(candidateNodes[1][2].line).toBeDefined();
                        expect(candidateNodes[1][2].line.getID()).toEqual("4579317_28929725");
                        expect(candidateNodes[1][3].node).toBeUndefined();
                        expect(candidateNodes[1][3].line).toBeDefined();
                        expect(candidateNodes[1][3].line.getID()).toEqual("4579317_28929725_1");
                        done();
                    })})})});
});

test('osm integration findCandidateLines',(done)=>{
    expect.assertions(5);
    let decoderProperties = {
        dist: 35,    //maximum distance of a candidate node to a LRP
        bearDiff: 60, //maximum difference between the bearing of a candidate node and that of a LRP
        frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
        lfrcnpDiff: 2, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
        distanceToNextDiff: 100, //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
        alwaysUseProjections: false,
        distMultiplier: 40,
        frcMultiplier: 10,
        fowMultiplier: 20,
        bearMultiplier: 30,
        maxSPSearchRetries: 50
    };

    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.doubleLineLane.locationLines;
    let LRPs = LineEncoder.encode(mapDataBase,locLines,0,0);

    let osmDataBase = new MapDataBase();

    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        OSMIntegration.initMapDataBase(osmDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        let candidateNodes = LineDecoder.findCandidatesOrProjections(osmDataBase,LRPs.LRPs,decoderProperties);
                        let candidateLines = LineDecoder.findCandidateLines(LRPs.LRPs,candidateNodes,decoderProperties);
                        //the first LRP had a real candidate node, which should be the start node of the found line,
                        //the second LRP had 2 projected candidate nodes, of which only one's line has the right direction
                        expect(candidateLines[0].length).toEqual(1);
                        expect(candidateLines[0][0].line.getStartNode().getID()).toEqual("28929726");
                        expect(candidateLines[0][0].line.getID()).toEqual("4579317_28929725_1");
                        expect(candidateLines[1].length).toEqual(1);
                        expect(candidateLines[1][0].line.getID()).toEqual("4579317_28929725_1");
                        done();
                    })})})});
});

test('osm integration findCandidateLines 50 dist',(done)=>{
    expect.assertions(6);
    let decoderProperties = {
        dist: 50,    //maximum distance of a candidate node to a LRP
        bearDiff: 60, //maximum difference between the bearing of a candidate node and that of a LRP
        frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
        lfrcnpDiff: 2, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
        distanceToNextDiff: 100, //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
        alwaysUseProjections: false,
        distMultiplier: 40,
        frcMultiplier: 10,
        fowMultiplier: 20,
        bearMultiplier: 30,
        maxSPSearchRetries: 50
    };

    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.doubleLineLane.locationLines;
    let LRPs = LineEncoder.encode(mapDataBase,locLines,0,0);

    let osmDataBase = new MapDataBase();

    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        OSMIntegration.initMapDataBase(osmDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        let candidateNodes = LineDecoder.findCandidatesOrProjections(osmDataBase,LRPs.LRPs,decoderProperties);
                        let candidateLines = LineDecoder.findCandidateLines(LRPs.LRPs,candidateNodes,decoderProperties);
                        expect(candidateLines[0].length).toEqual(1);
                        expect(candidateLines[0][0].line.getStartNode().getID()).toEqual("28929726");
                        expect(candidateLines[0][0].line.getID()).toEqual("4579317_28929725_1");
                        expect(candidateLines[1].length).toEqual(2);
                        expect(candidateLines[1][0].line.getID()).toEqual("211184913_28929726_1");
                        expect(candidateLines[1][1].line.getID()).toEqual("51356773_28929726_1");
                        done();
                    })})})});
});

test('osm integration findCandidateLines 50 dist always project',(done)=>{
    expect.assertions(14);
    let decoderProperties = {
        dist: 50,    //maximum distance of a candidate node to a LRP
        bearDiff: 60, //maximum difference between the bearing of a candidate node and that of a LRP
        frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
        lfrcnpDiff: 2, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
        distanceToNextDiff: 100, //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
        alwaysUseProjections: true,
        distMultiplier: 40,
        frcMultiplier: 10,
        fowMultiplier: 20,
        bearMultiplier: 30,
        maxSPSearchRetries: 50
    };

    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.doubleLineLane.locationLines;
    let LRPs = LineEncoder.encode(mapDataBase,locLines,0,0);

    let osmDataBase = new MapDataBase();

    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        OSMIntegration.initMapDataBase(osmDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        let candidateNodes = LineDecoder.findCandidatesOrProjections(osmDataBase,LRPs.LRPs,decoderProperties);
                        let candidateLines = LineDecoder.findCandidateLines(LRPs.LRPs,candidateNodes,decoderProperties);
                        expect(candidateLines[0].length).toEqual(2);
                        expect(candidateLines[0][0].line.getID()).toEqual("4579317_28929725_1");
                        expect(candidateLines[0][0].projected).toEqual(true);
                        expect(candidateLines[0][1].line.getID()).toEqual("4579317_28929725_1");
                        expect(candidateLines[0][1].projected).toEqual(false);
                        expect(candidateLines[1].length).toEqual(4);
                        expect(candidateLines[1][0].line.getID()).toEqual("4579317_28929725_1");
                        expect(candidateLines[1][0].projected).toEqual(true);
                        expect(candidateLines[1][1].line.getID()).toEqual("211184913_28929726_1");
                        expect(candidateLines[1][1].projected).toEqual(false);
                        expect(candidateLines[1][2].line.getID()).toEqual("51356773_28929726_1");
                        expect(candidateLines[1][2].projected).toEqual(false);
                        expect(candidateLines[1][3].line.getID()).toEqual("7940936_28929726");
                        expect(candidateLines[1][3].projected).toEqual(true);
                        done();
                    })})})});
});

test('osm integration determineShortestPaths',(done)=>{
    expect.assertions(4);
    let decoderProperties = {
        dist: 35,    //maximum distance of a candidate node to a LRP
        bearDiff: 60, //maximum difference between the bearing of a candidate node and that of a LRP
        frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
        lfrcnpDiff: 2, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
        distanceToNextDiff: 100, //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
        alwaysUseProjections: false,
        distMultiplier: 40,
        frcMultiplier: 10,
        fowMultiplier: 20,
        bearMultiplier: 30,
        maxSPSearchRetries: 50
    };

    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.doubleLineLane.locationLines;
    let LRPs = LineEncoder.encode(mapDataBase,locLines,0,0);

    let osmDataBase = new MapDataBase();

    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        OSMIntegration.initMapDataBase(osmDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        let candidateNodes = LineDecoder.findCandidatesOrProjections(osmDataBase,LRPs.LRPs,decoderProperties);
                        let candidateLines = LineDecoder.findCandidateLines(LRPs.LRPs,candidateNodes,decoderProperties);
                        let concatShortestPath = LineDecoder.determineShortestPaths(candidateLines,LRPs.LRPs,decoderProperties);
                        expect(concatShortestPath.shortestPath.length).toEqual(1);
                        expect(concatShortestPath.shortestPath[0].getID()).toEqual("4579317_28929725_1");
                        expect(concatShortestPath.posProjDist).toEqual(0);
                        expect(concatShortestPath.negProjDist).toEqual(osmDataBase.lines["4579317_28929725_1"].getLength()-40.34184067201833);
                        done();
                    })})})});
});

test('osm integration determineShortestPaths 50 dist',(done)=>{
    expect.assertions(1);
    let decoderProperties = {
        dist: 50,    //maximum distance of a candidate node to a LRP
        bearDiff: 60, //maximum difference between the bearing of a candidate node and that of a LRP
        frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
        lfrcnpDiff: 2, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
        distanceToNextDiff: 100, //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
        alwaysUseProjections: false,
        distMultiplier: 40,
        frcMultiplier: 10,
        fowMultiplier: 20,
        bearMultiplier: 30,
        maxSPSearchRetries: 50
    };

    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.doubleLineLane.locationLines;
    let LRPs = LineEncoder.encode(mapDataBase,locLines,0,0);

    let osmDataBase = new MapDataBase();

    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        OSMIntegration.initMapDataBase(osmDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        let candidateNodes = LineDecoder.findCandidatesOrProjections(osmDataBase,LRPs.LRPs,decoderProperties);
                        let candidateLines = LineDecoder.findCandidateLines(LRPs.LRPs,candidateNodes,decoderProperties);
                        expect(()=>{LineDecoder.determineShortestPaths(candidateLines,LRPs.LRPs,decoderProperties)}).toThrow(Error("No shortest path could be found between the given LRPs with indexes 0 and 1" +
                            " You either tried to decode a loop that isn't present in the current map " +
                            "or you tried decoding a line between two points that are to close together and decoded as a single node"));
                        done();
                    })})})});
});

test('osm integration determineShortestPaths 50 dist always project',(done)=>{
    expect.assertions(4);
    let decoderProperties = {
        dist: 50,    //maximum distance of a candidate node to a LRP
        bearDiff: 60, //maximum difference between the bearing of a candidate node and that of a LRP
        frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
        lfrcnpDiff: 2, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
        distanceToNextDiff: 100, //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
        alwaysUseProjections: true,
        distMultiplier: 40,
        frcMultiplier: 10,
        fowMultiplier: 20,
        bearMultiplier: 30,
        maxSPSearchRetries: 50
    };

    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.doubleLineLane.locationLines;
    let LRPs = LineEncoder.encode(mapDataBase,locLines,0,0);

    let osmDataBase = new MapDataBase();

    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        OSMIntegration.initMapDataBase(osmDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        let candidateNodes = LineDecoder.findCandidatesOrProjections(osmDataBase,LRPs.LRPs,decoderProperties);
                        let candidateLines = LineDecoder.findCandidateLines(LRPs.LRPs,candidateNodes,decoderProperties);
                        let concatShortestPath = LineDecoder.determineShortestPaths(candidateLines,LRPs.LRPs,decoderProperties);
                        expect(concatShortestPath.shortestPath.length).toEqual(1);
                        expect(concatShortestPath.shortestPath[0].getID()).toEqual("4579317_28929725_1");
                        expect(concatShortestPath.posProjDist).toEqual(20.63115153709108); // if alwaysUseProjections = true, the first LRP is also projected
                        expect(concatShortestPath.negProjDist).toEqual(osmDataBase.lines["4579317_28929725_1"].getLength()-40.34184067201833);
                        done();
                    })})})});
});

test('osm integration trimAccordingToOffsets no offsets',(done)=>{
    expect.assertions(6);
    let decoderProperties = {
        dist: 35,    //maximum distance of a candidate node to a LRP
        bearDiff: 60, //maximum difference between the bearing of a candidate node and that of a LRP
        frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
        lfrcnpDiff: 2, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
        distanceToNextDiff: 100, //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
        alwaysUseProjections: false,
        distMultiplier: 40,
        frcMultiplier: 10,
        fowMultiplier: 20,
        bearMultiplier: 30,
        maxSPSearchRetries: 50
    };

    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.doubleLineLane.locationLines;
    let LRPs = LineEncoder.encode(mapDataBase,locLines,0,0);

    let osmDataBase = new MapDataBase();

    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        OSMIntegration.initMapDataBase(osmDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        let candidateNodes = LineDecoder.findCandidatesOrProjections(osmDataBase,LRPs.LRPs,decoderProperties);
                        let candidateLines = LineDecoder.findCandidateLines(LRPs.LRPs,candidateNodes,decoderProperties);
                        let concatShortestPath = LineDecoder.determineShortestPaths(candidateLines,LRPs.LRPs,decoderProperties);
                        let offsets = {posOffset: 0, negOffset: 0};
                        LineDecoder.trimAccordingToOffsets(concatShortestPath,offsets);
                        expect(concatShortestPath.shortestPath.length).toEqual(1);
                        expect(concatShortestPath.shortestPath[0].getID()).toEqual("4579317_28929725_1");
                        expect(concatShortestPath.posProjDist).toEqual(0);
                        expect(concatShortestPath.negProjDist).toEqual(osmDataBase.lines["4579317_28929725_1"].getLength()-40.34184067201833);
                        expect(offsets.posOffset).toEqual(0);
                        expect(offsets.negOffset).toEqual(osmDataBase.lines["4579317_28929725_1"].getLength()-40.34184067201833);
                        done();
                    })})})});
});

test('osm integration trimAccordingToOffsets with invalid offsets',(done)=>{
    expect.assertions(1);
    let decoderProperties = {
        dist: 35,    //maximum distance of a candidate node to a LRP
        bearDiff: 60, //maximum difference between the bearing of a candidate node and that of a LRP
        frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
        lfrcnpDiff: 2, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
        distanceToNextDiff: 100, //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
        alwaysUseProjections: false,
        distMultiplier: 40,
        frcMultiplier: 10,
        fowMultiplier: 20,
        bearMultiplier: 30,
        maxSPSearchRetries: 50
    };

    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.doubleLineLane.locationLines;
    let LRPs = LineEncoder.encode(mapDataBase,locLines,0,0);

    let osmDataBase = new MapDataBase();

    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        OSMIntegration.initMapDataBase(osmDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        let candidateNodes = LineDecoder.findCandidatesOrProjections(osmDataBase,LRPs.LRPs,decoderProperties);
                        let candidateLines = LineDecoder.findCandidateLines(LRPs.LRPs,candidateNodes,decoderProperties);
                        let concatShortestPath = LineDecoder.determineShortestPaths(candidateLines,LRPs.LRPs,decoderProperties);
                        let offsets = {posOffset: 0, negOffset: 120};
                        expect(()=>{LineDecoder.trimAccordingToOffsets(concatShortestPath,offsets)}).toThrow(Error("The remaining shortest path after trimming according to offsets is empty."));
                        done();
                    })})})});
});

test('osm integration trimAccordingToOffsets valid offsets',(done)=>{
    expect.assertions(6);
    let decoderProperties = {
        dist: 35,    //maximum distance of a candidate node to a LRP
        bearDiff: 60, //maximum difference between the bearing of a candidate node and that of a LRP
        frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
        lfrcnpDiff: 2, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
        distanceToNextDiff: 100, //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
        alwaysUseProjections: false,
        distMultiplier: 40,
        frcMultiplier: 10,
        fowMultiplier: 20,
        bearMultiplier: 30,
        maxSPSearchRetries: 50
    };

    let startData = generateStraightLaneTestData();
    let {nodes,lines} = mapNodesLinesToID(startData.nodes,startData.lines);
    let mapDataBase = new MapDataBase(lines,nodes);
    let locLines = startData.doubleLineLane.locationLines;
    let LRPs = LineEncoder.encode(mapDataBase,locLines,0,0);

    let osmDataBase = new MapDataBase();

    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        OSMIntegration.initMapDataBase(osmDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        let candidateNodes = LineDecoder.findCandidatesOrProjections(osmDataBase,LRPs.LRPs,decoderProperties);
                        let candidateLines = LineDecoder.findCandidateLines(LRPs.LRPs,candidateNodes,decoderProperties);
                        let concatShortestPath = LineDecoder.determineShortestPaths(candidateLines,LRPs.LRPs,decoderProperties);
                        let offsets = {posOffset: 5, negOffset: 7};
                        LineDecoder.trimAccordingToOffsets(concatShortestPath,offsets);
                        expect(concatShortestPath.shortestPath.length).toEqual(1);
                        expect(concatShortestPath.shortestPath[0].getID()).toEqual("4579317_28929725_1");
                        expect(concatShortestPath.posProjDist).toEqual(0);
                        expect(concatShortestPath.negProjDist).toEqual(osmDataBase.lines["4579317_28929725_1"].getLength()-40.34184067201833);
                        expect(offsets.posOffset).toEqual(5);
                        expect(offsets.negOffset).toEqual(osmDataBase.lines["4579317_28929725_1"].getLength()-40.34184067201833+7);
                        done();
                    })})})});
});

test('osm integration full integration previously crashing because bad length calculation',(done)=>{
    expect.assertions(4);
    let decoderProperties = {
        dist: 35,    //maximum distance of a candidate node to a LRP
        bearDiff: 60, //maximum difference between the bearing of a candidate node and that of a LRP
        frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
        lfrcnpDiff: 2, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
        distanceToNextDiff: 100, //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
        alwaysUseProjections: true,
        distMultiplier: 40,
        frcMultiplier: 10,
        fowMultiplier: 20,
        bearMultiplier: 30,
        maxSPSearchRetries: 50
    };

    let LRP_0 = {
        bearing: 36.15816556660661,
        distanceToNext: 33,
        fow: 0,
        frc: undefined,
        isLast: false,
        lat: 51.21201178548282,
        lfrcnp: 7,
        long: 4.397157132625581,
        seqNr: 1
    };
    let LRP_1 = {
        bearing: 287.9390391708996,
        distanceToNext: 0,
        fow: 0,
        frc: undefined,
        isLast: true,
        lat: 51.211979860833395,
        lfrcnp: 7,
        long: 4.397580921649934,
        seqNr: 2
    };
    let LRPs = [LRP_0,LRP_1];

    let osmDataBase = new MapDataBase();

    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        OSMIntegration.initMapDataBase(osmDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        let decoded = LineDecoder.decode(osmDataBase,LRPs,0,0,decoderProperties);
                        console.log(decoded);
                        expect(decoded.lines[0].getID()).toEqual("51356773_28929726_1");
                        expect(decoded.lines[1].getID()).toEqual("4579317_28929725_1");
                        expect(decoded.posOffset).toEqual(57.235960971534844);
                        expect(decoded.negOffset).toEqual(112.3557074140935);
                        done();
                    })})})});

});