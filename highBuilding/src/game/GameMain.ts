// TypeScript file
class GameMain extends egret.DisplayObjectContainer {

    private factor: number = 50;
    private display: egret.DisplayObject;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.init, this);
    }

    private init() {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.init, this);
        this.init2();
    }


    private init2() {
        //创建world
        var world: p2.World = new p2.World();
        world.sleepMode = p2.World.BODY_SLEEPING;

        //创建plane
        var planeShape: p2.Plane = new p2.Plane();
        var planeBody: p2.Body = new p2.Body();
        planeBody.addShape(planeShape);
        planeBody.displays = [];
        world.addBody(planeBody);

        egret.Ticker.getInstance().register(function (dt) {
            if (dt < 10) {
                return;
            }
            if (dt > 1000) {
                return;
            }
            world.step(dt / 1000);

            var stageHeight: number = egret.MainContext.instance.stage.stageHeight;
            var l = world.bodies.length;
            for (var i: number = 0; i < l; i++) {
                var boxBody: p2.Body = world.bodies[i];
                if (boxBody.displays[0]) {
                    var box: egret.DisplayObject = boxBody.displays[0];
                    if (box) {
                        box.x = boxBody.position[0] * self.factor;
                        box.y = stageHeight - boxBody.position[1] * self.factor;
                        box.rotation = 360 - (boxBody.angle + boxBody.shapes[0].angle) * 180 / Math.PI;
                        if (boxBody.sleepState == p2.Body.SLEEPING) {
                            box.alpha = 0.5;
                        }
                        else {
                            box.alpha = 1;
                        }
                    }
                }
            }
        }, this);

        //鼠标点击添加刚体
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, stopTween, this);
        var self = this;
        var display: egret.DisplayObject;

        addBlock();
        self.drawLine();

        function stopTween() {
            egret.Tween.removeTweens(display);
            egret.Tween.removeTweens(self);
            //添加方形刚体
            var positionX: number = display.x / self.factor;
            var positionY: number = (egret.MainContext.instance.stage.stageHeight - display.y) / self.factor;

            var boxShape: p2.Shape = new p2.Box({ width: 1, height: 1 });
            var boxBody: p2.Body = new p2.Body({ mass: 1, position: [positionX, positionY], angularVelocity: 0 });
            boxBody.addShape(boxShape);
            world.addBody(boxBody);

            //物理系中的旋转用的弧度
            boxBody.angle = 2 * Math.PI - (display.rotation / 180) * Math.PI;
            console.log("角度===" + display.rotation + "弧度===" + boxBody.angle);
            boxBody.displays = [display];
        }

        function addBlock() {
            display = self.createBitmapByName("rect_png");

            display.width = self.factor;
            display.height = self.factor;
            display.anchorOffsetX = display.width / 2;
            display.anchorOffsetY = display.height / 2;
            display.x = 100;
            display.y = 100;
            display.rotation = -45;
            self.display = display;

            self.addChild(display);

            rightRo();

        }

        function leftRo() {
            egret.Tween.get(display, { loop: false }).to({ rotation: 90 + 45 }, 2000, egret.Ease.sineIn).call(() => {
                egret.Tween.removeTweens(display);
                // rightRo();
            });
        }

        function rightRo() {
            egret.Tween.get(display, { loop: false }).to({ rotation: -45 - 90 }, 2000, egret.Ease.sineIn).call(() => {
                egret.Tween.removeTweens(display);
                // leftRo();
            });

            egret.Tween.get(self).to({ fact: 1 }, 2000).call(() => {

            });

        }


        // function addOneBox(event: egret.TouchEvent): void {
        //     var display: egret.DisplayObject;

        //     display = self.createBitmapByName("rect_png");
        //     display.width = factor;
        //     display.height = factor;
        //     display.anchorOffsetX = display.width / 2;
        //     display.anchorOffsetY = display.height / 2;
        //     display.x = event.stageX;
        //     display.y = event.stageY;

        //     self.addChild(display);

        // self.addEventListener(egret.Event.ENTER_FRAME, () => {
        //     if (ralaote)
        //         display.rotation += 1;
        // }, self);

        // egret.Tween.get(display, { loop: true }).to({ rotation: 40 }, 1000, egret.Ease.sineIn).call(() => {
        //添加方形刚体
        // var positionX: number = display.x / factor;
        // var positionY: number = (egret.MainContext.instance.stage.stageHeight - display.y) / factor;

        // var boxShape: p2.Shape = new p2.Box({ width: 1, height: 1 });
        // var boxBody: p2.Body = new p2.Body({ mass: 1, position: [positionX, positionY], angularVelocity: 0 });
        // boxBody.addShape(boxShape);
        // world.addBody(boxBody);
        // //物理系中的旋转用的弧度
        // boxBody.angle = (40 / 180) * Math.PI;
        // boxBody.displays = [display];
        // });
        // }
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    private createBitmapByName(name: string): egret.Bitmap {
        var result: egret.Bitmap = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    public get fact(): number {
        return 0;
    }

    public set fact(value: number) {
        this.display.x = (1 - value) * (1 - value) * 100 + 2 * value * (1 - value) * 200 + value * value * 300;
        this.display.y = (1 - value) * (1 - value) * 100 + 2 * value * (1 - value) * 200 + value * value * 100;

        this.shape.graphics.clear();
        this.shape.graphics.lineStyle(2, 0x444446);
        this.shape.graphics.moveTo(200, 0);
        this.shape.graphics.lineTo(this.display.x, this.display.y);
    }

    /**
     * 画绳子
     */
    private drawLine(): egret.Shape {
        this.shape = new egret.Shape();
        // shape.graphics.beginFill(0xff0000);
        this.shape.graphics.lineStyle(2, 0x444446);
        this.shape.graphics.moveTo(200, 0);
        this.shape.graphics.lineTo(100 + this.display.width / 2, 100 - this.display.height / 2);
        // shape.graphics.endFill();
        this.addChild(this.shape);
        return this.shape;

    }

    private shape: egret.Shape;
}