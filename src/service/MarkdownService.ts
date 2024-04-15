
import $api from "../http";
import {Axios, AxiosResponse} from 'axios';
import IMarkdown from "../interface/IMarkdown";
import IVisitor from "../interface/IVisitor";

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

    static getVisitors(id:string, edit_code:string): Promise<AxiosResponse<IVisitor[]>> {
        return $api.get<IVisitor[]>("/markdown/visitors", {
            params: {
                id, 
                edit_code
            }
        })
    }
}