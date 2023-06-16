
import { _decorator, CCString, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Component_Tutorial
 * DateTime = Fri May 12 2023 11:05:03 GMT+0800 (中国标准时间)
 * Author = landon30
 * FileBasename = Component_Tutorial.ts
 * FileBasenameNoExtension = Component_Tutorial
 * URL = db://assets/Component_Tutorial.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('Component_Tutorial')
export class Component_Tutorial extends Component {
    hp: number = 10;
    
    @property
    mp: number = 30;

    @property({type: CCString})
    company = 'bigo';

    start () {
        console.log('property hp(cannot change in editor):' + this.hp);
        console.log('property mp(can change in editor,original value is 30):' + this.mp);
        console.log('property company(can change in editor):' + this.company);
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
