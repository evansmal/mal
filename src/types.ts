
export interface List {
    kind: "List";
    values: DataType[];
}

export interface Number {
    kind: "Number";
    value: number;
}

export interface Symbol {
    kind: "Symbol";
    value: string;
}

export interface True {
    kind: "True";
}

export interface False {
    kind: "False";
}

export interface Nil {
    kind: "Nil";
}

export type Atom = Number | Symbol | True | False | Nil;

export function Number(value: number): Number {
    return { kind: "Number", value };
}

export function Symbol(value: string): Symbol {
    return { kind: "Symbol", value };
}

export function toSymbols(value: List): Symbol[] {
    return value.values.map(s => {
        if (s.kind !== "Symbol") throw new Error("Cannot convert list into symbols");
        else return s;
    });
}

export function True(): True {
    return { kind: "True" };
}

export function False(): False {
    return { kind: "False" };
}

export function Nil(): Nil {
    return { kind: "Nil" };
}

export type Applicable = (...args: DataType[]) => DataType;

export interface Function {
    kind: "Function";
    apply: Applicable;
}

export function createFunction(fn: (...args: DataType[]) => DataType): Function {
    return { kind: "Function", apply: fn };
}

export type DataType = List | Atom | Function;
