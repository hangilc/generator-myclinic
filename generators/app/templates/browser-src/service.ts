import { request, arrayConverter, convertToString } from "./request";
//<% if( usePrinter ) { %>
import { Op } from "myclinic-drawer";
//<% } %>

export function print(pages: Op[][], setting?: string): Promise<string> {
	return request<string>("/printer/print", { pages: pages, setting: setting }, "POST", convertToString);
}

export function listPrinterSettings(): Promise<string[]> {
	return request("/printer/setting", {}, "GET", arrayConverter(convertToString));
}