import * as readline from "readline";

import { ns } from "./core.js"
import { readString } from "./reader.js";
import { printString } from "./printer.js";
import { DataType, Function, List, Nil, toSymbols } from "./types.js";
import { Environment } from "./env.js"


function read(input: string): DataType {
    return readString(input);
}

function evaluateAST(input: DataType, env: Environment): DataType {
    switch (input.kind) {
        case "List": {
            const values = input.values.map((node) => evaluate(node, env));
            return { kind: "List", values };
        }
        case "Symbol": {
            const lookup = env.getValue(input.value)
            if (lookup) return lookup;
            else throw new Error(`Unexpected symbol: ${input.value}`);
        }
        default: { return input; }

    }
}

function evaluateDefinition(ast: List, env: Environment): DataType {
    const [_, key, value] = ast.values;
    if (key.kind !== "Symbol") throw new Error("def! key is excepted to be symbol");
    return env.setValue(key.value, value);
}

function evaluateLet(ast: List, env: Environment): DataType {
    const new_environment = Environment([], [], env);
    const pairs = ast.values[1];
    if (pairs.kind !== "List") throw new Error("invalid bind");

    for (let i = 0; i < pairs.values.length; i += 2) {
        const key = pairs.values[i];
        const value = pairs.values[i + 1];
        if (key.kind !== "Symbol") {
            throw new Error(`unexpected token type: ${key}, expected: symbol`);
        }
        new_environment.setValue(key.value, evaluateAST(value, new_environment));
    }
    return evaluateAST(ast.values[2], new_environment);
}

function evaluateDo(ast: List, env: Environment): DataType {
    const values = ast.values.slice(1, -1);
    return values.map(value => evaluateAST(value, env))[values.length - 1];
}

function evaluateIf(ast: List, env: Environment): DataType {
    const condition = evaluateAST(ast.values[1], env);
    if (condition.kind === "True") return evaluateAST(ast.values[2], env);
    else if (condition.kind === "False") {
        return (ast.values.length >= 3 ? evaluateAST(ast.values[3], env) : Nil());
    }
    else throw new Error(`if condition evaluated to non-boolean value`);
}

function evaluateFn(ast: List, env: Environment): Function {
    const [, args, binds] = ast.values;
    if (args.kind !== "List") throw new Error(`Expected argument list for function def`);
    const symbols = toSymbols(args);
    return Function((...args: DataType[]) => {
        const new_environment = Environment(symbols, args, env);
        return evaluate(binds, new_environment);
    });
}

function evaluate(input: DataType, env: Environment): DataType {
    const ast = input;
    if (ast.kind !== "List") { return evaluateAST(input, env); }
    if (ast.values.length === 0) return input;
    if (ast.values.length === 1 && ast.values[0].kind === "Number") return ast.values[0];
    else {
        const node = ast.values[0];
        if (node.kind === "Symbol") {
            switch (node.value) {
                case "def!": { return evaluateDefinition(ast, env); }
                case "let*": { return evaluateLet(ast, env); }
                case "do": { return evaluateDo(ast, env); }
                case "if": { return evaluateIf(ast, env); }
                case "fn*": { return evaluateFn(ast, env); }
            }
        }
    }

    const result = evaluateAST(ast, env);
    if (result.kind !== "List") throw new Error(`Expected list, got ${result.kind}`);

    const [func, ...args] = result.values;
    if (func.kind !== "Function") throw new Error(`Expected function, got ${func.kind}`);
    return func.apply(...args);
}

function print(input: DataType): string {
    return printString(input);
}

function rep(input: string, environment: Environment): string {
    const line = print(evaluate(read(input), environment));
    return line;
}

function getInput(rl: readline.ReadLine): Promise<string> {
    return new Promise<string>((resolve) => {
        rl.question("user> ", resolve);
    });
}

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const default_env = Environment([], []);
    default_env.addSymbols(ns);
    while (true) { const input = await getInput(rl); rep(input, default_env); }
}

main();
