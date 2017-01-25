import { h } from "./typed-dom";
import { Op } from "myclinic-drawer";
import { print } from "./service";

export class PrinterWidget {
	dom: HTMLElement;
	private pages: Op[][] = [];

	constructor(){
		let printButton = h.button({}, ["印刷"]);
		printButton.addEventListener("click", event => {
			print(this.pages);
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

	setPages(pages: Op[][]){
		this.pages = pages;
	}
}