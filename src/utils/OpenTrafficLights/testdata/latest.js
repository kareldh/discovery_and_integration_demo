export let data = `@prefix dcterms: <http://purl.org/dc/terms/>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix skos: <http://www.w3.org/2004/02/skos/core#>.
@prefix skos-thes: <http://purl.org/iso25964/skos-thes#>.
@prefix void: <http://rdfs.org/ns/void#>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix otl: <https://w3id.org/opentrafficlights#>.

<https://lodi.ilabt.imec.be/opentrafficlights/rawdata#Dataset> rdfs:type void:Dataset;
    dcterms:subject <http://dbpedia.org/resource/Signal_timing>, <http://dbpedia.org/resource/Traffic_light>.
_:b0_connection1 a otl:Connection;
    otl:departureLane _:b0_lane1;
    otl:arrivalLane _:b0_lane11;
    otl:signalGroup <https://opentrafficlights.org/id/signalgroup/K648/6>.
_:b0_connection2 a otl:Connection;
    otl:departureLane _:b0_lane2;
    otl:arrivalLane _:b0_lane9;
    otl:signalGroup <https://opentrafficlights.org/id/signalgroup/K648/7>.
_:b0_connection3 a otl:Connection;
    otl:departureLane _:b0_lane2;
    otl:arrivalLane _:b0_lane7;
    otl:signalGroup <https://opentrafficlights.org/id/signalgroup/K648/7>.
_:b0_connection4 a otl:Connection;
    otl:departureLane _:b0_lane2;
    otl:arrivalLane _:b0_lane5;
    otl:signalGroup <https://opentrafficlights.org/id/signalgroup/K648/7>.
_:b0_connection5 a otl:Connection;
    otl:departureLane _:b0_lane8;
    otl:arrivalLane _:b0_lane3;
    otl:signalGroup <https://opentrafficlights.org/id/signalgroup/K648/5>.
_:b0_connection6 a otl:Connection;
    otl:departureLane _:b0_lane8;
    otl:arrivalLane _:b0_lane5;
    otl:signalGroup <https://opentrafficlights.org/id/signalgroup/K648/5>.
_:b0_connection7 a otl:Connection;
    otl:departureLane _:b0_lane8;
    otl:arrivalLane _:b0_lane7;
    otl:signalGroup <https://opentrafficlights.org/id/signalgroup/K648/5>.
_:b0_connection8 a otl:Connection;
    otl:departureLane _:b0_lane8;
    otl:arrivalLane _:b0_lane11;
    otl:signalGroup <https://opentrafficlights.org/id/signalgroup/K648/5>.
_:b0_connection9 a otl:Connection;
    otl:departureLane _:b0_lane6;
    otl:arrivalLane _:b0_lane5;
    otl:signalGroup <https://opentrafficlights.org/id/signalgroup/K648/4>.
_:b0_connection10 a otl:Connection;
    otl:departureLane _:b0_lane6;
    otl:arrivalLane _:b0_lane3;
    otl:signalGroup <https://opentrafficlights.org/id/signalgroup/K648/4>.
_:b0_connection11 a otl:Connection;
    otl:departureLane _:b0_lane6;
    otl:arrivalLane _:b0_lane11;
    otl:signalGroup <https://opentrafficlights.org/id/signalgroup/K648/4>.
_:b0_connection12 a otl:Connection;
    otl:departureLane _:b0_lane6;
    otl:arrivalLane _:b0_lane9;
    otl:signalGroup <https://opentrafficlights.org/id/signalgroup/K648/4>.
_:b0_connection13 a otl:Connection;
    otl:departureLane _:b0_lane4;
    otl:arrivalLane _:b0_lane3;
    otl:signalGroup <https://opentrafficlights.org/id/signalgroup/K648/3>.
_:b0_connection14 a otl:Connection;
    otl:departureLane _:b0_lane4;
    otl:arrivalLane _:b0_lane11;
    otl:signalGroup <https://opentrafficlights.org/id/signalgroup/K648/3>.
_:b0_connection15 a otl:Connection;
    otl:departureLane _:b0_lane4;
    otl:arrivalLane _:b0_lane9;
    otl:signalGroup <https://opentrafficlights.org/id/signalgroup/K648/3>.
_:b0_connection16 a otl:Connection;
    otl:departureLane _:b0_lane4;
    otl:arrivalLane _:b0_lane7;
    otl:signalGroup <https://opentrafficlights.org/id/signalgroup/K648/3>.
_:b0_connection17 a otl:Connection;
    otl:departureLane _:b0_lane10;
    otl:arrivalLane _:b0_lane3;
    otl:signalGroup <https://opentrafficlights.org/id/signalgroup/K648/1>.
_:b0_connection18 a otl:Connection;
    otl:departureLane _:b0_lane10;
    otl:arrivalLane _:b0_lane5;
    otl:signalGroup <https://opentrafficlights.org/id/signalgroup/K648/1>.
_:b0_connection19 a otl:Connection;
    otl:departureLane _:b0_lane10;
    otl:arrivalLane _:b0_lane7;
    otl:signalGroup <https://opentrafficlights.org/id/signalgroup/K648/1>.
_:b0_connection20 a otl:Connection;
    otl:departureLane _:b0_lane10;
    otl:arrivalLane _:b0_lane9;
    otl:signalGroup <https://opentrafficlights.org/id/signalgroup/K648/1>.
_:b0_lane1 a otl:Lane;
    <http://www.opengis.net/#geosparql/wktLiteral> "LINESTRING (51.2120579 4.3974731, 51.2118214 4.3991321)";
    <http://dbpedia.org/ontology/width> "100";
    dcterms:description "Kronenburgstraat (> nr. 48)".
_:b0_lane2 a otl:Lane;
    <http://www.opengis.net/#geosparql/wktLiteral> "LINESTRING (51.2120361 4.3974671, 51.2120058 4.3976971, 51.2120184 4.3977501)";
    <http://dbpedia.org/ontology/width> "100";
    dcterms:description "Kronenburgstraat (> nr. 48)".
_:b0_lane3 a otl:Lane;
    <http://www.opengis.net/#geosparql/wktLiteral> "LINESTRING (51.2118379 4.3970829, 51.2111054 4.3961904)";
    <http://dbpedia.org/ontology/width> "100";
    dcterms:description "Volkstraat".
_:b0_lane4 a otl:Lane;
    <http://www.opengis.net/#geosparql/wktLiteral> "LINESTRING (51.2117840 4.3972854, 51.2107036 4.3974678)";
    <http://dbpedia.org/ontology/width> "100";
    dcterms:description "Geuzenstraat".
_:b0_lane5 a otl:Lane;
    <http://www.opengis.net/#geosparql/wktLiteral> "LINESTRING (51.2117896 4.3972204, 51.2114204 4.3973075, 51.2106996 4.3974309)";
    <http://dbpedia.org/ontology/width> "100";
    dcterms:description "Geuzenstraat".
_:b0_lane6 a otl:Lane;
    <http://www.opengis.net/#geosparql/wktLiteral> "LINESTRING (51.2118379 4.3970829, 51.2111054 4.3961904)";
    <http://dbpedia.org/ontology/width> "100";
    dcterms:description "Volkstraat".
_:b0_lane7 a otl:Lane;
    <http://www.opengis.net/#geosparql/wktLiteral> "LINESTRING (51.2118758 4.3970172, 51.2111339 4.3961220)";
    <http://dbpedia.org/ontology/width> "100";
    dcterms:description "Volkstraat".
_:b0_lane8 a otl:Lane;
    <http://www.opengis.net/#geosparql/wktLiteral> "LINESTRING (51.2120563 4.3969880, 51.2121071 4.3965394, 51.2123772 4.3942387)";
    <http://dbpedia.org/ontology/width> "100";
    dcterms:description "Kronenburgstraat (< nr. 48)".
_:b0_lane9 a otl:Lane;
    <http://www.opengis.net/#geosparql/wktLiteral> "LINESTRING (51.2121009 4.3969997, 51.2124223 4.3942465)";
    <http://dbpedia.org/ontology/width> "100";
    dcterms:description "Kronenburgstraat (< nr. 48)".
_:b0_lane10 a otl:Lane;
    <http://www.opengis.net/#geosparql/wktLiteral> "LINESTRING (51.2122527 4.3973091, 51.2127026 4.3975384)";
    <http://dbpedia.org/ontology/width> "100";
    dcterms:description "Nationalestraat".
_:b0_lane11 a otl:Lane;
    <http://www.opengis.net/#geosparql/wktLiteral> "LINESTRING (51.2122440 4.3973510, 51.2126980 4.3975804)";
    <http://dbpedia.org/ontology/width> "100";
    dcterms:description "Nationalestraat".
<https://opentrafficlights.org/id/signalgroup/K648/1> rdfs:type otl:Signalgroup.
<https://opentrafficlights.org/id/signalgroup/K648/2> rdfs:type otl:Signalgroup.
<https://opentrafficlights.org/id/signalgroup/K648/3> rdfs:type otl:Signalgroup.
<https://opentrafficlights.org/id/signalgroup/K648/4> rdfs:type otl:Signalgroup.
<https://opentrafficlights.org/id/signalgroup/K648/5> rdfs:type otl:Signalgroup.
<https://opentrafficlights.org/id/signalgroup/K648/6> rdfs:type otl:Signalgroup.
<https://opentrafficlights.org/id/signalgroup/K648/7> rdfs:type otl:Signalgroup.
<https://opentrafficlights.org/id/signalgroup/K648/8> rdfs:type otl:Signalgroup.
<https://opentrafficlights.org/id/signalgroup/K648/9> rdfs:type otl:Signalgroup.
<https://w3id.org/opentrafficlights/thesauri/signalphase> a skos:ConceptScheme;
    dcterms:identifier "SIGNAL PHASE";
    skos:hasTopConcept <https://w3id.org/opentrafficlights/thesauri/signalphase/0>, <https://w3id.org/opentrafficlights/thesauri/signalphase/1>, <https://w3id.org/opentrafficlights/thesauri/signalphase/2>, <https://w3id.org/opentrafficlights/thesauri/signalphase/3>, <https://w3id.org/opentrafficlights/thesauri/signalphase/4>, <https://w3id.org/opentrafficlights/thesauri/signalphase/5>, <https://w3id.org/opentrafficlights/thesauri/signalphase/6>, <https://w3id.org/opentrafficlights/thesauri/signalphase/7>, <https://w3id.org/opentrafficlights/thesauri/signalphase/8>, <https://w3id.org/opentrafficlights/thesauri/signalphase/9>;
    skos:prefLabel "Signal phase"@en, "Signaal fase"@nl.
<https://w3id.org/opentrafficlights/thesauri/signalphase/0> a skos:Concept;
    dcterms:identifier "0"^^xsd:integer;
    skos:inScheme <https://w3id.org/opentrafficlights/thesauri/signalphase>;
    skos:prefLabel "Unavailable"@en, "Niet beschikbaar"@nl;
    skos:note "This phase is used for unknown or error."@en, "Duidt aan dat er een probleem is gedetecteerd of de fase is onbekend."@nl.
<https://w3id.org/opentrafficlights/thesauri/signalphase/1> a skos:Concept;
    dcterms:identifier "1"^^xsd:integer;
    skos:inScheme <https://w3id.org/opentrafficlights/thesauri/signalphase>;
    skos:prefLabel "Unlit (DARK)"@en, "Onverlicht (DONKER)"@en;
    skos:note "Stop vehicle at stop line. Do not proceed until it's safe."@en, "Stop het voertuig aan de stoplijn. Wacht tot het veilig is."@nl.
<https://w3id.org/opentrafficlights/thesauri/signalphase/2> a skos:Concept;
    dcterms:identifier "2"^^xsd:integer;
    skos:inScheme <https://w3id.org/opentrafficlights/thesauri/signalphase>;
    skos:prefLabel "Stop Then Proceed (flashing)"@en, "Stop-dan-verdergaan (knipperlicht)"@nl;
    skos:note "Stop vehicle at stop line. Do not proceed until it's safe."@en, "Stop het voertuig aan de stoplijn. Wacht tot het veilig is."@nl.
<https://w3id.org/opentrafficlights/thesauri/signalphase/3> a skos:Concept;
    dcterms:identifier "3"^^xsd:integer;
    skos:inScheme <https://w3id.org/opentrafficlights/thesauri/signalphase>;
    skos:prefLabel "Stop And Remain"@en, "Stop-En-Wacht"@nl;
    skos:note "Stop vehicle at stop line. Do not proceed."@en, "Stop het voertuig aan de stoplijn. Wacht."@nl.
<https://w3id.org/opentrafficlights/thesauri/signalphase/4> a skos:Concept;
    dcterms:identifier "4"^^xsd:integer;
    skos:inScheme <https://w3id.org/opentrafficlights/thesauri/signalphase>;
    skos:prefLabel "Pre-Movement"@en, "Voor-vertrek"@nl;
    skos:note "Stop vehicle. Prepare to proceed."@en, "Stop het voertuig. Maak klaar om te vertrekken."@nl, "Stop het voertuig. Maak klaar om te vertrekken."@nl;
    skos:editorialNote "Used in the European Union."@en, "Van toepassing in Europese Unie."@nl.
<https://w3id.org/opentrafficlights/thesauri/signalphase/5> a skos:Concept;
    dcterms:identifier "5"^^xsd:integer;
    skos:inScheme <https://w3id.org/opentrafficlights/thesauri/signalphase>;
    skos:prefLabel "Permissive Movement Allowed"@en, "Verdergaan is toegelaten onder voorwaarden."@nl;
    skos:note "Proceed with caution. Must yield to all conflicting traffic."@en, "Ga verder onder voorwaarde dat voorrang gegeven wordt bij conflict."@nl.
<https://w3id.org/opentrafficlights/thesauri/signalphase/6> a skos:Concept;
    dcterms:identifier "6"^^xsd:integer;
    skos:inScheme <https://w3id.org/opentrafficlights/thesauri/signalphase>;
    skos:prefLabel "Protected Movement Allowed"@en, "Ga verder met voorrang-garantie."@nl;
    skos:note "Proceed in direction indicated."@en, "Ga verder in de aangeduide richting."@nl.
<https://w3id.org/opentrafficlights/thesauri/signalphase/7> a skos:Concept;
    dcterms:identifier "7"^^xsd:integer;
    skos:inScheme <https://w3id.org/opentrafficlights/thesauri/signalphase>;
    skos:prefLabel "Permissive Clearance"@en, "Kruispunt vrijmaken zonder voorrang."@nl;
    skos:note "Prepare to stop. Proceed if unable to stop. Conflicting traffic may be present."@en, "Stop indien mogelijk. Anders maak kruispunt vrij. Conflicterend verkeer kan aanwezig zijn."@nl.
<https://w3id.org/opentrafficlights/thesauri/signalphase/8> a skos:Concept;
    dcterms:identifier "8"^^xsd:integer;
    skos:inScheme <https://w3id.org/opentrafficlights/thesauri/signalphase>;
    skos:prefLabel "Protected Clearance"@en, "Kruispunt vrijmaken met voorrang-garantie."@nl;
    skos:note "Prepare to stop. Proceed if unable to stop in direction indicated."@en, "Stop indien mogelijk. Anders maak kruispunt vrij."@nl.
<https://w3id.org/opentrafficlights/thesauri/signalphase/9> a skos:Concept;
    dcterms:identifier "9"^^xsd:integer;
    skos:inScheme <https://w3id.org/opentrafficlights/thesauri/signalphase>;
    skos:prefLabel "Caution Conflicting Traffic (Flashing)"@en, "Pas op voor conflicterend verkeer."@nl;
    skos:note "Proceed with caution. Conflicting traffic may be present at intersection conflict area."@en, "Ga opgelet verder. Mogelijk is er conflicterend verkeer op het kruispunt."@nl.


<https://opentrafficlights.org/spat/K648?time=2019-02-14T08:35:45.018Z> {
_:b3072910_b9851902 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/0>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:04.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:37:07.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/6> <https://w3id.org/opentrafficlights#signalState> _:b3072910_b9851902.
_:b3072910_b9851903 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:45.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/7> <https://w3id.org/opentrafficlights#signalState> _:b3072910_b9851903.
_:b3072910_b9851904 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:45.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/5> <https://w3id.org/opentrafficlights#signalState> _:b3072910_b9851904.
_:b3072910_b9851905 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/4> <https://w3id.org/opentrafficlights#signalState> _:b3072910_b9851905.
_:b3072910_b9851906 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:30.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:45.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/3> <https://w3id.org/opentrafficlights#signalState> _:b3072910_b9851906.
_:b3072910_b9851907 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/1> <https://w3id.org/opentrafficlights#signalState> _:b3072910_b9851907.
_:b3072910_b9851908 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:45.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/8> <https://w3id.org/opentrafficlights#signalState> _:b3072910_b9851908.
_:b3072910_b9851909 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/6>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:55.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:36:13.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/12> <https://w3id.org/opentrafficlights#signalState> _:b3072910_b9851909.
_:b3072910_b9851910 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:13.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:45.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/9> <https://w3id.org/opentrafficlights#signalState> _:b3072910_b9851910.
_:b3072910_b9851911 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:45.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/10> <https://w3id.org/opentrafficlights#signalState> _:b3072910_b9851911.
_:b3072910_b9851912 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/6>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:55.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:36:13.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/11> <https://w3id.org/opentrafficlights#signalState> _:b3072910_b9851912
}
<https://opentrafficlights.org/spat/K648?time=2019-02-14T08:35:45.018Z> <http://www.w3.org/ns/prov#generatedAtTime> "2019-02-14T08:35:45.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.

<https://opentrafficlights.org/spat/K648?time=2019-02-14T08:35:44.618Z> {
_:b3072907_b9851901 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:30.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:44.618Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/3> <https://w3id.org/opentrafficlights#signalState> _:b3072907_b9851901
}
<https://opentrafficlights.org/spat/K648?time=2019-02-14T08:35:44.618Z> <http://www.w3.org/ns/prov#generatedAtTime> "2019-02-14T08:35:44.618Z"^^<http://www.w3.org/2001/XMLSchema#date>.

<https://opentrafficlights.org/spat/K648?time=2019-02-14T08:35:44.018Z> {
_:b3072903_b9851890 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/0>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:04.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:37:07.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/6> <https://w3id.org/opentrafficlights#signalState> _:b3072903_b9851890.
_:b3072903_b9851891 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:44.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/7> <https://w3id.org/opentrafficlights#signalState> _:b3072903_b9851891.
_:b3072903_b9851892 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:44.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/5> <https://w3id.org/opentrafficlights#signalState> _:b3072903_b9851892.
_:b3072903_b9851893 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/4> <https://w3id.org/opentrafficlights#signalState> _:b3072903_b9851893.
_:b3072903_b9851894 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/0>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:44.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:44.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/3> <https://w3id.org/opentrafficlights#signalState> _:b3072903_b9851894.
_:b3072903_b9851895 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/1> <https://w3id.org/opentrafficlights#signalState> _:b3072903_b9851895.
_:b3072903_b9851896 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:44.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/8> <https://w3id.org/opentrafficlights#signalState> _:b3072903_b9851896.
_:b3072903_b9851897 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/6>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:55.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:36:13.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/12> <https://w3id.org/opentrafficlights#signalState> _:b3072903_b9851897.
_:b3072903_b9851898 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:13.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:44.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/9> <https://w3id.org/opentrafficlights#signalState> _:b3072903_b9851898.
_:b3072903_b9851899 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:44.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/10> <https://w3id.org/opentrafficlights#signalState> _:b3072903_b9851899.
_:b3072903_b9851900 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/6>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:55.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:36:13.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/11> <https://w3id.org/opentrafficlights#signalState> _:b3072903_b9851900
}
<https://opentrafficlights.org/spat/K648?time=2019-02-14T08:35:44.018Z> <http://www.w3.org/ns/prov#generatedAtTime> "2019-02-14T08:35:44.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.

<https://opentrafficlights.org/spat/K648?time=2019-02-14T08:35:43.018Z> {
_:b3072898_b9851879 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/0>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:04.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:37:07.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/6> <https://w3id.org/opentrafficlights#signalState> _:b3072898_b9851879.
_:b3072898_b9851880 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:43.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/7> <https://w3id.org/opentrafficlights#signalState> _:b3072898_b9851880.
_:b3072898_b9851881 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:43.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/5> <https://w3id.org/opentrafficlights#signalState> _:b3072898_b9851881.
_:b3072898_b9851882 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/4> <https://w3id.org/opentrafficlights#signalState> _:b3072898_b9851882.
_:b3072898_b9851883 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/0>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:44.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:44.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/3> <https://w3id.org/opentrafficlights#signalState> _:b3072898_b9851883.
_:b3072898_b9851884 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/1> <https://w3id.org/opentrafficlights#signalState> _:b3072898_b9851884.
_:b3072898_b9851885 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:43.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/8> <https://w3id.org/opentrafficlights#signalState> _:b3072898_b9851885.
_:b3072898_b9851886 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/6>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:55.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:36:13.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/12> <https://w3id.org/opentrafficlights#signalState> _:b3072898_b9851886.
_:b3072898_b9851887 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:13.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:43.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/9> <https://w3id.org/opentrafficlights#signalState> _:b3072898_b9851887.
_:b3072898_b9851888 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:43.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/10> <https://w3id.org/opentrafficlights#signalState> _:b3072898_b9851888.
_:b3072898_b9851889 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/6>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:55.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:36:13.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/11> <https://w3id.org/opentrafficlights#signalState> _:b3072898_b9851889
}
<https://opentrafficlights.org/spat/K648?time=2019-02-14T08:35:43.018Z> <http://www.w3.org/ns/prov#generatedAtTime> "2019-02-14T08:35:43.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.

<https://opentrafficlights.org/spat/K648?time=2019-02-14T08:35:42.018Z> {
_:b3072895_b9851868 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/0>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:04.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:37:07.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/6> <https://w3id.org/opentrafficlights#signalState> _:b3072895_b9851868.
_:b3072895_b9851869 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:42.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/7> <https://w3id.org/opentrafficlights#signalState> _:b3072895_b9851869.
_:b3072895_b9851870 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:42.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/5> <https://w3id.org/opentrafficlights#signalState> _:b3072895_b9851870.
_:b3072895_b9851871 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/4> <https://w3id.org/opentrafficlights#signalState> _:b3072895_b9851871.
_:b3072895_b9851872 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/0>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:44.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:44.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/3> <https://w3id.org/opentrafficlights#signalState> _:b3072895_b9851872.
_:b3072895_b9851873 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/1> <https://w3id.org/opentrafficlights#signalState> _:b3072895_b9851873.
_:b3072895_b9851874 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:42.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/8> <https://w3id.org/opentrafficlights#signalState> _:b3072895_b9851874.
_:b3072895_b9851875 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/6>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:55.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:36:13.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/12> <https://w3id.org/opentrafficlights#signalState> _:b3072895_b9851875.
_:b3072895_b9851876 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:13.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:42.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/9> <https://w3id.org/opentrafficlights#signalState> _:b3072895_b9851876.
_:b3072895_b9851877 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:42.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/10> <https://w3id.org/opentrafficlights#signalState> _:b3072895_b9851877.
_:b3072895_b9851878 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/6>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:55.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:36:13.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/11> <https://w3id.org/opentrafficlights#signalState> _:b3072895_b9851878
}
<https://opentrafficlights.org/spat/K648?time=2019-02-14T08:35:42.018Z> <http://www.w3.org/ns/prov#generatedAtTime> "2019-02-14T08:35:42.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.

<https://opentrafficlights.org/spat/K648?time=2019-02-14T08:35:41.617Z> {
_:b3072892_b9851867 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/0>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:44.417Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:44.417Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/3> <https://w3id.org/opentrafficlights#signalState> _:b3072892_b9851867
}
<https://opentrafficlights.org/spat/K648?time=2019-02-14T08:35:41.617Z> <http://www.w3.org/ns/prov#generatedAtTime> "2019-02-14T08:35:41.617Z"^^<http://www.w3.org/2001/XMLSchema#date>.

<https://opentrafficlights.org/spat/K648?time=2019-02-14T08:35:41.019Z> {
_:b3072888_b9851856 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/0>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:04.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:37:07.419Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/6> <https://w3id.org/opentrafficlights#signalState> _:b3072888_b9851856.
_:b3072888_b9851857 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:41.019Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/7> <https://w3id.org/opentrafficlights#signalState> _:b3072888_b9851857.
_:b3072888_b9851858 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:41.019Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/5> <https://w3id.org/opentrafficlights#signalState> _:b3072888_b9851858.
_:b3072888_b9851859 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:48.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:48.419Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/4> <https://w3id.org/opentrafficlights#signalState> _:b3072888_b9851859.
_:b3072888_b9851860 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/6>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:41.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:41.419Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/3> <https://w3id.org/opentrafficlights#signalState> _:b3072888_b9851860.
_:b3072888_b9851861 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:48.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:48.419Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/1> <https://w3id.org/opentrafficlights#signalState> _:b3072888_b9851861.
_:b3072888_b9851862 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:41.019Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/8> <https://w3id.org/opentrafficlights#signalState> _:b3072888_b9851862.
_:b3072888_b9851863 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/6>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:55.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:36:13.419Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/12> <https://w3id.org/opentrafficlights#signalState> _:b3072888_b9851863.
_:b3072888_b9851864 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:13.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:41.019Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/9> <https://w3id.org/opentrafficlights#signalState> _:b3072888_b9851864.
_:b3072888_b9851865 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:41.019Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/10> <https://w3id.org/opentrafficlights#signalState> _:b3072888_b9851865.
_:b3072888_b9851866 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/6>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:55.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:36:13.419Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/11> <https://w3id.org/opentrafficlights#signalState> _:b3072888_b9851866
}
<https://opentrafficlights.org/spat/K648?time=2019-02-14T08:35:41.019Z> <http://www.w3.org/ns/prov#generatedAtTime> "2019-02-14T08:35:41.019Z"^^<http://www.w3.org/2001/XMLSchema#date>.

<https://opentrafficlights.org/spat/K648?time=2019-02-14T08:35:40.018Z> {
_:b3072883_b9851845 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/0>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:04.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:37:07.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/6> <https://w3id.org/opentrafficlights#signalState> _:b3072883_b9851845.
_:b3072883_b9851846 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:40.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/7> <https://w3id.org/opentrafficlights#signalState> _:b3072883_b9851846.
_:b3072883_b9851847 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:40.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/5> <https://w3id.org/opentrafficlights#signalState> _:b3072883_b9851847.
_:b3072883_b9851848 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/4> <https://w3id.org/opentrafficlights#signalState> _:b3072883_b9851848.
_:b3072883_b9851849 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/6>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:41.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:41.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/3> <https://w3id.org/opentrafficlights#signalState> _:b3072883_b9851849.
_:b3072883_b9851850 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/1> <https://w3id.org/opentrafficlights#signalState> _:b3072883_b9851850.
_:b3072883_b9851851 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:40.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/8> <https://w3id.org/opentrafficlights#signalState> _:b3072883_b9851851.
_:b3072883_b9851852 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/6>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:55.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:36:13.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/12> <https://w3id.org/opentrafficlights#signalState> _:b3072883_b9851852.
_:b3072883_b9851853 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:13.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:40.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/9> <https://w3id.org/opentrafficlights#signalState> _:b3072883_b9851853.
_:b3072883_b9851854 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:40.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/10> <https://w3id.org/opentrafficlights#signalState> _:b3072883_b9851854.
_:b3072883_b9851855 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/6>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:55.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:36:13.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/11> <https://w3id.org/opentrafficlights#signalState> _:b3072883_b9851855
}
<https://opentrafficlights.org/spat/K648?time=2019-02-14T08:35:40.018Z> <http://www.w3.org/ns/prov#generatedAtTime> "2019-02-14T08:35:40.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.

<https://opentrafficlights.org/spat/K648?time=2019-02-14T08:35:39.018Z> {
_:b3072878_b9851834 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/0>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:04.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:37:07.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/6> <https://w3id.org/opentrafficlights#signalState> _:b3072878_b9851834.
_:b3072878_b9851835 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:39.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/7> <https://w3id.org/opentrafficlights#signalState> _:b3072878_b9851835.
_:b3072878_b9851836 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:39.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/5> <https://w3id.org/opentrafficlights#signalState> _:b3072878_b9851836.
_:b3072878_b9851837 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/4> <https://w3id.org/opentrafficlights#signalState> _:b3072878_b9851837.
_:b3072878_b9851838 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/6>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:41.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:41.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/3> <https://w3id.org/opentrafficlights#signalState> _:b3072878_b9851838.
_:b3072878_b9851839 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:48.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/1> <https://w3id.org/opentrafficlights#signalState> _:b3072878_b9851839.
_:b3072878_b9851840 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:39.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/8> <https://w3id.org/opentrafficlights#signalState> _:b3072878_b9851840.
_:b3072878_b9851841 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/6>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:55.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:36:13.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/12> <https://w3id.org/opentrafficlights#signalState> _:b3072878_b9851841.
_:b3072878_b9851842 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:13.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:39.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/9> <https://w3id.org/opentrafficlights#signalState> _:b3072878_b9851842.
_:b3072878_b9851843 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:39.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/10> <https://w3id.org/opentrafficlights#signalState> _:b3072878_b9851843.
_:b3072878_b9851844 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/6>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:55.418Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:36:13.418Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/11> <https://w3id.org/opentrafficlights#signalState> _:b3072878_b9851844
}
<https://opentrafficlights.org/spat/K648?time=2019-02-14T08:35:39.018Z> <http://www.w3.org/ns/prov#generatedAtTime> "2019-02-14T08:35:39.018Z"^^<http://www.w3.org/2001/XMLSchema#date>.

<https://opentrafficlights.org/spat/K648?time=2019-02-14T08:35:38.019Z> {
_:b3072875_b9851823 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/0>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:04.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:37:07.419Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/6> <https://w3id.org/opentrafficlights#signalState> _:b3072875_b9851823.
_:b3072875_b9851824 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:38.019Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/7> <https://w3id.org/opentrafficlights#signalState> _:b3072875_b9851824.
_:b3072875_b9851825 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:38.019Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/5> <https://w3id.org/opentrafficlights#signalState> _:b3072875_b9851825.
_:b3072875_b9851826 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:48.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:48.419Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/4> <https://w3id.org/opentrafficlights#signalState> _:b3072875_b9851826.
_:b3072875_b9851827 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/6>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:41.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:41.419Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/3> <https://w3id.org/opentrafficlights#signalState> _:b3072875_b9851827.
_:b3072875_b9851828 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:48.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:35:48.419Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/1> <https://w3id.org/opentrafficlights#signalState> _:b3072875_b9851828.
_:b3072875_b9851829 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:38.019Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/8> <https://w3id.org/opentrafficlights#signalState> _:b3072875_b9851829.
_:b3072875_b9851830 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/6>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:55.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:36:13.419Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/12> <https://w3id.org/opentrafficlights#signalState> _:b3072875_b9851830.
_:b3072875_b9851831 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:13.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:38.019Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/9> <https://w3id.org/opentrafficlights#signalState> _:b3072875_b9851831.
_:b3072875_b9851832 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/3>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:36:12.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T09:35:38.019Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/10> <https://w3id.org/opentrafficlights#signalState> _:b3072875_b9851832.
_:b3072875_b9851833 <http://www.w3.org/2000/01/rdf-schema#type> <https://w3id.org/opentrafficlights#SignalState>;
    <https://w3id.org/opentrafficlights#signalPhase> <https://w3id.org/opentrafficlights/thesauri/signalphase/6>;
    <https://w3id.org/opentrafficlights#minEndTime> "2019-02-14T08:35:55.419Z"^^<http://www.w3.org/2001/XMLSchema#date>;
    <https://w3id.org/opentrafficlights#maxEndTime> "2019-02-14T08:36:13.419Z"^^<http://www.w3.org/2001/XMLSchema#date>.
<https://opentrafficlights.org/id/signalgroup/K648/11> <https://w3id.org/opentrafficlights#signalState> _:b3072875_b9851833
}
<https://opentrafficlights.org/spat/K648?time=2019-02-14T08:35:38.019Z> <http://www.w3.org/ns/prov#generatedAtTime> "2019-02-14T08:35:38.019Z"^^<http://www.w3.org/2001/XMLSchema#date>.

<#Metadata> {
<https://lodi.ilabt.imec.be/observer/rawdata/latest> <http://www.w3.org/ns/hydra/core#search> <https://lodi.ilabt.imec.be/observer/rawdata/latest#search>.
<https://lodi.ilabt.imec.be/observer/rawdata/latest#search> a <http://www.w3.org/ns/hydra/core#IriTemplate>;
    <http://www.w3.org/ns/hydra/core#template> "https://lodi.ilabt.imec.be/observer/rawdata{?time}";
    <http://www.w3.org/ns/hydra/core#variableRepresentation> <http://www.w3.org/ns/hydra/core#BasicRepresentation>;
    <http://www.w3.org/ns/hydra/core#mapping> <https://lodi.ilabt.imec.be/observer/rawdata/latest#mapping>.
<https://lodi.ilabt.imec.be/observer/rawdata/latest#mapping> a <http://www.w3.org/ns/hydra/core#IriTemplateMapping>;
    <http://www.w3.org/ns/hydra/core#variable> "time";
    <http://www.w3.org/ns/hydra/core#required> "true"^^<http://www.w3.org/2001/XMLSchema#boolean>.
<https://lodi.ilabt.imec.be/observer/rawdata/latest> <http://rdfs.org/ns/void#inDataset> <https://lodi.ilabt.imec.be/observer/rawdata#Dataset>;
    <http://creativecommons.org/ns#license> <https://creativecommons.org/publicdomain/zero/1.0/>;
    <http://www.w3.org/ns/hydra/core#previous> <https://lodi.ilabt.imec.be/observer/rawdata/fragments?time=2019-02-14T08:35:26.618Z>
}
`;