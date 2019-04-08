import {locationTypeEnum} from "../map/Enum";

export default class JsonFormat{
    static exportJson(type,LRPs,posOffset,negOffset){
        if(type === locationTypeEnum.LINE_LOCATION){
            return this.exportLineLocation(LRPs,posOffset,negOffset);
        }
    }

    static exportLineLocation(LRPs,posOffset,negOffset) {
        let jsonObj = {
            "type": "RawLineLocationReference",
            "properties": {
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
                        "_pOffRelative":0,
                        "_nOffset": negOffset,
                        "_nOffRelative": 0,
                        "_version": 3
                    }
                }
            }
        };
        for(let i=0;i<LRPs.length;i++) {
            jsonObj.properties["_points"].properties.push({
                "type": "LocationReferencePoint",
                "properties": {
                    "_bearing": LRPs[i].bearing,
                    "_distanceToNext": LRPs[i].distanceToNext,
                    "_frc": LRPs[i].frc,
                    "_fow": LRPs[i].fow,
                    "_lfrcnp": LRPs[i].lfrcnp,
                    "_isLast": LRPs[i].isLast,
                    "_longitude": LRPs[i].lat,
                    "_latitude": LRPs[i].long,
                    "_sequenceNumber": LRPs[i].seqNr
                }
            });
        }

        return jsonObj;
    }
}