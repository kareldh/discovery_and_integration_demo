import Node from "../map/Node";
import Location from "../coder/Location";
import Line from "../map/Line";
import {locationTypeEnum} from "../map/Enum";

export function generateStraightLaneTestData(){
    let lines = [];
    let nodes = [];
    let locations = [];
    let node1 = new Node(1,51.2120579,4.3974671);
    let node2 = new Node(2,51.2118214,4.3991321);
    let node3 = new Node(3,51.2120361,4.3974671);
    let node4 = new Node(4,51.2120058,4.3976971);
    let node5 = new Node(5,51.2120184,4.3977501);
    //todo: line parameters (length, frc, ...)
    let line1 = new Line(1,node1,node2);
    let line2 = new Line(2,node3,node4);
    let line3 = new Line(3,node4,node5);
    node1.setLines([],[line1]);
    node2.setLines([line1],[]);
    node3.setLines([],[line2]);
    node4.setLines([line2],[line3]);
    node5.setLines([line3],[]);
    nodes.push(node1,node2,node3,node4,node5);
    lines.push(line1,line2,line3);

    let lane1 = new Location(locationTypeEnum.LINE_LOCATION,1);
    lane1.locationLines = [line1];

    let lane2 = new Location();
    lane2.locationLines = [line2,line3];

    locations.push(lane1,lane2);

    return {
        lines: lines,
        nodes: nodes,
        locations: locations
    }
}

export function mapNodesLinesToID(nodes,lines){
    let mappedNodes = {};
    let mappedLines = {};

    nodes.forEach(function (node) {
        mappedNodes[node.getID()] = node;
    });

    lines.forEach(function (line) {
        mappedLines[line.getID()] = line;
    });

    return {
        nodes: mappedNodes,
        lines: mappedLines
    }
}