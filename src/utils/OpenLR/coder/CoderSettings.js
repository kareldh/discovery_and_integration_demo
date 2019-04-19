let decoderProperties = {
    dist: 50,    //maximum distance of a candidate node to a LRP
    bearDiff: 45, //maximum difference between the bearing of a candidate node and that of a LRP
    frcDiff: 3, //maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 2, //maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 100, //maximum difference between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: true,
    distMultiplier: 40,
    frcMultiplier: 10,
    fowMultiplier: 20,
    bearMultiplier: 30,
    maxSPSearchRetries: 50
};

let configProperties = {
    bearDist: 20
};

export {decoderProperties,configProperties};