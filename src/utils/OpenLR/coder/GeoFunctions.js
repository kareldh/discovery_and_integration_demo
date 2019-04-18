import distance from '@turf/distance';
import {point} from '@turf/helpers'

export function calcDistance(lat1,long1,lat2,long2) {
    let from = point([
        lat1,
        long1
    ]);
    let to = point([
        lat2,
        long2
    ]);
    return distance(from,to,{units: "meters"})
}