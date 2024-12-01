import { HttpResponseBase } from "@angular/common/http";

export interface IServerResponse extends HttpResponseBase {
    success: boolean;
    message: string;
    data: any;
}