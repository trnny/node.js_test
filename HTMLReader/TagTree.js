const Stack = require('./Stack');
const Tag = require('./Tag');

module.exports = function(){
    var tags = {};
    this.add = function(tag){
        if(!tags[tag.tag])
            tags[tag.tag] = new Stack();
        tags[tag.tag].push(tag);
    }
    this.remove = function(tag){
        return tags[tag.tag].pop();
    }
    this.last = function(tag){
        return tags[tag.tag].peek();
    }
    this.empty = function(){
        for(var t in tags){
            if(!tags[t].isAmpty())
                return false;
        }
        return true;
    }
}