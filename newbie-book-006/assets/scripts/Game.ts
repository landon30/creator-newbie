
import { _decorator, Animation, AnimationState, Button, Component, find, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Game
 * DateTime = Sat May 20 2023 15:17:37 GMT+0800 (中国标准时间)
 * Author = landon30
 * FileBasename = Game.ts
 * FileBasenameNoExtension = Game
 * URL = db://assets/scripts/Game.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('Game')
export class Game extends Component {

    // 规则
    // 1. 玩家一次回合可以攻击3次（行动点决定），3次后到敌方回合
    // 2. 玩家每次回合的3次攻击中，可以选择普通攻击和治疗技能。每操作1次，扣除1行动点
    // 3. 选择治疗技能，需要扣指定法力值，扣除后玩家血量恢复指定值
    // 4. 选择普通攻击，敌人扣血，同时恢复指定法力值
    // 5. 敌人只有1行动点，只有普通攻击

    // 玩家最大血量
    private playerMaxHp: number = 25;
    // 玩家最大行动点 回合制游戏中 如果玩家当前行动点为3，表示玩家自己的回合可以操作3次
    private playerMaxAp: number = 3;
    // 玩家法力值上限 本游戏中，如果玩家使用恢复，则消耗1点mp
    private playerMaxMp: number = 10;

    // 玩家攻击力
    private playerAtk: number = 5;
    // 使用恢复一次，消耗的法力值
    private healMpCost: number = 8;
    // 使用恢复一次，恢复的血量
    private healHp: number = 5;
    // 法力恢复速度，玩家每次攻击一次，恢复法力
    private incMp: number = 2;

     // 玩家当前血量
     private playerHp: number = 0;
     // 玩家当前行动点
     private playerAp: number = 0;
     // 玩家当前法力值
     private playerMp: number = 0;

    // 敌人最大血量
    private enemyMaxHp: number = 25;
    // 敌人攻击力
    private enemyAtk: number = 3;

    // 敌人当前血量
    private enemyHp: number = 0;

    // 当前回合 0表示玩家回合 1表示敌人回合
    private turnNum = 0;

    // 这次代码示例，不再编辑器手动绑定，全部考虑使用find查找
    // 敌人节点
    private enemyAreaNode: Node = null;
    // 敌人节点下的血量标签
    private enemyHpLabel: Label = null;

    // 玩家的三个属性label
    private playerHpLabel: Label = null;
    private playerApLabel: Label = null;
    private playerMpLabel: Label = null;

    // 前进按钮，初始化隐藏，当打败敌人后，显示，点击下一关
    private nextBtn: Node = null;
    
    // 背景过渡动画
    private bgAni: Animation = null;

    start () {
        console.log('start.initProperty');
        this.initProperty();

        console.log('start.initEnemy');
        this.initEnemy();

        console.log('start.initPlayer');
        this.initPlayer();

        // 监听攻击按钮和恢复按钮的事件
        // 这里没有采用编辑器手动指定click事件，而是获取按钮节点，代码中指定点击回调
        console.log('start.onButtonEvents');
        this.onButtonEvents();
    }

    // 初始化所有绑定的节点属性等
    // 替代再编辑器拖拽绑定
    private initProperty(): void {
        // todo 直接使用find这种方式的话，如果属性声明为node没有问题，但是如果声明了为Label，则编译提示错误（因为find返回的是Node，但是我们声明的却是label）
        // todo 目前属性声明中去除了类型
        // fixed 仔细看了一下editor，label也是一个node，只不过加了一个label的组件,所以先获取node再获取组件
        this.enemyAreaNode = find('/Canvas/bg/enemyArea');
        this.enemyHpLabel = find('/Canvas/bg/enemyArea/enemy/hp').getComponent(Label);

        this.playerHpLabel = find('/Canvas/bg/playerStatus/hp').getComponent(Label);
        this.playerApLabel = find('/Canvas/bg/playerStatus/ap').getComponent(Label);
        this.playerMpLabel = find('/Canvas/bg/playerStatus/mp').getComponent(Label);

        this.nextBtn = find('/Canvas/bg/nextBtn');
        this.nextBtn.active = false;

        // 当前node是Canvas
        this.bgAni = this.node.getChildByName('bg').getComponent(Animation);
        // 添加回调，背景动画播放完，才刷新怪物
        this.bgAni.on(Animation.EventType.FINISHED,this.bgAniFinish,this);
    }

    // 初始化敌人
    public initEnemy(): void {
        this.updateEnemyHp(this.enemyMaxHp);
        this.enemyAreaNode.active = true;
    }

    // 更新敌人血量
    public updateEnemyHp(hp: number) : void  {
        this.enemyHp = hp;
        // todo 代码中将enemyMaxHp，为什么运行游戏没能生效呢？
        // todo 是被默认的编辑器搭建场景的25给覆盖了？
        // todo 尝试去除编辑器搭建场景的默认值，还是不行
        // 1. 属性声明加上Node/Label
        // 2. 尝试获取Label组件试一试
        // 3. fixed
        // 注意，这里字符串赋值 使用${this.enemyHp}引用变量
        this.enemyHpLabel.string = `${this.enemyHp} hp`;
    }

    // 初始化玩家
    public initPlayer(): void {
        this.updatePlayerHp(this.playerMaxHp);
        this.updatePlayerAp(this.playerMaxAp);
        this.updatePlayerMp(this.playerMaxMp);
    }

    // 更新玩家血量
    public updatePlayerHp(hp: number) : void  {
        this.playerHp = hp;
        // 注意这里字符串赋值使用了换行符
        this.playerHpLabel.string = `HP\n${this.playerHp}`;
    }

    // 更新玩家行动点
    public updatePlayerAp(ap: number) : void  {
        this.playerAp = ap;
        this.playerApLabel.string = `AP\n${this.playerAp}`;
    }

    // 更新玩家法力值
    public updatePlayerMp(mp: number) : void  {
        this.playerMp = mp;
        this.playerMpLabel.string = `MP\n${this.playerMp}`;
    }

    private onButtonEvents() : void {
        // 这里获取button节点，因为已经添加了button组件，所以这里直接监听按钮点击事件
        let attackBtn: Node = find('/Canvas/bg/ctrlArea/attackBtn');
        attackBtn.on(Button.EventType.CLICK,this.playerAttack,this);

        let healBtn: Node = find('/Canvas/bg/ctrlArea/healBtn');
        healBtn.on(Button.EventType.CLICK,this.playerHeal,this);

        this.nextBtn.on(Button.EventType.CLICK,this.nextRoom,this);
    }

    // 玩家攻击事件
    public playerAttack(): void {
        console.log('attackBtn.click#playerAttack');

        // 非本方回合不能攻击
        if(this.turnNum != 0) {
            return;
        }

        // 敌人已经死亡 // 这个时候需要点击前进进入下一关
        if(this.enemyHp <= 0) {
            return;
        }

        // 行动点不足
        if(this.playerAp <= 0) {
            return;
        }

        // 扣除行动点
        this.playerAp -= 1;

        // 恢复法力
        this.playerMp += this.incMp;
        if(this.playerMp > this.playerMaxMp) {
            this.playerMp = this.playerMaxMp;
        }

        // TODO 播放敌人受击动画
        // 此时已经在动画编辑器添加了一个hurt的enemy#position动画
        let ani = this.enemyAreaNode.getComponent(Animation);
        ani.play('hurt');

        // 敌人扣血
        this.enemyHp -= this.playerAtk;
        if(this.enemyHp <= 0) {
            this.onEnemyDie();
            return;
        }

        // 更新显示
        this.updateEnemyHp(this.enemyHp);
        this.updatePlayerAp(this.playerAp);
        this.updatePlayerMp(this.playerMp);

        // 检测是否到敌方回合
        this.checkEnemyAction();
    }

    // 敌人死亡逻辑
    private onEnemyDie(): void {
        console.log('onEnemyDie');

        // 这里将敌人血量变为0
        this.updateEnemyHp(0);
        // 隐藏敌人
        // 注意前进按钮没有在enemyAreaNode下
        // 节点都隐藏了，上面的重置label血量为0，也意义不大了
        this.enemyAreaNode.active = false;

        // 继续玩下去
        // 注释，显示前进按钮，点击进入
        // this.nextRoom();
        this.nextBtn.active = true;
    }

    // 进入下一关，初始化敌人
    private nextRoom(): void {
        console.log('nextRoom');

        // 隐藏前进按钮
        this.nextBtn.active = false;

        // 目前有一个问题是，当攻击，敌人死亡后，直接触发死亡逻辑，此时可能播放敌人受击动画，但是敌人节点却隐藏了
        // 所以当点击前进按钮后，刷出敌人后，会再次播放一次受击动画
        // 这里停掉受击动画
        // TODO 节点下有两个动画，stop是哪个呢？
        let hurtAni = this.enemyAreaNode.getComponent(Animation);
        hurtAni.stop();

        // 播放背景过渡动画
        this.bgAni.play('interlude');
    }

    // 背景动画完，才刷新怪物
    private bgAniFinish(): void {
        this.initEnemy();

        this.turnNum = 0;
        this.updatePlayerAp(this.playerMaxAp);
    }

    // 检测是否到敌方回合
    private checkEnemyAction() {
        // 行动点为0，对方回合开始攻击
        if(this.turnNum == 0 && this.playerAp <= 0) {
            this.turnNum = 1;
            // 敌方回合攻击
            this.enemyAttack();
        }
    }

    // 敌方攻击
    private enemyAttack() : void {
        if(this.turnNum != 1) {
            return;
        }

        this.playerHp -= this.enemyAtk;
        if(this.playerHp <= 0) {
            this.playerHp = 0;
        }
        this.updatePlayerHp(this.playerHp);

        // TODO 播放玩家攻击动画
        // 此时已经在动画编辑器添加了一个attack的enemy#position动画
        let ani = this.enemyAreaNode.getComponent(Animation);
        ani.play('attack');
        // TODO 这个如何关联是否受击动画播放完毕，还是攻击动画播放完毕呢？
        // fixed 回调函数有一个AnimationState，可以拿到clip
        ani.on(Animation.EventType.FINISHED,this.enemyAttackAniFinish,this);

        if(this.playerHp <= 0) {
            console.log('游戏结束');
            return;
        }
    }


    // 敌人攻击动画播放完毕
    public enemyAttackAniFinish(type: Animation.EventType, state: AnimationState) {
        // 判断敌人攻击动画播放完毕
        if(state.clip.name == 'attack') {
             // 切换玩家回合，同时恢复玩家行动力
            this.turnNum = 0;
            this.updatePlayerAp(this.playerMaxAp);
        }
    }

    // 玩家治疗事件
    public playerHeal(): void {
        console.log('healBtn.click#playerHeal');

          // 非本方回合不能攻击
          if(this.turnNum != 0) {
            return;
        }

        // 行动点不足
        if(this.playerAp <= 0) {
            return;
        }

        // 扣除行动点
        this.playerAp -= 1;

        // 法力值不足
        if(this.playerMp < this.healMpCost) {
            return;
        }

        // 扣除法力值
        this.playerMp -= this.healMpCost;

        // 回血
        this.playerHp += this.healHp;
        if(this.playerHp > this.playerMaxHp) {
            this.playerHp = this.playerMaxHp;
        }

        // 显示更新
        this.updatePlayerAp(this.playerAp);
        this.updatePlayerMp(this.playerMp);
        this.updatePlayerHp(this.playerHp);

        this.checkEnemyAction();
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
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
