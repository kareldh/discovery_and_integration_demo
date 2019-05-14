import MapDataBase from "../map/MapDataBase";
import SlowMapDataBase from "../map/SlowMapDataBase";
import {mapNodesLinesToID, generateStraightLaneTestData} from "./Helperfunctions";
import {loadNodesLineStringsWegenregsterAntwerpen} from "../../Data/LoadData";
import WegenregisterAntwerpenIntegration from "../../OpenLRIntegration/WegenregisterAntwerpenIntegration";
import {filterHighwayData, getMappedElements, parseToJson} from "../../Data/ParseData";
import OSMIntegration from "../../OpenLRIntegration/OSMIntegration";
import {loadOsmTestData} from "../../Data/LoadTestData";

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
    expect.assertions(19);
    loadNodesLineStringsWegenregsterAntwerpen().then(features => {
        let slowMapDataBase = new SlowMapDataBase();
        let mapDataBase = new MapDataBase();
        WegenregisterAntwerpenIntegration.initMapDataBase(slowMapDataBase,features);
        WegenregisterAntwerpenIntegration.initMapDataBase(mapDataBase,features);
        expect(mapDataBase).toBeDefined();
        let foundNodes = mapDataBase.findNodesCloseByCoordinate(51.2120497, 4.3971693, 5000);
        expect(slowMapDataBase).toBeDefined();
        let foundNodesSlow = slowMapDataBase.findNodesCloseByCoordinate(51.2120497, 4.3971693, 5000);
        expect(foundNodes.length).not.toEqual(0);
        expect(foundNodesSlow.length).not.toEqual(0);
        expect(foundNodes.length).toEqual(foundNodesSlow.length);
        let found = {};
        foundNodesSlow.forEach((node)=>{
           found[node.node.getID()] = true;
        });
        foundNodes.forEach(node=>{
           expect(found[node.node.getID()]).toEqual(true);
        });
        done();
    });
},60000);

test('findLinesCloseByCoordinate use with a lot of lines (from wegenregister Antwerpen)',(done)=>{
    expect.assertions(41);
    loadNodesLineStringsWegenregsterAntwerpen().then(features => {
        let slowMapDataBase = new SlowMapDataBase();
        let mapDataBase = new MapDataBase();
        WegenregisterAntwerpenIntegration.initMapDataBase(slowMapDataBase,features);
        WegenregisterAntwerpenIntegration.initMapDataBase(mapDataBase,features);
        expect(mapDataBase).toBeDefined();
        let foundLines = mapDataBase.findLinesCloseByCoordinate(51.2120497, 4.3971693, 5000);
        expect(slowMapDataBase).toBeDefined();
        let foundLinesSlow = slowMapDataBase.findLinesCloseByCoordinate(51.2120497, 4.3971693, 5000);
        expect(foundLines.length).not.toEqual(0);
        expect(foundLinesSlow.length).not.toEqual(0);
        expect(foundLines.length).toEqual(foundLinesSlow.length);
        let found = {};
        foundLinesSlow.forEach((line)=>{
            found[line.line.getID()] = true;
        });
        foundLines.forEach(line=>{
            expect(found[line.line.getID()]).toEqual(true);
        });
        done();
    });
},60000);

test('findNodesCloseByCoordinate OSM data',(done)=>{
    expect.assertions(7);
    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        let slowMapDataBase = new SlowMapDataBase();
                        let mapDataBase = new MapDataBase();
                        OSMIntegration.initMapDataBase(mapDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        OSMIntegration.initMapDataBase(slowMapDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        expect(mapDataBase).toBeDefined();
                        let foundNodes = mapDataBase.findNodesCloseByCoordinate(51.2120497, 4.3971693, 5000);
                        expect(slowMapDataBase).toBeDefined();
                        let foundNodesSlow = slowMapDataBase.findNodesCloseByCoordinate(51.2120497, 4.3971693, 5000);
                        expect(foundNodes.length).not.toEqual(0);
                        expect(foundNodesSlow.length).not.toEqual(0);
                        expect(foundNodes.length).toEqual(foundNodesSlow.length);
                        let found = {};
                        foundNodesSlow.forEach((node)=>{
                            found[node.node.getID()] = true;
                        });
                        foundNodes.forEach(node=>{
                            expect(found[node.node.getID()]).toEqual(true);
                        });
                        done();
                    })})})});
});

test('findLinesCloseByCoordinate OSM data',(done)=>{
    expect.assertions(17);
    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        let slowMapDataBase = new SlowMapDataBase();
                        let mapDataBase = new MapDataBase();
                        OSMIntegration.initMapDataBase(mapDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        OSMIntegration.initMapDataBase(slowMapDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        expect(mapDataBase).toBeDefined();
                        let foundLines = mapDataBase.findLinesCloseByCoordinate(51.2120497, 4.3971693, 5000);
                        expect(slowMapDataBase).toBeDefined();
                        let foundLinesSlow = slowMapDataBase.findLinesCloseByCoordinate(51.2120497, 4.3971693, 5000);
                        expect(foundLines.length).not.toEqual(0);
                        expect(foundLinesSlow.length).not.toEqual(0);
                        expect(foundLines.length).toEqual(foundLinesSlow.length);
                        let found = {};
                        foundLinesSlow.forEach((line)=>{
                            found[line.line.getID()] = true;
                        });
                        foundLines.forEach(line=>{
                            expect(found[line.line.getID()]).toEqual(true);
                        });
                        done();
                    })})})});
});

