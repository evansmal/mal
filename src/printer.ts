import { DataType } from "./types.js";

export function printString(node: DataType): string {
    if (node.kind === "List") {
        return `(${node.values.map(printString).join(" ")})`;
    } else if (node.kind === "Number") {
        return node.value.toString();
    } else if (node.kind === "Symbol") {
        return node.value;
    } else if (node.kind === "Function") {
        return `#<function>`;
    } else if (node.kind === "True") {
        return `true`;
    } else if (node.kind === "False") {
        return `false`;
    } else if (node.kind === "Nil") {
        return `nil`;
    } else {
        throw new Error("Encountered unexcepted node type: " + JSON.stringify(node, null, 4));
    }
}

