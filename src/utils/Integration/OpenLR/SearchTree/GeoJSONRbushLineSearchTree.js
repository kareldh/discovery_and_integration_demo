import {lineString} from '@turf/helpers'
import GeoJSONRbushSearchTree from "./GeoJSONRbushSearchTree";

export default class RbushLineSearchTree extends GeoJSONRbushSearchTree{
    constructor(lines){
        super();
        this.addLines(lines);
    }

    //one line === Line object
    addLines(lines){
        let data = [];

        //todo: maybe this could already be made in the openlr integration classes to speed this up
        for(let id in lines){
            if(lines.hasOwnProperty(id)){
                if(lines[id].getStartNode() === undefined || lines[id].getEndNode() === undefined){
                    throw lines[id];
                }
                data.push(lineString([
                    [lines[id].getStartNode().getLongitudeDeg(),lines[id].getStartNode().getLatitudeDeg()],
                    [lines[id].getEndNode().getLongitudeDeg(),lines[id].getEndNode().getLatitudeDeg()]
                ],{id: id}));
            }
        }
        this.tree.load(data);
    }

    //todo: remove lines
}