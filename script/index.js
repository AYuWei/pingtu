/**
 * 全局配置
 */
var config = {
    width: 500,
    height: 500,
    rowl: 3, // 行
    cosl: 3, // 列
    dom: document.getElementById('parentDiv'),
    imgsrc: "img/lol.png"
};
// 设置小块div的height  width
config.pieceHeight = config.height / config.cosl;
config.pieceWidth = config.width / config.rowl;


/**
 * 1、 初始化游戏
 */
function init() {
    // 1。初始化游戏区域
    initParentDiv();
    // 2。设置小块的div,用数组存放每个div的详细信息
    // 因为信息有点多，我们放在构造函数中使用（对象）
    // 2.1初始化小块
    var childArr = [];
    initChildDiv();
    console.log(childArr)
    // 2.2 把每个小块打乱位置 (洗牌)
    childDivRandom();
    // 2.3 注册事件
    setEvent();


    /**
     *  1。初始化游戏区域
     */
    function initParentDiv() {
        config.dom.style.height = config.height + "px";
        config.dom.style.width = config.width + "px";
        config.dom.style.border = "2px solid #ccc";
        config.dom.style.position = "relative";
        config.dom.style.margin = 'auto';
    }


    /**
     * 2、初始化小块
     */
    function initChildDiv() {
        for (var i = 0; i < config.rowl; i++) {
            for (var j = 0; j < config.cosl; j++) {
                // 判断是否是最后一行和最后一列
                var isVisible = true;
                if (i === config.rowl - 1 && j === config.cosl - 1) {
                    isVisible = false;
                }
                var child = new Chilidarr(j * config.pieceWidth, i * config.pieceHeight, isVisible);
                childArr.push(child);
            }
        }
    }

    /**
     *  2 小块的详细信息
     * @param {*} left   
     * @param {*} top 
     */
    function Chilidarr(left, top, isVisible) {
        this.left = left;   // 当前的位置
        this.top = top;
        this.correctLeft = this.left;  // 正确位置（当改变当前位置时，正确位置不变）
        this.correctTop = this.top;
        this.isVisible = isVisible;
        this.dom = document.createElement('div');
        this.dom.style.height = config.pieceHeight + 'px';
        this.dom.style.width = config.pieceWidth + 'px';
        this.dom.style.background = `url(${config.imgsrc}) -${this.left}px -${this.top}px`;
        this.dom.style.position = "absolute";
        this.dom.style.border = '2px solid #ccc';
        this.dom.style.boxSizing = 'border-box';
        this.isover = false;
        // 判断是否可见
        if (!isVisible) {
            this.dom.style.display = 'none';
            this.dom.style.border = 'none';
        }

        config.dom.appendChild(this.dom);
        // 显示到具体的位置
        this.show = function () {
            this.dom.style.left = this.left + 'px';
            this.dom.style.top = this.top + 'px';
        }

        // 判断是否在正确的位置上
        this.isCorrect = function () {
            return this.left === this.correctLeft && this.top === this.correctTop;
        }

        this.show();
    }

    /**
     * 2.2 小块的乱序，吧两个div的top left调换 
     */
    function childDivRandom() {
        // 循环数组，乱序
        for (var i = 0; i < childArr.length - 1; i++) {
            // 参数一个随机下标
            var index = setRandom(0, childArr.length - 2);
            // 调换位置dom1 dom2
            swap(childArr[index], childArr[i]);
        }

    }
    /**
     * 产生随机下标
     * @param {*} min 
     * @param {*} max 
     */
    function setRandom(min, max) {
        return Math.floor(Math.random() * (max + 1 - min) + min);
    }
    /**
     * 两个小块调换位置
     * @param {*} b1  // dom1 
     * @param {*} b2  // dom2
     */
    function swap(b1, b2) {
        // 交换left
        var templeft = b1.left;
        b1.left = b2.left;
        b2.left = templeft;
        // 交换top 
        var temptop = b1.top;
        b1.top = b2.top;
        b2.top = temptop;

        b2.show();
        b1.show();
    }

    // 2.3 注册事件
    function setEvent() {
        // 查找不可见的div 
        var isVisibledom = childArr.filter(function (item) {
            return !item.isVisible;
        })
        childArr.forEach(function (item) {
            item.dom.onclick = function () {
                if (item.isover) {
                   return;
                }
                if (item.top === isVisibledom[0].top && 
                    isEqual(Math.abs(item.left - isVisibledom[0].left) , config.pieceWidth)
                    || item.left === isVisibledom[0].left &&
                    isEqual(Math.abs(item.top - isVisibledom[0].top) , config.pieceHeight)
                    ) {
                    swap(isVisibledom[0], item);
                    over();
                }
                console.log(item.top)
                console.log(isVisibledom[0].top)
                // swap(isVisibledom[0], item);
                // over();
            }
        });
    }
    function isEqual(t1,t2){
        return parseInt(t1) === parseInt(t2);
    }
    // 判断游戏是否完成
    function over() {
        var isCorrect = childArr.filter(function (item) {
            return !item.isCorrect();
        });
        if (isCorrect.length === 0) {
            childArr.forEach(function (item) {
                item.isover = true;
                item.dom.style.display = 'block';
                item.dom.style.border = 'none';
            })
        }
    }

}

init();