import React from 'react';
import TileView from "./TileView";
import {
    filterHighwayData,
    getMappedElements, getRoutableTilesNodesAndLines,
    parseToJson
} from "../utils/Integration/Data/ParseData";
import {Marker, Polyline, Popup, Circle} from "react-leaflet";
import {mapNodesLinesToID} from "../utils/Integration/OpenLR/test/Helperfunctions";
import OSMIntegration from "../utils/Integration/OpenLRIntegration/OSMIntegration";
import OpenLRDecoder from "../utils/Integration/OpenLR/Decoder";
import LineEncoder from "../utils/Integration/OpenLR/coder/LineEncoder";
import MapDataBase from "../utils/Integration/OpenLR/map/MapDataBase";
import Line from "../utils/Integration/OpenLR/map/Line";
import Node from "../utils/Integration/OpenLR/map/Node";
import RoutableTilesIntegration from "../utils/Integration/OpenLRIntegration/RoutableTilesIntegration";
import {
    loadNodesLineStringsWegenregsterAntwerpen, fetchRoutableTile,
    fetchOsmData
} from "../utils/Integration/Data/LoadData";
import WegenregisterAntwerpenIntegration from "../utils/Integration/OpenLRIntegration/WegenregisterAntwerpenIntegration";
import GeoJsonIntegration from "../utils/Integration/OpenLRIntegration/GeoJsonIntegration";
import {map} from "../utils/Integration/Data/testdata/junction_with_lanes_manual";
// import {map} from "../utils/Integration/Data/testdata/lanes_from_data_with_correct_direction";
// import {map} from "../utils/Integration/Data/testdata/lanes_manual_empty_junction_3";
import {LinesDirectlyToLRPs} from "../utils/Integration/OpenLR/experimental/LinesDirectlyToLRPs";
import {configProperties, decoderProperties} from "../utils/Integration/OpenLR/coder/CoderSettings";
import {internalPrecisionEnum} from "../utils/Integration/OpenLR/map/Enum";
import {getTileXYForLocation, tile2boundingBox} from "../Logic/tileUtils";
import {downloadOpenTrafficLightsTestData} from "../utils/OpenTrafficLights/data";
import {MainDemo} from "./MainDemo";

let inputDataEnum = {
    "RoutableTiles": "RoutableTiles",
    "OpenStreetMap": "OpenStreetMap",
    "Wegenregister_Antwerpen": "Wegenregister_Antwerpen",
    "Geojson_kruispunt_tropisch_instituut": "Geojson_kruispunt_tropisch_instituut"
};

let encodingStratEnum = {
    "OpenLrEncode": "OpenLr encode lines in database only existing of these lines, only first and last line wil remain." ,
    "LinesToLRPs": "Simply make every line an LRP directly, without checking all the encoding steps."
};

