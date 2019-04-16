import {fetchCatalog} from "../Api";

test('fetch catalog doesn\'t timeout',(done)=>{
    fetchCatalog().then((c)=>{
        expect(c).toBeDefined();
        done();
    });
});