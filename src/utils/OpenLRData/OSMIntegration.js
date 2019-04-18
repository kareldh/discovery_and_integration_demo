import MapDataBase from "../OpenLR/map/MapDataBase";
import Line from "../OpenLR/map/Line";
import Node from "../OpenLR/map/Node";

export default class OSMIntegration{
    static initMapDataBase(lines,nodes){
        let openLRLines = {};
        let openLRNodes = {};
        nodes.forEach((node)=>{
           let openLRNode = new Node(node.id,node.lat,node.long);
           openLRNodes[openLRNode.getID()] = openLRNodes;

        });
        lines.forEach((line)=>{
            let openLRLine = new Line(line.id,openLRNodes[line.from],openLRNodes[line.to]);
            if(line.frc !== undefined){
                openLRLine.frc = OSMIntegration.getFRC(line.frc);
            }
            if(line.fow !== undefined){
                openLRLine.fow = OSMIntegration.getFRC(line.fow);
            }
            openLRLines[openLRLine.getID()] = openLRLine;
        });
        return new MapDataBase(openLRLines,openLRNodes);
    }
    
    static getFRC(osmvalue){
        return 0; //todo
    }

    static getFOW(osmvalue){
        return 0; //todo
    }
}