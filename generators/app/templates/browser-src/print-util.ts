import { h } from "./typed-dom";

export class PrinterWidget {
	dom: HTMLElement;

	constructor(){
		let printButton = h.button({}, ["印刷"]);
		printButton.addEventListener("click", event => {
			alert("click");
		});
		let printerName = h.span({}, ["（プリンター未選択）"]);
		let selectPrinter = h.a({}, ["プリンター選択"])
		let managePrinter = h.a({}, ["プリンター管理"])
		this.dom = h.div({}, [
			printButton,
			" ",
			"プリンター：",
			printerName,
			" ",
			selectPrinter,
			" ",
			managePrinter
		]);
	}
}