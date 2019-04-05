import {locationTypeEnum} from "./map/Enum";
import LineEncoder from "./coder/LineEncoder";

export default class OpenLREncoder {
    static encode(location,mapDataBase){
        if(location.type === locationTypeEnum.LINE_LOCATION){
            return LineEncoder.encode(mapDataBase,location.locationLines,location.posOffset,location.negOffset);
        }
    }
}