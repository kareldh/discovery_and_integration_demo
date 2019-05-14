import {map} from "./testdata/osmMap";

export function loadOsmTestData() {
    return new Promise((resolve) => {
        resolve(map)
    })
}