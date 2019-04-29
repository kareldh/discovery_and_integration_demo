import PolygonLookup from 'polygon-lookup';
//todo: compare with using rbush

export default class Catalog{
    constructor(catalogRDF){
        this.lookup = undefined;
        this.init(catalogRDF);
    }

    async init(catalogRDF,tags=[]){
        // 1: check if the data set in the catalog has a spatial tag (filled with a polygon)
        // 2: check if the data set in the catalog has one of the tags from the tags list
        // 3: if both 1 and 2 are satisfied, get the geo+json data, a unique id (URL to the opendata.vlaanderen page for this dataset) and the distribution url of the data set
        // 3: create a new geo json feature with the geo+json data as geometry and the identifier and distribution url as properties
        // 4: push this feature to the feature collection which will be used in the lookup structure
        let sets = this._getGeospatialDataSets(catalogRDF,tags);
        let features = this._createFeatures(sets);
        let featureCollection = {
            type: 'FeatureCollection',
            features: features
        };
        this.lookup = new PolygonLookup(featureCollection);
    }

    _getGeospatialDataSets(catalog,keywords=[]){
        let dataSets = {};
            let locationIDtoDataSet = {};
            catalog.triples.forEach((triple)=>{
                if(triple.predicate.value === "http://www.w3.org/ns/dcat#distribution"){
                    console.log(triple.subject.value);
                    if(dataSets[triple.subject.value] === undefined){
                        dataSets[triple.subject.value] = {};
                    }
                    dataSets[triple.subject.value].distribution = triple.object.value; //todo: this is still the intern id of the distribution and not its URL
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
            });
        return dataSets;
    }

    _createFeatures(dataSets){
        let featureCollection = [];
        for(let set in dataSets){
            if(dataSets.hasOwnProperty(set)){
                featureCollection.push({
                    type: 'Feature',
                    properties: {
                        id: set,
                        distribution: dataSets[set].distribution
                    },
                    geometry: dataSets[set].geojson
                });
            }
        }
        return featureCollection;
    }

    getDataSetsByPosition(lat,long,maxAmount){
        return this.lookup.search(lat,long,maxAmount);
        //todo: compare with rbush where one can use the range of the wgs84 tiles of osm to search for databases
    }
}