import { request, convertToString } from "./request";
import { Op } from "myclinic-drawer";

export function print(pages: Op[][], setting?: string): Promise<string> {
	console.log(pages);
	return request<string>("/printer/print", { pages: pages, setting: setting }, "POST", convertToString);
}