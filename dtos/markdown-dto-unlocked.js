
module.exports = class MarkdownDtoUnlocked {
    id
    data 
    timestamp
    owner
    visitors
    edit_code
    
    constructor(model) {
        this.id = model.id 
        this.data = model.data
        this.timestamp = model.timestamp 
        this.owner = model.owner
        this.visitors = model.visitors
        this.edit_code = model.edit_code
    }
}