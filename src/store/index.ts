import { makeAutoObservable } from "mobx";
import MarkdownService from "../service/MarkdownService";
import IMarkdown from "../interface/IMarkdown";

export default class Store {

    text: string = ""
    markdown: IMarkdown = {} as IMarkdown
    loading: boolean = false

    setText(text: string) {
        this.text = text
    }

    setLoading(state:boolean) {
        this.loading = state
    }

    setMarkdown(markdown:IMarkdown) {
        this.markdown = markdown
    }

    async setup(id:string) {
        this.setLoading(true)
        try {
            const {data} = await MarkdownService.getMarkdown(id)
            let markdown:IMarkdown = data.data as any
            this.setText(markdown.data)
            const edit_code = localStorage.getItem("edit_code")
            if(edit_code) markdown.edit_code = edit_code
            this.setMarkdown(markdown as any)
            this.setLoading(false)
            return null
        } catch(e:any) {
            console.log(e.response)
            this.setLoading(false)
            return e.response
        }
    }

    async delete(edit_code:string) {
        try {
            const {data} = await MarkdownService.delete(this.markdown.id, edit_code)
            return null
        } catch(e:any) {
            console.log(e.response)
            return e.response
        }
    }

    async getVisitorsCount(edit_code:string) {
        try {
            const {data} = await MarkdownService.getVisitorsCount(this.markdown.id, edit_code)
            return data
        } catch(e) {
            console.error(e)
            return e as any;
        }
    }

    async cron(access_code:string, min:number) {
        try {
            const {data} = await MarkdownService.cron(access_code, min)
            return data  
        } catch(e) {
            console.error(e) 
            return e as any
        }
    }

    async getCron(access_code:string) {
        try {
            const {data} = await MarkdownService.getCron(access_code)
            return data
        } catch(e) {
            console.error(e) 
            return e as any
        }
    }

    async getVisitors(edit_code:string, extended:any = null, offset:number=0, limit:number=50): Promise<any> {
        try {
            const {data} = await MarkdownService.getVisitors(this.markdown.id, edit_code, extended, offset, limit)
            return data
        } catch(e) {
            console.error(e)
            return e as any;
        }
    }

    async editMarkdown(edit_code:string, new_edit_code:string): Promise<IMarkdown> {
        try {
            const {data} = await MarkdownService.editMarkdown(this.markdown.id,edit_code, this.text, new_edit_code)
            return data.data as any
        } catch(e) {
            console.error(e)
            return e as any
        } finally {
        }
    }

    async uploadMarkdown(custom_edit_code:string): Promise<IMarkdown> {
        this.setLoading(true)
        try {
            const {data} = await MarkdownService.uploadMarkdown(this.text, custom_edit_code)
            return data.data as any
        } catch(e) {
            console.error(e)
            return e as any
        } finally {
            this.setLoading(false)
        }
    }

    constructor() {
        makeAutoObservable(this)
    }
}