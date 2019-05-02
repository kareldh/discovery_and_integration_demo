import React from 'react';
import TileView from "./TileView";
import {
    fetchRoutableTile, filterHighwayData,
    getMappedElements, getRoutableTilesNodesAndLines,
    parseToJson
} from "../data/api";
import {Marker, Polyline, Popup, Circle} from "react-leaflet";
import {Input} from "semantic-ui-react";
import {loadOsmTestData, mapNodesLinesToID} from "../utils/OpenLR/test/Helperfunctions";
import OSMIntegration from "../utils/OpenLRData/OSMIntegration";
import OpenLRDecoder from "../utils/OpenLR/Decoder";
import LineEncoder from "../utils/OpenLR/coder/LineEncoder";
import MapDataBase from "../utils/OpenLR/map/MapDataBase";
import Line from "../utils/OpenLR/map/Line";
import Node from "../utils/OpenLR/map/Node";
import RoutableTilesIntegration from "../utils/OpenLRData/RoutableTilesIntegration";
import {loadNodesLineStringsWegenregsterAntwerpen} from "../data/LoadTestData";
import WegenregisterAntwerpenIntegration from "../utils/OpenLRData/WegenregisterAntwerpenIntegration";

let inputDataEnum = {
    "RoutableTiles": 0,
    "OpenStreetMap": 2,
    "Wegenregister_Antwerpen": 3
};

export default class OpenLrDemo extends React.Component{
    constructor(props){
        super(props);
        this.init = this.init.bind(this);
        this.state = {
            data: [],
            lat: 51.21205,
            lng: 4.39717,
        };
        this.x = 8392;
        this.y = 5469;
        this.coordinates =[];
        this.dataSource = inputDataEnum.OpenStreetMap;
        this.addMarker = this.addMarker.bind(this);
        this.createMarker = this.createMarker.bind(this);
        this.reset = this.reset.bind(this);
        this.findMarkersOsm = this.findMarkersOsm.bind(this);
        this.findMarkersRoutableTiles = this.findMarkersRoutableTiles.bind(this);
        this.findMarkers = this.findMarkers.bind(this);
        this.osmDataBase = undefined;
        this.routableTilesDataBase = undefined;
        this.wegenretisterDataBase = undefined;
    }

    componentDidMount(){
        this.init(inputDataEnum.OpenStreetMap,this.x,this.y);
    }

