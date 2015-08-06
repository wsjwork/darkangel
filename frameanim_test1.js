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
        .requires("Input,Sprites,Scenes,Text")
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

  var Player = T.Sprite.extend({
    sheet: "k0",
    sprite: "player0",
    rate: 1/15,
    speed: 50,

    init: function(ops) {
      this._super(ops);
      this.merge("frameAnim");
    },
    setFrameAnim: function(sheet,sprite) {
      if(sheet) this.sheet = sheet;
      if(sprite) this.sprite = sprite;
      if((!this.w || !this.h)) {
        if(this.getSheet()) {
          this.w = this.w || this.getSheet().tileW;
          this.h = this.h || this.getSheet().tileH;
        }
      }
    },
    update: function(dt) {
      if(T.inputs['left']) { this.speed-=1; }
      if(T.inputs['right']) { this.speed+=1; }
      if(T.inputs['up']) { this.y-=this.speed; }

      if(T.inputs['down']) {
        this.fire();
      } else {
        if(this.x > 1280) {
          this.x = -100;
          this.speed = Math.floor(Math.random()*60)+40;
        }
        this.play("run_right",1,this.rate,{loop:true});
        this.x += this.speed * dt;
      }
      this._super(dt);
    },
    fire: function () {
      this.play("fire",3,1/6);
    }
  });
  
  T.scene("level0",new T.Scene(function(stage){
    stage.merge("interactive");

    var bg = new T.Sprite({asset:"bg1.jpg",
                           w:1280,
                           h:720
                          });
    stage.add(bg);

    var pp = new Array(500);
    for(var i=0; i<pp.length; ++i) {
      var y = Math.floor(Math.random()*520+90);
      console.log("Y: "+y);
      pp[i] =  new Player({
        x:Math.floor(Math.random()*500)-500,
        y:y,
        z:y
      });
      pp[i].setFrameAnim('k1','player0');
      pp[i].speed = Math.floor(Math.random()*40)+20;
      pp[i].rate = 4/pp[i].speed;
      stage.add(pp[i]);
    }

    for(var j=0; j < 50; ++j){
      for(var jj=0; jj< 10; ++jj) {
        var t0 = new T.CText("Hello 你好么?"+j*jj);
        t0.x = 0+j*5+jj*90;
        t0.y = 0+j*20+jj*4;
        // t0.color = '#7'+j*jj;
        t0.alpha = j/35;
        t0.setSize(16+jj);
        t0.z = 1000;
        stage.add(t0);
        t0.update = function(dt) {
          this.y-=Math.floor(Math.random()*6);
          // this.setSize(10+Math.floor(Math.random()*10));
          // this.alpha = Math.random();
          if(this.y < 0)
            this.y = 720;
        };
      }
    }

    T.input.on("z",function(e){
      if(!stage.paused)
        stage.pause();
      else 
        stage.unpause();
    });

  },{sort:true}));

  T.scene("level1",new T.Scene(function(stage){
    stage.merge("interactive");

  }));

  T.load(['k0.png',"k0.json",
          "bg0.jpg","bg1.jpg","bg2.jpg","bg3.jpg"],
         function() {
           T.compileSheets("k0.png","k0.json");
           T.fas("player0",{
             run_right: {frames: _.range(0,13),rate: 1/2},
             fire: {frames: _.range(14,24), next: 'sand', rate: 1/10},
             stand: {frames: [14], rate: 1/5}
           });

           T.input.on("c",function(){
             console.log("c");
             T.stageScene("level1");
           });

           T.input.on("x",function(){
             console.log("x");
             T.stageScene("level0");
           });

           window.setTimeout(function() {
             T.stageScene("level0");
           },300);
         });

};

