
import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Game
 * DateTime = Thu May 11 2023 17:04:43 GMT+0800 (中国标准时间)
 * Author = landon30
 * FileBasename = Game.ts
 * FileBasenameNoExtension = Game
 * URL = db://assets/Game.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('Game')
export class Game extends Component {

    // 声明为属性，绑定label节点，和label进行交互
    // 注意这里label必须类型，否则编辑器提示unknown，无法完成拖拽label组件到该属性上
    @property({type: Label})
    label: Label = null;

    start () {
        // [3]
        console.log('hello,creator');
        // 修改label内容
        this.label.string = 'Game Start';
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
