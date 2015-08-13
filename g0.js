/**
 * Created by Administrator on 2015/8/9 0009.
 */

var pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 2 ;

var in_screen = {w:window.innerWidth,h:window.innerHeight};
var out_screen = {w:1280,h:720};

var sc_x = in_screen.w/out_screen.w;
var sc_y = in_screen.h/out_screen.h;

var score = 0;

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
        if(score >15){
            T.stageScene("level0");
        }
        if(score == -2){
            T.stageScene("level2");
        }
    };
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
        exp:0,
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
            if(this.accel.x != 0 || this.accel.y != 0) {
                this.run();
            } else {
                this.idle();
            }
            this.x += this.accel.x;
            this.accel.x = 0;
            this.y += this.accel.y;
            this.accel.y = 0;
            this._super(dt);
            //如果碰到Foe1,血量减3
            for(var i = 0 ; i < this.parent.items.length ; i ++){
                if(this.parent.items[i] instanceof Foe1){
                    if(kill(this.x-14,this.y-55,this.x+14,this.y-17,(this.parent.items[i].x-23),(this.parent.items[i].y-51),(this.parent.items[i].x+23),this.parent.items[i].y-17)){
                        this.hp -= 3;
                    }
                }
            }
            //如果碰到Foe2,血量减5
            for(var i = 0 ; i < this.parent.items.length ; i ++){
                if( this.parent.items[i] instanceof  Foe2){
                    if(kill(this.x-14,this.y-55,this.x+14,this.y-17,(this.parent.items[i].x-33),(this.parent.items[i].y-60),(this.parent.items[i].x+33),this.parent.items[i].y-18)){
                        this.hp -= 5;
                    }
                }
            }
            if(this.hp <= 0){
                gameOver(-2);
            }
            if(score >2&&score<6){
                this.lv = 1;
                this.maxCartridge = 40;
            }
            if(score >6&&score<12){
                this.lv = 2;
                if(this.maxHp != -1){
                    this.hp = this.maxHp;
                    this.maxHp = -1;
                }
            }

        },
        fire : function(){
            //this.play('fire');
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
            this.play('player1_run');
        },
        idle : function(){
            this.play('player1_idle');
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
        run: function(){
            this.play("player1_run");
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
            if(T.inputs['ent']){
                this.fire();
            }
            if(this.accel.x != 0 || this.accel.y != 0) {
                this.run();
            } else {
                this.idle();
            }
            this.x += this.accel.x;
            this.accel.x = 0;
            this.y += this.accel.y;
            this.accel.y = 0;
            this._super(dt);
            //如果碰到Foe1,血量减3
            for(var i = 0 ; i < this.parent.items.length ; i ++){
                if(this.parent.items[i] instanceof Foe1){
                    if(kill(this.x-14,this.y-55,this.x+14,this.y-17,(this.parent.items[i].x-23),(this.parent.items[i].y-51),(this.parent.items[i].x+23),this.parent.items[i].y-17)){
                        this.hp -= 3;
                    }
                }
            }
            //如果碰到Foe2,血量减5
            for(var i = 0 ; i < this.parent.items.length ; i ++){
                if(this.parent.items[i] instanceof  Foe2){
                    if(kill(this.x-14,this.y-55,this.x+14,this.y-17,(this.parent.items[i].x-33),(this.parent.items[i].y-60),(this.parent.items[i].x+33),this.parent.items[i].y-18)){
                        this.hp -= 5;
                    }
                }
            }
            if(this.hp <= 0){
                gameOver(-2);
            }
            if(score >2&&score<6){
                this.lv = 1;
                this.maxCartridge = 40;
            }
            if(score >6&&score<12){
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
        center:{x:46,y:64},
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
                this.rate = 2/this.speed;
            }
            this.play("foe1_run",1,this.rate,{loop:true});
            this.x += this.speed * dt;
            this._super(dt);
        }
    });
    //敌人2
    var Foe2 = T.Entity.extend({
        w:92,
        h:68,
        center:{x:46,y:64},
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
                this.rate = 2/this.speed;
            }
            this.play("foe2_run",1,this.rate,{loop:true});
            this.x += this.speed * dt;
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
        update: function(dt){
            this.x += this.speed;
            for(var i = 0;i < this.parent.items.length; i++){
                if (this.parent.items[i] instanceof Foe1 || this.parent.items[i] instanceof  Foe2){
                    if(kill((this.x-3),(this.y-1),(this.x+3),(this.y+1),(this.parent.items[i].x-46),(this.parent.items[i].y-44),(this.parent.items[i].x+46),this.parent.items[i].y)){
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
    //子弹的显示
    var Bullet_View = T.Entity.extend({
        x:30,
        y:10,
        playtext:"玩家1的子弹：",
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
            this.cartridge.setText(this.playtext+this.player.cartridge);
        }
    });
    //分数的显示
    var Score_View = T.Entity.extend({
        x:30,
        y:70,
        init: function(ops){
            this.scoreview = new T.CText();
            this.scoreview.color = '#fa0';
            this.scoreview.setSize(26);
            this.on("added", function () {
                if(this.parent){
                    this.parent.add(this.scoreview);
                }
            })
        },
        update: function(dt) {
            this.scoreview.x = this.x ;
            this.scoreview.y = this.y ;
            this.scoreview.setText("当前的分数为："+score);
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
            this.nameview.x= this.player.x - 30;
            this.nameview.y= this.player.y - 80;
            this.nameview.setText("LV"+this.player.lv+" "+this.player.name);
        }

    });
    //血量的显示
    var Hp_View = T.Entity.extend({
        init: function(ops){
            this.nameview = new T.CText();
            this.nameview.color = '#FF0000';
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
            this.nameview.x= this.player.x - 20;
            this.nameview.y= this.player.y - 60;
            this.nameview.setText("HP"+parseInt(this.player.hp));
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
            h:720
        });
        stage.add(bg);

        var player1 = new Player({
            x:500,
            y:300,
            z:300,
            w:72,
            h:66,
            center:{x:36,y:62}
        });
        player1.setAnimSheet("player1","wsj_player1");
        stage.add(player1);

        var player2 = new Player2({
            x:500,
            y:200,
            z:300,
            w:72,
            h:66,
            center:{x:36,y:62}
        });
        player2.setAnimSheet("player1","wsj_player1"),
            stage.add(player2);


        var foe = Array(15);
        for(var i = 0; i < foe.length; i++){
            var y = Math.floor(Math.random()*520+90);
            foe[i] = new Foe1({
                x: Math.floor(Math.random() * 400) - 500,
                y: y,
                z: y
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
                z: y
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

        var score_view = new Score_View();
        stage.add(score_view);

        var name_view1 = new Name_View({player:player1});
        stage.add(name_view1);

        var name_view2 = new Name_View({player:player2});
        stage.add(name_view2);

        var hp_view1 = new Hp_View({player:player1});
        stage.add(hp_view1);

        var hp_view2 = new Hp_View({player:player2});
        stage.add(hp_view2);
    },{sort:true}));
    //加载资源
    T.load(["wsj_bg.jpg","wsj_bg_over.jpg","wsj_player1.png","wsj_bullet.png","wsj_foe1.png","wsj_foe2.png","wsj_bg_over1.jpg",
            "wsj_player1.json","wsj_foe1.json","wsj_foe2.json"],
        function(){
            T.compileSheets("wsj_player1.png","wsj_player1.json");
            T.compileSheets("wsj_foe1.png","wsj_foe1.json");
            T.compileSheets("wsj_foe2.png","wsj_foe2.json");
            _.each([
                ["wsj_player1",{
                    player1_idle:{frames:[0],rate:1},
                    player1_run:{frames: _.range(0,6),rate:1/10}
                }],
                ["wsj_foe1",{
                    foe1_run: {frames: _.range(0,8),rate: 1/5}
                }],
                ["wsj_foe2",{
                    foe2_run: {frames: _.range(0,20),rate: 1/5}
                }]
            ],function(anim){
                T.fas(anim[0],anim[1]);
            },300);

            T.input.on('r',function(){
                T.stageScene("level1");
            });
            window.setTimeout(function(){
                T.stageScene("level1");
            },300);
        });
};