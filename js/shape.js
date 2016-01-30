function shape(copy,canvas,cobj){
    this.copy=copy;
    this.canvas=canvas;
    this.cobj=cobj;
    this.bgcolor="#000";
    this.bordercolor="#000";
    //this.type="fill";
    this.type="stroke";
    this.shapes="line";//默认划的是线
    this.lineWidth=1;
    this.width=canvas.width;
    this.height=canvas.height;
    this.history=[];//存储划过的数据
    this.selectflag=true;
}

shape.prototype={
    init:function(){
        this.cobj.fillStyle=this.bgcolor;
        this.cobj.strokeStyle=this.bordercolor;
        this.cobj.lineWidth=this.lineWidth;
    },
    line:function(x,y,x1,y1){
        var that=this;
        that.init();
        that.cobj.beginPath();
        that.cobj.moveTo(x,y);
        that.cobj.lineTo(x1,y1);
        that.cobj.stroke();
        that.cobj.closePath();
    },
    rect:function(x,y,x1,y1){
        var that=this;
        that.init();
        that.cobj.beginPath();
        that.cobj.rect(x,y,x1-x,y1-y);
        that.cobj.closePath();
        that.cobj[that.type]();//绘制2d
    },
    circle:function(x,y,x1,y1){
        var that=this;
        that.init();
        that.cobj.beginPath();
        var r=Math.sqrt((x-x1)*(x-x1)+(y-y1)*(y-y1));
        that.cobj.arc(x,y,r,0,Math.PI*2);
        that.cobj.closePath();
        that.cobj[that.type]();//绘制2d
    },
    wujiao:function(x,y,x1,y1){
        this.init();
        var r=Math.sqrt((x-x1)*(x-x1)+(y-y1)*(y-y1));
        var r1=r/2;
        this.cobj.beginPath();
        this.cobj.moveTo(x+r,y);
        for(var i=0;i<10;i++){
            if(i%2==0){//wai
                this.cobj.lineTo(x+Math.cos(i*36*Math.PI/180)*r,y+Math.sin(i*36*Math.PI/180)*r);
            }else{
                this.cobj.lineTo(x+Math.cos(i*36*Math.PI/180)*r1,y+Math.sin(i*36*Math.PI/180)*r1);
            }
        }
        this.cobj.closePath();
        this.cobj[this.type]();
    },
    //画直线
    draw:function(){
        var that=this;//shape
        that.copy.onmousedown=function(e){
            var startX= e.offsetX;
            var startY= e.offsetY;
            that.copy.onmousemove=function(e){
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.history.length>0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var endX= e.offsetX;
                var endY= e.offsetY;
                that[that.shapes](startX,startY,endX,endY);
            }
            that.copy.onmouseup=function(e){
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height) );
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            }
        }
    },
