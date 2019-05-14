import {loadNodesLineStringsWegenregsterAntwerpen} from "../LoadData";

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