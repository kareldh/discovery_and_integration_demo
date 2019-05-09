import {generateRealisticLengthTestNetwork, mapNodesLinesToID} from "../../test/Helperfunctions";
import RbushSearchTree from "../RbushNodeSearchTree";

test('RbushNodeSearchTree constructor',()=>{
    let network = generateRealisticLengthTestNetwork();
    let data = mapNodesLinesToID(network.nodes,network.lines);
    let searchTree = new RbushSearchTree(data.nodes);
    expect(searchTree).toBeDefined();
    // console.log(network.lines[7].getLength(),network.lines[8].getLength(),network.lines[13].getLength(),network.lines[11].getLength(),network.lines[12].getLength(),network.nodes[6].getDistance(network.nodes[8].getLatitudeDeg(),network.nodes[8].getLongitudeDeg()));
    let searchResult = searchTree.findCloseBy(3*0.001+51,2*0.001+4,493);
    // console.log(searchResult);
    expect(searchResult.length).toEqual(7);
});