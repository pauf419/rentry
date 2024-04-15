import IVisitor from "./IVisitor"

export default interface IMarkdown {
    id:string 
    edit_code:string 
    data:string 
    timestamp:number
    owner:string
    visitors:number
}