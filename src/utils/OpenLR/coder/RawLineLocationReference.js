export default class RawLineLocationReference{
    constructor(LRPs,posOffset,negOffset){
        this.type = "RawLineLocationReference";
        this.properties = {
            "_id": "binary",
            "_locationType": 1,
            "_returnCode": null,
            "_points": {
                "type": "Array",
                "properties": []
            },
            "_offsets": {
                "type": "Offsets",
                "properties": {
                    "_pOffset": posOffset,
                    "_pOffRelative": 0,
                    "_nOffset": negOffset,
                    "_nOffRelative": 0,
                    "_version": 3
                }
            }
        };
        for(let i=0;i<LRPs.length;i++) {
            this.properties["_points"].properties.push({
                "type": "LocationReferencePoint",
                "properties": {
                    "_bearing": LRPs[i].bearing,
                    "_distanceToNext": LRPs[i].distanceToNext,
                    "_frc": LRPs[i].frc,
                    "_fow": LRPs[i].fow,
                    "_lfrcnp": LRPs[i].lfrcnp,
                    "_isLast": LRPs[i].isLast,
                    "_longitude": LRPs[i].lat,
                    "_latitude": LRPs[i].lon,
                    "_sequenceNumber": LRPs[i].seqNr
                }
            });
        }
    }
}