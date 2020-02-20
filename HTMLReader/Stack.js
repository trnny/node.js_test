module.exports = function Stack() {
    var items = [];
  
    /**
     * 将元素送入栈，放置于数组的最后一位
     */
    this.push = function(element) {
      items.push(element);
    };
  
    /**
     * 弹出栈顶元素
     */
    this.pop = function() {
      return items.pop();
    };
  
    /**
     * 查看栈顶元素
     */
    this.peek = function() {
      return items[items.length - 1];
    }
  
    /**
     * 确定栈是否为空
     * @return {Boolean} 若栈为空则返回true,不为空则返回false
     */
    this.isAmpty = function() {
      return items.length === 0
    };
  
    /**
     * 清空栈中所有内容
     */
    this.clear = function() {
      items = [];
    };
  
    /**
     * 返回栈的长度
     * @return {Number} 栈的长度
     */
    this.size = function() {
      return items.length;
    };
  
    /**
     * 以字符串显示栈中所有内容
     */
    this.print = function() {
      console.log(items.toString());
    };
  }