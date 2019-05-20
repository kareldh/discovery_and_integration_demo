import n3 from 'n3';
import linestringToLatLng from "./linestringToLatLng";
import {calcDistance} from "./GeoFunctions";

const { DataFactory } = n3;
const { namedNode } = DataFactory;

export function parseAndStoreQuads(_doc){
    return new Promise(resolve => {
        const parser = new n3.Parser();
        const store = new n3.Store();
        parser.parse(_doc, (error, quad, prefixes) => {
            if(quad)
                store.addQuad(quad);
            else
                resolve(store);
        })
    });
}

export async function getSignalGroups(_store){
    let signalgroups = [];
    await _store
        .getQuads(null, namedNode('http://www.w3.org/2000/01/rdf-schema#type'), namedNode('https://w3id.org/opentrafficlights#Signalgroup'))
        .forEach(
            (quad) => {signalgroups.push(quad.subject.value);}
        );
    return signalgroups;
}

export async function getLaneDefs(_store){ //map linestring op lane
    let lanes = {};
    await _store
        .getQuads(null, "http://www.opengis.net/#geosparql/wktLiteral", null)
        .forEach(
            (quad) => {lanes[quad.subject.value] = quad.object.value;}
        );
    return lanes;
}

export async function getStateDefs(_store){ //map state op signalgroup
    let greenStates = {};
    await _store
        .getQuads(null, "https://w3id.org/opentrafficlights#signalState", null)
        .forEach(
            (quad) => {greenStates[quad.object.value] = quad.subject.value;}
        );
    return greenStates;
}

export async function getGreenStates(_store){ //phase 6
    let greenStates = [];
    await _store
        .getQuads(null, "https://w3id.org/opentrafficlights#signalPhase", "https://w3id.org/opentrafficlights/thesauri/signalphase/6")
        .forEach(
            (quad) => {greenStates.push(quad.subject.value);}
        );
    return greenStates;
}

export function getDepartureLanes(_store){
    let departurelanes = [];
    if(_store){
        let processedDepartureLanes = [];
        _store.getQuads(null, namedNode('https://w3id.org/opentrafficlights#departureLane'), null).forEach((quad) => {
            _store.getQuads(quad.object, namedNode('http://purl.org/dc/terms/description'), null).forEach( (quad) => {
                if (!processedDepartureLanes.includes(quad.object.value)){
                    processedDepartureLanes.push(quad.object.value);
                }

                // Load arrival lanes
                _store.getQuads(null, namedNode('https://w3id.org/opentrafficlights#departureLane'), quad.subject).forEach((connectie) => {
                    let signalgroup = _store.getQuads(connectie.subject, namedNode('https://w3id.org/opentrafficlights#signalGroup'), null)[0].object.value;
                    _store.getQuads(connectie.subject, namedNode('https://w3id.org/opentrafficlights#arrivalLane'), null).forEach( (arrivalLane) => {
                        _store.getQuads(arrivalLane.object, namedNode('http://purl.org/dc/terms/description'), null).forEach( (descr) => {
                            if(!departurelanes[quad.subject.value]) departurelanes[quad.subject.value] = [];
                            departurelanes[quad.subject.value][arrivalLane.object.value] = {
                                '@id': arrivalLane.object.value,
                                'http://purl.org/dc/terms/description': descr.object.value,
                                'https://w3id.org/opentrafficlights#signalGroup': signalgroup
                            };
                        });
                    });
                });
            });
        });
    }
    return departurelanes;
}

