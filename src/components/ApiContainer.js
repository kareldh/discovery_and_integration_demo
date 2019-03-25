import React from 'react';
import TileView from "./TileView";
import {fetchRoutableTile, getIntersectionNodes} from "../data/api";
import {Marker, Popup} from "react-leaflet";

export default class ApiContainer extends React.Component{
    constructor(props){
        super(props);
        this.init = this.init.bind(this);
        this.state = {
            data: {}
        };
        this.init();
    }

    init(){
        fetchRoutableTile(14,8392,5470).then((data)=>{getIntersectionNodes(data.triples).then((intersections)=>{this.setState({data: intersections})})});
    }

    render(){
        let {data} = this.state;
        let markers = [];
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                markers.push(
                    <Marker key={data[key].id} position={[data[key].lat,data[key].lng]}>
                        <Popup>
                            <a href={data[key].id}>{data[key].id}</a>
                        </Popup>
                    </Marker>);
            }
        }

        return <div>
            <TileView zoom={14} lat={51.21205} lng={4.39717} data={markers}/>
        </div>;
    }
}