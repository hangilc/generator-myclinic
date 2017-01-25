import { Compiler, drawerToSvg } from "myclinic-drawer";
import * as service from "./service";

let data = window["data"];

let comp = new Compiler();
comp.moveTo(data.x, data.y);
comp.lineTo(100, 200);
let ops = comp.getOps();
let previewArea = document.getElementById("preview-wrapper");
let previewSvg = drawerToSvg(ops, {
	width: "210mm",
	height: "297mm",
	viewBox: "0 0 210 297"
});
if( previewArea !== null ){
	previewArea.appendChild(previewSvg);
}
let printButton = document.getElementById("print-button");
if( printButton !== null ){
	printButton.addEventListener("click", event => {
		service.print([ops]);
	})
}