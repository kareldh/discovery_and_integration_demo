import React from 'react';
import TileView from "./TileView";
import {
    fetchOsmData,
    fetchRoutableTile, filterHighwayData,
    getIntersectionNodes, getMappedElements,
    getNodesWithTrafficSignals,
    parseToJson
} from "../data/api";
import {Marker, Polyline, Popup} from "react-leaflet";
import {Input} from "semantic-ui-react";

export default class ApiContainer extends React.Component{
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
    }

    componentDidMount(){
        this.init(0,this.x,this.y);
    }

    init(mode,x,y){
        if(x === undefined || y === undefined){
            x = 8392;
            y = 5469;
        }
        if(mode === 0){
            fetchRoutableTile(14,x,y).then((data)=>{getIntersectionNodes(data.triples).then((intersections)=>{this.createMarkers(intersections)})});
        }
        else if(mode === 1){
            fetchRoutableTile(14,x,y).then((data)=>{getNodesWithTrafficSignals(data.triples).then((intersections)=>{this.createMarkers(intersections)})});
        }
        else if(mode === 2){
            fetchOsmData()
                .then((data)=>{parseToJson(data).then((json)=>{getMappedElements(json).then((elements)=>{filterHighwayData(elements).then((highwayData)=>{this.createLineStrings(highwayData)})})})});
                // .then((data)=>{this.createLineStrings(getMappedElements(parseToJson(data)))});
        }
    }

    createMarkers(data){
        let i = 0;
        let lat = 51.21205;
        let lng = 4.39717;
        let markers = [];
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                markers.push(
                    <Marker key={data[key].id+"_"+i} position={[data[key].lat,data[key].lng]}>
                        <Popup>
                            <a href={data[key].id}>{data[key].id}</a>
                        </Popup>
                    </Marker>);
                if(i===0){
                    lat = data[key].lat;
                    lng = data[key].lng;
                }
                i++;
            }
        }
        this.setState({data: markers, lat: lat, lng: lng});
    }

    createLineStrings(data){
        let i = 0;
        let lat = 51.21205;
        let lng = 4.39717;
        let lineStrings = [];
        if(data.ways !== undefined){
            for (let key in data.ways) {
                if (data.ways.hasOwnProperty(key)) {
                    let positions = [];
                    data.ways[key].nd.forEach((node) => ApiContainer.getNodeLatLong(node["@_ref"], data, positions, i, lat, lng));
                    lineStrings.push(
                        <Polyline positions = {positions} key={data.ways[key]["@_id"]+i}>
                            <Popup>
                                <a href={"https://www.openstreetmap.org/way/"+data.ways[key]["@_id"]}>{"https://www.openstreetmap.org/way/"+data.ways[key]["@_id"]}</a>
                            </Popup>
                        </Polyline>);
                }
            }
            this.setState({data: lineStrings, lat: lat, lng: lng});
        }
    }

    static getNodeLatLong(node, data, positions, i, lat, lng) {
        if(data.nodes[node] !== undefined){
            positions.push([data.nodes[node]["@_lat"],data.nodes[node]["@_lon"]]);
            if(i===0){ //todo: werkt niet
                lat = data.nodes[node]["@_lat"];
                lng = data.nodes[node]["@_lon"];
            }
            i++;
        }
    }

    render(){
        let {data,lat,lng} = this.state;
        console.log(data);
        return <div>
            <div>
                <TileView zoom={14} lat={lat} lng={lng} data={data}/>
        </div>
            <button onClick={()=>{this.init(0,this.x,this.y)}}>Common Nodes between Ways</button>
            <button onClick={()=>{this.init(1,this.x,this.y)}}>Highway:traffic_signals Nodes</button>
            <button onClick={()=>{this.init(2,this.x,this.y)}}>OpenStreetMap Ways</button>
            current tile x value: {this.x}   current tile y value: {this.y}
            <Input placeholder="tile x value" onChange={(e,data)=>{this.x = data.value}}/>
            <Input placeholder="tile y value" onChange={(e,data)=>{this.y = data.value}}/>
        </div>;
    }
}