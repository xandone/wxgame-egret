var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var GameMain = (function (_super) {
    __extends(GameMain, _super);
    function GameMain() {
        var _this = _super.call(this) || this;
        _this.swingx = [];
        _this.swingy = [];
        _this.isSwingRight = true;
        _this.moveSpeed = 5;
        _this.humanArr = [];
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.init, _this);
        return _this;
    }
    GameMain.prototype.init = function () {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.init, this);
        this.createMain();
    };
    GameMain.prototype.createMain = function () {
        this.initMap();
        this.initSelf();
        this.initHuman();
        this.initLifebuoy();
        this.start();
    };
    GameMain.prototype.start = function () {
        this.rightSwing();
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.stopTween, this);
    };
    GameMain.prototype.initMap = function () {
        SceneManager.addScene(SceneManager.instance._gameMap, this);
        SceneManager.instance._gameMap.start();
    };
    GameMain.prototype.initSelf = function () {
        var self = new egret.Bitmap(RES.getRes("self_png"));
        self.x = Constant.stageW / 2 - self.width / 2;
        self.y = Constant.stageH - 280;
        this.hero = self;
        this.addChild(self);
    };
    GameMain.prototype.initHuman = function () {
        var human = new Human();
        human.create("self_png");
        this.addChild(human);
        this.humanArr.push(human);
    };
    GameMain.prototype.initLifebuoy = function () {
        var life = new egret.Bitmap(RES.getRes("lifebuoy_png"));
        this.swingx[0] = this.hero.x - life.width / 2;
        this.swingx[1] = this.hero.x + this.hero.width / 2 - life.width / 2;
        this.swingx[2] = this.hero.x + this.hero.width - life.width / 2;
        this.swingy[0] = this.hero.y + this.hero.height / 2;
        this.swingy[1] = this.hero.y + this.hero.height;
        this.swingy[2] = this.hero.y + this.hero.height / 2;
        life.x = this.swingx[0];
        life.y = this.swingy[0];
        this.lifebuoy = life;
        this.drawLine();
        this.addChild(life);
    };
    GameMain.prototype.drawLine = function () {
        this.lineShape = new egret.Shape();
        this.addChild(this.lineShape);
        return this.lineShape;
    };
    GameMain.prototype.rightSwing = function () {
        var _this = this;
        egret.Tween.get(this).to({ fact: 1 }, 2000).call(function () {
            _this.leftSwing();
        });
    };
    GameMain.prototype.leftSwing = function () {
        var _this = this;
        egret.Tween.get(this).to({ fact2: 1 }, 2000).call(function () {
            _this.rightSwing();
        });
    };
    GameMain.prototype.stopTween = function () {
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.stopTween, this);
        egret.Tween.removeTweens(this);
        var x = Math.abs(this.stillnessX - (this.hero.x + 50));
        var y = this.stillnessY - (this.hero.y + this.hero.height / 2 + 2);
        this.scalePush = y / x;
        this.isSwingRight = this.stillnessX > (this.hero.x + 50);
        this.addEventListener(egret.Event.ENTER_FRAME, this.movingLife, this);
    };
    /**
     * 推救生圈
     */
    GameMain.prototype.movingLife = function () {
        var speedy;
        if (this.scalePush > 1) {
            speedy = this.moveSpeed / this.scalePush;
        }
        else {
            speedy = this.moveSpeed * this.scalePush;
        }
        if (this.isSwingRight) {
            if (this.scalePush > 1) {
                this.lifebuoy.x += speedy;
                this.lifebuoy.y += this.moveSpeed;
            }
            else {
                this.lifebuoy.x += this.moveSpeed;
                this.lifebuoy.y += speedy;
            }
        }
        else {
            if (this.scalePush > 1) {
                this.lifebuoy.x -= speedy;
                this.lifebuoy.y += this.moveSpeed;
            }
            else {
                this.lifebuoy.x -= this.moveSpeed;
                this.lifebuoy.y += speedy;
            }
        }
        this.lineShape.graphics.clear();
        this.lineShape.graphics.lineStyle(1, 0x393B3A);
        this.lineShape.graphics.moveTo(this.hero.x + 50, this.hero.y + this.hero.height / 2 + 2);
        this.lineShape.graphics.lineTo(this.lifebuoy.x + this.lifebuoy.width / 2, this.lifebuoy.y + 20);
        if (SceneManager.rescuedTest(this.lifebuoy, this.humanArr[0])) {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.movingLife, this);
            this.humanArr[0].switchChild();
            this.lifebuoy.visible = false;
            this.lineShape.graphics.clear();
            this.lineShape.graphics.lineStyle(1, 0x393B3A);
            this.lineShape.graphics.moveTo(this.hero.x + 50, this.hero.y + this.hero.height / 2 + 2);
            this.lineShape.graphics.lineTo(this.humanArr[0].x + this.humanArr[0].width / 2, this.humanArr[0].y + 50);
            this.stillnessX = this.humanArr[0].x + this.humanArr[0].width / 2;
            this.stillnessY = this.humanArr[0].y + 50;
            this.startPullHuman();
        }
        //出界
        if (this.lifebuoy.y + this.lifebuoy.height / 2 > Constant.stageH ||
            this.lifebuoy.x + this.lifebuoy.width / 2 < 0 ||
            this.lifebuoy.x + this.lifebuoy.width / 2 > Constant.stageW) {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.movingLife, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.movingLifePull, this);
        }
    };
    GameMain.prototype.movingLifePull = function () {
        var speedy;
        if (this.scalePush > 1) {
            speedy = this.moveSpeed / this.scalePush;
        }
        else {
            speedy = this.moveSpeed * this.scalePush;
        }
        if (this.isSwingRight) {
            if (this.scalePush > 1) {
                this.lifebuoy.x -= speedy;
                this.lifebuoy.y -= this.moveSpeed;
            }
            else {
                this.lifebuoy.x -= this.moveSpeed;
                this.lifebuoy.y -= speedy;
            }
        }
        else {
            if (this.scalePush > 1) {
                this.lifebuoy.x += speedy;
                this.lifebuoy.y -= this.moveSpeed;
            }
            else {
                this.lifebuoy.x += this.moveSpeed;
                this.lifebuoy.y -= speedy;
            }
        }
        this.lineShape.graphics.clear();
        this.lineShape.graphics.lineStyle(1, 0x393B3A);
        this.lineShape.graphics.moveTo(this.hero.x + 50, this.hero.y + this.hero.height / 2 + 2);
        this.lineShape.graphics.lineTo(this.lifebuoy.x + this.lifebuoy.width / 2, this.lifebuoy.y + 20);
        if (this.lifebuoy.y <= this.hero.y + this.hero.height / 2) {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.movingLifePull, this);
            this.lifebuoy.x = this.swingx[0];
            this.lifebuoy.y = this.swingy[0];
            this.start();
        }
    };
    GameMain.prototype.startPullHuman = function () {
        this.pullMan = this.humanArr[0];
        this.addEventListener(egret.Event.ENTER_FRAME, this.pullHuman, this);
        var x = Math.abs(this.stillnessX - (this.hero.x + 50));
        var y = this.stillnessY - (this.hero.y + this.hero.height / 2 + 2);
        this.pullHumanScale = y / x;
        this.isSwingRight = this.stillnessX > (this.hero.x + 50);
    };
    GameMain.prototype.pullHuman = function () {
        var speedy;
        if (this.pullHumanScale > 1) {
            speedy = this.moveSpeed / this.scalePush;
        }
        else {
            speedy = this.moveSpeed * this.scalePush;
        }
        if (this.isSwingRight) {
            if (this.pullHumanScale > 1) {
                this.pullMan.x -= speedy;
                this.pullMan.y -= this.moveSpeed;
            }
            else {
                this.pullMan.x -= this.moveSpeed;
                this.pullMan.y -= speedy;
            }
        }
        else {
            if (this.pullHumanScale > 1) {
                this.pullMan.x += speedy;
                this.pullMan.y -= this.moveSpeed;
            }
            else {
                this.pullMan.x += this.moveSpeed;
                this.pullMan.y -= speedy;
            }
        }
        this.lineShape.graphics.clear();
        this.lineShape.graphics.lineStyle(1, 0x393B3A);
        this.lineShape.graphics.moveTo(this.hero.x + 50, this.hero.y + this.hero.height / 2 + 2);
        this.lineShape.graphics.lineTo(this.pullMan.x + this.pullMan.width / 2, this.pullMan.y + 50);
        if (this.pullMan.y <= this.hero.y) {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.pullHuman, this);
            this.pullMan.x = this.hero.x + this.hero.width;
            this.pullMan.y = this.hero.y;
            this.lineShape.visible = false;
        }
    };
    Object.defineProperty(GameMain.prototype, "fact", {
        get: function () {
            return 0;
        },
        set: function (value) {
            this.lifebuoy.x = (1 - value) * (1 - value) * this.swingx[0] + 2 * value * (1 - value) * this.swingx[1] + value * value * this.swingx[2];
            this.lifebuoy.y = (1 - value) * (1 - value) * this.swingy[0] + 2 * value * (1 - value) * this.swingy[1] + value * value * this.swingy[2];
            this.lineShape.graphics.clear();
            this.lineShape.graphics.lineStyle(2, 0x393B3A);
            this.lineShape.graphics.moveTo(this.hero.x + 50, this.hero.y + this.hero.height / 2 + 2);
            this.lineShape.graphics.lineTo(this.lifebuoy.x + this.lifebuoy.width / 2, this.lifebuoy.y + 20);
            this.stillnessX = this.lifebuoy.x + this.lifebuoy.width / 2;
            this.stillnessY = this.lifebuoy.y + 20;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameMain.prototype, "fact2", {
        get: function () {
            return 0;
        },
        set: function (value) {
            this.lifebuoy.x = (1 - value) * (1 - value) * this.swingx[2] + 2 * value * (1 - value) * this.swingx[1] + value * value * this.swingx[0];
            this.lifebuoy.y = (1 - value) * (1 - value) * this.swingy[2] + 2 * value * (1 - value) * this.swingy[1] + value * value * this.swingy[0];
            this.lineShape.graphics.clear();
            this.lineShape.graphics.lineStyle(1, 0x393B3A);
            this.lineShape.graphics.moveTo(this.hero.x + 50, this.hero.y + this.hero.height / 2 + 2);
            this.lineShape.graphics.lineTo(this.lifebuoy.x + this.lifebuoy.width / 2, this.lifebuoy.y + 20);
            this.stillnessX = this.lifebuoy.x + this.lifebuoy.width / 2;
            this.stillnessY = this.lifebuoy.y + 20;
        },
        enumerable: true,
        configurable: true
    });
    return GameMain;
}(egret.DisplayObjectContainer));
__reflect(GameMain.prototype, "GameMain");