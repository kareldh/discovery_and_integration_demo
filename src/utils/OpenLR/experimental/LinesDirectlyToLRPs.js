import LRPNodeHelper from "../coder/LRPNodeHelper";
import {locationTypeEnum} from "../map/Enum";

/**
 * function that takes lines and directly makes LRPs of them, without running through all the encoding steps
 * Can be used to skip the encoding completely. These LRPs can be decoded, but lack the benefit of the encoding.
 * The encoding step reduces the amount of LRPs to the bare minimum, which doesn't happen when using this method.
 * So if this method is used on 20 lines of which only the very first and last end points are valid, this method will return
 * 20 LRPs, wile the encoding would only return 2 LRPs. So use this method only on a small amount of lines.
 * @param lines
 * @returns {{LRPs: *, posOffset: number, negOffset: number, type: number}}
 * @constructor
 */
export function LinesDirectlyToLRPs(lines){
    if(lines.length === 0){
        throw Error("The array of lines is empty");
    }
    let shortestPaths = [];
    lines.forEach(()=>{
        shortestPaths.push({lines: [], length: 0});
    });
    let encLines = lines.length >= 2 ? lines : [lines[0],lines[0]];
    return {LRPs: LRPNodeHelper.lrpLinesToLRPs(encLines,shortestPaths), posOffset:0, negOffset: 0, type: locationTypeEnum.LINE_LOCATION};
}