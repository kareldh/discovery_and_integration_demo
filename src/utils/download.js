import axios from "axios";

export function download(_uri){
    return new Promise((resolve,reject) => {
        axios.get(_uri)
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
}