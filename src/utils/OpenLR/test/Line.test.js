import Node from "../map/Node";
import Line from "../map/Line";
import pointToLineDistance from '@turf/point-to-line-distance';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import along from '@turf/along';
import {point,lineString} from '@turf/helpers'
import distance from "@turf/distance/index";
import bearing from '@turf/bearing'

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



function radians(n) {
    return n * (Math.PI / 180);
}

function degrees(n) {
    return n * (180 / Math.PI);
}

function getBearing2(startLat,startLong,endLat,endLong){
    startLat = radians(startLat);
    startLong = radians(startLong);
    endLat = radians(endLat);
    endLong = radians(endLong);

    var dLong = endLong - startLong;

    var dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));
    if (Math.abs(dLong) > Math.PI){
        if (dLong > 0.0)
            dLong = -(2.0 * Math.PI - dLong);
        else
            dLong = (2.0 * Math.PI + dLong);
    }

    return (degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
}

function getBearing3(startLat,startLong,endLat,endLong){
    var lat1 = radians(startLat);
    var lon1 = radians(startLong);
    var lat2 = radians(endLat);
    var lon2 = radians(endLong);
    var a = Math.sin(lon2 - lon1) * Math.cos(lat2);
    var b = Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    console.warn(lat1,lon1,lat2,lon2);
    console.warn(a,b);
    var bearing = (degrees(Math.atan2(a, b))+360.0)%360.0;

    return bearing;
}

test('bearing calculation',()=>{
    let startLat = 43.682213;
    let startLong = -70.450696;
    let startLat2 = 43.682194;
    let startLong2 = -70.450769;

    let p1 = point([startLong, startLat]);
    let p2 = point([startLong2, startLat2]);
    console.log((bearing(p1, p2)+360.0)%360.0);
    console.log(getBearing2(startLat,startLong,startLat2,startLong2));
    console.log(getBearing3(startLat,startLong,startLat2,startLong2));
});