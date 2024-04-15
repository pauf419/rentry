
module.exports = class MarkdownDto {
    id
    data 
    timestamp
    owner
    visitors
    
    constructor(model) {
        this.id = model.id 
        this.data = model.data
        this.timestamp = model.timestamp 
        this.owner = model.owner
        this.visitors = model.visitors
    }
}