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
        .requires("Input,Sprites,Scenes,Text,Entities")
        .setup("canvas",{width:info_screen0.w,height:info_screen0.h,
            pixelRatio: pixelRatio,
            scale:{x:sc_x,y:sc_y}
        })
        .controls();


    var kill = function(pl_x,pl_y,pl_xx,pl_yy,foe_x,foe_y,foe_xx,foe_yy){

        var result = false;
        if(pl_y>foe_y&&pl_y<foe_yy||pl_yy>foe_y&&pl_yy<foe_yy){
            //console.log("y合格");
            if(pl_x>foe_x&&pl_x<foe_xx||pl_xx>foe_x&&pl_xx<foe_xx)
            {
                //console.log("x合格");
                result = true;
            }
        }
        //console.log("调用了方法："+"结果为："+result);
        return result;
    };

    var Player = T.Entity.extend({
        speed: 50,
        weaponCD: 5,
        weaponCDing: 0,
        reloadCD: 60,
        reloadCDing: 0,
        maxCartridge:20,
        cartridge:20,
        score:0,
        init: function(ops) {
            this._super(ops);
            this.merge("frameAnim");
        },
        update: function(dt) {

            // CD
            if(this.weaponCDing > 0)
                this.weaponCDing--;
            if(this.reloadCDing > 0) {
                if(--this.reloadCDing < 1)
                    this.cartridge = this.maxCartridge;
            }
            // input
            if(T.inputs['c']) {
                this.fire();
            }
            if(T.input['space']) {
                this.jump();
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
        },
        idle: function() {
            this.play("idle");
        },
        run: function() {
            this.play("run");
        },
        fire: function() {
            if(this.cartridge > 0) {
                if(this.weaponCDing > 0) return;
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
        jump: function(){
            this.play("jump");
        }
    });

    var Zombie = T.Entity.extend({
        x: 600,
        y: 300,
        z: 300,
        w: 24,
        h: 24,
        center:{x:10,y:24},

        init: function(ops) {
            this._super(ops);
            this.merge("frameAnim");
            this.setAnimSheet('sheet_zombie0','zombie0');
        },
        walk: function() {
            this.play("walk",1,1/3,{loop:true});
        }

    });

    var Bullet = T.Entity.extend({
        w:6,h:2,
        center:{x:3,y:1},
        speed:4,
        asset:"bullet.png",
        hp:60,

        update: function(ops) {
            this.x += this.speed;
            console.log("x="+this.x+"y="+this.y);
            //得到所有的元素
            for (var i = 0 ;i< this.parent.items.length ; i++){
                var item = this.parent.items[i];
                //如果为敌人，就获取敌人的坐标
                if(item instanceof testrole||item instanceof testrole1||item instanceof Character){
                    console.log("xx="+this.parent.items[i].x+"yy="+this.parent.items[i].y);
                    var item_x = parseInt(this.parent.items[i].x);
                    var item_y = parseInt(this.parent.items[i].y);
                    //console.log("xx="+item_x+"yy="+item_y+"测试"+(item_y-30));
                    //进行击杀判定
                    if(kill((this.x-3),(this.y-1),(this.x+3),(this.y+1),(item_x-23),(item_y-44),(item_x+23),item_y)){
                        //console.log("移除");
                        //判定成功就立即移除目标
                        this.parent.remove(this.parent.items[i]);
                        //判定成功就立即移除该子弹
                        this.parent.remove(this);
                    }
                }

            }
            if (this.hp--< 0) {
                if (this.parent) {
                    this.parent.remove(this);
                }
            }
        }

    });

    var HUD = T.Entity.extend({
        x:30,y:10,
        init: function(ops) {
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
        setPlayer: function(player) {
            this.player = player;
        },
        update: function(dt) {
            this.cartridge.x = this.x;
            this.cartridge.y = this.y;
            this.cartridge.setText(this.player.cartridge);
            // this.cartridge._text = this.player.cartridge;

        }
    });

    var Character = T.Entity.extend({
        sheet: "k0",
        sprite: "player0",
        rate: 1/15,
        speed: 50,
        w:48,
        h:48,
        center:{x:24,y:44},

        init: function(ops) {
            this._super(ops);
            this.merge("frameAnim");
        },
        update: function(dt) {

            if(this.x > 1280) {
                this.x = -100;
                this.speed = Math.floor(Math.random()*60)+40;

                this.rate = 4/this.speed;
            }
            this.play("run_right",1,this.rate,{loop:true});
            this.x += this.speed * dt;
            this._super(dt);
        },
        fire: function () {
            this.play("fire",3,1/6);
        }
    });

    var testrole = T.Entity.extend({
        sheet: "test0",
        sprite: "testload",
        rate: 1/11,
        speed: 10,
        w:48,
        h:48,
        center:{x:24,y:48},

        init: function(ops) {
            this._super(ops);
            this.merge("frameAnim");
        },
        update: function(dt) {
            if(this.x > 1280) {
                this.x = -100;
                this.speed = Math.floor(Math.random()*60)+40;

                this.rate = 4/this.speed;
            }
            this.play("run_testright",1,this.rate,{loop:true});
            this.x += this.speed * dt;
            this._super(dt);

        }
    });

    var testrole1 = T.Entity.extend({
        sheet: "test1",
        sprite: "testload1",
        rate: 1/11,
        speed: 10,
        w:48,
        h:48,
        center:{x:24,y:48},

        init: function(ops) {
            this._super(ops);
            this.merge("frameAnim");
        },
        update: function(dt) {
            if(this.x > 1280) {
                this.x = -100;
                this.speed = Math.floor(Math.random()*60)+40;

                this.rate = 4/this.speed;
            }
            this.play("run_testright1",1,this.rate,{loop:true});
            this.x += this.speed * dt;
            this._super(dt);

        }
    });


    T.scene("level0",new T.Scene(function(stage1){
        stage1.merge("interactive");

        var bg = new T.Sprite({asset:"bg1.jpg",
            w:1280,
            h:720
        });
        stage1.add(bg);

        var testp = new Array(10);
        for(var i=0; i<testp.length; ++i){
            var y = Math.floor(Math.random()*520+90);
            testp[i] = new testrole({
                x:Math.floor(Math.random()*500)-500,
                y:y,
                z:y
            });
            testp[i].setAnimSheet('testjson','testload');
            testp[i].speed = Math.floor(Math.random()*40)+20;
            testp[i].rate = 10/testp[i].speed;
            stage1.add(testp[i]);

        }
        var testp1 = new Array(10);
        for(var i=0; i<testp.length; ++i){
            var y = Math.floor(Math.random()*520+90);
            testp1[i] = new testrole1({
                x:Math.floor(Math.random()*500)-500,
                y:y,
                z:y
            });
            testp1[i].setAnimSheet('testjson1','testload1');
            testp1[i].speed = Math.floor(Math.random()*40)+20;
            testp1[i].rate = 10/testp1[i].speed;
            stage1.add(testp1[i]);
        }

        var pp = new Array(10);
        for(var i=0; i<pp.length; ++i) {
            var y = Math.floor(Math.random()*520+90);
            // console.log("Y: "+y);
            pp[i] =  new Character({
                x:Math.floor(Math.random()*500)-500,
                y:y,
                z:y
            });
            pp[i].setAnimSheet('k1','player0');
            pp[i].speed = Math.floor(Math.random()*40)+20;
            pp[i].rate = 4/pp[i].speed;
            stage1.add(pp[i]);
        }

        var player = new Player({
            x: 300,
            y: 300,
            z: 300,
            w: 24,
            h: 24,
            center:{x:10,y:24}
        });

        player.setAnimSheet('sheet_p0','p0');
        stage1.add(player);

        var hud = new HUD({player:player});

        stage1.add(hud);

        var scoreview = new Scoreview({player:player});

        stage1.add(scoreview);

        var z0 = new Zombie();
        z0.scale.x = -1;
        z0.walk();
        stage1.add(z0);


        T.input.on("z",function(e){
            if(!stage.paused)
                stage.pause();
            else
                stage.unpause();
        });



    },{sort:true}));

    T.scene("level1",new T.Scene(function(stage1){
        stage1.merge("interactive");

    }));

    T.load(['k0.png',"k0.json",
            "testimg1.png", "testimg2.png","testimg3.png","test0.json","test1.json",
            "bg0.jpg","bg1.jpg","bg2.jpg","bg3.jpg",
            "p0.png","zombie.png","buterfly.png",
            "bullet.png",],
        function() {
            T.compileSheets("k0.png","k0.json");
            T.compileSheets("buterfly.png","test0.json");
            T.compileSheets("zombie.png","test1.json");
            T.sheet("sheet_p0","p0.png",{tw:16,th:16});
            T.sheet("sheet_zombie0","zombie.png",{tw:16,th:16});

            // T.fas("player0",{
            //   run_right: {frames: _.range(0,13),rate: 1/2},
            //   fire: {frames: _.range(14,24), next: 'sand', rate: 1/10},
            //   stand: {frames: [14], rate: 1/5}
            // });

            _.each(
                [["player0",{
                    run_right: {frames: _.range(0,13),rate: 1/2},
                    fire: {frames: _.range(14,24), next: 'sand', rate: 1/10},
                    stand: {frames: [14], rate: 1/5},
                    jump: {frames: _.range(0,13),rate:1/2}
                }],
                    ["p0",{
                        idle: {frames:[0],rate:1},
                        run:  {frames:_.range(0,6), rate:1/7},
                        jump: {frames:[9], rate:1},
                        fall: {frames:[6,7], rate:1/3 }
                    }],
                    ["zombie0",{
                        walk: {frames:_.range(0,6),rate: 1/7}
                    }],
                    ["testload",{
                        run_testright: {frames: _.range(0,3),rate: 1/3}
                    }],
                    ["testload1",{
                        run_testright1: {frames: _.range(0,8),rate: 1/3}
                    }]
                ],function(anim) {
                    T.fas(anim[0],anim[1]);
                });

            // T.input.on("c",function() {
            //   console.log("c");
            //   T.stageScene("level1");
            // });

            T.input.on("x",function() {
                console.log("x");
                T.stageScene("level0");
            });

            window.setTimeout(function() {
                T.stageScene("level0");
            },300);
        });

};

