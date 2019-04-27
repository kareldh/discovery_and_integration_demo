import axios from 'axios';


export function loadNodesLineStringsWegenregsterAntwerpen(){
    return new Promise(resolve => {
        axios.get("http://portaal-stadantwerpen.opendata.arcgis.com/datasets/6bad868c084a43ef8031cfe1b96956b2_297.geojson ").then(
            (data) => {
                resolve(data.data.features);
            }
        )
    });
}