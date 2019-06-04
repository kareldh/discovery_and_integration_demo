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
import {getDataSetsFromStore, getDataSetsFromTriples} from "../utils/Discovery/TrafficLightDataDiscovery/Data";
import {download} from "../utils/download";
import {parseAndStoreQuads} from "../utils/Discovery/TrafficLightDataDiscovery/Parser";
import {Circle, GeoJSON, Polyline, Popup} from "react-leaflet";
import {downloadOpenTrafficLightsTestData} from "../utils/OpenTrafficLights/data";
import {getLaneDefs, getLanesAsArrayInCorrectDirection} from "../utils/OpenTrafficLights/parser";
import linestringToLatLng from "../utils/OpenTrafficLights/linestringToLatLng";
import Line from "../utils/Integration/OpenLR/map/Line";
import Node from "../utils/Integration/OpenLR/map/Node";
import {LinesDirectlyToLRPs} from "../utils/Integration/OpenLR/experimental/LinesDirectlyToLRPs";
import OpenLRDecoder from "../utils/Integration/OpenLR/Decoder";
import {configProperties, decoderProperties} from "../utils/Integration/OpenLR/coder/CoderSettings";
import {internalPrecisionEnum} from "../utils/Integration/OpenLR/map/Enum";
import {mapNodesLinesToID} from "../utils/Integration/OpenLR/test/Helperfunctions";
import LineEncoder from "../utils/Integration/OpenLR/coder/LineEncoder";

let encodingStratEnum = {
    "OpenLrEncode": "OpenLr encode lines in database only existing of these lines, only first and last line wil remain." ,
    "LinesToLRPs": "Simply make every line an LRP directly, without checking all the encoding steps."
};

let lineVisualisationEnum = {
    "RawLineStrings": "Show the LineStrings as present in the dataset.",
    "MappedLineStrings": "Show the LineStrings mapped on the current mapDataBase"
};

let catalogEnum = {
    "vodap": "Vlaamse Open Data Portaal",
    "verkeerslichtdata_catalog_ttl": "Custom catalog for traffic light data on https://github.com/kareldh/TrafficLightsCatalog"
};

export class MainDemo extends React.Component{
    constructor() {
        super();
        this.location = {
            lat: 51.21205,
            lng: 4.39717
        };
        this.state = {
            data: [],
            tileXY: getTileXYForLocation(this.location.lat,this.location.lng,14),
            encodingStrat: encodingStratEnum.OpenLrEncode,
            lineVisualisation: lineVisualisationEnum.MappedLineStrings,
            catalog: catalogEnum.verkeerslichtdata_catalog_ttl
        };
        this.key = 0;
        this.mapDataBase = new MapDataBase();
        this.tiles = {};
        this.catalogInitialized = this.initCatalog();
        this.dataBaseInitialized = new Promise(resolve => resolve(true));
        this.setLocation = this.setLocation.bind(this);
        this.mappedDataSets = {};
        this.resetMap = this.resetMap.bind(this);
        this.handleGeoJsonClick = this.handleGeoJsonClick.bind(this);
        this.handleEncodingStratSelect = this.handleEncodingStratSelect.bind(this);
        this.handleLineStringVisualisationSelect = this.handleLineStringVisualisationSelect.bind(this);
        this.handleInternalPrecisionSelect = this.handleInternalPrecisionSelect.bind(this);
        this.handleCatalogSelect = this.handleCatalogSelect.bind(this);
    }

    initCatalog(catalog){
        this.catalog = new Catalog();
        if(catalog === catalogEnum.vodap){
            return new Promise(resolve=>{
                let t1 = performance.now();
                fetchCatalog("https://cors-anywhere.herokuapp.com/"+CATALOG_URL).then((c)=>{
                    let t3 = performance.now();
                    let sets = getDataSetsFromTriples(c.triples,["Boring"]);
                    let res = this.catalog.addCatalogPage(sets);
                    let t4 = performance.now();
                    console.log("first catalog page downloaded in",t3-t1,"ms","and parsed in",t4-t3,"ms");
                    fetchNextPage(res,this.catalog,["Boring"],{uriPrefix: "https://cors-anywhere.herokuapp.com/", logging: true}).then(()=>{
                        let t2 = performance.now();
                        console.log("Catalog initialized in",t2-t1,"ms");
                        resolve();
                    });
                });
            });
        }
        else{
            return new Promise(resolve=>{
                let t1 = performance.now();
                download("https://raw.githubusercontent.com/kareldh/TrafficLightsCatalog/master/verkeerslicht_catalog.ttl").then((c)=>{
                    let t3 = performance.now();
                    console.log("Catalog downloaded in",t3-t1,"ms");
                    parseAndStoreQuads(c).then(store=>{
                        getDataSetsFromStore(store,["verkeerslicht"]).then(sets=>{
                            let t2 = performance.now();
                            let r = this.catalog.addCatalogPage(sets);
                            console.log("Catalog initialized in",t2-t1,"ms","(Of which parsing took",t2-t3,"ms)");
                            resolve(r);
                        });
                    })
                })
            });
        }
    }

