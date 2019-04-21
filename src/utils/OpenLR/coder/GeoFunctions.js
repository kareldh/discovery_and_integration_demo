import distance from '@turf/distance';
import {point} from '@turf/helpers'

// no longer used
export function calcDistance(lat1,long1,lat2,long2) {
    let from = point([
        long1,
        lat1
    ]);
    let to = point([
        long2,
        lat2
    ]);
    return distance(from,to,{units: "meters"})
}