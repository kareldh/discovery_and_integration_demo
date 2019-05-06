import {locationTypeEnum} from "./map/Enum";
import LineDecoder from "./coder/LineDecoder";

export default class OpenLRDecoder {
    static decode(encoded,mapDataBase,decoderProperties){
        let decoderProp = {};
        for(let k in decoderProperties){
            if(decoderProperties.hasOwnProperty(k)){
                decoderProp[k] = decoderProperties[k];
            }
        }
        if(encoded.type === locationTypeEnum.LINE_LOCATION){
            try {
                return LineDecoder.decode(mapDataBase,encoded.LRPs,encoded.posOffset,encoded.negOffset,decoderProp);
            }
            catch(e){
                if(!decoderProp.alwaysUseProjections){
                    // if decoding fails without always using projections,
                    // try again with always using projections
                    decoderProp.alwaysUseProjections = true;
                    return LineDecoder.decode(mapDataBase,encoded.LRPs,encoded.posOffset,encoded.negOffset,decoderProp);
                }
                else{
                    throw(e); //re-throw the error
                }
            }
        }
    }
}