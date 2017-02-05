import { Compiler, drawerToSvg, Op } from "myclinic-drawer";
import * as service from "./service";
import { PrinterWidget } from "./print-util";

let data = window["data"];

let pages: Op[][] = [];
{
	let comp = new Compiler();
	comp.moveTo(data.x, data.y);
	comp.lineTo(100, 200);
	let ops = comp.getOps();
	pages.push(ops);
}
{
	let comp = new Compiler();
	comp.moveTo(200, 100);
	comp.lineTo(100, 200);
	let ops = comp.getOps();
	pages.push(ops);
}
let previewArea = document.getElementById("preview-wrapper");
renderPreview(pages[0]);
let printerSettingKey = "<%= subapp %>-printer-setting";
let printerWidget = document.getElementById("printer-widget");
if( printerWidget !== null ){
	let widget = new PrinterWidget(printerSettingKey);
	widget.onPageChange = pageIndex => {
		renderPreview(pages[pageIndex]);
		widget.updateNavPage(pageIndex+1);
	};
	widget.setPages(pages);
	printerWidget.appendChild(widget.dom);
}

function renderPreview(page: Op[]): void {
	if( previewArea !== null ){
		previewArea.innerHTML = "";
		let previewSvg = drawerToSvg(page, {
			width: "210mm",
			height: "297mm",
			viewBox: "0 0 210 297"
		});
		previewArea.appendChild(previewSvg);
	}
}
