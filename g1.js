/**
 * Created by Administrator on 2015/8/6 0006.
 */
//比例
var pixelRatio = window.devicePixelRatio ? window.devicePixelRatio :2;
var info_screen = {w:1280,h:720};
var info_screens = {w:window.innerWidth,h:window.innerHeight};

var sc_w = info_screens.w/info_screen.w;
var sc_h = info_screens.h/info_screen.h;

var score = 0;

var main = function(){
    var T = Tina({imagePath:"img/",dataPath:"data/"})
        .requires("Input,Sprites,Scenes,Text,Entities")
        .setup("canvas",{w:info_screens.w,h:info_screens.h,
            pixelRatio : pixelRatio,
            scale:{x:sc_w,y:sc_h}})
        .controls();

    var kill = function(){};
    //玩家
    var Player = T.Entities.extend();
    //怪兽
    var Foe = T.Entities.extend();
    //子弹
    var Bullet = T.Entities.extend();
    //文本的显示
    var Textview = T.Entities.extend();

    T.scene("level1",new T.scene(function (stage){

    }));
    T.scene("level2",new T.scene(function (stage){

    }));
    //第一个参数加载资源，第二个参数设置sheet
    T.load([],
        function(){

        }

    );

};