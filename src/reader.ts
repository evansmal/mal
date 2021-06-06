import { DataType, Atom, Symbol, Number, True, False, Nil, List } from "./types.js";

interface Reader {
    peek: () => Token;
    next: () => Token;
    getTokens: () => Token[];
    getPos: () => number;
}

function createReader(tokens: Token[]): Reader {
    let pos: number = 0;
    function peek() { return tokens[pos]; }
    function next() { return tokens[pos++]; }
    function getTokens() { return tokens; }
    function getPos() { return pos; }
    return { peek, next, getTokens, getPos };
}

type Token = string;

function tokenize(input: string): Token[] {
    const regex = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;
    const tokens: Token[] = [];
    while (true) {
        const matches = regex.exec(input);
        if (matches === null) break;

        const match = matches[1];
        if (match === "") break; // regex matches empty
        if (match === ";") break; // ignore comments

        tokens.push(match);
    }
    return tokens;
}

function readList(reader: Reader): List {
    reader.next(); // Drop '('
    const values: DataType[] = [];
    while (reader.peek() != ")") {
        values.push(readForm(reader));
    }
    reader.next(); // Drop ')'
    return { kind: "List", values };
}

function isNumber(value: string) {
    return !isNaN(parseFloat(value))
}

function isBoolean(value: string) {
    return (value === "true" || value === "false");
}

function isNil(value: string) {
    return (value === "nil");
}

function readAtom(reader: Reader): Atom {
    const token = reader.next();
    if (isNumber(token)) return { kind: "Number", value: parseFloat(token) }
    else if (isBoolean(token)) return (token === "true" ? True() : False());
    else if (isNil(token)) return Nil();
    else return { kind: "Symbol", value: token };
}

function readForm(reader: Reader): DataType {
    const tok = reader.peek();
    switch (tok) {
        case "(": {
            return readList(reader);
        }
        default: {
            return readAtom(reader);
        }
    }
}

export function readString(input: string): DataType {
    const reader = createReader(tokenize(input));
    return readForm(reader);
}
