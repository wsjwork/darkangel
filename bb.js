
var main = function() {
  var T = Tina({imagePath:"img/",
                dataPath:"data/"})
        .requires("Sprites")
        .setup("canvas",{width:600,height:400,
                         pixelRatio: 1
                        });
  
  T.load(['t0.jpg', "buterfly.png","buterfly.json"],
         function() {
           T.compileSheets("buterfly.png","buterfly.json");
           // T.animations("buterfly",{
           //  swing:{frames:_.range(0,3),rate:1/19}
           // });

           var img0 = new T.Sprite({asset:"t0.jpg",x:100,y:0, scale:{x:0.3,y:0.3}});
           var buterfly = new T.Sprite({sheet:"buterfly",sprite:"buterfly",x:179,y:67,z:1000,
                                        w:130,h:160});

           // buterfly.merge("animation");
           // buterfly.play("swing",1,1/5,{loop:true});
           T.gameLoop(function(dt){
             T.clear();
             img0.render();
             buterfly.render();
           });

         });
};

