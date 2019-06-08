/**
 * @jest-environment node
 */

import {fetchRoutableTile, loadNodesLineStringsWegenregisterAntwerpen} from "../Data/LoadData";
import MapDataBase from "../OpenLR/map/MapDataBase";
import WegenregisterAntwerpenIntegration from "../OpenLRIntegration/WegenregisterAntwerpenIntegration";
import {getRoutableTilesNodesAndLines} from "../Data/ParseData";
import RoutableTilesIntegration from "../OpenLRIntegration/RoutableTilesIntegration";
import {configProperties} from "../OpenLR/coder/CoderSettings";

test.skip('density wegenregister',(done)=>{
    loadNodesLineStringsWegenregisterAntwerpen().then(features => {
        let mapDatabase = new MapDataBase();
        WegenregisterAntwerpenIntegration.initMapDataBase(mapDatabase,features);

        let lines = mapDatabase.findLinesCloseByCoordinate(51.2120497,4.3971693,500*configProperties.internalPrecision);
        let nodes = mapDatabase.findNodesCloseByCoordinate(51.2120497,4.3971693,500*configProperties.internalPrecision);
        console.log("Nodes:",nodes.length,"Lines:",lines.length);
        expect(lines).toBeDefined();
        expect(nodes).toBeDefined();
        done();
    });
});

test.skip('density routable tiles',(done)=>{
    fetchRoutableTile(14,8392,5469)
        .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
            .then((nodesAndLines)=> {
                let mapDatabase = new MapDataBase();
                RoutableTilesIntegration.initMapDataBase(mapDatabase, nodesAndLines.nodes,nodesAndLines.lines);

                let lines = mapDatabase.findLinesCloseByCoordinate(51.2120497,4.3971693,500*configProperties.internalPrecision);
                let nodes = mapDatabase.findNodesCloseByCoordinate(51.2120497,4.3971693,500*configProperties.internalPrecision);
                console.log("Nodes:",nodes.length,"Lines:",lines.length);
                expect(lines).toBeDefined();
                expect(nodes).toBeDefined();
                done();
            })});
});