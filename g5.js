/**
 * Created by Administrator on 2015/8/9 0009.
 */
var pixelRatio = window.devicePixelRatio ? window.devicePixelRatio :2;

var in_screen = {w:window.innerWidth,h:window.innerHeight};
var out_screen = {w:1280,h:720};

var sc_x = in_screen.w/out_screen.w;
var sc_y = in_screen.h/out_screen.h;

var score = 0;

var main = function(){

    var T = Tina({imagePath:"img/",dataPath:"data/"})
        .requires("Input,Sprites,Entities,Scenes,Text")
        .setup("canvas",{width:in_screen.w,height:in_screen.h,
        pixelRatio :pixelRatio,
        scale:{x:sc_x,y:sc_y}})
        .controls();

    var Player = T.Entity.extend({});

    T.scene("level0",new T.Scene(function(stage){
        stage.merge("interactive");
        var bg = new T.Sprite({
           asset:"wsj_bg_over.jpg",
            w:1280,
            h:720
        });
        stage.add(bg);
    },{sort:true}));
    T.load(["wsj_bg_over.jpg"],function(){

        _.each([],function(anim){
            T.fas(anim[0],anim[1]);
        });

        window.setTimeout(function(){
            T.stageScene("level0");
        },300);
    });
};