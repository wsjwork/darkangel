///**
// * Created by Administrator on 2015/8/8 0008.
// */
var pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 2;

var in_screen = {w:window.innerWidth,h:window.innerHeight};
var out_screen = {w:1280,h:720};

var sc_w = in_screen.w/out_screen.w;
var sc_h = in_screen.h/out_screen.h;
var score = 0;


var main = function(){
    var audio1 = document.getElementById("testaudio1");
    var audio2 = document.getElementById("testaudio2");
    var audio3 = document.getElementById("testaudio3");
    var audio4 = document.getElementById("testaudio4");
    var audio5 = document.getElementById("testaudio5");


    var T = new Tina({
        dataPath:"data/",
        imagePath:"img/"})
    .requires("Input,Sprites,Scenes,Text,Entities")
    .setup("canvas",{width:in_screen.w,height:in_screen.h,
        pixelRatio:pixelRatio,
        scale:{x:sc_w,y:sc_h}})
        //.setup("canvas",{width:info_screen0.w,height:info_screen0.h,
        //    pixelRatio: pixelRatio,
        //    scale:{x:sc_w,y:sc_h}
        //})
    .controls();

    var kill = function (p_x,p_y,p_xx,p_yy,f_x,f_y,f_xx,f_yy){
        var result = false;
        if(p_x>f_x&&p_x<f_xx||p_xx>f_x&&p_xx<f_xx){
            if(p_y>f_y&&p_y<f_yy||p_yy>f_y&&p_yy<f_yy){
                result = true;
            }
        }
        return result;
    };

    var gameOver = function(score){
        if(score > 8){
            T.stageScene("level0");
        }
    };
    var Player = T.Entity.extend({
        speed: 20,
        weaponCD : 5,
        weaponCDing :0,
        reloadCD : 60,
        reloadCDing :0,
        cartridge :20,
        maxCartridge :20,
        init : function(ops) {
            this._super(ops);
            this.merge("frameAnim");
        },
        update : function(dt) {
            if (this.weaponCDing > 0){
                this.weaponCDing--;
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
            if(this.accel.x != 0) {
                this.run();
            } else {
                this.idle();
            }
            this.x += this.accel.x;
            this.accel.x = 0;
            this.y += this.accel.y;
            this.accel.y = 0;
            this._super(dt);

        },
        fire : function(){
            console.log("jin");
            this.play('fire');
            if(this.cartridge > 0){
                if(this.weaponCDing > 0)return;
                var bullet = new Bullet({x:this.x,y:this.y-this.w*1/3});
            if(this.scale.x < 0) bullet.speed = -bullet.speed;
            if(this.parent)
                this.parent.add(bullet);
            this.cartridge--;
            this.weaponCDing = this.weaponCD;
            } else {
                if(this.reloadCDing > 0) return;
                this.reloadCDing = this.reloadCD;
            }

        },
        run : function(){
            this.play('run');
        },
        idle : function(){
            this.play('idle');
        }
    });

    var Bullet = T.Entity.extend({
        w:6,
        h:2,
        center:{x:3,y:1},
        speed:5,
        asset:"bullet.png",
        hp:60,
        //实际上为ops
        update: function(dt){
            this.x += this.speed;
            for(var i = 0;i < this.parent.items.length; i++){
                if (this.parent.items[i] instanceof Foe1 ){
                    if(kill((this.x-3),(this.y-1),(this.x+3),(this.y+1),(this.parent.items[i].x-23),(this.parent.items[i].y-44),(this.parent.items[i].x+23),this.parent.items[i].y)){
                        this.parent.remove(this);
                        this.parent.remove(this.parent.items[i]);
                        score++;
                        gameOver(score);
                    }
                }
            }
            if(this.hp-- < 0){
                if(this.parent){
                    this.parent.remove(this);
                }
            }
        }

    });
    var Foe1 = T.Entity.extend({
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

    var BulletView = T.Entity.extend({
        x:30,
        y:10,
        init: function(ops){
            this.buttet = new T.CText();
            this.buttet.color = '#fa0';
            this.buttet.setSize(25);
            if(ops&&ops.player){
                this.player = ops.player;
            }
            this.on("added",function(){
                if(this.parent){
                    this.parent.add(this.buttet);
                }
            })
        },
        setPlayer:function(player){
            this.player = player;
        },
        update:function(dt){
            this.buttet.x = this.x;
            this.buttet.y = this.y;
            this.buttet.setText(this.player.cartridge);
        }

    });
    T.scene("level0",new T.Scene(function(stage){
        stage.merge("interactive");
        var bg = new T.Sprite({
            asset:"wsj_bg_over.jpg",
            w:1280,
            h:720
        });
        stage.add(bg);
    },{sort:true}));
    T.scene("level1",new T.Scene(function(stage){
        stage.merge("interactive");
        var bg = new T.Sprite({
            asset:"wsj_bg.jpg",
            w:1280 ,
            h:720
        });
        stage.add(bg);

        var player1 = new Player({
            w:48,
            h:48,
            x:300,
            y:200,
            z:300,
            center:{x:24,y:48}
        });
        player1.setAnimSheet('player1','wsj_player1_sprite');
        stage.add(player1);

        var foe = Array(10);
        for(var i = 0; i < foe.length; i++){
            var y = Math.floor(Math.random()*520+90);
            foe[i] = new Foe1({
                x: Math.floor(Math.random() * 400) - 500,
                y: y,
                z: y
            });
            foe[i].speed = Math.floor(Math.random()*40)+20;
            foe[i].rate = 4/foe[i].speed;
            foe[i].setAnimSheet('foe1','wsj_feo1_sprite');
            stage.add(foe[i]);
        }

        var bulletview = new BulletView({player:player1});
        stage.add(bulletview);

        T.input.on('z',function(){

            if(!stage.paused){
                stage.pause();
            }else{
                stage.unpause();
            }
        })

    },{sort:true}));
    T.load(["wsj_bg.jpg","bg_over.jpg","bullet.png","wsj_foe1.png","wsj_player1.png","p11.png","wsj_bg_over.jpg",
            "wsj_test.json","wsj_foe1.json","wsj_player1.json"],
        function(){
            T.compileSheets("wsj_player1.png","wsj_player1.json");
            T.compileSheets("wsj_foe1.png","wsj_foe1.json");
            _.each(
                [["wsj_feo1_sprite",{
                    foe1_run: {frames: _.range(0,8),rate:1/5}
                }],
                 ["wsj_player1_sprite",{
                     run : {frames: _.range(0,8),rate:1/13},
                     idle : {frames: [1],rate :1}
                 }]
                ],function(anim){
                    T.fas(anim[0],anim[1]);
                });
            T.input.on('r',function(){
                T.stageScene("level0");
            })
            window.setTimeout(function(){
                T.stageScene("level1");
            },300);

    });
};
