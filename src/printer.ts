import { DataType } from "./types.js";

export function printString(node: DataType): string {
    switch (node.kind) {
        case "List": return `(${node.values.map(printString).join(" ")})`;
        case "Number": return node.value.toString();
        case "Symbol": return node.value;
        case "Function": return `#<function>`;
        case "True": return `true`;
        case "False": return `false`;
        case "Nil": return `nul`;
        case "String": throw new Error("Unimplemented");
        default: {
            const _: never = node;
            return `unk_${_}`;
        }
    }
}

