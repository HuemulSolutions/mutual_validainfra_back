import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {departmentEndPointCreate, departmentEndPointDelete, departmentEndPointDeleteMulti, departmentEndPointGetAll, departmentEndPointGetById, departmentEndPointUpdate} from "../app/department/department-endpoint";
import { isEmpty } from "../common/huemul/huemul-functions";

app.http('departmentCreate', {
    route: 'department/v1/',
    methods: ['POST'],
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        let body: any = {}
        try {
            body = await request.json();
        } catch (error) {
            return {
                status: 400,
                body: `Error parsing body: ${error}`
            }
        }
        return await departmentEndPointCreate(request,null, {body});
    }
});

app.http('departmentUpdate', {
    route: 'department/v1/',
    methods: ['PUT'],
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        let body: any = {}
        try {
            body = await request.json();
        } catch (error) {
            return {
                status: 400,
                body: `Error parsing body: ${error}`
            }
        }
        return await departmentEndPointUpdate(request,null, {body});
    }
});

app.http('departmentDelete', {
    route: 'department/v1/{departmentId}',
    methods: ['DELETE'],
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        let body: any = {}
        try {
            body = await request.text();
            if (!isEmpty(body)) {
                body = JSON.parse(body);
            }
        } catch (error) {
            return {
                status: 400,
                body: `Error parsing body: ${error}`
            }
        }
        return await departmentEndPointDelete(request,null, {body});
    }
});

app.http('departmentDeleteMulti', {
    route: 'department/multi/delete/v1/',
    methods: ['PUT'],
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        let body: any = {}
        try {
            body = await request.json();
        } catch (error) {
            return {
                status: 400,
                body: `Error parsing body: ${error}`
            }
        }
        return await departmentEndPointDeleteMulti(request,null, {body});
    }
});

app.http('departmentGetById', {
    route: 'department/v1/{departmentId}',
    methods: ['GET'],
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        let body: any = {}
        try {
            body = await request.text();
            if (!isEmpty(body)) {
                body = JSON.parse(body);
            }
        } catch (error) {
            return {
                status: 400,
                body: `Error parsing body: ${error}`
            }
        }
        return await departmentEndPointGetById(request,null, {body});
    }
});

app.http('departmentGetAll', {
    route: 'department/v1/',
    methods: ['GET'],
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        let body: any = {}
        try {
            body = await request.text();
            if (!isEmpty(body)) {
                body = JSON.parse(body);
            }
        } catch (error) {
            return {
                status: 400,
                body: `Error parsing body: ${error}`
            }
        }
        return await departmentEndPointGetAll(request,null, {body});
    }
});