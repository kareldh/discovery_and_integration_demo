import {fetchCatalog} from "../Api";

test('fetch catalog doesn\'t timeout',(done)=>{
    expect.assertions(1);
    fetchCatalog().then((c)=>{
        expect(c).toBeDefined();
        done();
    });
});