    addRoutableTileToMapDataBase(zoom,x,y){
        return new Promise(resolve=>{
            fetchRoutableTile(zoom, x, y)
                .then((data) => {
                    let t1 = performance.now();
                    getRoutableTilesNodesAndLines(data.triples)
                        .then((nodesAndLines) => {
                            let nodesLines = RoutableTilesIntegration.getNodesLines(nodesAndLines.nodes, nodesAndLines.lines);
                            this.mapDataBase.addData(nodesLines.lines, nodesLines.nodes);
                            let t2 = performance.now();
                            console.log("Parsed tile",x,y,"in",t2-t1,"ms");
                            this.tiles[x + "_" + y] = true;
                            resolve();
                        })
                })
        });
    }

    setLocation(latLong){
        let {lat,lng} = latLong;
        let tileXY = getTileXYForLocation(lat,lng,14);
        this.setState({tileXY: tileXY});
        let promises = [];
        let t1 = performance.now();
        this.dataBaseInitialized = new Promise(resolve=>{
            for(let ix=tileXY.x-1;ix<=tileXY.x+1;ix++){
                for(let iy=tileXY.y-1;iy<=tileXY.y+1;iy++){
                    // if(!this.tiles[ix+"_"+iy]){
                    // use this check if we only want to fetch each tile one time during the lifetime of this application
                    // not using this check results in refilling the mapDataBase every time the location is set
                        promises.push(this.addRoutableTileToMapDataBase(14,ix,iy));
                    // }
                }
            }
            Promise.all(promises).then(()=>{
                let t2 = performance.now();
                console.log("mapDataBase initialized in",t2-t1,"ms");
                resolve();
            });
        });

        this.catalogInitialized.then(()=>{
            let t1 = performance.now();
            let boundingBox = tile2boundingBox(tileXY.x,tileXY.y,14);
            console.log(boundingBox);
            let datasets = this.catalog.getDataSetsInRange(boundingBox.latLower,boundingBox.latUpper,boundingBox.longLower,boundingBox.longUpper);
            let t2 = performance.now();
            console.log("",datasets.length,"datasets found in",t2-t1,"ms","in catalog of",this.catalog.getDatasetCount(),"datasets");
            let featureCollection = {
                "type": "FeatureCollection",
                "features": []
            };
            datasets.forEach((dataset)=>{
                featureCollection.features.push({"type": dataset.type, "properties": dataset.properties, "geometry": dataset.geometry});
            });
            this.addGeoJson(featureCollection);
        })
    }

    addGeoJson(geojson){
        this.key = (this.key+1)%2;
        this.setState({
            data: [<GeoJSON key = {this.key} data={geojson} onClick={this.handleGeoJsonClick} />]
        })
    }

    render(){
        let {lat,lng} = this.location;
        let {data,tileXY} = this.state;
        return <div>
            <div>
                <TileView zoom={14} lat={lat} lng={lng} data={data} onMouseClick={this.setLocation}/>
            </div>
            <select name={"Catalog"} value={this.state.catalog} onChange={this.handleCatalogSelect}>
                <option value={catalogEnum.verkeerslichtdata_catalog_ttl}>verkeerslichtdata_catalog_ttl</option>
                <option value={catalogEnum.vodap}>VODAP</option>
            </select>
            <select name={"Encode strategy"} value={this.state.encodingStrat} onChange={this.handleEncodingStratSelect}>
                <option value={encodingStratEnum.OpenLrEncode}>OpenLrEncode</option>
                <option value={encodingStratEnum.LinesToLRPs}>Lines to LRPs</option>
            </select>
            <select name={"Internal algorithmic precision"} value={this.state.internalPrecision} onChange={this.handleInternalPrecisionSelect}>
                <option value={internalPrecisionEnum.CENTIMETER}>Centimeter</option>
                <option value={internalPrecisionEnum.METER}>Meter</option>
            </select>
            <select name={"DataSet LineString visualisation"} value={this.state.internalPrecision} onChange={this.handleLineStringVisualisationSelect}>
                <option value={lineVisualisationEnum.MappedLineStrings}>Mapped to MapDataBase</option>
                <option value={lineVisualisationEnum.RawLineStrings}>Raw LineStrings</option>
            </select>
            <button onClick={this.resetMap}>Reset</button>
            current Tile X value: {tileXY.x} | Tile Y value: {tileXY.y}
        </div>;
    }

