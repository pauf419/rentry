
import $api from "../http";
import {Axios, AxiosResponse} from 'axios';
import IMarkdown from "../interface/IMarkdown";
import IVisitor from "../interface/IVisitor";
import IVisitorsCount from "../interface/IVisitorsCount";
import ICron from "../interface/ICron";

export default class MarkdownService {
    static uploadMarkdown(data:string, custom_edit_code:string): Promise<AxiosResponse<IMarkdown>> {
        return $api.post<IMarkdown>('/markdown', {data, custom_edit_code})
    }

    static getMarkdown(id:string): Promise<AxiosResponse<IMarkdown>> {
        return $api.get<IMarkdown>("/markdown", {
            params: {
                id
            }
        })
    }

    static editMarkdown(id:string, edit_code:string, data:string, new_edit_code:string): Promise<AxiosResponse<IMarkdown>> {
        return $api.post<IMarkdown>("/markdown/edit", {
            id,  
            data,
            edit_code,
            new_edit_code
        })
    }

    static getVisitors(id:string, edit_code:string, extended:any = null, offset:number = 0, limit:number=1000): Promise<AxiosResponse<IVisitor[]>> {
        return $api.get<IVisitor[]>("/markdown/visitors", {
            params: {
                id, 
                edit_code,
                extended,
                offset: offset ? offset : 0, 
                limit: limit ? limit : 1000
            }
        })
    }

    static getVisitorsCount(id:string, edit_code:string): Promise<AxiosResponse<IVisitorsCount>>{
        return $api.get<IVisitorsCount>("/markdown/visitors/count", {
            params: {
                id, 
                edit_code
            }
        })
    }

    static delete(id:string, edit_code:string): Promise<AxiosResponse<IMarkdown>> {
        return $api.post<IMarkdown>("/markdown/delete", {id, edit_code})
    }

    static cron(access_code:string, min:number): Promise<AxiosResponse<ICron>> {
        return $api.post<ICron>("/markdown/cron?access_code="+access_code, {
            min,
        })
    }

    static getCron(access_code:string): Promise<AxiosResponse<ICron>> {
        return $api.get<ICron>("/markdown/cron", {
            params: {
                access_code
            }
        })
    }
}