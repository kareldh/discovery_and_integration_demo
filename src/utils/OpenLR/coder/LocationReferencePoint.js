export default class LocationReferencePoint{
    constructor(bearing,distanceToNext,frc,fow,lfrcnp,islast,lat,lon,seqNr){
        this.bearing = Math.round(bearing);
        this.distanceToNext = Math.round(distanceToNext);
        this.frc = frc;
        this.fow = fow;
        this.lfrcnp = lfrcnp;
        this.isLast = islast;
        this.lat = Number(Math.round(lat+'e5')+'e-5');
        this.long = Number(Math.round(lon+'e5')+'e-5');
        this.seqNr = seqNr;
    }
}