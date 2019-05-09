import rbush from 'rbush'

/**
 * Implementation of RBush for use with geospatial data
 * Wrapping at +180 and -180 longitude or +90 and -90 latitude currently not yet tested.
 * Looks to be faster than the GeoJSON-RBush package but further comparision needed
 */
export default class RbushLineSearchTree{
    constructor(featureCollection){
        this.tree = rbush();
        this.addPolygons(featureCollection);
    }

    addPolygons(featureCollection){
        let data = [];
        featureCollection.features.forEach((feature)=>{
            let minLong;
            let minLat;
            let maxLong;
            let maxLat;

            feature.geometry.coordinates[0].forEach((c)=>{
                if(minLong === undefined || c[0] < minLong) {
                    minLong = c[0];
                }
                else if(maxLong === undefined || c[0] > maxLong){
                    maxLong = c[0];
                }
                if(minLat === undefined || c[1] < minLat){
                    minLat = c[1];
                }
                else if(maxLat === undefined || c[1] > maxLat){
                    maxLat = c[1];
                }
            });

            if(minLong !== undefined && maxLong !== undefined && minLat !== undefined && maxLat !== undefined){
                data.push({
                    minX: minLong,
                    minY: minLat,
                    maxX: maxLong,
                    maxY: maxLat,
                    feature: feature
                });
            }
        });
        this.tree.load(data);
    }

    //dist given in meters
    //uses an approximate square bounding box around the given point, so it is possible that lines are returned that
    //are further than dist away. It is still necessary to iterate the returned polygons and calculate their real distance.
    findCloseBy(lat,long,dist){
        let earthRadius = 6371000;
        let latDiff = this.toDegrees(dist/earthRadius);
        let longDiff = this.toDegrees(dist/(Math.cos(this.toRadians(lat)) * earthRadius));
        let latUpper = lat+latDiff;
        let latLower = lat-latDiff;
        let longUpper = long+longDiff;
        let longLower = long-longDiff;
        return this.findInRange(latLower,longLower,latUpper,longUpper);
    }

    findInRange(latLower,longLower,latUpper,longUpper){
        let found = [];
        let latOverflow = latUpper > 90;
        let latUnderflow = latLower < -90;
        let longOverflow = longUpper > 180;
        let longUnderflow = longLower < -180;
        if((latOverflow&&latUnderflow) || (longOverflow || longUnderflow)){
            console.error("Given distance is to long and would cover all nodes. All nodes are returned.");
            return this.tree.all();
        }
        if(!latOverflow && !latUnderflow && !longOverflow && !longUnderflow){
            Array.prototype.push.apply(found,this.tree.search({minX: longLower, minY: latLower, maxX: longUpper, maxY: latUpper}));
        }
        else{
            let bottomLatMin;
            let bottomLatMax;
            let topLatMin;
            let topLatMax;
            let leftLongMin;
            let leftLongMax;
            let rightLongMin;
            let rightLongMax;

            if(latOverflow){
                bottomLatMin = latLower;
                bottomLatMax = 90;
                topLatMin = -90;
                topLatMax = -90 + (latUpper - 90);
            }
            if(longOverflow) {
                leftLongMin = longLower;
                leftLongMax = 180;
                rightLongMin = -180;
                rightLongMax = -180 + (longUpper - 180);
            }
            if(latUnderflow) {
                bottomLatMin = 90 + (latLower + 90);
                bottomLatMax = 90;
                topLatMin = -90;
                topLatMax = latUpper;
            }
            if(longUnderflow){
                leftLongMin = 90 + (latLower + 90);
                leftLongMax = 180;
                rightLongMin = -180;
                rightLongMax = longUpper;
            }
            if((latOverflow && (longUnderflow || longOverflow)) || (latUnderflow && (longUnderflow || longOverflow)))    {
                Array.prototype.push.apply(found, this.tree.search({
                    minX: leftLongMin,
                    minY: bottomLatMin,
                    maxX: leftLongMax,
                    maxY: bottomLatMax
                }));
                Array.prototype.push.apply(found, this.tree.search({
                    minX: rightLongMin,
                    minY: bottomLatMin,
                    maxX: rightLongMax,
                    maxY: bottomLatMax
                }));
                Array.prototype.push.apply(found, this.tree.search({
                    minX: rightLongMin,
                    minY: topLatMin,
                    maxX: rightLongMax,
                    maxY: topLatMax
                }));
                Array.prototype.push.apply(found, this.tree.search({
                    minX: leftLongMin,
                    minY: topLatMin,
                    maxX: leftLongMax,
                    maxY: topLatMax
                }));
            }
            else if(latOverflow || latUnderflow){
                Array.prototype.push.apply(found, this.tree.search({
                    minX: longLower,
                    minY: bottomLatMin,
                    maxX: longUpper,
                    maxY: bottomLatMax
                }));
                Array.prototype.push.apply(found, this.tree.search({
                    minX: longLower,
                    minY: topLatMin,
                    maxX: longUpper,
                    maxY: topLatMax
                }));
            }
            else if(longOverflow || longUnderflow){
                Array.prototype.push.apply(found, this.tree.search({
                    minX: rightLongMin,
                    minY: latLower,
                    maxX: rightLongMax,
                    maxY: latUpper
                }));
                Array.prototype.push.apply(found, this.tree.search({
                    minX: leftLongMin,
                    minY: latLower,
                    maxX: leftLongMax,
                    maxY: latUpper
                }));
            }
        }
        return found;
    }

    toRadians(degrees){
        return degrees * Math.PI / 180;
    }

    toDegrees(radians){
        return radians / Math.PI * 180
    }
}