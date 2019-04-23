import {decoderProperties} from "./coder/CoderSettings";
import {locationTypeEnum} from "./map/Enum";
import LineDecoder from "./coder/LineDecoder";

export default class OpenLRDecoder {
    static decode(encoded,mapDataBase){
        if(encoded.type === locationTypeEnum.LINE_LOCATION){
            return LineDecoder.decode(mapDataBase,encoded.LRPs,encoded.posOffset,encoded.negOffset,decoderProperties);
        }
    }
}