
import { _decorator, Component, Director, Input, input, Label, Node, ParticleSystem2D, Sprite, Tween, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Game
 * DateTime = Tue May 16 2023 12:28:08 GMT+0800 (中国标准时间)
 * Author = landon30
 * FileBasename = Game.ts
 * FileBasenameNoExtension = Game
 * URL = db://assets/scripts/Game.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('Game')
export class Game extends Component {

    // 绑定的子弹节点
    @property({ type: Node })
    private bulletNode:Node = null;

    // 绑定的敌人节点
    @property({ type: Node })
    private enemyNode:Node = null;

    // 游戏状态 0 未发射 1 已发射 2 已结束
    private gameState: number = 0;

    // 子弹tween，用于碰撞后关闭
    private bulletTween:Tween<Node> = null;

    // 让敌人动起来的tween
    private enemyTween: Tween<Node> = null;

    @property({ type: Node})
    private boomNode: Node = null;

    @property( {type : Label})
    private scoreLabel: Label = null;
    private score: number = 0;

    protected onLoad(): void {
        console.log("onLoad")
    }

    // 取消监听
    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_START,this.fire,this);
    }

    // 敌人初始化
    enemyInit() {
        if(this.enemyTween != null) {
            this.enemyTween.stop();
        }

        // 敌人初始化位置，最右侧
        let st = new Vec3(300,260,0);
        // y随机
        st.y = st.y - Math.random() * 100;
        // x随机
        if(Math.random() > 0.5) {
            // 对面
            st.x = -st.x;
        }

        // 右-左的时间 随机
        let dua = 1.5 - Math.random() * 0.5;

        this.enemyNode.setPosition(st);
        this.enemyNode.active = true;

        this.enemyTween = tween(this.enemyNode)
        // 最左侧位置
        .to(dua,{position: new Vec3(-st.x,st.y,0)})
        // 最右侧位置
        .to(dua,{position: new Vec3(st.x,st.y,0)})
        // 打包
        .union()
        // 重复执行
        .repeatForever()
        // 启动
        .start();
    }

    // 子弹初始化
    bulletInit() {
        // 子弹初始位置
        let st = new Vec3(0,-340,0);

        this.bulletNode.setPosition(st);
        this.bulletNode.active = true;
    }

    // 监听触摸事件，发射子弹
    fire() {
        if (this.gameState != 0) {
            return;
        }

        this.gameState = 1;

        // 使用tween实现子弹位移
        // 0.6s移动到目标位置
        this.bulletTween = tween(this.bulletNode)
        .to(0.6,{position: new Vec3(0,600,0)})
        // 添加一个回调函数
        .call(() => {
            this.gameOver();
        })
        .start();
    }

    // 当子弹动画顺利到达目标为止，说明没有命中，游戏结束
    gameOver() {
        console.log('Game Over!');
        this.gameState = 2;

        // 播放粒子，子弹的颜色
        let bulletColor = this.bulletNode.getComponent(Sprite).color;
        this.boom(this.bulletNode.position,bulletColor);

        // 延时1s，用于播放粒子
        setTimeout(() => {
             // 重新加载场景
        Director.instance.loadScene('Game');
        },1000);
    }

    start () {
        // 监听事件 源文件改为了node监听
        this.node.on(Input.EventType.TOUCH_START,this.fire,this);

        // 初始化敌人来回移动
        this.enemyInit();
    }

    update (deltaTime: number) {
        // 每帧检测碰撞
        this.checkHit();
    }

    // 子弹和敌人的碰撞检测
    checkHit() {
        if(this.gameState != 1) {
            return;
        }

        let distance = Vec3.distance(this.bulletNode.position,this.enemyNode.position);

        if(distance <= 50) {
            // 关闭tween动画
            this.bulletTween.stop();
            // 游戏结束
            this.gameState = 2;

            // 隐藏两个节点对象
            this.enemyNode.active = false;
            this.bulletNode.active = false;

            // 播放粒子，敌人的颜色
            let enemyColor = this.enemyNode.getComponent(Sprite).color;
            this.boom(this.bulletNode.position,enemyColor);

            this.incrScore();
            this.newLevel();
        }
     }

     // 播放例子效果
     boom(pos,color) {
        this.boomNode.setPosition(pos);
        // 获取组件方法 getComponent
        let particle = this.boomNode.getComponent(ParticleSystem2D);

        // 注意-样例代码错误
        if(color != undefined) {
            particle.startColor = particle.endColor = color;
        }

        particle.resetSystem();
     }

     // 当和敌人碰撞后，增加得分，并重新初始化
     newLevel() {
        this.bulletInit();
        this.enemyInit();

        this.gameState = 0;
     }

     // 增加得分
     incrScore() {
        this.score += 1;
        this.scoreLabel.string = String(this.score);
     }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
