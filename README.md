# Mal
##### A [Mal](https://github.com/kanaka/mal) interpreter written in TypeScript. 

Mal is a Clojure inspired Lisp interpreter. Currently, this repository contains a REPL that implements most features of the Mal language. 

## Getting Started

Start by cloning the repository and installing the dependencies:

```sh
git clone https://github.com/evansmal/mal.git
cd mal && yarn install
```

Next, build the project:

```sh
yarn build
```

Run the REPL:

```sh
yarn repl
$ user> 
```

Try out a few examples:

```
$ user> (prn (+ 2 (* 6 5)))
32

$ user> (prn ((fn* (a) (+ a 1)) 10))
11
```
