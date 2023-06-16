
import { _decorator, Component, director, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Game
 * DateTime = Fri May 12 2023 15:26:41 GMT+0800 (中国标准时间)
 * Author = landon30
 * FileBasename = Game.ts
 * FileBasenameNoExtension = Game
 * URL = db://assets/scripts/Game.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('Game')
export class Game extends Component {

    // 绑定enemy_skill节点，用于脚本获取节点信息，该节点下有三个子节点
    // 需要将enemy_skill节点拖到Canvas下Game脚本组件的enemySkillNode属性上
    @property({ type: Node })
    private enemySkillNode: Node = null;

    // 绑定label节点，用于脚本修改label的文本
    @property({ type: Label})
    private hintLabel: Label = null;

    // 敌人攻击类型，从0-3，定时随机，来确定显示哪张图片
    private enemyAttackType = 0;
    private timer = null;

    start () {
        // 启动定时器 0.1s执行一次，传一个lambda，注意是 =>
        this.timer = setInterval(() => {
            this.randomEnemyAttack();
        }, 100);
    }

    randomEnemyAttack() {
        // 随机一个攻击类型
        this.enemyAttackType = Math.floor(Math.random() * 3);
        
        // 遍历enemy_skill节点，根据攻击类型激活显示对应的图片
        let children = this.enemySkillNode.children;
        children.forEach(childNode => {
            if(childNode.name == this.enemyAttackType.toString()) {
                childNode.active = true;
            } else {
                childNode.active = false;
            }
        });
    }

    // 我方 点击 的回调函数
    // todo 需要有2个参数，第2参数和button组件传入的CustomEventData一致
    // todo 假如传入attack的原型是attack(event, dummy, customEventData)，则dummy会被赋值为button的传参
    attack(event, customEventData) {
        console.log('attack button click.event.target.name:' + event.target.name);
        console.log('attack button click.customEventData:' + customEventData);

        if(!this.timer) {
            return;
        }

        // 清除定时器（和setInterval一样的已有函数）
        clearInterval(this.timer);
        this.timer = null;

        let pkResult = 0;
        let attackType = event.target.name;

        if(attackType == 0) {
            if(this.enemyAttackType == 0) {
                pkResult = 0;
            } else if(this.enemyAttackType == 1) {
                pkResult = 1;
            } else if(this.enemyAttackType == 2) {
                pkResult = -1;
            }
        } else if(attackType == 1) {
            if(this.enemyAttackType == 0) {
                pkResult = -1;
            } else if(this.enemyAttackType == 1) {
                pkResult = 0;
            } else if(this.enemyAttackType == 2) {
                pkResult = 1;
            }
        } else if(attackType == 2) {
            if(this.enemyAttackType == 0) {
                pkResult = 1;
            } else if(this.enemyAttackType == 1) {
                pkResult = -1;
            } else if(this.enemyAttackType == 2) {
                pkResult = 0;
            }
        }

        if(pkResult == 1) {
            this.hintLabel.string = "胜利";
        } else if(pkResult == 0) {
            this.hintLabel.string = "平局";
        } else if(pkResult == -1) {
            this.hintLabel.string = "失败";
        }
    }

    // 重启 按钮 点击的回调函数，可以原型为空
    // customEventData如果不在button指定，则输出undefined
    restart(event, customEventData) {
        console.log('restart button click.event.target.name:' + event.target.name);
        console.log('restart button click.customEventData:' + customEventData);
        // 重新加载场景
        director.loadScene('Game');
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
