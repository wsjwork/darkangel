
var main = function() {
  var T = Tina({imagePath:"img/",
                dataPath:"data/"})
        .requires("Input,Sprites,Scenes")
        .setup("canvas",{width:600,height:400,
                         pixelRatio: 1
                        })
        .controls();

  T.input.on("z",function(){console.log("z");});
  T.input.on("left",function(){console.log("left");});
  T.input.on("right",function(){console.log("right");});
  T.input.on("up",function(){console.log("up");});
  T.input.on("down",function(){console.log("down");});

  
  T.scene("level0",new T.Scene(function(stage){
    stage.merge("interactive");

    var img0 = new T.Sprite({asset:"t0.jpg",x:100,y:0, scale:{x:0.3,y:0.3}});
    var buterfly = new T.Sprite({sheet:"buterfly",sprite:"buterfly",x:179,y:67,z:1000,
                                 w:130,h:160});

    T.input.on("z",function(e){
      if(!stage.paused)
        stage.pause();
      else 
        stage.unpause();
    });

    buterfly.update = function(dt) {
      if(T.inputs['left']) { console.log("0 left"); this.x--;}
      if(T.inputs['right']) { this.x++;}
      if(T.inputs['up']) { this.y--;}
      if(T.inputs['down']) { this.y++;}
    };
    stage.add(buterfly);
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

  T.load(['t0.jpg', "buterfly.png","buterfly.json"],
         function() {
           T.compileSheets("buterfly.png","buterfly.json");
           // T.animations("buterfly",{
           //  swing:{frames:_.range(0,3),rate:1/19}
           // });

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

