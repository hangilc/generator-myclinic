import { h, appendToElement } from "./typed-dom";
import { Op } from "myclinic-drawer";
import { print, listPrinterSettings } from "./service";

export class PrinterWidget {
	dom: HTMLElement;
	private pages: Op[][] = [];
	private settingName: (string|null) = null;
	private selectWorkarea: HTMLElement;

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
			if( this.selectWorkarea.innerHTML === "" ){
				let settings = await listPrinterSettings();
				this.fillSelectWorkarea(settings);
			} else {
				this.selectWorkarea.innerHTML = "";
			}
		});
		this.selectWorkarea = h.div({}, []);
		this.dom = h.div({}, [
			printButton,
			" ",
			"プリンター：",
			printerName,
			" ",
			selectPrinter,
			" ",
			h.a({href: "/printer", target:"printer"}, ["プリンター管理"]),
			this.selectWorkarea
		]);
	}

	setPages(pages: Op[][]){
		this.pages = pages;
	}

	private fillSelectWorkarea(settings: string[]): void{
		let dom = this.selectWorkarea;
		let current = this.settingName;
		let form = h.form({}, []);
		settings.forEach(setting => {
			let opt = h.input({type: "radio", name: "printer-setting"}, []);
			opt.checked = setting === current;
			appendToElement(form, [opt, setting, " "]);
		});
		dom.appendChild(form);
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

