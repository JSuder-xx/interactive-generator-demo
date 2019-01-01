# Interactive Generator Demonstration
## Overview
This is a personal thought experiment to fully exercise understanding of various facets of (Java/Type)Script generators
* two-way communication
* effect on coding style when treating the generator as a program communicating with a host environment.
  * The poster-child use-case for generators is treating the generator function as a _synchronous_ sub-program which yields Promises to the host environment such that the host environment resumes execution of the synchronous generator-program once the promise resolves to a value. This is an alternate solution to the use of async/await for abstracting away callback mechanics with asynchronous workflows.
  * I decided to instead abstract away I/O and waiting for user feedback as a means to have some fun with toy graphics examples.

The project consists of 
* a Generator IO API designed to execute generators-as-programs where the program effects the world (output) by yielding Command object instances and receives Input instances from the world (host environment).
* a number of programs written in this style
  * Amb 
    * Pattern: Generator-as-program delegating to generator-as-lazy-stream. 
    * Description: Realization of a form of the Amb example from Structure and Interpretation of Computer programs but using lazily evaluated streams with filtering rather than a non-deterministic operator/evaluator.
  * Gravity Tiles 
    * Pattern: Generator-as-program with an animation loop i.e. execution every N milliseconds rather than in response to input.
    * Description: Poor man's partice physics where particles gravitate towards the mouse cursor location.
  * Line Drawer
    * Pattern: Generator-as-program responding to mouse event feedback.
    * Description: Silly little line drawing application with button and canvas clicks.
  * LOGO
    * Pattern: Generator-as-program responding to keyboard input to produce interesting visual output.
    * Description: This is just me having fun over a weekend with a toy lexer/recursive descent parser/interpreter implementation for an interesting subset LOGO. 

## Usage
* Clone repository
* Install dependencies from the command line
```
npm install
```
* Start a dev server from the command line
```
npm start
```
* Navigate to localhost:3000 in your browser.