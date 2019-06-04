import n3 from 'n3';

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

export async function getDataSets(_store){
    let dataSets = {};
    await _store
        .getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/ns/dcat#Dataset'))
        .forEach(
            (quad) => {dataSets[quad.subject.value] = {}}
        );
    return dataSets;
}

export async function getDistributions(_store){
    let distributions = {};
    let distributionsData = {};
    await _store
        .getQuads(null, namedNode("http://www.w3.org/ns/dcat#distribution"), null)
        .forEach(
            (quad) => {distributions[quad.subject.value]=quad.object.value}
        );
    for(let key in distributions){
        if(distributions.hasOwnProperty(key)){
            await _store
                .getQuads(namedNode(distributions[key]), null, null)
                .forEach(
                    (quad) => {
                        if(distributionsData[distributions[key]] === undefined){
                            distributionsData[distributions[key]] = {};
                        }
                        distributionsData[distributions[key]][quad.predicate.value]=quad.object.value
                    }
                );
        }
    }

    return {
        distributionsData: distributionsData,
        distributions: distributions
    };
}

export async function getLocationIDtoDataSet(_store){
    let locationIDtoDataSet = {};
    await _store
        .getQuads(null, namedNode("http://purl.org/dc/terms/spatial"), null)
        .forEach(
            (quad) => {locationIDtoDataSet[quad.subject.value] = quad.object.value;}
        );
    return locationIDtoDataSet;
}

export async function getGeometries(_store){
    let geometries = {};
    await _store
        .getQuads(null, namedNode("http://www.w3.org/ns/locn#geometry"), null)
        .forEach(
            (quad) => {
                if(quad.object.value[0] === "{")
                    geometries[quad.subject.value] = JSON.parse(quad.object.value);
            }
        );
    return geometries;
}

export async function getKeywords(_store){
    let keyWords = [];
    await _store
        .getQuads(null, namedNode("http://www.w3.org/ns/dcat#keyword"), null)
        .forEach(
            (quad) => {
                if(keyWords[quad.subject.value] === undefined){
                    keyWords[quad.subject.value] = [];
                }
                keyWords[quad.subject.value].push(quad.object.value);
            }
        );
    return keyWords;
}

export async function getPagingInfo(_store){
    let paging = {
        currentPage: undefined,
        nextPage: undefined,
        lastPage: undefined
    };
    await _store
        .getQuads(null, null, namedNode("http://www.w3.org/ns/hydra/core#PagedCollection"))
        .forEach(
            (quad) => {
                paging.currentPage = quad.subject.value;
            }
        );
    if(paging.currentPage !== undefined){
        await _store
            .getQuads(this.currentPage, namedNode("http://www.w3.org/ns/hydra/core#lastPage"), null)
            .forEach(
                (quad) => {
                    paging.lastPage = quad.object.value;
                }
            );
        await _store
            .getQuads(this.currentPage, namedNode("http://www.w3.org/ns/hydra/core#nextPage"), null)
            .forEach(
                (quad) => {
                    paging.nextPage = quad.object.value;
                }
            );
    }
    return paging;
}

