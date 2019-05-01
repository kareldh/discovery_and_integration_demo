import {fowEnum} from "../../OpenLR/map/Enum";

//based on https://www.agiv.be/~/media/agiv/producten/mrb/documenten/wegenregister_objectcataloog.pdf
//or https://download.vlaanderen.be/Producten/GetDocument?id=280&title=Data_Wegenregister_v2_0_pdf&x=Data_Wegenregister_v2_0_pdf
export let WegenregisterAntwerpenFowMorfMapping = {
    "autosnelweg": fowEnum.MOTORWAY,
    "weg met gescheiden rijbanen die geen autosnelweg is": fowEnum.MOTORWAY,
    "weg bestaande uit één rijbaan": fowEnum.SINGLE_CARRIAGEWAY,
    "rotonde": fowEnum.ROUNDABOUT,
    "speciale verkeerssituatie": fowEnum.OTHER,
    "verkeersplein": fowEnum.TRAFFICSQUARE,
    "op- of afrit, behorende tot een nietgelijkgrondse verbinding": fowEnum.SLIPROAD,
    "op- of afrit, behorende tot een gelijkgrondse verbinding": fowEnum.SLIPROAD,
    "parallelweg": fowEnum.SLIPROAD,
    "ventweg": fowEnum.SINGLE_CARRIAGEWAY,
    "in- of uitrit van een parking": fowEnum.SLIPROAD,
    "in- of uitrit van een dienst": fowEnum.SLIPROAD,
    "voetgangerszone": fowEnum.OTHER,
    "wandel- of fietsweg, niet toegankelijk voor andere voertuigen": fowEnum.OTHER,
    "tramweg, niet toegankelijk voor andere voertuigen": fowEnum.OTHER,
    "dienstweg": fowEnum.OTHER,
    "aardeweg": fowEnum.OTHER,
    "veer": fowEnum.OTHER,
    "niet gekend": fowEnum.UNDEFINED
};
