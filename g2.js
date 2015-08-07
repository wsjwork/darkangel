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
      if (score > 14){
          T.stageScene("level2");
      }
    };
    //玩家
    var Player = T.Entity.extend({
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
    //怪兽
    var Foe = T.Entity.extend();
    //子弹
    var Bullet = T.Entity.extend({
        w:6,
        h:2,
        center:{x:3,y:1},
        speed:5,
        asset:"bullet.png",
        hp:60,
        update:function(ops){
            this.x += this.speed;
            if(this.hp-- < 0){
                this.parent.remove(this);
            }
        }
    });
    //文本的显示
    var Textview = T.Entity.extend();

    T.scene("level1",new T.Scene(function (stage){
        score = 0;
        //stage.merge("interactive");
        //加入背景
        var bg = new T.Sprite({
            asset:"bg1.jpg",
            w:1280,
            h:720
        });
        stage.add(bg);
        //加入玩家
        var playerone = new Player({
            x:400,
            y:300,
            z:300,
            w:50,
            h:50,
            center:{x:25,y:46}
        });
        playerone.setAnimSheet('sheet_p0','p0');
        stage.add(playerone);

    },{sort:true}));
    T.scene("level2",new T.scene(function (stage){

    }));
    //第一个参数加载资源，第二个参数设置sheet
    T.load(["bg1.jpg", "p11.png","bullet.png"],
        function(){
            T.sheet("sheet_p0","p11.png",{tw:72,th:66});

            _.each(
                [
                    ["p0",{
                        idle:{frames:[0],rate:1},
                        run:{frames: _.range(0,6),rate:1/10}
                    }]

                //这是什么鬼？
                ],function(anim){
                    T.fas(anim[0],anim[1]);
                }
            );
            //加载完之后进入level1界面
            window.setTimeout(function() {
                T.stageScene("level1");
            },300);
        }

    );
};