import { h } from "./typed-dom";
import { Op } from "myclinic-drawer";
import { print, listPrinterSettings } from "./service";

export class PrinterWidget {
	dom: HTMLElement;
	private pages: Op[][] = [];
	private settingName: (string|null) = null;

	constructor(settingName: (string|null)){
		this.settingName = settingName;
		let printButton = h.button({}, ["印刷"]);
		printButton.addEventListener("click", event => {
			if( this.settingName === null ){
				print(this.pages);
			} else {
				print(this.pages, this.settingName);
			}
		});
		let printerName = h.span({}, [settingName || "（プリンター未選択）"]);
		let selectPrinter = h.a({}, ["プリンター選択"]);
		selectPrinter.addEventListener("click", async event => {
			let settings = await listPrinterSettings();
			alert(JSON.stringify(settings));
		})
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

export function getPrinterSetting(key: string): string | null{
	return window.localStorage.getItem(key);
}

export function setPrinterSetting(key, name): void{
	window.localStorage.setItem(key, name);
}

export function removePrinterSetting(key): void{
	window.localStorage.removeItem(key);
}

