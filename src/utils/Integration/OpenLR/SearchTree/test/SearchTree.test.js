import {generateRealisticLengthTestNetwork, mapNodesLinesToID} from "../../test/Helperfunctions";
import GeoJSONRbushLineSearchTree from "../GeoJSONRbushLineSearchTree";
import RbushLineSearchTree from "../RbushLineSearchTree";
import RbushSearchTree from "../RbushNodeSearchTree";
import GeoJSONRbushSearchTree from "../GeoJSONRbushNodeSearchTree";

test('GeoJSONRbushLineSearchTree vs RbusLineSearchTree',()=>{
    let network = generateRealisticLengthTestNetwork();
    let data = mapNodesLinesToID(network.nodes,network.lines);

    let t1  = performance.now();
    let searchTree = new RbushLineSearchTree(data.lines);
    let searchResult = searchTree.findCloseBy(3*0.001+51,2*0.001+4,493);
    let t2 = performance.now();
    console.log("found in",t2-t1,"ms using RbushLineSearchTree");

    let t3  = performance.now();
    let searchTree2 = new GeoJSONRbushLineSearchTree(data.lines);
    let searchResult2 = searchTree2.findCloseBy(3*0.001+51,2*0.001+4,493);
    let t4 = performance.now();
    console.log("found in",t4-t3,"ms using GeoJSONRbushLineSearchTree");

    expect(searchResult.length).toEqual(24);
    expect(searchResult2.length).toEqual(24);
});

test('GeoJSONRbushNodeSearchTree vs RbushNodeSearchTree',()=>{
    let network = generateRealisticLengthTestNetwork();
    let data = mapNodesLinesToID(network.nodes,network.lines);

    let t1  = performance.now();
    let searchTree = new RbushSearchTree(data.nodes);
    let searchResult = searchTree.findCloseBy(3*0.001+51,2*0.001+4,493);
    let t2 = performance.now();
    console.log("found in",t2-t1,"ms using RbushNodeSearchTree");

    let t3  = performance.now();
    let searchTree2 = new GeoJSONRbushSearchTree(data.nodes);
    let searchResult2 = searchTree2.findCloseBy(3*0.001+51,2*0.001+4,493);
    let t4 = performance.now();
    console.log("found in",t4-t3,"ms using GeoJSONRbushNodeSearchTree");

    expect(searchResult.length).toEqual(7);
    expect(searchResult2.length).toEqual(7);
});