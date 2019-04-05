export default class LocationReferencePoint{
    constructor(bearing,distanceToNext,frc,fow,lfrcnp,islast,lat,lon,seqNr){
        this.bearing = bearing;
        this.distanceToNext = distanceToNext;
        this.frc = frc;
        this.fow = fow;
        this.lfrcnp = lfrcnp;
        this.isLast = islast;
        this.lat = lat;
        this.lon = lon;
        this.seqNr = seqNr;
    }
}