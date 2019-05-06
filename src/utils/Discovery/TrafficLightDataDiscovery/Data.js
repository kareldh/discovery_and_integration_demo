

import {
    getDataSets, getDistributions, getGeometries, getKeywords, getLocationIDtoDataSet,
    getPagingInfo
} from "./Parser";

export function getDataSetsFromTriples(triples, keywords=[]){
    let dataSets = {};
    let distributions = {};
    let locationIDtoDataSet = {};
    let currentPage = undefined;
    let lastPage = undefined;
    let nextPage = undefined;
    triples.forEach((triple)=>{
        if(triple.predicate.value === "http://www.w3.org/ns/dcat#distribution"){
            if(dataSets[triple.subject.value] === undefined){
                dataSets[triple.subject.value] = {};
            }
            dataSets[triple.subject.value].distribution = triple.object.value;
            if(distributions[triple.object.value] === undefined){
                distributions[triple.object.value] = {};
            }
        }

        if(triple.predicate.value === "http://purl.org/dc/terms/spatial"){
            if(dataSets[triple.subject.value] === undefined){
                dataSets[triple.subject.value] = {};
            }
            locationIDtoDataSet[triple.object.value] = triple.subject.value;
        }

        if(
            triple.predicate.value === "http://www.w3.org/ns/locn#geometry"
            && triple.object.value[0] === "{"
        ){
            if(locationIDtoDataSet[triple.subject.value] === undefined){ //makes assumption about order of triples
                throw Error(triple.subject.value + " not previously encountered!");
            }
            // if order of triples is random, use geometries[triple.subject.value] = ...
            // and iterate its properties in the end to create dataSets[locationIDtoDataSet[key]] .geojson = geometries[key]
            dataSets[locationIDtoDataSet[triple.subject.value]].geojson = JSON.parse(triple.object.value);
        }

        if(triple.predicate.value === "http://www.w3.org/ns/dcat#keyword"){
            if(dataSets[triple.subject.value] === undefined){
                dataSets[triple.subject.value] = {};
            }
            if(dataSets[triple.subject.value].keywords === undefined){
                dataSets[triple.subject.value].keywords = [];
            }
            if(keywords.includes(triple.object.value)){
                dataSets[triple.subject.value].hasValidKeyword = true;
            }
            dataSets[triple.subject.value].keywords.push(triple.object.value);
        }

        if(distributions[triple.subject.value] !== undefined){
            distributions[triple.subject.value][triple.predicate.value] = triple.object.value ;
        }

        if(triple.object.value === "http://www.w3.org/ns/hydra/core#PagedCollection"){
            currentPage = triple.subject.value;
        }

        if(currentPage !== undefined && triple.subject.value === currentPage){
            if(triple.predicate.value === "http://www.w3.org/ns/hydra/core#lastPage"){
                lastPage = triple.object.value;
            }
            if(triple.predicate.value === "http://www.w3.org/ns/hydra/core#nextPage"){
                nextPage = triple.object.value;
            }
        }
    });
    return {
        dataSets: dataSets,
        distributions: distributions,
        currentPage: currentPage,
        nextPage: nextPage,
        lastPage: lastPage
    };
}

export async function getDataSetsFromStore(_store,keywords=[]){
    let dataSets = {};
    let distributions = {};
    let distributionsData = {};
    let locationIDtoDataSet = {};
    let geometries = {};
    let tags = {};
    let pagingInfo = {};

    await Promise.all([
        getDataSets(_store).then((d)=>{dataSets=d}),
        getDistributions(_store).then((d)=>{distributions=d.distributions; distributionsData=d.distributionsData}),
        getLocationIDtoDataSet(_store).then((d)=>{locationIDtoDataSet=d}),
        getGeometries(_store).then((d)=>{geometries=d}),
        getKeywords(_store).then((d)=>{tags=d}),
        getPagingInfo(_store).then((d)=>{pagingInfo=d})
    ]);

    for(let key in dataSets){
        if(dataSets.hasOwnProperty(key)){
            dataSets[key].distribution = distributions[key];
            dataSets[key].geojson = geometries[locationIDtoDataSet[key]];
            dataSets[key].keywords = tags[key];
            for(let i=0;i<tags[key];i++){
                if(keywords.includes(tags[i])){
                    dataSets.hasValidKeyword = true;
                }
            }
        }
    }

    return {
        dataSets: dataSets,
        distributions: distributionsData,
        currentPage: pagingInfo.currentPage,
        nextPage: pagingInfo.nextPage,
        lastPage: pagingInfo.lastPage
    };
}