    init(mode,x,y){
        if(x === undefined || y === undefined){
            x = 8392;
            y = 5469;
        }
        if(mode === inputDataEnum.RoutableTiles){
            this.dataSource = inputDataEnum.RoutableTiles;
        }
        else if(mode === inputDataEnum.OpenStreetMap){
            this.dataSource = inputDataEnum.OpenStreetMap;
        }
        else if(mode === inputDataEnum.Wegenregister_Antwerpen){
            this.dataSource = inputDataEnum.Wegenregister_Antwerpen;
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
            let encoded = LineEncoder.encode(mapDataBase,l,0,0);
            console.log(encoded);

            if(this.dataSource===inputDataEnum.OpenStreetMap){
                this.findMarkersOsm(encoded);
            }
            else if(this.dataSource===inputDataEnum.RoutableTiles){
                this.findMarkersRoutableTiles(encoded);
            }
            else if(this.dataSource===inputDataEnum.Wegenregister_Antwerpen){
                this.findMarkersWegenregisterAntwerpen(encoded);
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
                                let t1 = performance.now();
                                this.osmDataBase = new MapDataBase();
                                OSMIntegration.initMapDataBase(this.osmDataBase,highwayData.nodes,highwayData.ways,highwayData.relations);
                                let decoded = OpenLRDecoder.decode(encoded,this.osmDataBase);
                                let t2 = performance.now();
                                console.log("Found in Open Street Maps in",t2-t1,"ms",decoded);
                                this.createLineStringsOpenLr(decoded.lines,decoded.posOffset,decoded.negOffset);
                            })})})});
        }
        else{
            let t1 = performance.now();
            let decoded = OpenLRDecoder.decode(encoded,this.osmDataBase);
            let t2 = performance.now();
            console.log("Found in Open Street Maps in",t2-t1,"ms",decoded);
            this.createLineStringsOpenLr(decoded.lines,decoded.posOffset,decoded.negOffset);
        }
    }

    findMarkersRoutableTiles(encoded){
        if(this.routableTilesDataBase === undefined){
            fetchRoutableTile(14,this.x,this.y)
                .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                    .then((nodesAndLines)=>{
                        let t1 = performance.now();
                        this.routableTilesDataBase = new MapDataBase();
                        RoutableTilesIntegration.initMapDataBase(this.routableTilesDataBase,nodesAndLines.nodes,nodesAndLines.lines);
                        let decoded = OpenLRDecoder.decode(encoded,this.routableTilesDataBase);
                        let t2 = performance.now();
                        console.log("Found in RoutableTiles in",t2-t1,"ms",decoded);
                        this.createLineStringsOpenLr(decoded.lines,decoded.posOffset,decoded.negOffset);
                    })});
        }
        else{
            let t1 = performance.now();
            let decoded = OpenLRDecoder.decode(encoded,this.routableTilesDataBase);
            let t2 = performance.now();
            console.log("Found in RoutableTiles in",t2-t1,"ms",decoded);
            this.createLineStringsOpenLr(decoded.lines,decoded.posOffset,decoded.negOffset);
        }
    }

    findMarkersWegenregisterAntwerpen(encoded){
        if(this.wegenretisterDataBase === undefined){
            loadNodesLineStringsWegenregsterAntwerpen().then(features => {
                this.wegenretisterDataBase = new MapDataBase();
                let t1 = performance.now();
                WegenregisterAntwerpenIntegration.initMapDataBase(this.wegenretisterDataBase,features);
                let decoded = OpenLRDecoder.decode(encoded,this.wegenretisterDataBase);
                let t2 = performance.now();
                console.log("Found in Wegenregister Antwerpen in",t2-t1,"ms",decoded);
                this.createLineStringsOpenLr(decoded.lines,decoded.posOffset,decoded.negOffset);
            });
        }
        else{
            let t1 = performance.now();
            let decoded = OpenLRDecoder.decode(encoded,this.wegenretisterDataBase);
            let t2 = performance.now();
            console.log("Found in Wegenregister Antwerpen in",t2-t1,"ms",decoded);
            this.createLineStringsOpenLr(decoded.lines,decoded.posOffset,decoded.negOffset);
        }
    }

    addMarker(latlng){
        this.coordinates.push(latlng);
        // let marker = this.createMarker(latlng.lat,latlng.lng);
        this.setState((state, props)=>{
            let d = this.coordinates.map((c)=>{
                    return this.createMarker(c.lat,c.lng);
                });
            return {
                data: d,
                lat: state.lat,
                lng: state.lng,
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
            this.setState((state, props)=>{
                return {
                    data: lineStrings,
                    lat: state.lat,
                    lng: state.lng,
                }
            });
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
            <button onClick={()=>{this.init(inputDataEnum.RoutableTiles,this.x,this.y)}}>Routable Tiles data</button>
            <button onClick={()=>{this.init(inputDataEnum.OpenStreetMap,this.x,this.y)}}>Open Street Map data</button>
            <button onClick={()=>{this.init(inputDataEnum.Wegenregister_Antwerpen,this.x,this.y)}}>Wegenregister Antwerpen data</button>
            <button onClick={this.findMarkers}>Find lines in data</button>
            <button onClick={this.reset}>Reset</button>
            current tile x value: {this.x}   current tile y value: {this.y}
            <Input placeholder="tile x value" onChange={(e,data)=>{this.x = data.value}}/>
            <Input placeholder="tile y value" onChange={(e,data)=>{this.y = data.value}}/>
        </div>;
    }
}