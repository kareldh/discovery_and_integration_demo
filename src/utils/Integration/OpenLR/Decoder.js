import {locationTypeEnum} from "./map/Enum";
import LineDecoder from "./coder/LineDecoder";

export default class OpenLRDecoder {
    // static decode(encoded,mapDataBase,decoderProperties){
    //     let decoderProp = {};
    //     let rangeIncreases = 0;
    //     for(let k in decoderProperties){
    //         if(decoderProperties.hasOwnProperty(k)){
    //             decoderProp[k] = decoderProperties[k];
    //         }
    //     }
    //     if(encoded.type === locationTypeEnum.LINE_LOCATION){
    //         try {
    //             return LineDecoder.decode(mapDataBase,encoded.LRPs,encoded.posOffset,encoded.negOffset,decoderProp);
    //         }
    //         catch(e){
    //             if(!decoderProp.alwaysUseProjections){
    //                 // if decoding fails without always using projections,
    //                 // try again with always using projections
    //                 decoderProp.alwaysUseProjections = true;
    //                 return LineDecoder.decode(mapDataBase,encoded.LRPs,encoded.posOffset,encoded.negOffset,decoderProp);
    //             }
    //             else{
    //                 while(rangeIncreases < decoderProp.maxDecodeRetries){
    //                     rangeIncreases++;
    //                     decoderProp.dist = decoderProp.dist * decoderProp.distMultiplierForRetry;
    //                     decoderProp.distanceToNextDiff = decoderProp.distanceToNextDiff * decoderProp.distMultiplierForRetry;
    //                     try {
    //                         return LineDecoder.decode(mapDataBase,encoded.LRPs,encoded.posOffset,encoded.negOffset,decoderProp);
    //                     }
    //                     catch(err){
    //                         if(rangeIncreases >= decoderProp.maxDecodeRetries){
    //                             throw(err)
    //                         }
    //                     }
    //                 }
    //                 throw(e); //re-throw the error
    //             }
    //         }
    //     }
    // }
    // //retry with bigger dist and use no proj and always proj each time
    static decode(encoded,mapDataBase,decoderProperties){
        let decoderProp = {};
        let rangeIncreases = 0;
        for(let k in decoderProperties){
            if(decoderProperties.hasOwnProperty(k)){
                decoderProp[k] = decoderProperties[k];
            }
        }
        if(decoderProp.maxDecodeRetries === undefined){
            decoderProp.maxDecodeRetries = 0;
        }
        if(encoded.type === locationTypeEnum.LINE_LOCATION){
            while(rangeIncreases <= decoderProp.maxDecodeRetries){
                try {
                    return LineDecoder.decode(mapDataBase,encoded.LRPs,encoded.posOffset,encoded.negOffset,decoderProp);
                }
                catch(e){
                    if(!decoderProp.alwaysUseProjections){
                        // if decoding fails without always using projections,
                        // try again with always using projections
                        decoderProp.alwaysUseProjections = true;
                    }
                    else{
                        if(decoderProp.dist && decoderProp.distMultiplierForRetry && decoderProp.distanceToNextDiff){
                            rangeIncreases++;
                            if(rangeIncreases > decoderProp.maxDecodeRetries){
                                throw(e); //re-throw the error
                            }
                            let oldDist = decoderProp.dist;
                            decoderProp.dist = decoderProp.dist * decoderProp.distMultiplierForRetry;
                            decoderProp.distanceToNextDiff = decoderProp.distanceToNextDiff + (decoderProp.dist - oldDist) * 2;
                            decoderProp.alwaysUseProjections = false;
                        }
                        else{
                            throw(e); //re-throw the error
                        }
                    }
                }
            }
        }
    }

    // //no retry mechanism
    // static decode(encoded,mapDataBase,decoderProperties){
    //     let decoderProp = {};
    //     for(let k in decoderProperties){
    //         if(decoderProperties.hasOwnProperty(k)){
    //             decoderProp[k] = decoderProperties[k];
    //         }
    //     }
    //     if(encoded.type === locationTypeEnum.LINE_LOCATION){
    //         return LineDecoder.decode(mapDataBase,encoded.LRPs,encoded.posOffset,encoded.negOffset,decoderProp);
    //     }
    // }
}