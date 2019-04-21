import {locationTypeEnum} from "./map/Enum";
import LineEncoder from "./coder/LineEncoder";
import JsonFormat from "./coder/JsonFormat";

export default class OpenLREncoder {
    static encode(location,mapDataBase){
        if(location.type === locationTypeEnum.LINE_LOCATION){
            let encoded = LineEncoder.encode(mapDataBase,location.locationLines,location.posOffset,location.negOffset);
            return JsonFormat.exportJson(locationTypeEnum.LINE_LOCATION,encoded.LRPs,encoded.posOffset,encoded.negOffset); //todo, should not happen here, but higher up
        }
    }
}