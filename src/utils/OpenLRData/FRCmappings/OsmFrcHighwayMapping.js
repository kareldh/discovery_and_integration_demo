//based on https://wiki.openstreetmap.org/wiki/Key:highway
import {frcEnum} from "../../OpenLR/map/Enum";

export let OsmFrcHighwayMapping = {
    "motorway": frcEnum.FRC_0,
    "trunk": frcEnum.FRC_1,
    "primary": frcEnum.FRC_2,
    "secondary": frcEnum.FRC_3,
    "tertiary": frcEnum.FRC_4,
    "unclassified": frcEnum.FRC_5,
    "residential": frcEnum.FRC_6
};