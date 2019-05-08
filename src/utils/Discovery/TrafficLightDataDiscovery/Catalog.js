import RbushPolygonSearchTree from './searchTree/RbushPolygonSearchTree'

export default class Catalog{
    constructor(){
        this.searchTree = undefined;
        this.amountOfDatasets = 0;
    }

    addCatalogPage(sets){
        // BEFORE
        // 1: check if the data set in the catalog has a spatial tag (filled with a polygon)
        // 2: check if the data set in the catalog has one of the tags from the tags list
        // 3: if both 1 and 2 are satisfied, get the geo+json data, a unique id (URL to the opendata.vlaanderen page for this dataset) and the distribution url of the data set
        // NOW
        // 3: create a new geo json feature with the geo+json data as geometry and the identifier and distribution url as properties
        // 4: push this feature to the feature collection which will be used in the lookup structure
        let features = Catalog._createFeaturesForGeoSpatialDataSets(sets);
        let featureCollection = {
            type: 'FeatureCollection',
            features: features
        };
        if(this.searchTree === undefined){
            this.searchTree = new RbushPolygonSearchTree(featureCollection);
        }
        else{
            this.searchTree.addPolygons(featureCollection);
        }
        this.amountOfDatasets += features.length;

        return {
            currentPage: sets.currentPage,
            nextPage: sets.nextPage,
            lastPage: sets.lastPage
        }
    }

    static _createFeaturesForGeoSpatialDataSets(data){
        let featureCollection = [];
        for(let set in data.dataSets){
            if(data.dataSets.hasOwnProperty(set) && data.dataSets[set].geojson !== undefined && data.dataSets[set].hasValidKeyword){
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
    }

    getDatasetCount(){
        return this.amountOfDatasets;
    }
}