import * as $ from "jquery";

export interface Converter<T>{
	(src:any): T
}

export function arrayConverter<T>(c: Converter<T>): Converter<T[]> {
	return function(src: any[]): T[] {
		return src.map(c);
	}
}

export function convertToNumber(src: any): number {
	return +src;
}

export function convertToString(src: any): string {
	return "" + src;
}

export function request<T>(url: string, data: Object, method: string, cvtor: Converter<T>){
    return new Promise(function (resolve, reject) {
        let opt = {
            url: url,
            type: method,
            data: data,
            dataType: "json",
            timeout: 15000,
            success: function (result) {
                try {
                    let obj = cvtor(result);
                    resolve(obj);
                }
                catch (ex) {
                    reject(ex);
                }
            },
            error: function (xhr, status, ex) {
                reject(JSON.stringify({ xhr: xhr, status: status, exception: ex }));
            }
        };
        if( method === "POST" ){
            if( typeof data !== "string" ){
                opt.data = JSON.stringify(data);
            } else {
                opt.data = data;
            }
            opt.contentType = "application/json; charset=utf-8";
        } else {
            opt.data = data;
        }
        $.ajax(opt);
    });
}
