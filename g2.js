/**
 * Created by Administrator on 2015/8/6 0006.
 */
//比例
var pixelRatio = window.devicePixelRatio ? window.devicePixelRatio :2;
var info_screen = {w:1280,h:720};
var info_screens = {w:window.innerWidth, h:window.innerHeight};

var sc_w = info_screens.w/info_screen.w;
var sc_h = info_screens.h/info_screen.h;

var score = 0;

var main = function(){


    var audio1 = document.getElementById("testaudio1");
    var audio2 = document.getElementById("testaudio2");
    var audio3 = document.getElementById("testaudio3");
    var audio4 = document.getElementById("testaudio4");
    var audio5 = document.getElementById("testaudio5");

    var T = Tina({imagePath:"img/",dataPath:"data/"})
        .requires("Input,Sprites,Scenes,Text,Entities")
        .setup("canvas",{width:info_screens.w, height:info_screens.h,
            pixelRatio : pixelRatio,
            scale:{x:sc_w,y:sc_h}})
        .controls();
    /**
     *  击杀判定
     * @param p_x   击杀者左x
     * @param p_y   击杀者左y
     * @param p_xx  击杀者右x
     * @param p_yy  击杀者右y
     * @param f_x   被击杀者左x
     * @param f_y   被击杀者左y
     * @param f_xx  被击杀者右x
     * @param f_yy  被击杀者右y
     * @returns {boolean}   判定击杀成功返回true,否则返回false
     */
    var kill = function(p_x,p_y,p_xx,p_yy,f_x,f_y,f_xx,f_yy){
        var result = false;
        if(p_y>f_y&&p_y<f_yy||p_yy>f_y&&p_yy<f_yy){
            if(p_x>f_x&&p_x<f_xx||p_xx>f_x&&p_xx<f_xx){
                result = true;
            }
        }
        return result;
    };
    //游戏结束判定
    var gameOver = function(){
      //如果分数大于14分则变换为level2场景
      if (score > 8){
          T.stageScene("level2");
      }
    };
    //玩家1
    var PlayerOne = T.Entity.extend({
        speed:50,
        weaponCD:5,
        weaponCDing:0,
        reloadCD:60,
        reloadCDing:0,
        maxCartridge:20,
        cartridge:20,
        init:function(ops){
            this._super(ops);
            this.merge("frameAnim");
        },
        run:function(){
            this.play("run");
        },
        idle:function(){
            this.play("idle");
        },
        fire:function(){
            if(this.cartridge>0){
                if(this.weaponCDing>0)return;

                var bullet = new Bullet({x : this.x , y : this.y-this.w*1/3});
                if (audio1.paused){
                    audio1.src="audio/testmp1.mp3";
                    if(audio1 != null && audio1.canPlayType && audio1.canPlayType("audio/mpeg")){
                        audio1.play();
                    }
                }else if (audio2.paused){
                    audio2.src="audio/testmp1.mp3";
                    if(audio2 != null && audio2.canPlayType && audio2.canPlayType("audio/mpeg")){
                        audio2.play();
                    }
                }else if (audio3.paused){
                    audio3.src="audio/testmp1.mp3";
                    if(audio3 != null && audio3.canPlayType && audio3.canPlayType("audio/mpeg")){
                        audio3.play();
                    }
                }else if (audio4.paused){
                    audio4.src="audio/testmp1.mp3";
                    if(audio4 != null && audio4.canPlayType && audio4.canPlayType("audio/mpeg")){
                        audio4.play();
                    }
                }else if (audio5.paused){
                    audio5.src="audio/testmp1.mp3";
                    if(audio5 != null && audio5.canPlayType && audio5.canPlayType("audio/mpeg")){
                        audio5.play();
                    }
                }else{
                    audio1.src = ""
                    audio1.src="audio/testmp1.mp3";
                    if(audio1 != null && audio1.canPlayType && audio1.canPlayType("audio/mpeg")) {
                        audio1.play();
                    }
                }
                if(this.scale.x < 0) bullet.speed = -bullet.speed;
                if(this.parent)
                    this.parent.add(bullet);
                this.cartridge--;
                this.weaponCDing = this.weaponCD;
            }else{
                if(this.reloadCDing > 0)return;
                this.reloadCDing = this.reloadCD;
            }
        },
        update:function(dt){
            if(this.weaponCDing > 0){
                this.weaponCDing--;
            }
            if(this.reloadCDing > 0){
                if(--this.reloadCDing<1){
                    this.cartridge = this.maxCartridge;
                }
            }
            if(T.inputs['h']) {
                this.fire();
            }
            if(T.inputs['a']) {
                this.accel.x -= 3;
                this.scale.x = -1;
            }
            if(T.inputs['d']) {
                this.accel.x += 3;
                this.scale.x = 1;
            }
            if(T.inputs['w']) {
                this.accel.y -= 2;
                this.scale.y = 1;
            }
            if(T.inputs['s']) {
                this.accel.y += 2;
                this.scale.y = 1;
            }
            if(this.accel.x != 0) {
                this.run();
            } else {
                this.idle();
            }
            this.x += this.accel.x;
            this.accel.x = 0;
            this.y+= this.accel.y;
            this.accel.y = 0;
            this._super(dt);
        }
    });
    //玩家2
    var PlayerTwo = T.Entity.extend({
        speed:50,
        weaponCD:5,
        weaponCDing:0,
        reloadCD:60,
        reloadCDing:0,
        maxCartridge:20,
        cartridge:20,
        init:function(ops){
            this._super(ops);
            this.merge("frameAnim");
        },
        run:function(){
            this.play("run");
        },
        idle:function(){
            this.play("idle");
        },
        fire:function(){
            if(this.cartridge>0){
                if(this.weaponCDing>0)return;

                var bullet = new Bullet({x : this.x , y : this.y-this.w*1/3});
                if (audio1.paused){
                    audio1.src="audio/testmp1.mp3";
                    if(audio1 != null && audio1.canPlayType && audio1.canPlayType("audio/mpeg")){
                        audio1.play();
                    }
                }else if (audio2.paused){
                    audio2.src="audio/testmp1.mp3";
                    if(audio2 != null && audio2.canPlayType && audio2.canPlayType("audio/mpeg")){
                        audio2.play();
                    }
                }else if (audio3.paused){
                    audio3.src="audio/testmp1.mp3";
                    if(audio3 != null && audio3.canPlayType && audio3.canPlayType("audio/mpeg")){
                        audio3.play();
                    }
                }else if (audio4.paused){
                    audio4.src="audio/testmp1.mp3";
                    if(audio4 != null && audio4.canPlayType && audio4.canPlayType("audio/mpeg")){
                        audio4.play();
                    }
                }else if (audio5.paused){
                    audio5.src="audio/testmp1.mp3";
                    if(audio5 != null && audio5.canPlayType && audio5.canPlayType("audio/mpeg")){
                        audio5.play();
                    }
                }else{
                    audio1.src = ""
                    audio1.src="audio/testmp1.mp3";
                    if(audio1 != null && audio1.canPlayType && audio1.canPlayType("audio/mpeg")) {
                        audio1.play();
                    }
                }
                if(this.scale.x < 0) bullet.speed = -bullet.speed;
                if(this.parent)
                    this.parent.add(bullet);
                this.cartridge--;
                this.weaponCDing = this.weaponCD;
            }else{
                if(this.reloadCDing > 0)return;
                this.reloadCDing = this.reloadCD;
            }
        },
        update:function(dt){
            if(this.weaponCDing > 0){
                this.weaponCDing--;
            }
            if(this.reloadCDing > 0){
                if(--this.reloadCDing<1){
                    this.cartridge = this.maxCartridge;
                }
            }
            if(T.inputs['ent']) {
                this.fire();
            }
            if(T.inputs['left']) {
                this.accel.x -= 3;
                this.scale.x = -1;
            }
            if(T.inputs['right']) {
                this.accel.x += 3;
                this.scale.x = 1;
            }
            if(T.inputs['up']) {
                this.accel.y -= 2;
                this.scale.y = 1;
            }
            if(T.inputs['down']) {
                this.accel.y += 2;
                this.scale.y = 1;
            }
            if(this.accel.x != 0) {
                this.run();
            } else {
                this.idle();
            }
            this.x += this.accel.x;
            this.accel.x = 0;
            this.y+= this.accel.y;
            this.accel.y = 0;
            this._super(dt);
        }
    });
    //怪兽
    var Foe = T.Entity.extend({
        sheet: "k0",
        sprite: "k0load",
         rate:1/15,
         speed:50,
         w:48,
         h:48,
         center:{x:24,y:44},

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
             this.play("run_test",1,this.rate,{loop:true});
             this.x += this.speed *dt ;
             this._super(dt);
         }
    });
    //子弹
    var Bullet = T.Entity.extend({
        w:6,
        h:2,
        center:{x:3,y:1},
        speed:5,
        asset:"bullet.png",
        hp:60,
        update:function(ops){
            for( var i = 0; i < this.parent.items.length; i++){
                if (this.parent.items[i] instanceof Foe){
                    if(kill(this.x-3,this.y-1,this.x+3,this.y+1,parseInt(this.parent.items[i].x)-24,parseInt(this.parent.items[i].y)-44,parseInt(this.parent.items[i].x)+24,parseInt(this.parent.items[i].y))){
                        score++;
                        gameOver(score);
                        this.parent.remove(this.parent.items[i]);
                        this.parent.remove(this);
                    }
                }
            }
            this.x += this.speed;
            if(this.hp-- < 0){
                this.parent.remove(this);
            }
        }
    });
    //文本的显示
    var Bullet_View = T.Entity.extend({
        x:30,
        y:10,
        playtext:"玩家1的子弹：",
        init:function(ops){
            this.cartridge = new T.CText();
            this.cartridge.color = 'fa0';
            this.cartridge.setsiz =(26);
            if(ops && ops.player) {
                this.player = ops.player;
            }
            this.on("added",function(){
                if(this.parent)
                    this.parent.add(this.cartridge);
            });
        },
        setPlayer: function(player){
            this.player = player;
        },
        update: function (dt) {
            this.cartridge.x = this.x;
            this.cartridge.y = this.y;
            this.cartridge.setText(this.playtext+this.player.cartridge);
        }
    });
    //文本的显示
    var Text_View = T.Entity.extend({
        x:30,
        y:50,
        init:function(ops){
            this.scoreview = new T.CText();
            this.scoreview.color = 'fa0';
            this.scoreview.setsiz =(26);
            if(ops && ops.player) {
                this.player = ops.player;
            }
            this.on("added",function(){
                if(this.parent)
                    this.parent.add(this.scoreview);
            });
        },
        update: function (dt) {
            this.scoreview.x = this.x;
            this.scoreview.y = this.y;
            this.scoreview.setText("分数为："+score);
        }
    });

    T.scene("level1",new T.Scene(function (stage){
        score = 0;
        stage.merge("interactive");
        //加入背景
        var bg = new T.Sprite({
            asset:"bg1.jpg",
            w:1280,
            h:720
        });
        stage.add(bg);


        //加入敌人
        var foe = new Array(10);
        for(var i = 0;i < foe.length ; ++i){
            var y =  Math.floor(Math.random()*520)+90;
            foe[i] = new Foe({
                x : Math.floor(Math.random()*400)-400,
                y : y,
                z : y
            });
            foe[i].setAnimSheet('k1','k0load');
            foe[i].speed = Math.floor(Math.random()*40)+20;
            foe[i].rate = 8/foe[i].speed;
            stage.add(foe[i]);
        }

        //加入玩家1
        var playerone = new PlayerOne({
            x:400,
            y:300,
            z:300,
            w:50,
            h:50,
            center:{x:25,y:46}
        });
        playerone.setAnimSheet('sheet_p0','p0');
        stage.add(playerone);
        //加入玩家2
        var playertwo = new PlayerTwo({
            x:600,
            y:300,
            z:300,
            w:50,
            h:50,
            center:{x:25,y:46}
        });
        playertwo.setAnimSheet('sheet_p0','p0');
        stage.add(playertwo);
        //score_view
        var sv = new Text_View();
        stage.add(sv);
        //bullet view for player_one
        var bv1 = new Bullet_View({player:playerone});
        stage.add(bv1);
        //bullet view for player_two
        var bv2 = new Bullet_View({player:playertwo});
        bv2.playtext = "玩家2的子弹：";
        bv2.y = 30;
        stage.add(bv2);

        T.input.on('z',function(e){
            if(!stage.paused){
                stage.pause();
            }else{
                stage.unpause();
            }
        });

    },{sort:true}));

    T.scene("level2",new T.Scene(function (stage){
        stage.merge("interactive");
        score = 0;
        var bg = new T.Sprite({
            asset:"bg_over.jpg",
            w : 1280,
            h : 720
        });
        stage.add(bg);


    },{sort:true}));
    //第一个参数加载资源，第二个参数设置sheet
    T.load(["bg1.jpg", "p11.png","bullet.png","k0.png","bg_over.jpg",
            "k0.json"],
        function(){
            T.compileSheets("k0.png","k0.json");
            T.sheet("sheet_p0","p11.png",{tw:72,th:66});
            _.each(
                [
                    ["p0",{
                        idle:{frames:[0],rate:1},
                        run:{frames: _.range(0,6),rate:1/10}
                    }],
                    ["k0load",{
                        run_test: {frames: _.range(0,13),rate: 1/2}
                    }]
                //这是什么鬼？
                ],function(anim){
                    T.fas(anim[0],anim[1]);
                });
            T.input.on("x",function() {
                console.log("x");
                T.stageScene("level1");
            });
            //加载完之后进入level1界面
            window.setTimeout(function() {
                T.stageScene("level1");
            },300);
        }
    );
};