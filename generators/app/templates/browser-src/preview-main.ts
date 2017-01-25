import { Compiler, drawerToSvg } from "myclinic-drawer";
import * as service from "./service";
import { PrinterWidget, getPrinterSetting } from "./print-util";

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
let printerSettingKey = "<%= subapp %>-printer-setting";
let printerWidget = document.getElementById("printer-widget");
if( printerWidget !== null ){
	let widget = new PrinterWidget(getPrinterSetting(printerSettingKey));
	widget.setPages([ops]);
	printerWidget.appendChild(widget.dom);
}