import { SymbolTable } from "./env.js";
import { List, True, False, Nil, String, Number, DataType, Applicable, Function } from "./types.js";
import { printString } from "./printer.js";
import { readString } from "./reader.js";

import { readFileSync } from "fs";

function createBinaryOperand(expr: (a: Number, b: Number) => Number): Applicable {
    return (a: DataType, b: DataType) => {
        if (a.kind === "Number" && b.kind === "Number") {
            return expr(a, b);
        } else {
            throw new Error("Cannot add two non-numbers");
        }
    }
}

const add = createBinaryOperand((a, b) => { return Number(a.value + b.value) });
const subtract = createBinaryOperand((a, b) => { return Number(a.value - b.value) });
const multiply = createBinaryOperand((a, b) => { return Number(a.value * b.value) });
const divide = createBinaryOperand((a, b) => { return Number(a.value / b.value) });

const print: Applicable = (...args) => {
    console.log(printString(args[0]));
    return Nil();
};

const list: Applicable = (...args) => {
    return { kind: "List", values: args };
};

const is_list: Applicable = (...args) => {
    return (args[0].kind === "List" ? True() : False())
};

const is_empty: Applicable = (...args) => {
    if (args[0].kind !== "List") throw new Error("cannot check if non-list entity is empty");
    return (args[0].values.length === 0 ? True() : False())
};

const count: Applicable = (...args) => {
    if (args[0].kind !== "List") throw new Error("cannot count items in non-list entity");
    return Number(args[0].values.length);
};

function isEqual(first: List, second: List): (True | False) {
    if (first.values.length !== second.values.length) return False();
    const equality = first.values.filter((v, i) => {
        if (v.kind === second.values[i].kind) return false;
        else return true;
    });
    return (equality.length > 0 ? True() : False())
}

const compare: Applicable = (...args) => {
    const first = args[0];
    const second = args[1];
    if (first.kind === "List" && second.kind === "List") {
        return isEqual(first, second)
    } else {
        return (first.kind === second.kind ? True() : False());
    }
};

function createComparator(func: (a: number, b: number) => boolean): Applicable {
    return (...args) => {
        const [a, b] = args;
        if (a.kind !== "Number" || b.kind !== "Number") throw new Error("Cannot compare non-numeric values");
        return (func(a.value, b.value) ? True() : False());
    }
}

const lt = createComparator((a, b) => { return (a < b); });
const lte = createComparator((a, b) => { return (a <= b); });
const gt = createComparator((a, b) => { return (a > b); });
const gte = createComparator((a, b) => { return (a >= b); });

const read_str = (...args: DataType[]) => {
    if (args.length !== 0 || args[0].kind !== "String") throw new Error("Cannot read_str with non-string values");
    return readString(args[0].value);
}

const slurp = (...args: DataType[]) => {
    if (args.length !== 0 || args[0].kind !== "String") throw new Error("Cannot slurp with non-string values");
    return String(readFileSync(args[0].value).toString());
}

export const ns: SymbolTable = {
    "+": Function(add),
    "-": Function(subtract),
    "*": Function(multiply),
    "/": Function(divide),
    "prn": Function(print),
    "list": Function(list),
    "list?": Function(is_list),
    "empty?": Function(is_empty),
    "count": Function(count),
    "=": Function(compare),
    "<": Function(lt),
    "<=": Function(lte),
    ">": Function(gt),
    ">=": Function(gte),
    "read-string": Function(read_str),
    "slurp": Function(slurp)
}
