/**
 * Created by Administrator on 2015/8/9 0009.
 */

var pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 2 ;

var in_screen = {w:window.innerWidth,h:window.innerHeight};
var out_screen = {w:1280,h:720};

var sc_x = in_screen.w/out_screen.w;
var sc_y = in_screen.h/out_screen.h;

var main = function(){

    var T = Tina({imagePath:"img/",dataPath:"data/"})
        .requires("Input,Sprites,Entities,Scenes,Text")
        .setup("canvas",{width:in_screen.w,height:in_screen.h,
            pixelRatio:pixelRatio,
            scale:{x:sc_x,y:sc_y}})
        .controls();
    //击杀判定
    var kill  = function(p_x,p_y,p_xx,p_yy,f_x,f_y,f_xx,f_yy){
        var result = false;
        if(p_y>f_y&&p_y<f_yy||p_yy>f_y&&p_yy<f_yy) {
            if (p_x > f_x && p_x < f_xx || p_xx > f_x && p_xx < f_xx) {
                result = true;
            }
        }
        return result;
    };
    //结束判定
    var gameOver = function(score){
        if(score == -2){
            T.stageScene("level2");
        }
    };
    //结束背景图
    var bg_Over = function (){
        var bg = new T.Sprite({
            asset:"wsj_complete.png",
            w:1280,
            h:720,
            z:1000
        });
        return bg;
    };
    //流血
    var bleed = T.Entity.extend({
            w:48,
            h:48,
            z:300,
            hp:5,
            asset: "wsj_bleed.png",
        init: function(ops){
            this._super(ops);
            if(ops && ops.player) {
                this.player = ops.player;
            }
        },
        setPlayer: function(player){
            this.player = player;
        },
        update: function(dt) {
            this.x= this.player.x-20;
            this.y= this.player.y-18;
            if(this.hp-- < 0){
                this.parent.remove(this);
            }
            this._super(dt);

        }
    });
    //流血2
    var bleed_foe = T.Entity.extend({
        w:48,
        h:48,
        z:300,
        hp:60,
        asset: "wsj_bleed.png",
        update: function(dt) {
            if(this.hp-- < 0){
                this.parent.remove(this);
            }
            this._super(dt);
        }
    });
    //玩家1
    var Player = T.Entity.extend({
        speed: 20,
        weaponCD : 5,
        weaponCDing :0,
        reloadCD : 60,
        reloadCDing :0,
        cartridge :20,
        maxCartridge :20,
        maxHp : 200,
        name:"玩家1",
        hp:100,
        lv:0,
        lv_old:0,
        lv_time:0,
        exp:0,
        ad:20,
        fire_act:0,
        act_hp:5,
        die_time:30,
        player_score:0,
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
            if(T.inputs['h']){
                this.fire();
                this.act();
            }
            if(this.hp < 0 || this.hp ==0) {
                this.die();
                if(this.die_time-- < 0){
                    //this.x = -100;
                    //this.y = -100;
                    this.parent.remove(this);
                    //gameOver(-2);
                }
            }else  if(this.fire_act == 1 ){
                console.log("fire");
                 this.play("player1_fire");
                 this.fire_act=0;
                 this.act_hp =5;
                }else  if(this.act_hp-- < 0){
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
                   if(this.accel.x != 0 || this.accel.y != 0) {
                            this.run();
                             } else {
                            this.idle();
                             }
                    if(this.act_hp < -100){
                    this.act_hp = -1;
                    }
                    if(this.lv_time < -100){
                        this.lv_time = -1;
                    }
                console.log(this.lv_time);
            }
            this.x += this.accel.x;
            this.accel.x = 0;
            this.y += this.accel.y;
            this.accel.y = 0;
            this._super(dt);
            //如果碰到Foe1,血量减3
            for(var i = 0 ; i < this.parent.items.length ; i ++){
                if(this.parent.items[i] instanceof Foe1){
                    if(kill(this.x-14,this.y-14,this.x+14,this.y+14,(this.parent.items[i].x-23),(this.parent.items[i].y-16),(this.parent.items[i].x+23),this.parent.items[i].y+16)){

                        if(this.hp > 0 || this.hp == 0){
                            this.hp -= 2;
                        }

                        var bleed1 = new bleed({x:this.x-20,y:this.y-18,player:this});
                        this.parent.add(bleed1);
                    }
                }
            }
            //如果碰到Foe2,血量减5
            for(var i = 0 ; i < this.parent.items.length ; i ++){
                if( this.parent.items[i] instanceof  Foe2){
                    if(kill(this.x-14,this.y-14,this.x+14,this.y+14,(this.parent.items[i].x-33),(this.parent.items[i].y-25),(this.parent.items[i].x+33),this.parent.items[i].y+25)){

                        if(this.hp > 0 || this.hp == 0){
                            this.hp -= 3;
                        }

                        var bleed1 = new bleed({x:this.x-20,y:this.y-18,player:this});
                        this.parent.add(bleed1);
                    }
                }
            }

            if(this.player_score >2&&this.player_score<6){
                this.lv = 1;
                this.maxCartridge = 40;

            }
            if(this.player_score >6&&this.player_score<12){
                this.lv = 2;
                if(this.maxHp != -1){
                    this.hp = this.maxHp;
                    this.maxHp = -1;
                }
            }
        },
        fire : function(){
            if(this.cartridge > 0){
                if(this.weaponCDing > 0)return;
                var bullet = new Bullet({x:this.x,y:this.y,player:this});
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
        act : function () {
            if(this.cartridge > 0){
                this.fire_act = 1;
            }
        },
        run : function(){
            this.play('player1_run');

        },
        idle : function(){
            this.play('player1_idle');
        },
        die : function(){
            this.play("player1_die");
        },
        up: function(){
            this.play("player1_up")
        }
    });
    //玩家2
    var Player2 = T.Entity.extend({
        speed:50,
        rate:1/2,
        weaponCD:5,
        weaponCDing:0,
        reloadCD:60,
        reloadCDing:0,
        cartridge:20,
        maxCartridge:20,
        name:"玩家2",
        maxHp : 200,
        hp:100,
        lv:0,
        exp:0,
        ad:20,
        fire_act:0,
        act_hp:5,
        die_time:30,
        player_score:0,
        init: function(ops){
            this._super(ops);
            this.merge("frameAnim");
        },
        idle: function(){
            this.play("player1_idle");
        },
        fire: function(){
            if(this.cartridge > 0){
                if(this.weaponCDing > 0)return;
                var bullet = new Bullet({x:this.x,y:this.y,player:this});
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
        run: function(){
            this.play("player1_run");
        },
        die : function(){
            this.play("player1_die");
        },
        act : function () {
            if(this.cartridge > 0){
                this.fire_act = 1;
            }
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

            if(T.inputs['ent']){
                this.fire();
                this.act();
            }
            if(this.hp < 0 || this.hp ==0) {
                this.die();
                if(this.die_time-- < 0){
                    //this.x = -100;
                    //this.y = -100;
                    this.parent.remove(this);
                    //gameOver(-2);
                }
            }else if(this.fire_act == 1){
                this.play("player1_fire");
                this.fire_act=0;
            }else if(this.act_hp-- < 0){
                if(T.inputs['up']){
                    this.scale.y = 1;
                    this.accel.y -= 3;
                }
                if(T.inputs['down']){
                    this.scale.y = 1;
                    this.accel.y += 3;
                }
                if(T.inputs['left']){
                    this.scale.x = -1;
                    this.accel.x -= 4;
                }
                if(T.inputs['right']){
                    this.scale.x = 1;
                    this.accel.x += 4;
                }
                if(this.accel.x != 0 || this.accel.y != 0) {
                    this.run();
                } else {
                    this.idle();
                }
                if(this.act_hp < -100){
                    this.act_hp = -1;
                }
            }
            this.x += this.accel.x;
            this.accel.x = 0;
            this.y += this.accel.y;
            this.accel.y = 0;
            this._super(dt);
            //如果碰到Foe1,血量减3
            for(var i = 0 ; i < this.parent.items.length ; i ++){
                if(this.parent.items[i] instanceof Foe1){
                    if(kill(this.x-14,this.y-14,this.x+14,this.y+14,(this.parent.items[i].x-23),(this.parent.items[i].y-16),(this.parent.items[i].x+23),this.parent.items[i].y+16)){

                        if(this.hp > 0){
                            this.hp -= 2;
                        }

                        var bleed1 = new bleed({x:this.x-20,y:this.y-18,player:this});
                        this.parent.add(bleed1);
                    }
                }
            }
            //如果碰到Foe2,血量减5
            for(var i = 0 ; i < this.parent.items.length ; i ++){
                if(this.parent.items[i] instanceof  Foe2){
                    if(kill(this.x-14,this.y-14,this.x+14,this.y+14,(this.parent.items[i].x-33),(this.parent.items[i].y-25),(this.parent.items[i].x+33),this.parent.items[i].y+25)){

                        if(this.hp > 0){
                            this.hp -= 3;
                        }

                        var bleed1 = new bleed({x:this.x-20,y:this.y-18,player:this});
                        this.parent.add(bleed1);
                    }
                }
            }
            if(this.player_score >2&&this.player_score<6){
                this.lv = 1;
                this.maxCartridge = 40;
            }
            if(this.player_score >6&&this.player_score<12){
                this.lv = 2;
                if(this.maxHp != -1){
                    this.hp = this.maxHp;
                    this.maxHp = -1;
                }
            }
        }
    });
    //敌人
    var Foe1 = T.Entity.extend({
        w:92,
        h:68,
        center:{x:46,y:34},
        hp:100,
        speed:20,
        rate:1/5,
        att_time:0,

        init: function(ops){
            this._super(ops);
            if(ops && ops.player1&&ops.player2) {
                this.player1 = ops.player1;
                this.player2 = ops.player2;
            }
            this.merge("frameAnim");
        },
        setPlayer: function(player1,player2){
            this.player1 = player1;
            this.player2 = player2;
        },
        attack: function(){
            this.play("foe1_attack");

        },
        update: function(dt){
            if(kill(this.player1.x-14,this.player1.y-14,this.player1.x+14,this.player1.y+14,this.x-23,this.y-16,this.x+23,this.y+16)&&this.att_time-- < 0&&this.player1.hp > 0){
                this.att_time = 60;
                this.attack();
            }else if(kill(this.player2.x-14,this.player2.y-14,this.player2.x+14,this.player2.y+14,this.x-23,this.y-16,this.x+23,this.y+16)&&this.att_time-- < 0&&this.player2.hp > 0){
                this.attack();
                this.att_time = 50;
            }else if(this.att_time-- < 0){

                this.play("foe1_run",0,rate = 5/this.speed);
                //this.play("foe1_run");
                this.x += this.speed * dt;
            }
            if(this.x > 1280){
                this.x = -100;
                this.speed = Math.floor(Math.random()*60)+40;
                this.rate = 2/this.speed;
            }
            this._super(dt);

        }
    });
    //敌人2
    var Foe2 = T.Entity.extend({
        w:92,
        h:68,
        hp:100,
        center:{x:46,y:34},
        speed:20,
        rate:1/5,
        att_time:0,
        init: function(ops){
            this._super(ops);
            if(ops && ops.player1&&ops.player2) {
                this.player1 = ops.player1;
                this.player2 = ops.player2;
            }
            this.merge("frameAnim");
        },
        setPlayer: function(player1,player2){
            this.player1 = player1;
            this.player2 = player2;
        },
        attack: function(){
            this.play("foe2_attack");
        },
        update: function(dt){
            if(kill(this.player1.x-14,this.player1.y-14,this.player1.x+14,this.player1.y+14,this.x-33,this.y-25,this.x+33,this.y+25) && this.att_time-- < 0 && this.player1.hp > 0){
                this.att_time = 50;
                this.attack();
            }else if(kill(this.player2.x-14,this.player2.y-14,this.player2.x+14,this.player2.y+14,this.x-33,this.y-25,this.x+33,this.y+25) && this.att_time-- < 0 && this.player2.hp > 0){
                this.attack();
                this.att_time = 50;
            }else if(this.att_time-- < 0){
                this.play("foe2_run",0,rate = 5/this.speed);
                this.x += this.speed * dt;
            }
            if(this.x > 1280){
                this.x = -100;
                this.speed = Math.floor(Math.random()*60)+40;
                this.rate = 2/this.speed;
            }
            this._super(dt);

        }
    });
    //子弹
    var Bullet = T.Entity.extend({
        w:8,
        h:4,
        center:{x:4,y:2},
        speed:5,
        asset:"wsj_bullet.png",
        hp:60,
        init: function(ops){
            this._super(ops);
            if(ops && ops.player) {
                this.player = ops.player;
            }
        },
        setPlayer: function(player){
            this.player = player;
        },
        update: function(dt){
            this.x += this.speed;
            for(var i = 0;i < this.parent.items.length; i++){
                if (this.parent.items[i] instanceof Foe1 ){
                    if(kill((this.x-4),(this.y-2),(this.x+4),(this.y+2),(this.parent.items[i].x-23),(this.parent.items[i].y-16),(this.parent.items[i].x+23),this.parent.items[i].y+20)){
                        this.parent.remove(this);
                        this.parent.items[i].hp -= this.player.ad;
                        if(this.parent.items[i].hp <= 0){
                            this.parent.remove(this.parent.items[i]);
                            this.player.player_score++;
                        }
                    }
                }
            }
            for(var i = 0;i < this.parent.items.length; i++){
                if (this.parent.items[i] instanceof  Foe2){
                    if(kill((this.x-4),(this.y-2),(this.x+4),(this.y+2),(this.parent.items[i].x-33),(this.parent.items[i].y-25),(this.parent.items[i].x+33),this.parent.items[i].y+33)){
                        this.parent.remove(this);
                        this.parent.items[i].hp -= this.player.ad;
                        if(this.parent.items[i].hp <= 0){
                            this.parent.remove(this.parent.items[i]);
                            this.player.player_score++;
                        }
                    }
                }
            }
            if(this.hp-- < 0){
                if(this.parent){
                    this.parent.remove(this);
                }
            }
            this._super(dt);
        }
    });
    //子弹的显示
    var Bullet_View = T.Entity.extend({
        x:30,
        y:10,
        z:100,
        play_text:"玩家1的子弹：",
        init:function(ops){
            this.cartridge = new T.CText();
            this.cartridge.color = '#fa0';
            this.cartridge.setSize(26);
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
            this.cartridge.setText(this.play_text+this.player.cartridge);
            this._super(dt);
        }
    });
    //分数的显示
    var Score_View = T.Entity.extend({
        x:30,
        y:70,
        z:100,
        score_text:"玩家1的分数为：",
        init: function(ops){
            this.scoreview = new T.CText();
            this.scoreview.color = '#fa0';
            this.scoreview.setSize(26);

            if(ops && ops.player) {
                this.player = ops.player;
            }
            this.on("added", function () {
                if(this.parent){
                    this.parent.add(this.scoreview);
                }
            });
        },
        setPlayer: function(player){
            this.player = player;
        },
        update: function(dt) {
            this.scoreview.x = this.x ;
            this.scoreview.y = this.y ;
            this.scoreview.setText(this.score_text+this.player.player_score);
            if(this.player.player_score > 15){

                this.parent.add(bg_Over());
                this.parent.pause();
                this.player.player_score = 0;
                console.log("判定一次结束");
                window.setTimeout(function(){
                    T.stageScene("level3");
                },2000);
            }
            this._super(dt);
        }
    });
    //名字的显示
    var Name_View = T.Entity.extend({
        init: function(ops){
            this.nameview = new T.CText();
            this.nameview.color = '#fa0';
            this.nameview.setSize(15);
            if(ops && ops.player) {
                this.player = ops.player;
            }
            this.on("added", function () {
                if(this.parent){
                    this.parent.add(this.nameview);
                }
            })
        },
        setPlayer: function(player){
            this.player = player;
        },
        update: function(dt) {
            if(this.player.hp > 0){
                this.nameview.x= this.player.x - 30;
                this.nameview.y= this.player.y - 45;
                this.nameview.setText("LV"+this.player.lv+" "+this.player.name);
            }else{
                this.parent.remove(this.nameview);
                this.parent.remove(this);
            }
            //this.nameview.x= this.player.x - 30;
            //this.nameview.y= this.player.y - 45;
            //this.nameview.setText("LV"+this.player.lv+" "+this.player.name);
            this._super(dt);
        }


    });
    //玩家血量的显示
    var Hp_View1 = T.Entity.extend({
        init: function(ops){
            this.hpview = new T.CText();
            this.hpview.color = '#11264F';
            this.hpview.setSize(15);
            if(ops && ops.player && ops.player0) {
                this.player = ops.player;
                this.player0 = ops.player0;
            }
            this.on("added", function () {
                if(this.parent){
                    this.parent.add(this.hpview);
                }
            })
        },
        setPlayer: function(player,player0){
            this.player = player;
            this.player0 = player0;
        },
        update: function(dt) {
            if(this.player.hp > 0){
                this.hpview.x= this.player.x - 20;
                this.hpview.y= this.player.y - 25;
                this.hpview.setText("HP"+parseInt(this.player.hp));
            }else{
                this.parent.remove(this.hpview);
                this.parent.remove(this);
            }
            if(this.player.hp <= 0 && this.player0.hp <= 0 ){
                gameOver(-2);
            }
            //this.hpview.x= this.player.x - 20;
            //this.hpview.y= this.player.y - 25;
            //this.hpview.setText("HP"+parseInt(this.player.hp));
            this._super(dt);

        }
    });
    //敌人血量的显示
    var Hp_View2 = T.Entity.extend({
        init: function(ops){
            this.hpview = new T.CText();
            this.hpview.color = '#FF0000';
            this.hpview.setSize(15);
            if(ops && ops.foe){
                this.foe = ops.foe;
            }
            this.on("added", function () {
                if(this.parent){
                    this.parent.add(this.hpview);
                }
            })
        },
        setFoe: function(foe){
            this.foe = foe;
        },
        update: function(dt) {
            if(this.foe.hp > 0){
                this.hpview.x= this.foe.x - 20;
                this.hpview.y= this.foe.y - 40;
                this.hpview.setText("HP"+parseInt(this.foe.hp));
            }else{
                this.parent.remove(this.hpview);
            }

            this._super(dt);
        }

    });

    //结束场景
    T.scene("level0",new T.Scene(function(stage){
        stage.merge("interactive");
        var bg = new T.Sprite({
            asset:"wsj_bg_over.jpg",
            w:1280,
            h:720
        });
        stage.add(bg);
    },{sort:true}));
    T.scene("level2",new T.Scene(function(stage){
        stage.merge("interactive");
        var bg = new T.Sprite({
            asset:"wsj_bg_over1.jpg",
            w:1280,
            h:720
        });
        stage.add(bg);
    },{sort:true}));
    //游戏场景
    T.scene("level1",new T.Scene(function(stage){
        score = 0;
        stage.merge("interactive");
        var bg = new T.Sprite({
            asset:"wsj_bg.jpg",
            w:1280,
            h:720,
            z:0
        });
        stage.add(bg);

        var player1 = new Player({
            x:500,
            y:300,
            z:300,
            w:72,
            h:66,
            player_score :0,
            center:{x:36,y:33}
        });
        player1.setAnimSheet("player1","wsj_player1");
        stage.add(player1);

        var player2 = new Player2({
            x:500,
            y:200,
            z:300,
            w:72,
            h:66,
            player_score :0,
            center:{x:36,y:33}
        });
        player2.setAnimSheet("player1","wsj_player1"),
            stage.add(player2);


        var foe = Array(15);
        for(var i = 0; i < foe.length; i++){
            var y = Math.floor(Math.random()*520+90);
            foe[i] = new Foe1({
                x: Math.floor(Math.random() * 800) - 800,
                y: y,
                z: y,
                player1 : player1,
                player2 : player2
            });
            foe[i].speed = Math.floor(Math.random() * 10) + 20;
            foe[i].rate = 5/foe[i].speed;
            foe[i].setAnimSheet('foe1','wsj_foe1');
            stage.add(foe[i]);
        }
        var hp = Array(15);
        for(var i = 0; i < foe.length; i++){
            hp[i] = new Hp_View2({foe : foe[i]});
            stage.add(hp[i]);
        }

        var foe2 = Array(15);
        for(var i = 0; i < foe.length; i++){
            var y = Math.floor(Math.random()*520+90);
            foe2[i] = new Foe2({
                x: Math.floor(Math.random() * 800) - 800,
                y: y,
                z: y,
                player1 : player1,
                player2 : player2
            });
            foe2[i].speed = Math.floor(Math.random()*10)+20;
            foe2[i].rate = 5/foe[i].speed;
            foe2[i].setAnimSheet('foe2','wsj_foe2');
            stage.add(foe2[i]);
        }
        var bulletView1 = new Bullet_View({player : player1});
        stage.add(bulletView1);

        var hp2 = Array(15);
        for(var i = 0; i < foe2.length; i++){
            hp2[i] = new Hp_View2({foe : foe2[i]});
            stage.add(hp2[i]);
        }

        var bulletView2 = new Bullet_View({player : player2});
        bulletView2.playtext = "玩家2的子弹：";
        bulletView2.y = 40;
        stage.add(bulletView2);

        var score_view1 = new Score_View({player:player1});
        stage.add(score_view1);

        var score_view2 = new Score_View({player:player2});
        score_view2.y = 100;
        score_view2.score_text = "玩家2的分数为：";
        stage.add(score_view2);

        var name_view1 = new Name_View({player:player1});
        stage.add(name_view1);

        var name_view2 = new Name_View({player:player2});
        stage.add(name_view2);

        var hp_view1 = new Hp_View1({player:player1,player0:player2});
        stage.add(hp_view1);

        var hp_view2 = new Hp_View1({player:player2,player0:player1});
        stage.add(hp_view2);



    },{sort:true}));
    //游戏场景
    T.scene("level3",new T.Scene(function(stage){
        score = 0;
        stage.merge("interactive");
        var bg = new T.Sprite({
            asset:"bg1.jpg",
            w:1280,
            h:720,
            z:0
        });
        stage.add(bg);

        var player1 = new Player({
            x:500,
            y:300,
            z:300,
            w:72,
            h:66,
            player_score :0,
            center:{x:36,y:33}
        });
        player1.setAnimSheet("player1","wsj_player1");
        stage.add(player1);

        var player2 = new Player2({
            x:500,
            y:200,
            z:300,
            w:72,
            h:66,
            player_score :0,
            center:{x:36,y:33}
        });
        player2.setAnimSheet("player1","wsj_player1"),
            stage.add(player2);


        var foe = Array(15);
        for(var i = 0; i < foe.length; i++){
            var y = Math.floor(Math.random()*520+90);
            foe[i] = new Foe1({
                x: Math.floor(Math.random() * 400) - 500,
                y: y,
                z: y,
                player1 : player1,
                player2 : player2
            });
            foe[i].speed = Math.floor(Math.random()*60)+20;
            foe[i].rate = 5/foe[i].speed;
            foe[i].setAnimSheet('foe1','wsj_foe1');
            stage.add(foe[i]);
        }

        var foe2 = Array(15);
        for(var i = 0; i < foe.length; i++){
            var y = Math.floor(Math.random()*520+90);
            foe[i] = new Foe2({
                x: Math.floor(Math.random() * 400) - 500,
                y: y,
                z: y,
                player1 : player1,
                player2 : player2
            });
            foe[i].speed = Math.floor(Math.random()*10)+20;
            foe[i].rate = 5/foe[i].speed;
            foe[i].setAnimSheet('foe2','wsj_foe2');
            stage.add(foe[i]);
        }
        var bulletView1 = new Bullet_View({player : player1});
        stage.add(bulletView1);

        var bulletView2 = new Bullet_View({player : player2});
        bulletView2.playtext = "玩家2的子弹：";
        bulletView2.y = 40;
        stage.add(bulletView2);

        var score_view1 = new Score_View({player:player1});
        stage.add(score_view1);

        var score_view2 = new Score_View({player:player2});
        score_view2.y = 100;
        score_view2.score_text = "玩家2的分数为：";
        stage.add(score_view2);

        var name_view1 = new Name_View({player:player1});
        stage.add(name_view1);

        var name_view2 = new Name_View({player:player2});
        stage.add(name_view2);

        var hp_view1 = new Hp_View1({player:player1,player0:player2});
        stage.add(hp_view1);

        var hp_view2 = new Hp_View1({player:player2,player0:player1});
        stage.add(hp_view2);


    },{sort:true}));
    //加载资源
    T.load(["wsj_bg.jpg","wsj_bg_over.jpg","wsj_player1.png","wsj_bullet.png","wsj_foe1.png","wsj_foe2.png","wsj_bg_over1.jpg","p0.png","wsj_complete.png","bg1.jpg","wsj_bleed.png",
            "wsj_player1.json","wsj_foe1.json","wsj_foe2.json"],
        function(){
            T.compileSheets("wsj_player1.png","wsj_player1.json");
            T.compileSheets("wsj_foe1.png","wsj_foe1.json");
            T.compileSheets("wsj_foe2.png","wsj_foe2.json");
            T.sheet("sheet_p0","p0.png",{tw:16,th:16});
            _.each([
                ["wsj_player1",{
                    player1_idle:{frames:[0],rate:1},
                    player1_run: {frames: _.range(0,7),rate:1/10},
                    player1_fire:{frames: _.range(8,15),rate:1/30},
                    player1_up :{frames: _.range(16,23),rate:1/10},
                    player1_die:{frames: _.range(24,34),rate:1/5},
                    player1_cartridge:{frames: _.range(35,48),rate:1/5}
                }],
                ["wsj_foe1",{
                    foe1_run: {frames: _.range(0,8),rate: 1/5},
                    foe1_attack:{frames: _.range(9,14),rate: 1/8,next:"foe1_idle"},
                    foe1_idle:{frames:[8],rate:1}
                }],
                ["wsj_foe2",{
                    foe2_run: {frames: _.range(0,19),rate: 1/5},
                    foe2_attack: {frames: _.range(20,29),rate: 1/8,next:"foe2_idle"},
                    foe2_idle: {frames:[0],rate: 1}
                }]
            ],function(anim){
                T.fas(anim[0],anim[1]);
            },300);
            T.input.on('z',function(){
                stage.pause();
            });
            T.input.on('r',function(){
                T.stageScene("level1");
            });
            window.setTimeout(function(){
                T.stageScene("level1");
            },300);
        });
};