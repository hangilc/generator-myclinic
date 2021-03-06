import { h, appendToElement } from "./typed-dom";
import { Op } from "myclinic-drawer";
import { print, listPrinterSettings } from "./service";

class Nav {
	dom: HTMLElement;
	onPageChange: (number) => void = _ => {};

	constructor(){
		this.dom = h.span({}, []);
	}

	update(currentPage: number, totalPages: number){
		this.dom.innerHTML = "";
		let prevLink = h.a({}, ["<"]);
		let nextLink = h.a({}, [">"]);
		prevLink.addEventListener("click", event => {
			if( currentPage > 1 ){
				this.onPageChange(currentPage - 1);
			}
		});
		nextLink.addEventListener("click", event => {
			if( currentPage < totalPages ){
				this.onPageChange(currentPage + 1);
			}
		});
		if( totalPages > 1 ){
			appendToElement(this.dom, [
				prevLink,
				" ",
				`${currentPage} / ${totalPages}`,
				" ",
				nextLink
			]);
		}
	}
}

export class PrinterWidget {
	dom: HTMLElement;
	onPageChange: (number) => void = _ => {};
	private pages: Op[][] = [];
	private settingKey: string|null = null;
	private settingName: string|null = null;
	private nav: Nav;
	private settingNameSpan: HTMLElement;
	private selectWorkarea: HTMLElement;

	constructor(settingKey?: string){
		this.nav = new Nav();
		this.nav.onPageChange = newPage => {
			let pageIndex = newPage - 1;
			this.onPageChange(pageIndex);
		};
		if( settingKey !== undefined ){
			this.settingKey = settingKey;
			this.settingName = getPrinterSetting(settingKey);
		}
		let printButton = h.button({}, ["印刷"]);
		printButton.addEventListener("click", event => {
			if( this.settingName === null ){
				print(this.pages);
			} else {
				print(this.pages, this.settingName);
			}
		});
		this.settingNameSpan = h.span({}, [this.settingName || "（プリンター未選択）"]);
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
			this.nav.dom,
			" ",
			"プリンター：",
			this.settingNameSpan,
			" ",
			selectPrinter,
			" ",
			h.a({href: "/printer", target:"printer"}, ["プリンター管理"]),
			this.selectWorkarea
		]);
	}

	setPages(pages: Op[][]): void{
		this.nav.update(1, pages.length);
		this.pages = pages;
	}

	updateNavPage(page: number): void {
		this.nav.update(page, this.pages.length);
	}

	private fillSelectWorkarea(settings: string[]): void{
		let dom = this.selectWorkarea;
		let current = this.settingName;
		let form = h.form({}, []);
		{
			let opt = h.input({type: "radio", name: "printer-setting"}, []);
			opt.checked = !current;
			opt.addEventListener("change", event => {
				this.updateSetting(null);
				dom.innerHTML = "";
			})
			appendToElement(form, [opt, "(プリンター未選択)", " "]);
		}
		settings.forEach(setting => {
			let opt = h.input({type: "radio", name: "printer-setting"}, []);
			opt.checked = setting === current;
			opt.addEventListener("change", event => {
				this.updateSetting(setting);
				dom.innerHTML = "";
			})
			appendToElement(form, [opt, setting, " "]);
		});
		let cancel = h.button({}, ["キャンセル"]);
		cancel.addEventListener("click", event => {
			dom.innerHTML = "";
		})
		form.appendChild(cancel);
		dom.appendChild(form);
	}

	private updateSetting(setting: string | null){
		this.settingName = setting;
		if( this.settingKey !== undefined ){
			if( setting === null ){
				removePrinterSetting(this.settingKey);
			} else {
				setPrinterSetting(this.settingKey, setting);
			}
		}
		this.settingNameSpan.innerHTML = "";
		appendToElement(this.settingNameSpan, [setting || "（プリンター未選択）"])
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

