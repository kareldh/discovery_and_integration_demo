import {
    decoderProperties, decoderPropertiesAlwaysProj,
    osmToOsm, osmToOsmNoEncoding, osmToRoutableTiles, osmToRoutableTilesNoEnc, osmToWegenregister,
    osmToWegenregisterNoEnc,
    routableTilesToRoutableTiles,
    routableTilesToRoutableTiles4MeterOffsetsDiff,
    routableTilesToRoutableTilesNoEncoding, routableTilesToWegenregister, routableTilesToWegenregisterNoEnc,
    wegenregisterToWegenregister, wegenregisterToWegenregisterNoEncoding,
    wegenregisterToWegenregisterNoEncodingNoShortLines,
    wegenregisterToWegenregisterNoShortLines
} from "./EncodeDecodeDemoTestFunctions";
import {internalPrecisionEnum} from "../OpenLR/map/Enum";
import {configProperties} from "../OpenLR/coder/CoderSettings";

describe("tests using configProperties in centimeter",()=>{

    describe("tests different databases",()=>{
        test('demo osm to wegenregister no proj',(done)=>{
            expect.hasAssertions();
            osmToWegenregister(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo osm to wegenregister always proj',(done)=>{
            expect.hasAssertions();
            osmToWegenregister(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo osm to wegenregister no enc no proj',(done)=>{
            expect.hasAssertions();
            osmToWegenregisterNoEnc(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo osm to wegenregister no enc always proj',(done)=>{
            expect.hasAssertions();
            osmToWegenregisterNoEnc(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);

        test('demo osm to RoutableTiles no proj',(done)=>{
            expect.hasAssertions();
            osmToRoutableTiles(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo osm to RoutableTiles always proj',(done)=>{
            expect.hasAssertions();
            osmToRoutableTiles(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo osm to RoutableTiles no enc no proj',(done)=>{
            expect.hasAssertions();
            osmToRoutableTilesNoEnc(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo osm to RoutableTiles no enc always proj',(done)=>{
            expect.hasAssertions();
            osmToRoutableTilesNoEnc(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);

        test('demo RoutableTiles to wegenregister no proj',(done)=>{
            expect.hasAssertions();
            routableTilesToWegenregister(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo RoutableTiles to wegenregister always proj',(done)=>{
            expect.hasAssertions();
            routableTilesToWegenregister(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo RoutableTiles to wegenregister no enc no proj',(done)=>{
            expect.hasAssertions();
            routableTilesToWegenregisterNoEnc(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo RoutableTiles to wegenregister no enc always proj',(done)=>{
            expect.hasAssertions();
            routableTilesToWegenregisterNoEnc(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
    });

    describe("tests same database",()=>{
        test('demo osm to osm',(done)=>{
            expect.hasAssertions();
            osmToOsm(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo osm to osm no proj',(done)=>{
            expect.hasAssertions();
            osmToOsm(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo osm to osm no encoding',(done)=>{
            expect.hasAssertions();
            osmToOsmNoEncoding(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo osm to osm no encoding no proj',(done)=>{
            expect.hasAssertions();
            osmToOsmNoEncoding(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);

        test('demo wegenregister to wegenregister',(done)=>{
            expect.hasAssertions();
            wegenregisterToWegenregister(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo wegenregister to wegenregister no proj',(done)=>{
            expect.hasAssertions();
            wegenregisterToWegenregister(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo wegenregister to wegenregister no encoding',(done)=>{
            expect.hasAssertions();
            wegenregisterToWegenregisterNoEncoding(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo wegenregister to wegenregister no encoding no proj',(done)=>{
            expect.hasAssertions();
            wegenregisterToWegenregisterNoEncoding(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);

        test('demo RoutableTiles to RoutableTiles',(done)=>{
            expect.hasAssertions();
            routableTilesToRoutableTiles(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo RoutableTiles to RoutableTiles no proj',(done)=>{
            expect.hasAssertions();
            routableTilesToRoutableTiles(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo RoutableTiles to RoutableTiles no encoding',(done)=>{
            expect.hasAssertions();
            routableTilesToRoutableTilesNoEncoding(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo RoutableTiles to RoutableTiles no encoding no proj',(done)=>{
            expect.hasAssertions();
            routableTilesToRoutableTilesNoEncoding(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
    });

    describe("tests wegenregister only lines longer than 5 meter",()=>{
        test('demo wegenregister to wegenregister NoShortLines',(done)=>{
            expect.hasAssertions();
            wegenregisterToWegenregisterNoShortLines(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo wegenregister to wegenregister no proj NoShortLines',(done)=>{
            expect.hasAssertions();
            wegenregisterToWegenregisterNoShortLines(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo wegenregister to wegenregister no encoding NoShortLines',(done)=>{
            expect.hasAssertions();
            wegenregisterToWegenregisterNoEncodingNoShortLines(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo wegenregister to wegenregister no encoding no proj NoShortLines',(done)=>{
            expect.hasAssertions();
            wegenregisterToWegenregisterNoEncodingNoShortLines(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
    });
});



describe("tests using configProperties in meter",()=>{
    beforeEach(()=>{
        configProperties.internalPrecision = internalPrecisionEnum.METER;
        configProperties.bearDist = 20;
    });

    describe("tests different databases",()=>{
        test('demo osm to wegenregister no proj',(done)=>{
            expect.hasAssertions();
            osmToWegenregister(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo osm to wegenregister always proj',(done)=>{
            expect.hasAssertions();
            osmToWegenregister(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo osm to wegenregister no enc no proj',(done)=>{
            expect.hasAssertions();
            osmToWegenregisterNoEnc(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo osm to wegenregister no enc always proj',(done)=>{
            expect.hasAssertions();
            osmToWegenregisterNoEnc(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);

        test('demo osm to RoutableTiles no proj',(done)=>{
            expect.hasAssertions();
            osmToRoutableTiles(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo osm to RoutableTiles always proj',(done)=>{
            expect.hasAssertions();
            osmToRoutableTiles(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo osm to RoutableTiles no enc no proj',(done)=>{
            expect.hasAssertions();
            osmToRoutableTilesNoEnc(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo osm to RoutableTiles no enc always proj',(done)=>{
            expect.hasAssertions();
            osmToRoutableTilesNoEnc(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);

        test('demo RoutableTiles to wegenregister no proj',(done)=>{
            expect.hasAssertions();
            routableTilesToWegenregister(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo RoutableTiles to wegenregister always proj',(done)=>{
            expect.hasAssertions();
            routableTilesToWegenregister(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo RoutableTiles to wegenregister no enc no proj',(done)=>{
            expect.hasAssertions();
            routableTilesToWegenregisterNoEnc(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo RoutableTiles to wegenregister no enc always proj',(done)=>{
            expect.hasAssertions();
            routableTilesToWegenregisterNoEnc(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
    });

    describe("tests same database",()=>{
        test('demo osm to osm',(done)=>{
            expect.hasAssertions();
            osmToOsm(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo osm to osm no proj',(done)=>{
            expect.hasAssertions();
            osmToOsm(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo osm to osm no encoding',(done)=>{
            expect.hasAssertions();
            osmToOsmNoEncoding(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo osm to osm no encoding no proj',(done)=>{
            expect.hasAssertions();
            osmToOsmNoEncoding(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);

        test('demo wegenregister to wegenregister',(done)=>{
            expect.hasAssertions();
            wegenregisterToWegenregister(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo wegenregister to wegenregister no proj',(done)=>{
            expect.hasAssertions();
            wegenregisterToWegenregister(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo wegenregister to wegenregister no encoding',(done)=>{
            expect.hasAssertions();
            wegenregisterToWegenregisterNoEncoding(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo wegenregister to wegenregister no encoding no proj',(done)=>{
            expect.hasAssertions();
            wegenregisterToWegenregisterNoEncoding(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);

        test('demo RoutableTiles to RoutableTiles 4 meter prec',(done)=>{
            expect.hasAssertions();
            routableTilesToRoutableTiles4MeterOffsetsDiff(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo RoutableTiles to RoutableTiles no proj',(done)=>{
            expect.hasAssertions();
            routableTilesToRoutableTiles(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo RoutableTiles to RoutableTiles no encoding',(done)=>{
            expect.hasAssertions();
            routableTilesToRoutableTilesNoEncoding(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo RoutableTiles to RoutableTiles no encoding no proj',(done)=>{
        expect.hasAssertions();
        routableTilesToRoutableTilesNoEncoding(decoderProperties).then((res)=>{
            console.log(res);
            expect(res).toBeDefined();
            done();
        });
    },60000);
    });

    describe("tests wegenregister only lines longer than 5 meter",()=>{
        test('demo wegenregister to wegenregister NoShortLines',(done)=>{
            expect.hasAssertions();
            wegenregisterToWegenregisterNoShortLines(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo wegenregister to wegenregister no proj NoShortLines',(done)=>{
            expect.hasAssertions();
            wegenregisterToWegenregisterNoShortLines(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo wegenregister to wegenregister no encoding NoShortLines',(done)=>{
            expect.hasAssertions();
            wegenregisterToWegenregisterNoEncodingNoShortLines(decoderPropertiesAlwaysProj).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
        test('demo wegenregister to wegenregister no encoding no proj NoShortLines',(done)=>{
            expect.hasAssertions();
            wegenregisterToWegenregisterNoEncodingNoShortLines(decoderProperties).then((res)=>{
                console.log(res);
                expect(res).toBeDefined();
                done();
            });
        },60000);
    });

    afterEach(()=>{
        configProperties.internalPrecision = internalPrecisionEnum.CENTIMETER;
        configProperties.bearDist = 2000;
    });
});