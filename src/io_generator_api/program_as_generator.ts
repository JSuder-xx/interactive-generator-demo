import { Command } from "./command";
import { MouseAndKeyboardEvents } from "./input";

type ProgramAsGenerator = Generator<Command, void, MouseAndKeyboardEvents>

export default ProgramAsGenerator
