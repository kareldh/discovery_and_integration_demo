import {frcEnum} from "../../OpenLR/map/Enum";

//based on https://www.agiv.be/~/media/agiv/producten/mrb/documenten/wegenregister_objectcataloog.pdf
//or https://download.vlaanderen.be/Producten/GetDocument?id=280&title=Data_Wegenregister_v2_0_pdf&x=Data_Wegenregister_v2_0_pdf
export let WegenregisterAntwerpenFrcWegcatMapping = {
    "hoofdweg": frcEnum.FRC_0,
    "primaire weg I": frcEnum.FRC_1,
    "primaire weg II": frcEnum.FRC_2,
    "primaire weg II type 1": frcEnum.FRC_2,
    "primaire weg II type 2": frcEnum.FRC_3,
    "primaire weg II type 3": frcEnum.FRC_3,
    "primaire weg II type 4": frcEnum.FRC_0,
    "secundaire weg": frcEnum.FRC_4,
    "secundaire weg type 1": frcEnum.FRC_4,
    "secundaire weg type 2": frcEnum.FRC_5,
    "secundaire weg type 3": frcEnum.FRC_5,
    "secundaire weg type 4": frcEnum.FRC_5,
    "lokale weg": frcEnum.FRC_6,
    "lokale weg type 1": frcEnum.FRC_6,
    "lokale weg type 2": frcEnum.FRC_6,
    "lokale weg type 3": frcEnum.FRC_6,
    "niet gekend": frcEnum.FRC_7,
    "niet van toepassing": frcEnum.FRC_7
};