    handleGeoJsonClick(event){
        event.originalEvent.view.L.DomEvent.stopPropagation(event);
        let datasetFeature = event.sourceTarget.feature;
        console.log(datasetFeature);
        let url = datasetFeature.properties.distribution["http://www.w3.org/ns/dcat#accessURL"];
        console.log(url);
        let data = [];
        // downloadOpenTrafficLightsTestData().then(doc=>{
        download(url).then(doc=>{
            MainDemo._getTrafficLightData(doc).then(parsed=>{
                if(this.state.lineVisualisation === lineVisualisationEnum.MappedLineStrings){
                    let LRPs = MainDemo._toLRPs(parsed,this.state.en);
                    this.mappedDataSets[datasetFeature.properties.id] = LRPs;
                    this.dataBaseInitialized.then(()=>{
                        let t1 = performance.now();
                        LRPs.forEach(line=>{
                            try{
                                let decoded = OpenLRDecoder.decode(line.LRP,this.mapDataBase,decoderProperties);
                                let lineData = MainDemo.createLineStringsOpenLrForLane(decoded.lines,decoded.posOffset,decoded.negOffset,line.lane);
                                Array.prototype.push.apply(data,lineData);
                            }
                            catch(e){
                                console.error(e);
                            }
                        });
                        let t2 = performance.now();
                        console.log("LRPs decoded in ",t2-t1,"ms");
                        this.setState({data: data});
                    });
                }
                else if(this.state.lineVisualisation === lineVisualisationEnum.RawLineStrings){
                    let t1 = performance.now();
                    Array.prototype.push.apply(data,MainDemo._createRawLineStrings(parsed));
                    let t2 = performance.now();
                    console.log("Raw lines drawn in ",t2-t1,"ms");
                    this.setState({data: data});
                }
            });
        })
            .catch((e)=>{console.log("Could not download distribution:",e)});
    }

    static _getTrafficLightData(doc){
        return new Promise(resolve => {
            parseAndStoreQuads(doc).then((store)=>{
                getLanesAsArrayInCorrectDirection(store).then(lanes=>{
                    resolve(lanes);
                })
            })
        });
    }

    static _createRawLineStrings(parsed){
        let data = [];
        for(let k in parsed){
            if(parsed.hasOwnProperty(k)){
                data.push(<Polyline
                    positions = {parsed[k]}
                    key={k}
                >
                    <Popup>
                        <p>{k}</p>
                    </Popup>
                </Polyline>);
            }
        }
        return data;
    }

    static _toLRPs(parsed,encodingStrat){
        let t1 = performance.now();
        let LRPs = [];
        for(let key in parsed){
            if(parsed.hasOwnProperty(key)){
                let n = [];
                let l = [];
                n.push(new Node(0,parsed[key][0][0],parsed[key][0][1]));
                for(let i=1;i<parsed[key].length;i++){
                    n.push(new Node(i,parsed[key][i][0],parsed[key][i][1]));
                    l.push(new Line(i,n[i-1],n[i]));
                }
                if(encodingStrat === encodingStratEnum.LinesToLRPs){
                    LRPs.push({
                        lane: key,
                        LRP: LinesDirectlyToLRPs(l)
                    })
                }
                else{
                    let {nodes,lines} = mapNodesLinesToID(n,l);
                    let mapDataBase = new MapDataBase(lines,nodes);
                    LRPs.push({
                        lane: key,
                        LRP: LineEncoder.encode(mapDataBase,l,0,0)
                    })
                }
            }
        }
        let t2 = performance.now();
        console.log("LineStrings encoded in",t2-t1,"ms");
        return LRPs;
    }

    static createLineStringsOpenLrForLane(lines, posOffset, negOffset, lane){
        let lineStrings = [];
        if(lines !== undefined){
            for (let i=0;i<lines.length;i++) {
                lineStrings.push(
                    <Polyline
                        positions = {[[lines[i].getStartNode().getLatitudeDeg(),lines[i].getStartNode().getLongitudeDeg()],[lines[i].getEndNode().getLatitudeDeg(),lines[i].getEndNode().getLongitudeDeg()]]}
                        key={lines[i].getID()+lane}
                        color={i%2===0?"Blue":"DarkTurquoise "}
                    >
                        <Popup>
                            <p>{lines[i].getID()+" -> "+lane}</p>
                        </Popup>
                    </Polyline>);
            }
            let firstOffsetCoord = lines[0].getGeoCoordinateAlongLine(posOffset*configProperties.internalPrecision);
            let lastOffsetCoord = lines[lines.length-1].getGeoCoordinateAlongLine(lines[lines.length-1].getLength()-(negOffset*configProperties.internalPrecision));
            lineStrings.push(<Circle key={"firstOffsetPoint"+lane} center={[firstOffsetCoord.lat,firstOffsetCoord.long]} radius={1} color={"red"}>
                <Popup>
                    <p>Start {lane}</p>
                </Popup>
            </Circle>);
            lineStrings.push(<Circle key={"lastOffsetPoint"+lane} center={[lastOffsetCoord.lat,lastOffsetCoord.long]} radius={1} color={"magenta"}>
                <Popup>
                    <p>End {lane}</p>
                </Popup>
            </Circle>);
            return lineStrings;
        }
    }

    resetMap(){
        this.setState((state,props)=>{
            return {
                data: [],
            }
        });
    }

    handleInternalPrecisionSelect(event){
        configProperties.internalPrecision = event.target.value;
        this.mapDataBase = new MapDataBase();
        this.setLocation(this.location);
    }

    handleEncodingStratSelect(event){
        this.setState({encodingStrat: event.target.value});
    }

    handleLineStringVisualisationSelect(event){
        this.setState({lineVisualisation: event.target.value});
    }

    handleCatalogSelect(event){
        this.setState({catalog: event.target.value});
        this.initCatalog(event.target.value);
    }
}