export function getTileXYForLocation(latitude, longitude, zoom){
    let x = _long2tile(longitude,zoom);
    let y = _lat2tile(latitude,zoom);
    return {x: x, y: y};
}

export function tile2boundingBox(x,y,zoom){
    let north = _tile2lat(y,zoom);
    let south = _tile2lat(y+1,zoom);
    let west = _tile2long(x, zoom);
    let east = _tile2long(x+1,zoom);
    return {
        latUpper: north,
        longLower: west,
        latLower: south,
        longUpper: east
    }
}

/*
https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29
 */
function _long2tile(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
function _lat2tile(lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }

function _tile2long(x,z) {
    return (x/Math.pow(2,z)*360-180);
}
function _tile2lat(y,z) {
    let n=Math.PI-2*Math.PI*y/Math.pow(2,z);
    return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
}