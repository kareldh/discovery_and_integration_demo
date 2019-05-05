import rbush from 'rbush'

export default class RbushNodeSearchTree{
    constructor(nodes){
        this.tree = rbush(9, ['[0]', '[1]', '[0]', '[1]']);
        this.addNodes(nodes);
    }

    // one node === Node object
    addNodes(nodes){
        let data = [];

        //todo: this could already be made in the openlr integration classes
        for(let id in nodes){
            if(nodes.hasOwnProperty(id)){
                if(isNaN(nodes[id].getLongitudeDeg()) || isNaN(nodes[id].getLatitudeDeg())){
                    throw nodes[id];
                }
                data.push([nodes[id].getLongitudeDeg(),nodes[id].getLatitudeDeg(),nodes[id].getID()]);
            }
        }
        this.tree.load(data);
    }

    // one node === [long, lat, id]
    addData(data){
        this.tree.load(data);
    }

    //todo: remove nodes

    //dist given in meters
    //uses an approximate square bounding box around the given point, so it is possible that nodes are returned that
    //are further than dist away. It is still necessary to iterate the returned nodes and calculate their real distance.
    findCloseBy(lat,long,dist){
        let earthRadius = 6371000;
        let latDiff = this.toDegrees(dist/earthRadius);
        let longDiff = this.toDegrees(dist/(Math.cos(this.toRadians(lat)) * earthRadius));
        let foundNodes = [];
        let latUpper = lat+latDiff;
        let latLower = lat-latDiff;
        let longUpper = long+longDiff;
        let longLower = long-longDiff;
        let latOverflow = latUpper > 90;
        let latUnderflow = latLower < -90;
        let longOverflow = longUpper > 180;
        let longUnderflow = longLower < -180;
        if((latOverflow&&latUnderflow) || (longOverflow || longUnderflow)){
            console.error("Given distance is to long and would cover all nodes. All nodes are returned.");
            return this.tree.all();
        }
        if(!latOverflow && !latUnderflow && !longOverflow && !longUnderflow){
            Array.prototype.push.apply(foundNodes,this.tree.search({minX: longLower, minY: latLower, maxX: longUpper, maxY: latUpper}));
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
                Array.prototype.push.apply(foundNodes, this.tree.search({
                    minX: leftLongMin,
                    minY: bottomLatMin,
                    maxX: leftLongMax,
                    maxY: bottomLatMax
                }));
                Array.prototype.push.apply(foundNodes, this.tree.search({
                    minX: rightLongMin,
                    minY: bottomLatMin,
                    maxX: rightLongMax,
                    maxY: bottomLatMax
                }));
                Array.prototype.push.apply(foundNodes, this.tree.search({
                    minX: rightLongMin,
                    minY: topLatMin,
                    maxX: rightLongMax,
                    maxY: topLatMax
                }));
                Array.prototype.push.apply(foundNodes, this.tree.search({
                    minX: leftLongMin,
                    minY: topLatMin,
                    maxX: leftLongMax,
                    maxY: topLatMax
                }));
            }
            else if(latOverflow || latUnderflow){
                Array.prototype.push.apply(foundNodes, this.tree.search({
                    minX: longLower,
                    minY: bottomLatMin,
                    maxX: longUpper,
                    maxY: bottomLatMax
                }));
                Array.prototype.push.apply(foundNodes, this.tree.search({
                    minX: longLower,
                    minY: topLatMin,
                    maxX: longUpper,
                    maxY: topLatMax
                }));
            }
            else if(longOverflow || longUnderflow){
                Array.prototype.push.apply(foundNodes, this.tree.search({
                    minX: rightLongMin,
                    minY: latLower,
                    maxX: rightLongMax,
                    maxY: latUpper
                }));
                Array.prototype.push.apply(foundNodes, this.tree.search({
                    minX: leftLongMin,
                    minY: latLower,
                    maxX: leftLongMax,
                    maxY: latUpper
                }));
            }
        }
        return foundNodes;
    }

    toRadians(degrees){
        return degrees * Math.PI / 180;
    }

    toDegrees(radians){
        return radians / Math.PI * 180
    }
}