import { Compiler } from "myclinic-drawer";
import * as service from "./service";

let data = window["data"];

let comp = new Compiler();
comp.moveTo(data.x, data.y);
comp.lineTo(100, 200);
let ops = comp.getOps();
service.print([ops]);
