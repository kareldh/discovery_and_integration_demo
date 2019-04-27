import {loadNodesLineStringsWegenregsterAntwerpen} from "../LoadTestData";

test('loadNodesLineStringsWegenregsterAntwerpen',(done)=>{
    expect.assertions(1);
    loadNodesLineStringsWegenregsterAntwerpen().then(
        data => {
            expect(data).toBeDefined();
            console.log(data.length);
            done();
        }
    );
});