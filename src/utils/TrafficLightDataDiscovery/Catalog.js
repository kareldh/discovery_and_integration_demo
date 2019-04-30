import RbushPolygonSearchTree from './searchTree/RbushPolygonSearchTree'

export default class Catalog{
    constructor(catalogRDF){
        this.searchTree = undefined;
        this.init(catalogRDF);
    }

    init(catalogRDF,tags=[]){
        // 1: check if the data set in the catalog has a spatial tag (filled with a polygon)
        // 2: check if the data set in the catalog has one of the tags from the tags list
        // 3: if both 1 and 2 are satisfied, get the geo+json data, a unique id (URL to the opendata.vlaanderen page for this dataset) and the distribution url of the data set
        // 3: create a new geo json feature with the geo+json data as geometry and the identifier and distribution url as properties
        // 4: push this feature to the feature collection which will be used in the lookup structure
        let sets = this._getDataSets(catalogRDF,tags);
        let features = this._createFeaturesForGeoSpatialDataSets(sets);
        let featureCollection = {
            type: 'FeatureCollection',
            features: features
        };
        this.searchTree = new RbushPolygonSearchTree(featureCollection);
    }

    _getDataSets(catalog,keywords=[]){
        let dataSets = {};
        let distributions = {};
        let locationIDtoDataSet = {};
        catalog.triples.forEach((triple)=>{
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
                if(locationIDtoDataSet[triple.subject.value] === undefined){
                    throw Error(triple.subject.value + " not previously encountered!");
                }
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
        });
        return {
            dataSets: dataSets,
            distributions: distributions
        };
    }

    _createFeaturesForGeoSpatialDataSets(data){
        let featureCollection = [];
        for(let set in data.dataSets){
            if(data.dataSets.hasOwnProperty(set) && data.dataSets[set].geojson !== undefined){
                featureCollection.push({
                    type: 'Feature',
                    properties: {
                        id: set,
                        distribution: data.distributions[data.dataSets[set].distribution]
                    },
                    geometry: data.dataSets[set].geojson
                });
            }
        }
        return featureCollection;
    }

    getDataSetsByDistance(lat,long,dist){
        return this.searchTree.findCloseBy(lat,long,dist);
    }

    getDataSetsInRange(latLower,latUpper,longLower,longUpper){
        return this.searchTree.findInRange(latLower,longLower,latUpper,longUpper);
        //todo: rbush where one can use the range of the wgs84 tiles of osm to search for databases
    }
}