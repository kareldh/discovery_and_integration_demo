import {loadNodesLineStringsWegenregisterAntwerpen} from "../LoadData";

test('loadNodesLineStringsWegenregisterAntwerpen',(done)=>{
    expect.assertions(1);
    loadNodesLineStringsWegenregisterAntwerpen().then(
        data => {
            expect(data).toBeDefined();
            console.log(data.length);
            done();
        }
    );
},10000);