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
import {getLaneDefs} from "../utils/OpenTrafficLights/parser";
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
            lineVisualisation: lineVisualisationEnum.MappedLineStrings
        };
        this.key = 0;
        this.mapDataBase = new MapDataBase();
        this.catalog = new Catalog();
        this.tiles = {};
        this.catalogInitialized = this.initCatalog();
        this.dataBaseInitialized = new Promise(resolve => resolve(true));
        this.setLocation = this.setLocation.bind(this);
        this.mappedDataSets = {};
        this.resetMap = this.resetMap.bind(this);
        this.handleGeoJsonClick = this.handleGeoJsonClick.bind(this);
        this.handleEncodingStratSelect = this.handleEncodingStratSelect.bind(this);
        this.handleLineStringVisualisationSelect = this.handleLineStringVisualisationSelect.bind(this);
    }

    initCatalog(){
        return new Promise(resolve=>{
            fetchCatalog("https://cors-anywhere.herokuapp.com/"+CATALOG_URL).then((c)=>{
                let sets = getDataSetsFromTriples(c.triples);
                let res = this.catalog.addCatalogPage(sets);
                fetchNextPage(res,this.catalog,[],{uriPrefix: "https://cors-anywhere.herokuapp.com/"}).then(()=>{
                    resolve();
                });
            });
        });
        // return new Promise(resolve=>{
        //     download("https://raw.githubusercontent.com/kareldh/TrafficLightsCatalog/master/verkeerslicht_catalog.ttl").then((c)=>{
        //         parseAndStoreQuads(c).then(store=>{
        //             getDataSetsFromStore(store,["verkeerslicht"]).then(sets=>{
        //                 resolve(this.catalog.addCatalogPage(sets));
        //             });
        //         })
        //     })
        // });
    }

    addRoutableTileToMapDataBase(zoom,x,y){
        return new Promise(resolve=>{
            fetchRoutableTile(zoom, x, y)
                .then((data) => {
                    getRoutableTilesNodesAndLines(data.triples)
                        .then((nodesAndLines) => {
                            let nodesLines = RoutableTilesIntegration.getNodesLines(nodesAndLines.nodes, nodesAndLines.lines);
                            this.mapDataBase.addData(nodesLines.lines, nodesLines.nodes);
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
            let boundingBox = tile2boundingBox(tileXY.x,tileXY.y,14);
            let datasets = this.catalog.getDataSetsInRange(boundingBox.latLower,boundingBox.latUpper,boundingBox.longLower,boundingBox.longUpper);
            console.log(datasets);
            let featureCollection = {
                "type": "FeatureCollection",
                "features": []
            };
            datasets.forEach((dataset)=>{
                featureCollection.features.push(dataset.feature);
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
            <div>Tile X value: {tileXY.x} | Tile Y value: {tileXY.y}</div>
            <select name={"Encode strategy"} value={this.state.encodingStrat} onChange={this.handleEncodingStratSelect}>
                <option value={encodingStratEnum.OpenLrEncode}>OpenLrEncode</option>
                <option value={encodingStratEnum.LinesToLRPs}>Lines to LRPs</option>
            </select>
            <select name={"Internal algorithmic precision"} value={this.state.internalPrecision} onChange={MainDemo.handleInternalPrecisionSelect}>
                <option value={internalPrecisionEnum.CENTIMETER}>Centimeter</option>
                <option value={internalPrecisionEnum.METER}>Meter</option>
            </select>
            <select name={"DataSet LineString visualisation"} value={this.state.internalPrecision} onChange={this.handleLineStringVisualisationSelect}>
                <option value={lineVisualisationEnum.MappedLineStrings}>Mapped to MapDataBase</option>
                <option value={lineVisualisationEnum.RawLineStrings}>Raw LineStrings</option>
            </select>
            <button onClick={this.resetMap}>Reset</button>
        </div>;
    }

    handleGeoJsonClick(event){
        event.originalEvent.view.L.DomEvent.stopPropagation(event);
        let datasetFeature = event.sourceTarget.feature;
        let url = datasetFeature.properties.distribution["http://www.w3.org/ns/dcat#downloadURL"];
        console.log(url);
        let data = [];
        downloadOpenTrafficLightsTestData().then(doc=>{
            this._getTrafficLightData(doc).then(parsed=>{
                if(this.state.lineVisualisation === lineVisualisationEnum.MappedLineStrings){
                    let LRPs = this._toLRPs(parsed);
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
                    Array.prototype.push.apply(data,this._createRawLineStrings(parsed));
                    let t2 = performance.now();
                    console.log("Raw lines drawn in ",t2-t1,"ms");
                    this.setState({data: data});
                }
            });
        });
    }

    _getTrafficLightData(doc){
        return new Promise(resolve => {
            parseAndStoreQuads(doc).then((store)=>{
                getLaneDefs(store).then((lanes)=>{
                    let parsed = {};
                    for(let key in lanes){
                        if(lanes.hasOwnProperty(key)){
                            parsed[key] = linestringToLatLng(lanes[key]);
                        }
                    }
                    resolve(parsed);
                });
            })
        });
    }

    _createRawLineStrings(parsed){
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

    _toLRPs(parsed){
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
                if(this.state.encodingStrat === encodingStratEnum.LinesToLRPs){
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
            let firstOffsetCoord = lines[0].getGeoCoordinateAlongLine(posOffset*100);
            let lastOffsetCoord = lines[lines.length-1].getGeoCoordinateAlongLine(lines[lines.length-1].getLength()-(negOffset*100));
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
}