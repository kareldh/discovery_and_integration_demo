import Node from "../map/Node";
import Location from "../coder/Location";
import Line from "../map/Line";
import {locationTypeEnum} from "../map/Enum";
import {map} from "../../Data/testdata/osmMap";

export function generateStraightLaneTestData(){
    let lines = [];
    let nodes = [];
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

    let singleLineLane = new Location(locationTypeEnum.LINE_LOCATION,1);
    singleLineLane.locationLines = [line1];

    let doubleLineLane = new Location(locationTypeEnum.LINE_LOCATION,2);
    doubleLineLane.locationLines = [line2,line3];

    let unconnectedLane = new Location(locationTypeEnum.LINE_LOCATION,3);
    unconnectedLane.locationLines = [line1,line3];

    let invalidStartNodeLane = new Location(locationTypeEnum.LINE_LOCATION,4);
    invalidStartNodeLane.locationLines=[line3];

    let invalidEndNodeLane = new Location(locationTypeEnum.LINE_LOCATION,5);
    invalidEndNodeLane.locationLines=[line2];

    return {
        lines: lines,
        nodes: nodes,
        singleLineLane: singleLineLane,
        doubleLineLane: doubleLineLane,
        unconnectedLane: unconnectedLane,
        invalidStartNodeLane: invalidStartNodeLane,
        invalidEndNodeLane: invalidEndNodeLane
    }
}

export function mapNodesLinesToID(nodes,lines){
    let mappedNodes = {};
    let mappedLines = {};

    nodes.forEach(function (node) {
        if(node !== undefined)
            mappedNodes[node.getID()] = node;
    });

    lines.forEach(function (line) {
        if(line !== undefined)
            mappedLines[line.getID()] = line;
    });

    return {
        nodes: mappedNodes,
        lines: mappedLines
    }
}

export function generateTestNetwork(){
    let nodeA = new Node(1,-8,-3);
    let nodeB = new Node(2,-6,5);
    let nodeC = new Node(3,-3,3);
    let nodeD = new Node(4,-1,1);
    let nodeE = new Node(5,-1,-2);
    let nodeF = new Node(6,0,5);
    let nodeG = new Node(7,3,5);
    let nodeH = new Node(8,3,2);
    let nodeI = new Node(9,7,5);
    let nodeJ = new Node(10,7,-1);

    let line1 = new Line(1,nodeA,nodeB);
    let line14 = new Line(14,nodeB,nodeA);
    let line2 = new Line(2,nodeB,nodeF);
    let line15 = new Line(15,nodeF,nodeB);
    let line3 = new Line(3,nodeF,nodeG);
    let line16 = new Line(16,nodeG,nodeF);
    let line4 = new Line(4,nodeG,nodeI);
    let line17 = new Line(17,nodeI,nodeG);
    let line5 = new Line(5,nodeC,nodeF);
    let line18 = new Line(18,nodeF,nodeC);
    let line6 = new Line(6,nodeD,nodeG);
    let line19 = new Line(19,nodeG,nodeD);
    let line7 = new Line(7,nodeH,nodeG);
    let line20 = new Line(20,nodeG,nodeH);
    let line8 = new Line(8,nodeH,nodeI);
    let line21 = new Line(21,nodeI,nodeH);
    let line9 = new Line(9,nodeI,nodeJ);
    let line22 = new Line(22,nodeJ,nodeI);
    let line10 = new Line(10,nodeC,nodeD);
    let line23 = new Line(23,nodeD,nodeC);
    let line11 = new Line(11,nodeD,nodeH);
    let line24 = new Line(24,nodeH,nodeD);
    let line12 = new Line(12,nodeE,nodeH);
    let line25 = new Line(25,nodeH,nodeE);
    let line13 = new Line(13,nodeH,nodeJ);
    let line26 = new Line(26,nodeJ,nodeH);

    return {
        nodes: [nodeA,nodeB,nodeC,nodeD,nodeE,nodeF,nodeG,nodeH,nodeI,nodeJ],
        lines: [undefined,line1,line2,line3,line4,line5,line6,line7,line8,line9,line10,line11,line12,line13,line14,line15,line16,line17,line18,line19,line20,line21,line22,line23,line24,line25,line26]
    }
}

export function generateRealisticLengthTestNetwork(){
    let nodeA = new Node(1,-8*0.001+51,-3*0.001+4);
    let nodeB = new Node(2,-6*0.001+51,5*0.001+4);
    let nodeC = new Node(3,-3*0.001+51,3*0.001+4);
    let nodeD = new Node(4,-1*0.001+51,1*0.001+4);
    let nodeE = new Node(5,-1*0.001+51,-2*0.001+4);
    let nodeF = new Node(6,0*0.001+51,5*0.001+4);
    let nodeG = new Node(7,3*0.001+51,5*0.001+4);
    let nodeH = new Node(8,3*0.001+51,2*0.001+4);
    let nodeI = new Node(9,7*0.001+51,5*0.001+4);
    let nodeJ = new Node(10,7*0.001+51,-1*0.001+4);

    let line1 = new Line(1,nodeA,nodeB);
    let line14 = new Line(14,nodeB,nodeA);
    let line2 = new Line(2,nodeB,nodeF);
    let line15 = new Line(15,nodeF,nodeB);
    let line3 = new Line(3,nodeF,nodeG);
    let line16 = new Line(16,nodeG,nodeF);
    let line4 = new Line(4,nodeG,nodeI);
    let line17 = new Line(17,nodeI,nodeG);
    let line5 = new Line(5,nodeC,nodeF);
    let line18 = new Line(18,nodeF,nodeC);
    let line6 = new Line(6,nodeD,nodeG);
    let line19 = new Line(19,nodeG,nodeD);
    let line7 = new Line(7,nodeH,nodeG);
    let line20 = new Line(20,nodeG,nodeH);
    let line8 = new Line(8,nodeH,nodeI);
    let line21 = new Line(21,nodeI,nodeH);
    let line9 = new Line(9,nodeI,nodeJ);
    let line22 = new Line(22,nodeJ,nodeI);
    let line10 = new Line(10,nodeC,nodeD);
    let line23 = new Line(23,nodeD,nodeC);
    let line11 = new Line(11,nodeD,nodeH);
    let line24 = new Line(24,nodeH,nodeD);
    let line12 = new Line(12,nodeE,nodeH);
    let line25 = new Line(25,nodeH,nodeE);
    let line13 = new Line(13,nodeH,nodeJ);
    let line26 = new Line(26,nodeJ,nodeH);

    return {
        nodes: [nodeA,nodeB,nodeC,nodeD,nodeE,nodeF,nodeG,nodeH,nodeI,nodeJ],
        lines: [undefined,line1,line2,line3,line4,line5,line6,line7,line8,line9,line10,line11,line12,line13,line14,line15,line16,line17,line18,line19,line20,line21,line22,line23,line24,line25,line26]
    }
}

export function loadOsmTestData(){
    return new Promise((resolve)=>{
        resolve(map)
    })
}