export function getLanesForSignalGroup(_store){ //build index which gives an array of arrival lanes and an array of departure lanes for each signalgroup
    return new Promise((resolve)=>{
        let signalGroups = {};
        if(_store) {
            _store.getQuads(null, namedNode('http://www.w3.org/2000/01/rdf-schema#type'), namedNode('https://w3id.org/opentrafficlights#Signalgroup')).forEach((signalGroup) => {
                if(!signalGroups[signalGroup.subject.value]){
                    signalGroups[signalGroup.subject.value] = {departureLanes: [], arrivalLanes: []};
                }

                _store.getQuads(null, namedNode('https://w3id.org/opentrafficlights#signalGroup'), signalGroup.subject).forEach((connection) => {

                    //Load departure lanes
                    _store.getQuads(connection.subject, namedNode('https://w3id.org/opentrafficlights#departureLane'), null).forEach((quad) => {
                        if(!signalGroups[connection.object.value].departureLanes.includes(quad.object.value)) signalGroups[connection.object.value].departureLanes.push(quad.object.value);
                    });

                    //Load arrival lanes
                    _store.getQuads(connection.subject, namedNode('https://w3id.org/opentrafficlights#arrivalLane'), null).forEach((quad) => {
                        if(!signalGroups[connection.object.value].arrivalLanes.includes(quad.object.value)) signalGroups[connection.object.value].arrivalLanes.push(quad.object.value);
                    });

                });
            })
        }
        resolve(signalGroups);
    });
}

export function getLanesAsArrayInCorrectDirection(store){
    return new Promise(resolve=>{
        let lanes;
        let startArrive;
        Promise.all([
            getLaneDefs(store).then((laneDefs)=>{
                lanes = laneDefs;
            }),
            getLanesForSignalGroup(store).then(lanesForSignalGroup=>{
                startArrive = lanesForSignalGroup
            })
        ]).then(()=>{
            for(let key in lanes){
                if(lanes.hasOwnProperty(key)){
                    lanes[key] = linestringToLatLng(lanes[key]);
                }
            }
            let newLanes = {};
            for(let key in startArrive){
                if(startArrive.hasOwnProperty(key)){
                    for(let i=0;i<startArrive[key].departureLanes.length;i++){
                        for(let j=0;j<startArrive[key].arrivalLanes.length;j++){
                            let departureLane = lanes[startArrive[key].departureLanes[i]].slice();
                            let arrivalLane = lanes[startArrive[key].arrivalLanes[j]].slice();
                            let depEndToArrStart = calcDistance(departureLane[departureLane.length-1][0],departureLane[departureLane.length-1][1],arrivalLane[0][0],arrivalLane[0][1]);
                            let depEndToArrEnd = calcDistance(departureLane[departureLane.length-1][0],departureLane[departureLane.length-1][1],arrivalLane[arrivalLane.length-1][0],arrivalLane[arrivalLane.length-1][1]);
                            let depStartToArrStart = calcDistance(departureLane[0][0],departureLane[0][1],arrivalLane[0][0],arrivalLane[0][1]);
                            let depStartToArrEnd = calcDistance(departureLane[0][0],departureLane[0][1],arrivalLane[arrivalLane.length-1][0],arrivalLane[arrivalLane.length-1][1]);
                            if(depEndToArrStart < depEndToArrEnd && depEndToArrStart < depStartToArrStart && depEndToArrStart < depStartToArrEnd){
                                newLanes[startArrive[key].departureLanes[i]] = departureLane;
                                newLanes[startArrive[key].arrivalLanes[j]] = arrivalLane;
                            }
                            else if(depEndToArrEnd < depEndToArrStart && depEndToArrEnd < depStartToArrStart && depEndToArrEnd < depStartToArrEnd){
                                // reverse arrival lane
                                newLanes[startArrive[key].departureLanes[i]] = departureLane;
                                newLanes[startArrive[key].arrivalLanes[j]+"_reversed"] = arrivalLane.reverse();
                            }
                            else if(depStartToArrStart < depEndToArrEnd && depStartToArrStart < depEndToArrStart && depStartToArrStart < depStartToArrEnd){
                                // reverse departure lane
                                newLanes[startArrive[key].departureLanes[i]+"_reversed"] = departureLane.reverse();
                                newLanes[startArrive[key].arrivalLanes[j]] = arrivalLane;
                            }
                            else if(depStartToArrEnd < depEndToArrEnd && depStartToArrEnd < depStartToArrStart && depStartToArrEnd < depEndToArrStart){
                                // reverse both arrival and departure lane
                                newLanes[startArrive[key].departureLanes[i]+"_reversed"] = departureLane.reverse();
                                newLanes[startArrive[key].arrivalLanes[j]+"_reversed"] = arrivalLane.reverse();
                            }
                        }
                    }
                }
            }
            resolve(newLanes);
        });
    });
}