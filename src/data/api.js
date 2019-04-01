import ldfetch from 'ldfetch';
import axios from 'axios';
import parser from 'fast-xml-parser';
import {DATASET_URL} from "./const";

export function fetchRoutableTile(z,x,y){
    return new Promise((resolve) => {
        let fetch = new ldfetch({headers: {accept: 'application/ld+json'}});
        fetch.get(DATASET_URL+z+"/"+x+"/"+y).then(
            response => {resolve(response)}
        )
    });
}


/*
Gaat er van uit dat arrays van nodes bij het veld osm:nodes na elkaar volgen en niet random verspreid zijn over de lijst met triples.
Gaat er van uit dat array na het vermelden van array komt
op die manier kan het vinden van de node URI's op intersections van Ways in 1 run door de triples
 */
export function getIntersectionNodes(triples){
    return new Promise((resolve)=>{
        let intersections = {};
        let added = {};
        let already_found = {};

        let nodeListStarts = {};

        triples.forEach(function(element){
            if(element.subject && element.predicate && element.object){
                let found = /http:\/\/www\.openstreetmap\.org\/way\/\d*/g.exec(element.subject.value);
                if(found && element.predicate.value === "https://w3id.org/openstreetmap/terms#nodes"){
                    // console.log(element);
                    nodeListStarts[element.object.value] = true;
                }
                else if(nodeListStarts[element.subject.value]){
                    if(element.predicate.value === "http://www.w3.org/1999/02/22-rdf-syntax-ns#first"){
                        // console.log(element.object.value);

                        if(already_found[element.object.value] && !added[element.object.value]){
                            intersections[element.object.value] = {id: element.object.value, lat: undefined, lng: undefined};
                            added[element.object.value] = true;
                        }
                        else{
                            // console.log(element.object.value);
                            already_found[element.object.value] = true;
                        }
                    }
                    else if(element.predicate.value === "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest" && element.object.value !== "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil"){
                        nodeListStarts[element.object.value] = true;
                    }
                }
            }
        });


        // voor elke node nog zijn lat en long bepalen
        getLatLng(triples,intersections);

        resolve(intersections);
    });
}

/*
Gaat er van uit de lat en long triples van een node voor de highway triple komt
 */
export function getNodesWithTrafficSignals(triples){
    return new Promise((resolve)=>{
        let intersections = {};
        let lat = undefined;
        let lng = undefined;

        triples.forEach(function(element){
            if(element.subject && element.predicate && element.object){
                if(element.predicate.value === "http://www.w3.org/2003/01/geo/wgs84_pos#lat"){
                    lat = element.object.value;
                }
                else if(element.predicate.value === "http://www.w3.org/2003/01/geo/wgs84_pos#long"){
                    lng = element.object.value;
                }
                else if(element.predicate.value === "https://w3id.org/openstreetmap/terms#highway" && element.object.value === "osm:traffic_signals"){
                    intersections[element.subject.value] = {id: element.object.value, lat: lat, lng: lng};
                    if(!lat || !lng){
                        console.log("lat of lng zijn undefined")
                    }
                    lat = undefined;
                    lng = undefined;
                }
            }
        });

        resolve(intersections);
    });
}

function getLatLng(triples,intersections){
    triples.forEach(function(element){
        if(element.subject && element.predicate && element.object){
            if(intersections[element.subject.value]){
                if(element.predicate.value === "http://www.w3.org/2003/01/geo/wgs84_pos#lat"){
                    intersections[element.subject.value].lat = element.object.value;
                }
                else if(element.predicate.value === "http://www.w3.org/2003/01/geo/wgs84_pos#long"){
                    intersections[element.subject.value].lng = element.object.value;
                }
            }
        }
    });
}


export function fetchOsmData(){
    return new Promise((resolve,reject)=>{
        axios.get("https://api.openstreetmap.org/api/0.6/map?bbox=4.3915,51.2065,4.4076,51.2169")
            .then((data)=>resolve(data.data))
            .catch((error)=>{reject(error)})
    })
}

export function parseToJson(xml){
    return new Promise(((resolve,reject) => {
        let options = {
            // attributeNamePrefix : "@_",
            // attrNodeName: "attr", //default is 'false'
            // textNodeName : "#text",
            ignoreAttributes : false,
            ignoreNameSpace : false,
            allowBooleanAttributes : true,
            parseNodeValue : true,
            parseAttributeValue : true,
            trimValues: true,
            // cdataTagName: "__cdata", //default is 'false'
            // cdataPositionChar: "\\c",
            // localeRange: "", //To support non english character in tag/attribute values.
            // parseTrueNumberOnly: false,
            // attrValueProcessor: a => he.decode(a, {isAttributeValue: true}),//default is a=>a
            // tagValueProcessor : a => he.decode(a) //default is a=>a
        };

        if(parser.validate(xml) === true)
            resolve(parser.parse(xml,options));
        else{
            reject("could not parse xml")
        }
    }));
}

//zou eigenlijk al bij parsing moeten gebeuren
export function getMappedElements(json){
    return new Promise((resolve)=>{
        let nodes = {};
        let ways = {};
        let relations = {};
        json.osm.node.forEach(function(node){
            nodes[node["@_id"]] = node;
        });
        json.osm.way.forEach(function (way) {
            ways[way["@_id"]] = way;
        });
        json.osm.relation.forEach(function (relation) {
            relations[relation["@_id"]] = relation;
        });
         resolve ({nodes: nodes, ways: ways, relations: relations});
    });
}

export function filterHighwayData(data){
    return new Promise((resolve => {
        let ways = {};
        for(let key in data.ways){
            if(data.ways.hasOwnProperty(key) && data.ways[key].tag !== undefined){
                if(Array.isArray(data.ways[key].tag)){
                    data.ways[key].tag.forEach(function (tag) {
                        if(tag["@_k"] === "highway"){
                            ways[key] = data.ways[key];
                        }
                    });
                }
                else if(data.ways[key].tag["@_k"] !== undefined && data.ways[key].tag["@_k"] === "highway"){
                    ways[key] = data.ways[key];
                }
            }
        }
        resolve({nodes: data.nodes, ways: ways, relations: data.relations});
    }));
}