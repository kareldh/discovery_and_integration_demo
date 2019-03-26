import React from 'react';
import TileView from "./TileView";
import {fetchRoutableTile, getIntersectionNodes, getNodesWithTrafficSignals} from "../data/api";
import {Marker, Popup} from "react-leaflet";
import {Input} from "semantic-ui-react";

export default class ApiContainer extends React.Component{
    constructor(props){
        super(props);
        this.init = this.init.bind(this);
        this.state = {
            data: {}
        };
        this.x = 8392;
        this.y = 5469;
        this.init(0,this.x,this.y);
    }

    init(mode,x,y){
        if(x === undefined || y === undefined){
            x = 8392;
            y = 5469;
        }
        if(mode === 0){
            fetchRoutableTile(14,x,y).then((data)=>{getIntersectionNodes(data.triples).then((intersections)=>{this.setState({data: intersections})})});
        }
        else if(mode === 1){
            fetchRoutableTile(14,x,y).then((data)=>{getNodesWithTrafficSignals(data.triples).then((intersections)=>{this.setState({data: intersections})})});
        }
    }

    render(){
        let {data} = this.state;
        let markers = [];
        let i = 0;
        let lat = 51.21205;
        let lng = 4.39717;
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

        return <div>
            <div>
                <TileView zoom={14} lat={lat} lng={lng} data={markers}/>
        </div>
            <button onClick={()=>{this.init(0,this.x,this.y)}}>Common Nodes between Ways</button>
            <button onClick={()=>{this.init(1,this.x,this.y)}}>Highway:traffic_signals Nodes</button>
            current tile x value: {this.x}   current tile y value: {this.y}
            <Input placeholder="tile x value" onChange={(e,data)=>{this.x = data.value}}/>
            <Input placeholder="tile y value" onChange={(e,data)=>{this.y = data.value}}/>
        </div>;
    }
}