export default class OpenLrDemo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            lat: 51.21205,
            lng: 4.39717,
            encodingStrat: encodingStratEnum.OpenLrEncode,
            dataSource: inputDataEnum.RoutableTiles,
            internalPrecision: internalPrecisionEnum.CENTIMETER
        };
        this.x = 8392;
        this.y = 5469;
        this.coordinates =[];
        this.tiles = {};
        this.addMarker = this.addMarker.bind(this);
        this.reset = this.reset.bind(this);
        this.findMarkersOsm = this.findMarkersOsm.bind(this);
        this.findMarkersRoutableTiles = this.findMarkersRoutableTiles.bind(this);
        this.findMarkers = this.findMarkers.bind(this);
        this.handleEncodingStratSelect = this.handleEncodingStratSelect.bind(this);
        this.handleDataSourceSelect = this.handleDataSourceSelect.bind(this);
        this.addDataBases = this.addDataBases.bind(this);
        this.handleInternalPrecisionSelect = this.handleInternalPrecisionSelect.bind(this);
        this.showLanesAntwerpenTest = this.showLanesAntwerpenTest.bind(this);
        this.osmDataBase = undefined;
        this.routableTilesDataBase = undefined;
        this.wegenregisterDataBase = undefined;
        this.geojsonKruispuntDataBase = undefined;
        this.dataBasesInitialized = new Promise((resolve,reject)=>resolve());
        decoderProperties.useFrcFow = false;
    }

    static createMarker(latitude,longitude){
         return <Marker key={latitude+"_"+longitude} position={[latitude, longitude]}>
                <Popup>
                    <p>{latitude+" "+longitude}</p>
                </Popup>
            </Marker>;
    }

    findMarkers(){
        let {coordinates} = this;
        if(coordinates.length >= 2){
            let l = [];
            let n = [];
            n.push(new Node(0,coordinates[0].lat,coordinates[0].lng));
            for(let i=1;i<coordinates.length;i++){
                n.push(new Node(i,coordinates[i].lat,coordinates[i].lng));
                l.push(new Line(i,n[i-1],n[i]));
            }
            let {nodes,lines} = mapNodesLinesToID(n,l);
            let mapDataBase = new MapDataBase(lines,nodes);
            let encoded;
            if(this.state.encodingStrat === encodingStratEnum.OpenLrEncode){
                encoded = LineEncoder.encode(mapDataBase,l,0,0);
            }
            else if(this.state.encodingStrat === encodingStratEnum.LinesToLRPs){
                encoded = LinesDirectlyToLRPs(l);
            }
            console.log(encoded);

            if(this.state.dataSource===inputDataEnum.OpenStreetMap){
                this.findMarkersOsm(encoded);
            }
            else if(this.state.dataSource===inputDataEnum.RoutableTiles){
                this.findMarkersRoutableTiles(encoded);
            }
            else if(this.state.dataSource===inputDataEnum.Wegenregister_Antwerpen){
                this.findMarkersWegenregisterAntwerpen(encoded);
            }
            else if(this.state.dataSource===inputDataEnum.Geojson_kruispunt_tropisch_instituut){
                this.findMarkersGeojsonKruispunt(encoded);
            }
        }
        else{
            console.log("Not enough coordinates given to form a line",this.state.coordinates);
        }
    }

    findMarkersOsm(encoded){
        // if(this.osmDataBase === undefined){
        //     loadOsmTestData()
        //         .then((data)=>{parseToJson(data)
        //             .then((json)=>{getMappedElements(json)
        //                 .then((elements)=>{filterHighwayData(elements)
        //                     .then((highwayData)=>{
        //                         try {
        //                             let t1 = performance.now();
        //                             this.osmDataBase = new MapDataBase();
        //                             OSMIntegration.initMapDataBase(this.osmDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
        //                             let decoded = OpenLRDecoder.decode(encoded,this.osmDataBase,decoderProperties);
        //                             let t2 = performance.now();
        //                             console.log("Found in Open Street Maps in",t2-t1,"ms",decoded);
        //                             this.createLineStringsOpenLr(decoded.lines,decoded.posOffset,decoded.negOffset);
        //                         }
        //                         catch(e){
        //                             alert(e);
        //                         }
        //                     })})})});
        // }
        // else{
        this.dataBasesInitialized.then(()=>{
            try{
                let t1 = performance.now();
                let decoded = OpenLRDecoder.decode(encoded,this.osmDataBase,decoderProperties);
                let t2 = performance.now();
                console.log("Found in Open Street Maps in",t2-t1,"ms",decoded);
                this.createLineStringsOpenLr(decoded.lines,decoded.posOffset,decoded.negOffset);
            }
            catch(e){
                alert(e);
            }
        });
        // }
    }

    findMarkersRoutableTiles(encoded){
        // if(this.routableTilesDataBase === undefined){
        //     fetchRoutableTile(14,this.x,this.y)
        //         .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
        //             .then((nodesAndLines)=>{
        //                 try{
        //                     let t1 = performance.now();
        //                     this.routableTilesDataBase = new MapDataBase();
        //                     RoutableTilesIntegration.initMapDataBase(this.routableTilesDataBase,nodesAndLines.nodes,nodesAndLines.lines);
        //                     let decoded = OpenLRDecoder.decode(encoded,this.routableTilesDataBase,decoderProperties);
        //                     let t2 = performance.now();
        //                     console.log("Found in RoutableTiles in",t2-t1,"ms",decoded);
        //                     this.createLineStringsOpenLr(decoded.lines,decoded.posOffset,decoded.negOffset);
        //                 }
        //                 catch(e){
        //                     alert(e);
        //                 }
        //             })});
        // }
        // else{
        this.dataBasesInitialized.then(()=>{
            try{
                let t1 = performance.now();
                let decoded = OpenLRDecoder.decode(encoded,this.routableTilesDataBase,decoderProperties);
                let t2 = performance.now();
                console.log("Found in RoutableTiles in",t2-t1,"ms",decoded);
                this.createLineStringsOpenLr(decoded.lines,decoded.posOffset,decoded.negOffset);
            }
            catch(e){
                alert(e);
            }
        });
        // }
    }

    findMarkersWegenregisterAntwerpen(encoded){
        if(this.wegenregisterDataBase === undefined){
            loadNodesLineStringsWegenregsterAntwerpen().then(features => {
                try{
                    this.wegenregisterDataBase = new MapDataBase();
                    let t1 = performance.now();
                    WegenregisterAntwerpenIntegration.initMapDataBase(this.wegenregisterDataBase,features);
                    let decoded = OpenLRDecoder.decode(encoded,this.wegenregisterDataBase,decoderProperties);
                    let t2 = performance.now();
                    console.log("Found in Wegenregister Antwerpen in",t2-t1,"ms",decoded);
                    this.createLineStringsOpenLr(decoded.lines,decoded.posOffset,decoded.negOffset);
                }
                catch(e){
                    alert(e);
                }
            });
        }
        else{
            try{
                let t1 = performance.now();
                let decoded = OpenLRDecoder.decode(encoded,this.wegenregisterDataBase,decoderProperties);
                let t2 = performance.now();
                console.log("Found in Wegenregister Antwerpen in",t2-t1,"ms",decoded);
                this.createLineStringsOpenLr(decoded.lines,decoded.posOffset,decoded.negOffset);
            }
            catch(e){
                alert(e);
            }
        }
    }

    findMarkersGeojsonKruispunt(encoded){
        if(this.geojsonKruispuntDataBase === undefined){
            try{
                let t1 = performance.now();
                this.geojsonKruispuntDataBase = new MapDataBase();
                GeoJsonIntegration.initMapDataBase(this.geojsonKruispuntDataBase,map.features);
                let decoded = OpenLRDecoder.decode(encoded,this.geojsonKruispuntDataBase,decoderProperties);
                let t2 = performance.now();
                console.log("Found in Geojson kruispunt in",t2-t1,"ms",decoded);
                this.createLineStringsOpenLr(decoded.lines,decoded.posOffset,decoded.negOffset);
            }
            catch(e){
                alert(e);
            }
        }
        else{
            try{
                let t1 = performance.now();
                let decoded = OpenLRDecoder.decode(encoded,this.geojsonKruispuntDataBase,decoderProperties);
                let t2 = performance.now();
                console.log("Found in Geojson kruispunt in",t2-t1,"ms",decoded);
                this.createLineStringsOpenLr(decoded.lines,decoded.posOffset,decoded.negOffset);
            }
            catch(e){
                alert(e);
            }
        }
    }

    addMarker(latlng){
        this.addDataBases(latlng,this.state.dataSource);
        this.coordinates.push(latlng);
        // let marker = OpenLrDemo.createMarker(latlng.lat,latlng.lng);
        this.setState(()=>{
            let d = this.coordinates.map((c)=>{
                    return OpenLrDemo.createMarker(c.lat,c.lng);
                });
            return {
                data: d,
            }
        });
    }

    addDataBases(latlng,dataSource){
        let {lat,lng} = latlng;
        let tileXY = getTileXYForLocation(lat,lng,14);
        this.x = tileXY.x;
        this.y = tileXY.y;
        let promises = [];
        let t1 = performance.now();
        let promise = new Promise(resolve=>{
            for(let ix=tileXY.x-1;ix<=tileXY.x+1;ix++){
                for(let iy=tileXY.y-1;iy<=tileXY.y+1;iy++){
                    if(!this.tiles[ix+"_"+iy]){
                        // use this check if we only want to fetch each tile one time during the lifetime of this application
                        // not using this check results in refilling the mapDataBase every time the location is set
                        if(dataSource===inputDataEnum.RoutableTiles){
                            promises.push(this.addRoutableTileToMapDataBase(14,ix,iy));
                        }
                        else if(dataSource===inputDataEnum.OpenStreetMap){
                            promises.push(this.addOpenStreetMapTileToMapDataBase(14,ix,iy));
                        }
                        this.tiles[ix+"_"+iy] = true;
                    }
                }
            }

            Promise.all(promises).then(()=>{
                let t2 = performance.now();
                console.log("mapDataBase initialized in",t2-t1,"ms");
                resolve();
            }).catch();
        });
        this.dataBasesInitialized = Promise.all([
           this.dataBasesInitialized,
           promise
        ]);
    }

    addRoutableTileToMapDataBase(zoom,x,y){
        let t3 = performance.now();
        return new Promise((resolve,reject)=>{
            fetchRoutableTile(zoom, x, y)
                .then((data) => {
                    let t4 = performance.now();
                    console.log("downloaded tile",x,y,zoom,"in",t4-t3,"ms");
                    let t1 = performance.now();
                    getRoutableTilesNodesAndLines(data.triples)
                        .then((nodesAndLines) => {
                            if(this.routableTilesDataBase === undefined){
                                this.routableTilesDataBase = new MapDataBase();
                            }
                            let nodesLines = RoutableTilesIntegration.getNodesLines(nodesAndLines.nodes, nodesAndLines.lines);
                            this.routableTilesDataBase.addData(nodesLines.lines, nodesLines.nodes);
                            let t2 = performance.now();
                            console.log("parsed tile",x,y,zoom,"in",t2-t1,"ms");
                            resolve();
                        })
                })
                .catch((e)=>reject(e));
        });
    }

    addOpenStreetMapTileToMapDataBase(zoom,x,y){
        let boundingBox = tile2boundingBox(x,y,zoom);
        let t3 = performance.now();
        return new Promise((resolve,reject)=>{
            fetchOsmData(boundingBox.latLower,boundingBox.latUpper,boundingBox.longLower,boundingBox.longUpper)
                .then((data)=>{
                    let t4 = performance.now();
                    console.log("downloaded tile",x,y,zoom,"in",t4-t3,"ms");
                    let t1 = performance.now();
                    parseToJson(data)
                    .then((json)=>{getMappedElements(json)
                        .then((elements)=>{filterHighwayData(elements)
                            .then((highwayData)=>{
                                if(this.osmDataBase === undefined){
                                    this.osmDataBase = new MapDataBase();
                                }
                                let nodesLines = OSMIntegration.getNodesLines(highwayData.nodes,highwayData.ways,highwayData.relations);
                                this.osmDataBase.addData(nodesLines.lines,nodesLines.nodes);
                                let t2 = performance.now();
                                console.log("parsed tile",x,y,zoom,"in",t2-t1,"ms");
                                resolve();
                            })})})})
                .catch(e=>reject(e));
        });

    }

    createLineStringsOpenLr(lines,posOffset,negOffset){
        // let lat = 51.21205;
        // let lng = 4.39717;
        let lineStrings = [];
        if(lines !== undefined){
            for (let i=0;i<lines.length;i++) {
                lineStrings.push(OpenLrDemo.createPolyline(lines[i],i));
            }
            let firstOffsetCoord = lines[0].getGeoCoordinateAlongLine(posOffset*configProperties.internalPrecision);
            let lastOffsetCoord = lines[lines.length-1].getGeoCoordinateAlongLine(lines[lines.length-1].getLength()-(negOffset*configProperties.internalPrecision));
            lineStrings.push(<Circle key={"firstOffsetPoint"} center={[firstOffsetCoord.lat,firstOffsetCoord.long]} radius={1} color={"red"}/>);
            lineStrings.push(<Circle key={"lastOffsetPoint"} center={[lastOffsetCoord.lat,lastOffsetCoord.long]} radius={1} color={"magenta"}/>);
            this.setState({data: lineStrings});
        }
    }

    static createPolyline(line,seq){
        return <Polyline
            positions = {[[line.getStartNode().getLatitudeDeg(),line.getStartNode().getLongitudeDeg()],[line.getEndNode().getLatitudeDeg(),line.getEndNode().getLongitudeDeg()]]}
            key={line.getID()}
            color={seq%2===0?"Green":"DarkTurquoise "}
        >
            <Popup>
                <p>{line.getID()}</p>
            </Popup>
        </Polyline>;
    }

    reset(){
        this.setState((state)=>{
            return {
                data: [],
                coordinates: [],
                lat: state.lat,
                lng: state.lng,
            }
        });
        this.coordinates =[];
    }

    render(){
        let {data,lat,lng} = this.state;
        console.log(data);
        return <div>
            <div>
                <TileView zoom={14} lat={lat} lng={lng} data={data} onMouseClick={this.addMarker}/>
            </div>
            <select name={"Datasource"} value={this.state.dataSource} onChange={this.handleDataSourceSelect}>
                <option value={inputDataEnum.RoutableTiles}>Routable Tiles data</option>
                <option value={inputDataEnum.OpenStreetMap}>Open Street Map data</option>
                <option value={inputDataEnum.Wegenregister_Antwerpen}>Wegenregister Antwerpen data</option>
                <option value={inputDataEnum.Geojson_kruispunt_tropisch_instituut}>Geojson kruispunt tropisch instituut Antwerpen data</option>
            </select>
            <select name={"Encode strategy"} value={this.state.encodingStrat} onChange={this.handleEncodingStratSelect}>
                <option value={encodingStratEnum.OpenLrEncode}>OpenLrEncode</option>
                <option value={encodingStratEnum.LinesToLRPs}>Lines to LRPs</option>
            </select>
            <select name={"Internal algorithmic precision"} value={this.state.internalPrecision} onChange={this.handleInternalPrecisionSelect}>
                <option value={internalPrecisionEnum.CENTIMETER}>Centimeter</option>
                <option value={internalPrecisionEnum.METER}>Meter</option>
            </select>
            <button onClick={this.findMarkers}>Find lines in data</button>
            <button onClick={this.reset}>Reset</button>
            <button onClick={this.showLanesAntwerpenTest}>Demo kruispunt</button>
            current tile x value: {this.x}   current tile y value: {this.y}
        </div>;
    }

    handleEncodingStratSelect(event){
        this.setState({encodingStrat: event.target.value});
    }

    handleDataSourceSelect(event){
        this.setState({dataSource: event.target.value});
        this.tiles = [];
    }

    handleInternalPrecisionSelect(event){
        this.osmDataBase = undefined;
        this.routableTilesDataBase = undefined;
        this.wegenregisterDataBase = undefined;
        this.geojsonKruispuntDataBase = undefined;
        this.tiles = [];
        configProperties.internalPrecision = event.target.value*1;
        this.setState({internalPrecision: event.target.value*1});
        this.reset();
    }

    showLanesAntwerpenTest(){
        let data = [];
        let database = undefined;
        let dataBaseInitialized = new Promise((resolve)=>resolve());
        if(this.state.dataSource===inputDataEnum.Wegenregister_Antwerpen){
            if(this.wegenregisterDataBase === undefined){
                dataBaseInitialized = new Promise(resolve=>{
                    let t3 = performance.now();
                    loadNodesLineStringsWegenregsterAntwerpen().then(features => {
                        let t4 = performance.now();
                        console.log("Wegenregister downloaded in",t4-t3,"ms");
                        try{
                            let t1 = performance.now();
                            this.wegenregisterDataBase = new MapDataBase();
                            WegenregisterAntwerpenIntegration.initMapDataBase(this.wegenregisterDataBase,features);
                            let t2 = performance.now();
                            console.log("Wegenregister parsed in",t2-t1,"ms");
                            console.log("Wegenregister initialised in",t2-t3);
                            resolve();
                        }
                        catch(e){
                            alert(e);
                        }
                    });
                });
            }
        }
        else if(this.state.dataSource===inputDataEnum.Geojson_kruispunt_tropisch_instituut){
            if(this.geojsonKruispuntDataBase === undefined){
                this.geojsonKruispuntDataBase = new MapDataBase();
                GeoJsonIntegration.initMapDataBase(this.geojsonKruispuntDataBase,map.features);
            }
        }
        else{
            this.addDataBases({lat: 51.21205, lng: 4.39717},this.state.dataSource);
            dataBaseInitialized = this.dataBasesInitialized;
        }
        console.log(dataBaseInitialized);
        downloadOpenTrafficLightsTestData().then(doc=>{
            MainDemo._getTrafficLightData(doc).then(parsed=> {
                let LRPs = MainDemo._toLRPs(parsed,this.state.encodingStrat);
                dataBaseInitialized.then(() => {
                    console.log(dataBaseInitialized);
                    if(this.state.dataSource===inputDataEnum.OpenStreetMap){
                        database = this.osmDataBase;
                    }
                    else if(this.state.dataSource===inputDataEnum.RoutableTiles){
                        database = this.routableTilesDataBase;
                    }
                    else if(this.state.dataSource===inputDataEnum.Wegenregister_Antwerpen){
                        database = this.wegenregisterDataBase;
                    }
                    else if(this.state.dataSource===inputDataEnum.Geojson_kruispunt_tropisch_instituut){
                        database = this.geojsonKruispuntDataBase;
                    }
                    console.log("Lines in target database:",Object.keys(database.lines).length);
                    let t1 = performance.now();
                    LRPs.forEach(line => {
                        try {
                            let decoded = OpenLRDecoder.decode(line.LRP, database, decoderProperties);
                            console.log("Line:",line,"Decoded:",decoded);
                            let lineData = MainDemo.createLineStringsOpenLrForLane(decoded.lines, decoded.posOffset, decoded.negOffset, line.lane);
                            Array.prototype.push.apply(data, lineData);
                        }
                        catch (e) {
                            console.error(e);
                        }
                    });
                    let t2 = performance.now();
                    console.log("LRPs decoded in ", t2 - t1, "ms");
                    this.setState({data: data});
                })
                    .catch(e=>{
                        this.osmDataBase = undefined;
                        this.routableTilesDataBase = undefined;
                        this.wegenregisterDataBase = undefined;
                        this.geojsonKruispuntDataBase = undefined;
                        this.tiles = [];
                        this.dataBasesInitialized = new Promise((resolve,reject)=>resolve());
                        alert(e);
                    });
            })});
    }
}