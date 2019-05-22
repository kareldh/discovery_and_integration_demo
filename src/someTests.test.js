/**
 * @jest-environment node
 */

import axios from 'axios';

test('speed ophalen catalogus',(done)=>{
    expect.assertions(1);
    let t1 = clock();
    axios.get("https://opendata.vlaanderen.be/catalog.rdf?page=10").then((c)=>{
        let t2 = clock(t1);
        console.log("opgehaald in",t2,"ms");
        // console.log(c.data);
        expect(c.data).toBeDefined();
        done();
    })
});

test('speed ophalen catalogus na doorsturen',(done)=>{
    expect.assertions(1);
    let t1 = performance.now();
    axios.get("https://cors-anywhere.herokuapp.com/https://opendata.vlaanderen.be/catalog.rdf?page=10").then((c)=>{
        let t2 = performance.now();
        console.log("opgehaald in",t2-t1,"ms");
        // console.log(c.data);
        expect(c.data).toBeDefined();
        done();
    })
});

function clock(start) {
    if ( !start ) return process.hrtime();
    var end = process.hrtime(start);
    return Math.round((end[0]*1000) + (end[1]/1000000));
}