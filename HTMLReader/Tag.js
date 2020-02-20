module.exports = function(tagName){
    var t = {
        tag: '',
        attrs: {},
        type: 0,
        innerText: '',
        innerHTML: '',
        html: '',
        childTag: [],
        childNode: []
    };
    t.tag = tagName;
    this.tag = function(){
        return t;
    }
    this.set = function(tag){
        for(var i in tag){
            t[i] = tag[i];
        }
        return t;
    }
    this.addChild = function(tag){
        t.childTag.push(tag);
        return this;
    }
    this.addInnerText = function(str){
        t.innerText += str;
        return this;
    }
    this.addInnerHTML = function(str){
        t.innerHTML += str;
        return this;
    }
    this.addHtml = function(str){
        t.html += str;
        return this;
    }
    return this;
}