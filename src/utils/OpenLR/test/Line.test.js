import Node from "../map/Node";
import Line from "../map/Line";

test('creating line adds it to node incoming or outgoing lines',()=>{
    let nodeA = new Node(1,-8,-3);
    let nodeB = new Node(2,-6,5);

    let line1 = new Line(1,nodeA,nodeB);
    let line14 = new Line(14,nodeB,nodeA);

    expect(nodeA.getIncomingLines().length).toEqual(1);
    expect(nodeA.getOutgoingLines().length).toEqual(1);
    expect(nodeB.getIncomingLines().length).toEqual(1);
    expect(nodeB.getOutgoingLines().length).toEqual(1);
    expect(nodeA.getIncomingLines()[0]).toBe(line14);
    expect(nodeA.getOutgoingLines()[0]).toBe(line1);
    expect(nodeB.getIncomingLines()[0]).toBe(line1);
    expect(nodeB.getOutgoingLines()[0]).toBe(line14);
});