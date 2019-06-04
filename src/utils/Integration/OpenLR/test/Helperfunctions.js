import Node from "../map/Node";
import Location from "../coder/Location";
import Line from "../map/Line";
import {locationTypeEnum} from "../map/Enum";

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

export function loadRTtestNetworkWithLoop(){
    let n1 = new Node("http://www.openstreetmap.org/node/4691959557",51.2126651,4.4066541);
    let n2 = new Node("http://www.openstreetmap.org/node/5607822120",51.2126422,4.4066453);
    let n3 = new Node("http://www.openstreetmap.org/node/5607832955",51.2126153,4.4067580);
    let n4 = new Node("http://www.openstreetmap.org/node/5607832954",51.2125941,4.4068391);
    let n5 = new Node("http://www.openstreetmap.org/node/5607832950",51.2125183,4.4070575);
    let n6 = new Node("http://www.openstreetmap.org/node/5607832953",51.2124908,4.4071645);
    let n7 = new Node("http://www.openstreetmap.org/node/5607822421",51.2124336,4.4074395);
    let n8 = new Node("http://www.openstreetmap.org/node/5607822443",51.2124724,4.4074550);
    let n9 = new Node("http://www.openstreetmap.org/node/5607832951",51.2125418,4.4073929);
    let n10 = new Node("http://www.openstreetmap.org/node/5607822427",51.2126749,4.4073613);
    let n11 = new Node("http://www.openstreetmap.org/node/5607822435",51.2128848,4.4073296);
    let n12 = new Node("http://www.openstreetmap.org/node/4691959567",51.2128858,4.4082370);
    let n13 = new Node("http://www.openstreetmap.org/node/4691959568",51.2128258,4.4071835);
    let n14 = new Node("http://www.openstreetmap.org/node/4691959569",51.2127736,4.4071085);
    let n15 = new Node("http://www.openstreetmap.org/node/4691959570",51.2127100,4.4069567);

    let l1 = new Line("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/4691959557",n1,n2);
    let l2 = new Line("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/5607822120",n2,n3);
    let l3 = new Line("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/5607832955",n3,n4);
    let l4 = new Line("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/5607832954",n4,n5);
    let l5 = new Line("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/5607832950",n5,n6);
    let l6 = new Line("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/5607832953",n6,n7);
    let l7 = new Line("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/5607822421",n7,n8);
    let l8 = new Line("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/5607822443",n8,n9);
    let l9 = new Line("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/5607832951",n9,n10);
    let l10 = new Line("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/5607822427",n10,n11);
    let l11 = new Line("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/5607822435",n11,n12);
    let l12 = new Line("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/4691959567",n12,n13);
    let l13 = new Line("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/4691959568",n13,n14);
    let l14 = new Line("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/4691959569",n14,n15);
    let l15 = new Line("http://www.openstreetmap.org/way/150668711_http://www.openstreetmap.org/node/4691959570",n15,n1);

    return {
        nodes: [n1,n2,n3,n4,n5,n6,n7,n8,n9,n10,n11,n12,n13,n14,n15],
        lines: [l1,l2,l3,l4,l5,l6,l7,l8,l9,l10,l11,l12,l13,l14,l15]
    }
}