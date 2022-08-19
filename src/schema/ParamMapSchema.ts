import {
    Constraint,
    Number as RTNumber,
    String as RTString,
    Boolean as RTBoolean,
    Array as RTArray,

} from "runtypes";

type TParamFieldType = Constraint<any, any, any> |
    RTNumber |
    RTString |
    RTBoolean |
    RTArray<RTNumber | RTString, false> ;


type TParamMapType = {
    [key: string]: TParamFieldType
};

type TParamMapField = number | string | boolean | number[] | string[];
type TParamObject = {
    [key: string]: TParamMapField
};

export {
    TParamFieldType,
    TParamMapType,
    TParamMapField,
    TParamObject
}