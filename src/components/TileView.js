import React from 'react';
import {Map, TileLayer} from 'react-leaflet';


export default class TileView extends React.Component {
    constructor(props) {
        super();
        this.lat = props.lat;
        this.lng = props.lng;
        this.zoom = props.zoom;
        this.state = {
            data: props.data
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({data: newProps.data})
    }

    render() {
        const position = [this.lat, this.lng];
        const zoom = this.zoom;
        const {data} = this.state;
        return (
            <Map
                style = {{width:'600px', height: '600px'}}
                center = {position}
                zoom = {zoom}
            >
                <
                    TileLayer
                    attribution = '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {data}
            </Map>
        )
    }
}