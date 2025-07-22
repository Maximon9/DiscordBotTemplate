import { category } from "../../utils/command.js";
import ping from "./ping.js";

const commands = [ping];
const extra = {
    description: `Debug contains ${commands.length} commands to debug with`,
    emoji: "🐞",
};

export default category("Debug", commands, extra);
