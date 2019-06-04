export let catalog = `@prefix dc: <http://purl.org/dc/terms/> .
@prefix dcat: <http://www.w3.org/ns/dcat#> .
@prefix vocals: <http://w3id.org/rsp/vocals#> .
@prefix ns1: <http://www.w3.org/ns/locn#> .
@prefix ns2: <https://www.iana.org/assignments/media-types/application/vnd.geo+> .
@prefix ns3: <http://www.opengis.net/ont/geosparql#> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix vcard: <http://www.w3.org/2006/vcard/ns#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<https://github.com/kareldh/opentrafficlightscatalog>
  a vocals:StreamDescriptor, dcat:Catalog ;
  dc:description "Demo catalog as part of my masters thesis." ;
  dc:publisher <https://github.com/kareldh/TrafficLightsCatalog> ;
  dc:title "kareldh Catalog" ;
  dc:language <http://id.loc.gov/vocabulary/iso639-2/dut> ;
  dc:license <https://creativecommons.org/publicdomain/zero/1.0/> ;
  dc:issued "2019-05-03"^^xsd:date ;
  dc:modified "2019-05-03"^^xsd:date ;
  foaf:primaryTopic <https://lodi.ilabt.imec.be/observer/rawdata/latest#Dataset> ;
  vocals:stream <https://lodi.ilabt.imec.be/observer/rawdata/latest#Dataset> ;
  dcat:dataset <https://lodi.ilabt.imec.be/observer/rawdata/latest#Dataset> .

<https://lodi.ilabt.imec.be/observer/rawdata/latest#Dataset>
  a vocals:RDFStream, dcat:Dataset ;
  vocals:hasEndPoint <https://lodi.ilabt.imec.be/observer/rawdata/latest#Endpoint> ;
  dcat:distribution <https://lodi.ilabt.imec.be/observer/rawdata/latest#Endpoint> ;
  dcat:keyword "verkeerslicht" ;
  dc:subject <http://dbpedia.org/resource/Signal_timing>, <http://dbpedia.org/resource/Traffic_light> ;
  dc:spatial [
    a dc:Location ;
    ns1:geometry "{\\"type\\": \\"Polygon\\", \\"coordinates\\": [[[4.3942387, 51.2106996],[4.3942387, 51.2127026],[4.3991321, 51.2127026],[4.3991321, 51.2106996],[4.3942387, 51.2106996]]]}"^^ns2:json, "POLYGON ((4.3942387 51.2106996,4.3942387 51.2127026,4.3991321 51.2127026,4.3991321 51.2106996,4.3942387 51.2106996))"^^ns3:wktLiteral
  ] ;
  dc:description "Publicatie van verkeerslichtdata voor het kruispunt aan het Tropisch Instituut in Antwerpen volgen OpenTrafficLights.org" ;
  dc:publisher <https://github.com/kareldh/TrafficLightsCatalog> ;
  dcat:contactPoint <https://github.com/kareldh> ;
  dc:language <http://id.loc.gov/vocabulary/iso639-2/dut> ;
  dc:title "Verkeerslichtdata kruispunt Tropisch Instituut Antwerpen (OpenTrafficLights)" .

<https://github.com/kareldh/TrafficLightsCatalog>
  a foaf:Person, foaf:Agent ;
  foaf:mbox "karel.dhaene@ugent.be" ;
  foaf:name "Karel D'haene" .

<https://github.com/kareldh>
  a vcard:Individual ;
  vcard:hasEmail "karel.dhaene@ugent.be" ;
  vcard:fn "Karel D'haene" .

<https://lodi.ilabt.imec.be/observer/rawdata/latest#Endpoint>
  a vocals:StreamEndpoint, dcat:Distribution ;
  dcat:mediaType "application/trig" ;
  dcat:downloadURL "https://lodi.ilabt.imec.be/observer/rawdata/latest" ;
  dcat:accessURL "https://lodi.ilabt.imec.be/observer/rawdata/latest" ;
  dc:title "OpenTrafficLights" ;
  dc:description "OpenTrafficLights publishing traffic light api" ;
  dc:license <https://creativecommons.org/publicdomain/zero/1.0/> .

<https://creativecommons.org/publicdomain/zero/1.0/>
  a dc:LicenseDocument ;
  dc:type <http://purl.org/dc/dcmitype/Text> .
`;