//    铅笔画
    pen:function(){
        var that=this;
        that.copy.onmousedown=function(e){
            var startX= e.offsetX;
            var startY= e.offsetY;
            that.init();
            that.cobj.beginPath();
            that.cobj.moveTo(startX,startY);
            that.copy.onmousemove=function(e){
                var endX= e.offsetX;
                var endY= e.offsetY;
                that.cobj.lineTo(endX,endY);
                that.cobj[that.type]();
            }
            that.copy.onmouseup=function(e){
                that.cobj.closePath();
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height) );
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            }
        }

    },
    xp:function(xpobj,w,h){
        var that=this;
        //点了橡皮  没按下
        that.copy.onmousemove = function (e) {
            var ox = e.offsetX;
            var oy = e.offsetY;

            var lefts = ox - w / 2;
            var tops = oy - h / 2;
            if (lefts < 0) {
                lefts = 0;
            }
            if (lefts > that.width - w) {
                lefts = that.width - w;
            }
            if (tops < 0) {
                tops = 0;
            }
            if (tops > that.height - h) {
                tops = that.height - h;
            }
            xpobj.css({
                left: lefts,
                top: tops,
                height: h,
                width: w,
                display:"block"
            })
        }
        //点了橡皮  按下
        that.copy.onmousedown=function(e) {
            that.copy.onmousemove = function (e) {
                var ox = e.offsetX;
                var oy = e.offsetY;
                var lefts = ox - w / 2;
                var tops = oy - h / 2;
                if (lefts < 0) {
                    lefts = 0;
                }
                if (lefts > that.width - w) {
                    lefts = that.width - w;
                }
                if (tops < 0) {
                    tops = 0;
                }
                if (tops > that.height - h) {
                    tops = that.height - h;
                }
                xpobj.css({
                    left: lefts,
                    top: tops,
                    height: h,
                    width: w,
                    display:"block"
                })
                that.cobj.clearRect(lefts, tops, w,h);
            }
            that.copy.onmouseup=function(){
                xpobj.css({display:"none"});
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height) );
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;

            }
        }

    },

    select:function(selectareaobj) {
        var that = this;
        //that.init();
        that.copy.onmousedown = function (e) {
            var startX = e.offsetX;
            var startY = e.offsetY;
            //that.init();
            var minX, minY, w, h;
            that.copy.onmousemove = function (e) {
                var endX = e.offsetX;
                var endY = e.offsetY;
                minX = startX < endX ? startX : endX;
                minY = startY < endY ? startY : endY;
                w = Math.abs(startX - endX);
                h = Math.abs(startY - endY);
                selectareaobj.css({
                    display: "block",
                    left: minX,
                    top: minY,
                    width: w,
                    height: h
                })
            }
            that.copy.onmouseup = function () {
                that.copy.onmousemove = null;
                that.copy.onmouseup = null;
                that.temp = that.cobj.getImageData(minX, minY, w, h);
                that.cobj.clearRect(minX, minY, w, h);
                that.history.push(that.cobj.getImageData(0, 0, that.width, that.height));
                that.cobj.putImageData(that.temp, minX, minY)
                that.drag(minX,minY,w,h,selectareaobj);
            }
        }
    },

    drag:function(x,y,w,h,selectareaobj){//x,y起始点坐标  w,h宽高
        var that=this;
        that.copy.onmousemove = function (e) {//视觉上鼠标在选中的区域
            var ox= e.offsetX;
            var oy= e.offsetY;
            if(ox>x && ox<x+w && oy>y && oy<y+h){
                that.copy.style.cursor="move";
            }else{
                that.copy.style.cursor="default";
            }
        }

        that.copy.onmousedown = function (e) {
            var ox= e.offsetX;
            var oy= e.offsetY;
            var cx=ox-x;//cx是在选择区域中 距离选择区域的边界的距离
            var cy=oy-y;
            if(ox>x && ox<x+w && oy>y && oy<y+h){
                that.copy.style.cursor="move";
            }else{
                that.copy.style.cursor="default";
                return;//按下的地方不在选择的区域 直接return
            }
            that.copy.onmousemove = function (e) {
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.history.length!==0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var endX= e.offsetX;
                var endY= e.offsetY;
                var lefts=endX-cx;
                var tops=endY-cy;
                if (lefts < 0) {
                    lefts = 0;
                }
                if (lefts > that.width - w) {
                    lefts = that.width - w;
                }
                if (tops < 0) {
                    tops = 0;
                }
                if (tops > that.height - h) {
                    tops = that.height - h;
                }
                selectareaobj.css({
                    left:lefts,
                    top:tops
                })
                x=lefts;//记录当前拖动完的位置
                y=tops;
            //    图像走 画布显示
                that.cobj.putImageData(that.temp,lefts,tops);
            }
            that.copy.onmouseup=function(e){
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.drag(x,y,w,h,selectareaobj)
            }
        }
    }

//每次点击其他或者移动的时候将history里面的画像显示
//    每次操作结束时将画像push在history中



}