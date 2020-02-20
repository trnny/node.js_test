
//  定义:
var xxxTable = function(title){  // 构造 传入表的标题
    this.setTitle = (title) => {  // 设置表的标题
        return this;
    }
    this.setHeading = function() {  // 设置表的头项
        return this;
    }
    this.setAlign = (t, w) => {  // 设置对齐方式 如center,left,right
        return this;
    }
    this.setMargin = (l, t, b) => {  // 设置表左、上、下边距
        return this;
    }
    this.addRow = function() {  // 添加一行
        return this;
    }
    this.toString = () => {  // 把该表变成字符串
        var string = "";
        return string;
    }
    this.toJSON = () => {  // 把该表变成JSON对象
        var obj = new Object();
        return obj;
    }
    this.toHTML = () => {   // 把该表变成HTML DOM段
        var html = "";
        return html;
    }
    this.fromJSON = (obj) => {  // 从JSON对象创建表
        return this;
    }
    this.clear = () => {  // 清除表的行项、头项、标题、对齐方式等
        return this;
    }
    this.clearRows = () => {  // 清除表的行项
        return this;
    }
    return this;
}


//  使用:
var table = new xxxTable("a text table!!")
    .setHeading("NO.", "name", "class", "pro", "age")
    .addRow('a', "tuhuawu", "3", "", "19")
    .addRow('b', "b'name", "b'class", "b'professional", 99);
console.log(table.toString());


//  效果:
       // 默认对齐方式 分别是 center, left, center
       // 默认边距都是0
// .------------------------------------------------.
// |                 a text table!!                 |     表的标题
// |------------------------------------------------|
// | NO. | name    | class   | pro            | age |     表的头项
// |-----|---------|---------|----------------|-----|
// |  a  | tuhuawu |    3    |                | 19  |     表的行项
// |  b  | b'name  | b'class | b'professional | 99  |
// '------------------------------------------------'
