import {fetchCatalog} from "../Api";
import {CATALOG_URL} from "../config";

test('fetch catalog doesn\'t timeout',(done)=>{
    expect.assertions(1);
    fetchCatalog(CATALOG_URL).then((c)=>{
        expect(c).toBeDefined();
        done();
    });
});