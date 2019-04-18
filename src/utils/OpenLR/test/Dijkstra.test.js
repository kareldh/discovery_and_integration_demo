import Node from "../map/Node";
import Line from "../map/Line";
import Dijkstra from "../coder/Dijkstra";

test('ShortestPath',()=>{
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

    let shortestPath = Dijkstra.shortestPath(nodeC,nodeI);
    expect(shortestPath.lines[0].getID()).toEqual(line5.getID());
    expect(shortestPath.lines[1].getID()).toEqual(line3.getID());
    expect(shortestPath.lines[2].getID()).toEqual(line4.getID());
    let shortestPath2 = Dijkstra.shortestPath(nodeA,nodeJ);
    expect(shortestPath2.lines[0].getID()).toEqual(line1.getID());
    expect(shortestPath2.lines[1].getID()).toEqual(line2.getID());
    expect(shortestPath2.lines[2].getID()).toEqual(line3.getID());
    expect(shortestPath2.lines[3].getID()).toEqual(line20.getID());
    expect(shortestPath2.lines[4].getID()).toEqual(line13.getID());
    let shortestPath3 = Dijkstra.shortestPath(nodeA,nodeA);
    expect(shortestPath3).toEqual({
        lines: [],
        length: 0
    });
});