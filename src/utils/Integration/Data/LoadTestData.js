import {map} from "./testdata/osmMap";
import {wegenregister} from "./testdata/wegenregister_segment";

export function loadWegenRegisterAntwerpenTestData(){
    return new Promise((resolve)=>{
        resolve(wegenregister)
    })
}

export function loadOsmTestData() {
    return new Promise((resolve) => {
        resolve(map)
    })
}