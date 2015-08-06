var pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 2;
var info_screen = {w:1280, h:720};
// var info_screen = {w:1920, h:1200};
// var info_screen = {w:2446, h:1376};
var info_screen0 = {w:window.innerWidth, h:window.innerHeight};

var sc_x = info_screen0.w / info_screen.w;
var sc_y = info_screen0.h / info_screen.h;



var main = function() {
  var T = Tina({imagePath:"img/",
                dataPath:"data/"})
        .requires("Input,Sprites,Scenes")
        .setup("canvas",{width:info_screen0.w,height:info_screen0.h,
                         pixelRatio: pixelRatio,
                         scale:{x:sc_x,y:sc_y}
                        })
        .controls();

  T.input.on("z",function(){console.log("z");});
  T.input.on("left",function(){console.log("left");});
  T.input.on("right",function(){console.log("right");});
  T.input.on("up",function(){console.log("up");});
  T.input.on("down",function(){console.log("down");});

  var Btf = T.Sprite.extend({
    init: function(speed,ops) {
      this.speed = speed || 1;
      this._super(ops);
    },
    update: function(dt) {
      if(T.inputs['left']) { console.log("0 left"); this.x-=this.speed; }
      if(T.inputs['right']) { this.x+=this.speed; }
      if(T.inputs['up']) { this.y-=this.speed; }
      if(T.inputs['down']) { this.y+=this.speed; }
      this._super(dt);
    },
    swing: function () {
      this.play("swing",1,1/6,{loop:true});
    }
  });
  
  T.scene("level0",new T.Scene(function(stage){
    stage.merge("interactive");

    var img0 = new T.Sprite({asset:"t0.jpg",x:100,y:0, scale:{x:0.3,y:0.3}});
    var buterfly = new T.Sprite({sheet:"buterfly",sprite:"buterfly",x:179,y:67,z:1000,
                                 w:130,h:160});
    var btf = new Btf(3,{sheet:"buterfly",sprite:"buterfly",x:79,y:267,z:1000,
                         w:130,h:160});

    T.input.on("z",function(e){
      if(!stage.paused)
        stage.pause();
      else 
        stage.unpause();
    });

    buterfly.update = function(dt) {
      // if(T.inputs['left']) { console.log("0 left"); this.x--;}
      // if(T.inputs['right']) { this.x++;}
      // if(T.inputs['up']) { this.y--;}
      // if(T.inputs['down']) { this.y++;}
    };

    stage.add(buterfly);
    stage.add(btf);

    btf.merge("frameAnim");
    // btf.purge("frameAnim");
    btf.swing();
  }));

  T.scene("level1",new T.Scene(function(stage){
    stage.merge("interactive");

    // var img0 = new T.Sprite({asset:"t0.jpg",x:100,y:0, scale:{x:0.3,y:0.3}});
    var buterfly = new T.Sprite({sheet:"buterfly",sprite:"buterfly",x:279,y:167,z:1000,
                                 w:130,h:160});

    buterfly.update = function(dt) {
      if(T.inputs['left']) { console.log("1 left"); this.x--;}
      if(T.inputs['right']) { this.x++;}
      if(T.inputs['up']) { this.y--;}
      if(T.inputs['down']) { this.y++;}
    };
    stage.add(buterfly);
  }));

  T.load(['t0.jpg',"buterfly.png","buterfly.json"],
         function() {
           T.compileSheets("buterfly.png","buterfly.json");
           T.fas("buterfly",{
             swing:{frames:_.range(0,3),rate:1/19}
           });

           // buterfly.merge("animation");
           // buterfly.play("swing",1,1/5,{loop:true});
           // T.gameLoop(function(dt){
           //   T.clear();
           //   // img0.render();
           //   buterfly.render();
           // });

           T.input.on("c",function(){
             console.log("c");
             T.stageScene("level1");
           });

           T.input.on("x",function(){
             console.log("x");
             T.stageScene("level0");
           });
           T.stageScene("level0");
         });

};

