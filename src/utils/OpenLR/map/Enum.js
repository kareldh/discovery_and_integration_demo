export let fowEnum = Object.freeze({
    "UNDEFINED": 0, // The physical road type is unknown.
    "MOTORWAY": 1, // A Motorway is defined as a road permitted for motorized vehicles only in combination with a prescribed minimum speed.
    "MULTIPLE_CARRIAGEWAY": 2, // A multiple carriageway is defined as a road with physically separated carriageways regardless of the number of lanes.
    "SINGLE_CARRIAGEWAY": 3, // All roads without separate carriageways are considered as roads with a single carriageway.
    "ROUNDABOUT": 4, // A Roundabout is a road which forms a ring on which traffic travelling in only one direction is allowed.
    "TRAFFICSQUARE": 5, // A Traffic Square is an open area (partly) enclosed by roads which is used for non-traffic purposes and which is not a Roundabout.
    "SLIPROAD": 6, // A Slip Road is a road especially designed to enter or leave a line.
    "OTHER": 7 // The physical road type is known but does not fit into one of the other categories.
});

export let frcEnum = Object.freeze({
    "FRC_0": 0, // Main road.
    "FRC_1": 1, // First class road.
    "FRC_2": 2, // Second class road.
    "FRC_3": 3, // Third class road.
    "FRC_4": 4, // Forth class road.
    "FRC_5": 5, // Fifth class road.
    "FRC_6": 6, // Sixth class road.
    "FRC_7": 7 // Other class road.
});

export let locationTypeEnum = Object.freeze({
    "UNKNOWN": 0,
    "LINE_LOCATION": 1,
    "GEO_COORDINATES": 2,
    "POINT_ALONG_LINE": 3,
    "POI_WITH_ACCESS_POINT": 4,
    "CIRCLE": 5,
    "POLYGON": 6,
    "CLOSED_LINE": 7,
    "RECTANGLE": 8,
    "GRID": 9
});