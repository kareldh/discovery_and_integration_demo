import MapDataBase from "../utils/Integration/OpenLR/map/MapDataBase";
import Catalog from "../utils/Discovery/TrafficLightDataDiscovery/Catalog";
import {getTileXYForLocation, tile2boundingBox} from "../Logic/tileUtils";
import {fetchRoutableTile} from "../utils/Integration/Data/LoadData";
import {getRoutableTilesNodesAndLines} from "../utils/Integration/Data/ParseData";
import RoutableTilesIntegration from "../utils/Integration/OpenLRIntegration/RoutableTilesIntegration";
import {fetchCatalog, fetchNextPage} from "../utils/Discovery/TrafficLightDataDiscovery/Api";
import {CATALOG_URL} from "../utils/Discovery/TrafficLightDataDiscovery/Config";
import * as React from "react";
import TileView from "./TileView";

export class MainDemo extends React.Component{
    constructor() {
        super();
        this.location = {
            lat: 51.21205,
            lng: 4.39717
        };
        this.mapDataBase = new MapDataBase();
        this.catalog = new Catalog();
        this.tiles = {};
        this.catalogInitialized = this.initCatalog();
        this.dataBaseInitialized = new Promise(resolve => resolve(true));
    }

    initCatalog(){
        fetchCatalog("https://cors-anywhere.herokuapp.com/"+CATALOG_URL).then((c)=>{
            let res = this.catalog.addCatalogPage(c);
            return fetchNextPage(res,this.catalog,[],{uriPrefix: "https://cors-anywhere.herokuapp.com/"});
        });
        // fetchCatalog("https://raw.githubusercontent.com/kareldh/TrafficLightsCatalog/master/verkeerslicht_catalog.ttl").then((c)=>{
        //     console.log(c);
        // })
    }

    setLocation(lat,long){
        let tileXY = getTileXYForLocation(lat,long,14);
        if(!this.tiles[tileXY.x+"_"+tileXY.y]){
            this.dataBaseInitialized = fetchRoutableTile(14,tileXY.x,tileXY.y)
                .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                    .then((nodesAndLines)=> {
                        let nodesLines = RoutableTilesIntegration.getNodesLines(nodesAndLines.nodes,nodesAndLines.lines);
                        this.mapDataBase.addData(nodesLines.lines,nodesLines.nodes);
                    })});
            this.catalogInitialized.then(()=>{
                console.log("TEST");
                let boundingBox = tile2boundingBox(tileXY.x,tileXY.y,14);
                let datasets = this.catalog.getDataSetsInRange(boundingBox.latLower,boundingBox.latUpper,boundingBox.longLower,boundingBox.longUpper);
                console.log(datasets.length);
                //todo: map these datasets
            })
        }
    }

    render(){
        let {lat,lng} = this.location;
        return <div>
            <div>
                <TileView zoom={14} lat={lat} lng={lng} data={[]} onMouseClick={this.addMarker}/>
            </div>
        </div>;
    }
}