test('findNodesCloseByCoordinate OSM data 2',(done)=>{
    expect.assertions(7);
    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        let slowMapDataBase = new SlowMapDataBase();
                        let mapDataBase = new MapDataBase();
                        OSMIntegration.initMapDataBase(mapDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        OSMIntegration.initMapDataBase(slowMapDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        expect(mapDataBase).toBeDefined();
                        let foundNodes = mapDataBase.findNodesCloseByCoordinate(51.2120361, 4.3974671, 5000);
                        expect(slowMapDataBase).toBeDefined();
                        let foundNodesSlow = slowMapDataBase.findNodesCloseByCoordinate(51.2120361, 4.3974671, 5000);
                        expect(foundNodes.length).not.toEqual(0);
                        expect(foundNodesSlow.length).not.toEqual(0);
                        expect(foundNodes.length).toEqual(foundNodesSlow.length);
                        let found = {};
                        foundNodesSlow.forEach((node)=>{
                            found[node.node.getID()] = true;
                        });
                        foundNodes.forEach(node=>{
                            expect(found[node.node.getID()]).toEqual(true);
                        });
                        done();
                    })})})});
});

test('findLinesCloseByCoordinate OSM data 2',(done)=>{
    expect.assertions(17);
    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        let slowMapDataBase = new SlowMapDataBase();
                        let mapDataBase = new MapDataBase();
                        OSMIntegration.initMapDataBase(mapDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        OSMIntegration.initMapDataBase(slowMapDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        expect(mapDataBase).toBeDefined();
                        let foundLines = mapDataBase.findLinesCloseByCoordinate(51.2120361, 4.3974671, 5000);
                        expect(slowMapDataBase).toBeDefined();
                        let foundLinesSlow = slowMapDataBase.findLinesCloseByCoordinate(51.2120361, 4.3974671, 5000);
                        expect(foundLines.length).not.toEqual(0);
                        expect(foundLinesSlow.length).not.toEqual(0);
                        expect(foundLines.length).toEqual(foundLinesSlow.length);
                        let found = {};
                        foundLinesSlow.forEach((line)=>{
                            found[line.line.getID()] = true;
                        });
                        foundLines.forEach(line=>{
                            expect(found[line.line.getID()]).toEqual(true);
                        });
                        done();
                    })})})});
});

test('findNodesCloseByCoordinate OSM data 3',(done)=>{
    expect.assertions(7);
    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        let slowMapDataBase = new SlowMapDataBase();
                        let mapDataBase = new MapDataBase();
                        OSMIntegration.initMapDataBase(mapDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        OSMIntegration.initMapDataBaseDeprecatedNoOneWay(slowMapDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        expect(mapDataBase).toBeDefined();
                        let foundNodes = mapDataBase.findNodesCloseByCoordinate(51.2120361, 4.3974671, 5000);
                        expect(slowMapDataBase).toBeDefined();
                        let foundNodesSlow = slowMapDataBase.findNodesCloseByCoordinate(51.2120361, 4.3974671, 5000);
                        expect(foundNodes.length).not.toEqual(0);
                        expect(foundNodesSlow.length).not.toEqual(0);
                        expect(foundNodes.length).toEqual(foundNodesSlow.length);
                        let found = {};
                        foundNodesSlow.forEach((node)=>{
                            found[node.node.getID()] = true;
                        });
                        foundNodes.forEach(node=>{
                            expect(found[node.node.getID()]).toEqual(true);
                        });
                        done();
                    })})})});
});

test('findLinesCloseByCoordinate OSM data 3',(done)=>{
    expect.assertions(17);
    loadOsmTestData()
        .then((data)=>{parseToJson(data)
            .then((json)=>{getMappedElements(json)
                .then((elements)=>{filterHighwayData(elements)
                    .then((highwayData)=>{
                        let slowMapDataBase = new SlowMapDataBase();
                        let mapDataBase = new MapDataBase();
                        OSMIntegration.initMapDataBase(mapDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        OSMIntegration.initMapDataBaseDeprecatedNoOneWay(slowMapDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                        expect(mapDataBase).toBeDefined();
                        let foundLines = mapDataBase.findLinesCloseByCoordinate(51.2120361, 4.3974671, 5000);
                        expect(slowMapDataBase).toBeDefined();
                        let foundLinesSlow = slowMapDataBase.findLinesCloseByCoordinate(51.2120361, 4.3974671, 5000);
                        expect(foundLines.length).not.toEqual(0);
                        expect(foundLinesSlow.length).not.toEqual(0);
                        expect(foundLines.length).toEqual(foundLinesSlow.length);
                        let found = {};
                        foundLinesSlow.forEach((line)=>{
                            found[line.line.getID()] = true;
                        });
                        foundLines.forEach(line=>{
                            expect(found[line.line.getID()]).toEqual(true);
                        });
                        done();
                    })})})});
});