/**
 * Created by Administrator on 2015/8/9 0009.
 */
var pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 2;

var in_screen ={w: window.innerWidth, h: window.innerHeight};
var out_screen = {w:1280,h:720};

var sc_w = in_screen.w/out_screen.w;
var sc_h = in_screen.h/out_screen.h;

var score = 0;

var main = function(){

  var T = Tina ({imagePath:"img/",
                dataPath:"data/"})
        .requires("Input,Sprites,Text,Scenes,Entities")
        .setup("canvas",{width:in_screen.w,height:in_screen.h, pixelRatio : pixelRatio , scale :{x:sc_w,y:sc_h}})
        //.setup("canvas",{width:in_screen.w,height:in_screen.h, pixelRatio : pixelRatio , scale :{x:sc_w,y:sc_h}})
      .controls();
    //T.input.on('w',function(){console.log("x")});
    var Player = T.Entity.extend({
      speed : 20,
      weaponCD : 20,
      weaponCDing :0,
      reloadCD : 60,
      reloadCDing :0,
      cartridge : 20,
      maxCartridge :20,
      init : function(ops){
          this._super(ops);
          this.merge("frameAnim")
      },
      fire : function(){
          //this.play("fire");
          if(this.cartridge > 0){
              if(this.weaponCDing > 0)return;
              var bullet = new Bullet({x:this.x,y:this.y - this.h*7/20});
              if(this.scale.x < 0) bullet.speed = - bullet.speed;
              if(this.parent){
                  this.parent.add(bullet);
              }
              this.cartridge --;
              this.weaponCDing = this.weaponCD;
          }else{
              if(this.reloadCDing > 0)return;
              this.reloadCDing = this.reloadCD;
          }

      },
      idle: function(){
          this.play("idle");
      },
      run : function(){
          this.play("run");
      },
      update: function(dt){
          if (this.weaponCDing > 0){
              this.weaponCDing --;
          }
          if (this.reloadCDing > 0){
              if(--this.reloadCDing <1){
                this.cartridge = this.maxCartridge;
              }
          }

          if(T.inputs['w']){
              this.scale.y = 1;
              this.accel.y -= 3;
          }
          if(T.inputs['s']){
              this.scale.y = 1;
              this.accel.y += 3;
          }
          if(T.inputs['a']){
              this.scale.x = -1;
              this.accel.x -= 4;
          }
          if(T.inputs['d']){
              this.scale.x = 1;
              this.accel.x += 4;
          }
          if(T.inputs['h']){
              this.fire();
          }

          if(this.accel.x !=0||this.accel.y !=0){
              this.run();
          }else{
              this.idle();
          }


          this.x += this.accel.x;
          this.accel.x = 0;
          this.y += this.accel.y;
          this.accel.y = 0;
          this._super(dt);


      }
  });
    var Bullet = T.Entity.extend({
        x:6,
        y:2,
        center:{x:3,y:1},
        speed:5,
        asset:"wsj_bullet.png",
        hp:60,
        update: function(dt){
            this.x += this.speed;
            if(this.hp-- < 0){
                this.parent.remove(this);
            }
        }
    });
    var BulletView = T.Entity.extend({
        x:10,
        y:30,
        init: function(ops){
            this.buttelview = new T.CText();
            this.buttelview.color = '#80C8FE';
            this.buttelview.setSize(25);
            if(ops&&ops.player){
                this.player = ops.player;
            }
            this.on("added",function(){
                if(this.parent){
                    this.parent.add(this.buttelview);
                }
            })
        },
        setPlayer: function(player){
          this.player  = player;
        },
        update : function(dt){
            this.buttelview.x = this.x ;
            this.buttelview.y = this.y;
            this.buttelview.setText(this.player.cartridge);
            this._super(dt);
        }


    });
    //var Foe = T.Entity.extend({
    //    speed:50,
    //    rate:1/8,
    //    w:46,
    //    h:34,
    //    center:{x:23,y:30},
    //    init: function(ops){
    //        this._super(ops);
    //        this.merge("frameAnim")
    //    },
    //    update: function(dt){
    //      if(this.x >1280){
    //          this.x = -100;
    //          this.speed = Math.floor(Math.random()*60)+40;
    //          this.rate = 4/this.speed;
    //      }
    //      this.play("foe1_run",1,rate=this.rate,{loop:true});
    //        this.x += this.speed;
    //        this._super(dt);
    //    }
    //});
    var Foe = T.Entity.extend({
        w:46,
        h:34,
        center:{x:24,y:44},
        speed:20,
        rate:1/5,

        init: function(ops){
            this._super(ops);
            this.merge("frameAnim");
        },
        update: function(dt){
            if(this.x > 1280){
                this.x = -100;
                this.speed = Math.floor(Math.random()*60)+40;
                this.rate = 4/this.speed;
            }
            this.play("foe1_run",1,this.rate,{loop:true});
            this.x += this.speed * dt;
            this._super(dt);
        }
    });

    T.scene("level1",new T.Scene(function(stage){
        stage.merge("interactive");
        var bg =new T.Sprite({
            asset:"wsj_bg.jpg",
            w:1280,
            h:720
        });
        stage.add(bg);

        var player1 = new Player({
            x:200,
            y:300,
            z:300,
            w:60,
            h:80,
            center:{x:30,y:70}
        });
        player1.setAnimSheet("player1","wsj_player1");
        stage.add(player1);

        //var foe1 = Array(20);
        //for( var i = 0 ;i < foe1.length ;i++){
        //    var y = Math.floor(Math.random()*520)+90;
        //    foe1[i] = new Foe({
        //        x : Math.floor(Math.random()*500)-500,
        //        y : y ,
        //        z : y
        //    });
        //    foe1[i].setAnimSheet("foe1","foe1");
        //    foe1[i].speed = Math.floor(Math.random()*40)+20;
        //    foe1[i].rate = 4/foe1[i].speed;
        //    stage.add(foe1[i]);
        //}
        var foe = Array(10);
        for(var i = 0; i < foe.length; i++){
            var y = Math.floor(Math.random()*520+90);
            foe[i] = new Foe({
                x: Math.floor(Math.random() * 400) - 500,
                y: y,
                z: y
            });
            foe[i].speed = Math.floor(Math.random()*40)+20;
            foe[i].rate = 4/foe[i].speed;
            foe[i].setAnimSheet('foe1','wsj_foe1');
            stage.add(foe[i]);
        }


        var buttelview = new BulletView({player : player1});
        stage.add(buttelview);

    },{sort:true}));

    T.scene("level0",new T.Scene(function(stage){
        stage.merge("interactive");
        var bg =new T.Sprite({
           asset:"wsj_bg_over.jpg",
            w:1280,
            h:720
        });
        stage.add(bg);

    },{sort:true}));
    T.load(["wsj_bg_over.jpg","wsj_bg.jpg","wsj_player1.png","wsj_bullet.png","wsj_foe1.png",
            "wsj_player1.json","wsj_foe1.json"],function(){
        T.compileSheets("wsj_player1.png","wsj_player1.json");
        T.compileSheets("wsj_foe1.png","wsj_foe1.json");

        _.each([
                ["wsj_player1",{
                    run :{frames: _.range(0,8),rate:1/13},
                    idle:{frames:[9],rate:1},
                    fire:{frames: _.range(0,13),rate:1}
                }],
                ["wsj_foe1",{
                    foe1_run: {frames: _.range(0,8),rate:1/5}
                }]
            ],
            function(anim){
                T.fas(anim[0],anim[1]);
        });
        window.setTimeout(function(){
            T.stageScene("level1");
        },300);
    });
};