import {internalPrecisionEnum} from "../map/Enum";

let decoderProperties = {
    dist: 15,    //maximum distance (in meter) of a candidate node to a LRP
    bearDiff: 60, //maximum difference (in degrees) between the bearing of a candidate node and that of a LRP
    frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 3, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 40, //maximum difference (in meter) between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: false,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 50
};

let configProperties = {
    bearDist: 2000,
    internalPrecision: internalPrecisionEnum.CENTIMETER
};

export {decoderProperties,configProperties};