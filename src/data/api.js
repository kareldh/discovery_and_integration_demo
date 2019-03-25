import ldfetch from 'ldfetch';
import {DATASET_URL} from "./const";

export function fetchRoutableTile(z,x,y){
    return new Promise((resolve,reject) => {
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

        resolve(intersections);
    });
}