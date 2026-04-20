import { IMethodNotAllowed, sendBadRequest, successResponse } from "./common_interface";
import { httpCodes } from "./httpCodes";

export class CommonHelper {

    capitalizeFirstLetter(obj: { [key: string]: any }): object {
        obj.status.message = obj.status.message.toLowerCase();
        obj.status.message = obj.status.message.charAt(0).toUpperCase() + obj.status.message.slice(1);
        return obj;
    }

    methodNotAllowed(res: IMethodNotAllowed, msg: string): void {
        let response_data = {
            dataset: {},
            status: {
                action_status: false,
                message: msg
            }
        };
        res.setHeader('content-type', 'application/json');
        res.status(httpCodes.HTTP_RESPONSE_METHOD_NOT_ALLOWED);
        res.send({ response: response_data });
    }


    successResponse(res: successResponse, dataSet: object, msg: string): void {
        let response_data = {
            data: dataSet,
            status: {
                message: msg,
                action_status: true
            }
        }
        res.status(global.HttpCodes.HTTP_RESPONSE_OK);
        res.send({ response: this.capitalizeFirstLetter(response_data) });

    }


    sendBadRequest(res: sendBadRequest, msg: string) {

        let response_data = {
            data: {},
            status: {
                message: msg,
                action_status: false
            }
        }
        res.status(global.HttpCodes.HTTP_RESPONSE_BAD_REQUEST);
        res.send({ response: this.capitalizeFirstLetter(response_data) });
    }

    notAuthorized(res: sendBadRequest, msg: string) {

        let response_data = {
            status: {
                message: msg,
                action_status: false
            }
        }
        res.status(global.HttpCodes.HTTP_RESPONSE_UNAUTHORIZED);
        res.send({ response: this.capitalizeFirstLetter(response_data) });
    }

   
    successFromService = (msg: string, data: object) => {
        let make_status_obj = {
            status: true,
            status_code: global.HttpCodes.HTTP_RESPONSE_OK,
            data_sets: data,
            message: msg
        };
        return make_status_obj;
    }

    errorFromService = (msg: string) => {
        let responseObj = {
            status: false,
            status_code: global.HttpCodes.HTTP_RESPONSE_BAD_REQUEST,
            message: msg
        }
        return responseObj;
    }

    notFoundResponse = (msg: string) => {
        let responseObj = {
            status: false,
            status_code: global.HttpCodes.HTTP_RESPONSE_NOT_FOUND,
            message: msg
        }
        return responseObj;
    }

    generatdigitOtp = () => {
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        return randomNumber;

    }

}