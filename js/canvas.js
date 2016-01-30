$(function(){
    var box=$(".box");
    var copy=$(".copy");
    var canvas = $("canvas");
    var cobj =canvas[0].getContext("2d");//绘制2d图像的对象
    canvas.attr({
        width:copy.width(),
        height:copy.height()
    })

    var index;
    $(".hasson").hover(function(){
        index=$(".hasson").index(this);
        $(".hasson").eq(index).find(".son").finish();
        $(".hasson .son").css({display:"none"})
        $(".hasson").eq(index).find(".son").attr("data-ani","animate-slidelright1").css({display:"block"});
        },
        function(){
            $(".hasson").eq(index).find(".son").attr("data-ani","animate-sliderleft1");
            $(".hasson").eq(index).find(".son").queue(function(){
                $(this).css({display:"none"});
                $(this).dequeue();//出队
            })
        })



    var obj=new shape(copy[0],canvas[0],cobj);
//画图
    $(".shapes div").click(function(){
        if($(this).attr("data-role")!="pen"){
            obj.shapes=$(this).attr("data-role");
            obj.draw();
        }else{
            obj.pen();
        }
    })

//画图类型
    $(".type div").click(function(){
        obj.type=$(this).attr("data-role");
    })


//线条的颜色
    $(".linecolor").change(function(){
        obj.bordercolor=$(this).val();
    })


//填充的颜色
    $(".fillcolor").change(function(){
        obj.bgcolor=$(this).val();
    })


//    线条宽度
    $(".linewidth div").click(function(){
        obj.lineWidth=$(this).attr("data-role");
    })

//橡皮
    $(".xpsize div").click(function(){
        var w=$(this).attr("data-role");
        var h=$(this).attr("data-role");
        obj.xp($(".xp"),w,h);
    })

//    file
    $(".file div").click(function(){
        var index=$(this).index(".file div");
        if(index==0){//新建
            if(obj.history.length>0){
              var yes= window.confirm("是否保存");
                if(yes){
                    location.href=canvas[0].toDataURL().replace("data:image/png","data:stream/octet");
                }
            }
            obj.history=[];
            cobj.clearRect(0,0,canvas[0].width,canvas[0].height);
        }else if(index==1){//返回
            cobj.clearRect(0,0,canvas[0].width,canvas[0].height);
            if(obj.history.length==0){
                alert("不能后退");
                return;
            }
            var data=obj.history.pop();
            cobj.putImageData(data,0,0);
        }else if(index==2){//保存
            //data:stream/octet;
            location.href=canvas[0].toDataURL().replace("data:image/png","data:stream/octet");
        }
    })


    $(".select").click(function(){
        $(this).addClass("xuanzebg");
        obj.select($(".selectarea"));
    })


    //选择了区域后点击其他菜单
    $(".hasson div").click(function(){
        if(obj.temp){
            obj.history.push(cobj.getImageData(0, 0, canvas[0].width, canvas[0].height));
            //this.temp=null;
            $(".selectarea").css({
                display:"none"
            })
            $(".select").removeClass("xuanzebg");
        }

    })







})