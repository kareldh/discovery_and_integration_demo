import {fowEnum} from "../../OpenLR/map/Enum";

//based on https://wiki.openstreetmap.org/wiki/Key:highway
//and https://wiki.openstreetmap.org/wiki/NL:The_Netherlands_roads_tagging
export let OsmFowHighwayMapping = {
    "motorway": fowEnum.MULTIPLE_CARRIAGEWAY,
    "trunk": fowEnum.MOTORWAY,
    "primary": fowEnum.SINGLE_CARRIAGEWAY,
    "secondary": fowEnum.SINGLE_CARRIAGEWAY,
    "tertiary": fowEnum.SINGLE_CARRIAGEWAY,
    "unclassified": fowEnum.SINGLE_CARRIAGEWAY,
    "residential": fowEnum.SINGLE_CARRIAGEWAY,

    "motorway_link": fowEnum.SLIPROAD,
    "trunk_link": fowEnum.SLIPROAD,
    "primary_link": fowEnum.SLIPROAD,
    "secondary_link": fowEnum.SLIPROAD,
    "tertiary_link": fowEnum.SLIPROAD,

    "living_street": fowEnum.OTHER,
    "service": fowEnum.OTHER,
    "pedestrian": fowEnum.OTHER,
    "track": fowEnum.OTHER,
    "bus_guideway": fowEnum.OTHER,
    "excape": fowEnum.OTHER,
    "road": fowEnum.OTHER,

    "footway": fowEnum.OTHER,
    "bridleway": fowEnum.OTHER,
    "steps": fowEnum.OTHER,
    "path": fowEnum.OTHER,

    "cycleway": fowEnum.OTHER,

    "proposed": fowEnum.OTHER,

    "construction": fowEnum.OTHER,

    "bus_stop": fowEnum.OTHER,
    "crossing": fowEnum.OTHER,
    "elevator": fowEnum.OTHER,
    "emergency_access_point": fowEnum.OTHER,
    "give_way": fowEnum.OTHER,
    "mini_roundabout": fowEnum.ROUNDABOUT,
    "motorway_junction": fowEnum.SINGLE_CARRIAGEWAY,
    "passing_place": fowEnum.OTHER,
    "rest_area": fowEnum.OTHER,
    "speed_camera": fowEnum.OTHER,
    "street_lamp": fowEnum.OTHER,
    "services": fowEnum.OTHER,
    "stop": fowEnum.OTHER,
    "traffic_signals": fowEnum.OTHER,
    "turning_circle": fowEnum.OTHER
};