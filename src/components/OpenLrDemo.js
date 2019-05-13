import React from 'react';
import TileView from "./TileView";
import {
    filterHighwayData,
    getMappedElements, getRoutableTilesNodesAndLines,
    parseToJson
} from "../utils/Integration/Data/ParseData";
import {Marker, Polyline, Popup, Circle} from "react-leaflet";
import {Input} from "semantic-ui-react";
import {loadOsmTestData, mapNodesLinesToID} from "../utils/Integration/OpenLR/test/Helperfunctions";
import OSMIntegration from "../utils/Integration/OpenLRIntegration/OSMIntegration";
import OpenLRDecoder from "../utils/Integration/OpenLR/Decoder";
import LineEncoder from "../utils/Integration/OpenLR/coder/LineEncoder";
import MapDataBase from "../utils/Integration/OpenLR/map/MapDataBase";
import Line from "../utils/Integration/OpenLR/map/Line";
import Node from "../utils/Integration/OpenLR/map/Node";
import RoutableTilesIntegration from "../utils/Integration/OpenLRIntegration/RoutableTilesIntegration";
import {loadNodesLineStringsWegenregsterAntwerpen,fetchRoutableTile} from "../utils/Integration/Data/LoadData";
import WegenregisterAntwerpenIntegration from "../utils/Integration/OpenLRIntegration/WegenregisterAntwerpenIntegration";
import GeoJsonIntegration from "../utils/Integration/OpenLRIntegration/GeoJsonIntegration";
import {map} from "../utils/Integration/Data/testdata/junction_with_lanes_manual";
import {LinesDirectlyToLRPs} from "../utils/Integration/OpenLR/experimental/LinesDirectlyToLRPs";
import {configProperties, decoderProperties} from "../utils/Integration/OpenLR/coder/CoderSettings";
import {internalPrecisionEnum} from "../utils/Integration/OpenLR/map/Enum";

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
        this.init = this.init.bind(this);
        this.state = {
            data: [],
            lat: 51.21205,
            lng: 4.39717,
            encodingStrat: encodingStratEnum.OpenLrEncode,
            dataSource: inputDataEnum.RoutableTiles
        };
        this.x = 8392;
        this.y = 5469;
        this.coordinates =[];
        this.addMarker = this.addMarker.bind(this);
        this.createMarker = this.createMarker.bind(this);
        this.reset = this.reset.bind(this);
        this.findMarkersOsm = this.findMarkersOsm.bind(this);
        this.findMarkersRoutableTiles = this.findMarkersRoutableTiles.bind(this);
        this.findMarkers = this.findMarkers.bind(this);
        this.handleEncodingStratSelect = this.handleEncodingStratSelect.bind(this);
        this.handleDataSourceSelect = this.handleDataSourceSelect.bind(this);
        this.osmDataBase = undefined;
        this.routableTilesDataBase = undefined;
        this.wegenretisterDataBase = undefined;
        this.geojsonKruispuntDataBase = undefined;
    }

    componentDidMount(){
        this.init(this.x,this.y);
    }

    init(x,y){
        if(x === undefined || y === undefined){
            x = 8392;
            y = 5469;
        }
    }

    createMarker(latitude,longitude){
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
        if(this.osmDataBase === undefined){
            loadOsmTestData()
                .then((data)=>{parseToJson(data)
                    .then((json)=>{getMappedElements(json)
                        .then((elements)=>{filterHighwayData(elements)
                            .then((highwayData)=>{
                                try {
                                    let t1 = performance.now();
                                    this.osmDataBase = new MapDataBase();
                                    OSMIntegration.initMapDataBase(this.osmDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                                    let decoded = OpenLRDecoder.decode(encoded,this.osmDataBase,decoderProperties);
                                    let t2 = performance.now();
                                    console.log("Found in Open Street Maps in",t2-t1,"ms",decoded);
                                    this.createLineStringsOpenLr(decoded.lines,decoded.posOffset,decoded.negOffset);
                                }
                                catch(e){
                                    alert(e);
                                }
                            })})})});
        }
        else{
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
        }
    }

    findMarkersRoutableTiles(encoded){
        if(this.routableTilesDataBase === undefined){
            fetchRoutableTile(14,this.x,this.y)
                .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                    .then((nodesAndLines)=>{
                        try{
                            let t1 = performance.now();
                            this.routableTilesDataBase = new MapDataBase();
                            RoutableTilesIntegration.initMapDataBase(this.routableTilesDataBase,nodesAndLines.nodes,nodesAndLines.lines);
                            let decoded = OpenLRDecoder.decode(encoded,this.routableTilesDataBase,decoderProperties);
                            let t2 = performance.now();
                            console.log("Found in RoutableTiles in",t2-t1,"ms",decoded);
                            this.createLineStringsOpenLr(decoded.lines,decoded.posOffset,decoded.negOffset);
                        }
                        catch(e){
                            alert(e);
                        }
                    })});
        }
        else{
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
        }
    }

    findMarkersWegenregisterAntwerpen(encoded){
        if(this.wegenretisterDataBase === undefined){
            loadNodesLineStringsWegenregsterAntwerpen().then(features => {
                try{
                    this.wegenretisterDataBase = new MapDataBase();
                    let t1 = performance.now();
                    WegenregisterAntwerpenIntegration.initMapDataBase(this.wegenretisterDataBase,features);
                    let decoded = OpenLRDecoder.decode(encoded,this.wegenretisterDataBase,decoderProperties);
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
                let decoded = OpenLRDecoder.decode(encoded,this.wegenretisterDataBase,decoderProperties);
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
        this.coordinates.push(latlng);
        // let marker = this.createMarker(latlng.lat,latlng.lng);
        this.setState(()=>{
            let d = this.coordinates.map((c)=>{
                    return this.createMarker(c.lat,c.lng);
                });
            return {
                data: d,
            }
        });
    }

    createLineStringsOpenLr(lines,posOffset,negOffset){
        // let lat = 51.21205;
        // let lng = 4.39717;
        let lineStrings = [];
        if(lines !== undefined){
            for (let i=0;i<lines.length;i++) {
                lineStrings.push(
                    <Polyline
                        positions = {[[lines[i].getStartNode().getLatitudeDeg(),lines[i].getStartNode().getLongitudeDeg()],[lines[i].getEndNode().getLatitudeDeg(),lines[i].getEndNode().getLongitudeDeg()]]}
                        key={lines[i].getID()}
                        color={i%2===0?"Blue":"DarkTurquoise "}
                    >
                        <Popup>
                            <p>{lines[i].getID()}</p>
                        </Popup>
                    </Polyline>);
            }
            let firstOffsetCoord = lines[0].getGeoCoordinateAlongLine(posOffset*100);
            let lastOffsetCoord = lines[lines.length-1].getGeoCoordinateAlongLine(lines[lines.length-1].getLength()-(negOffset*100));
            lineStrings.push(<Circle key={"firstOffsetPoint"} center={[firstOffsetCoord.lat,firstOffsetCoord.long]} radius={1} color={"red"}/>);
            lineStrings.push(<Circle key={"lastOffsetPoint"} center={[lastOffsetCoord.lat,lastOffsetCoord.long]} radius={1} color={"magenta"}/>);
            this.setState({data: lineStrings});
        }
    }

    reset(){
        this.setState((state,props)=>{
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
            current tile x value: {this.x}   current tile y value: {this.y}
            <Input placeholder="tile x value" onChange={(e,data)=>{this.x = data.value}}/>
            <Input placeholder="tile y value" onChange={(e,data)=>{this.y = data.value}}/>
        </div>;
    }

    handleEncodingStratSelect(event){
        this.setState({encodingStrat: event.target.value});
    }

    handleDataSourceSelect(event){
        this.setState({dataSource: event.target.value});
    }

    handleInternalPrecisionSelect(event){
        this.osmDataBase = undefined;
        this.routableTilesDataBase = undefined;
        this.wegenretisterDataBase = undefined;
        this.geojsonKruispuntDataBase = undefined;
        configProperties.internalPrecision = event.target.value;
    }
}