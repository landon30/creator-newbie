
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = AlgorithmTest
 * DateTime = Thu May 18 2023 20:43:13 GMT+0800 (中国标准时间)
 * Author = landon30
 * FileBasename = AlgorithmTest.ts
 * FileBasenameNoExtension = AlgorithmTest
 * URL = db://assets/scripts/AlgorithmTest.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('AlgorithmTest')
export class AlgorithmTest extends Component {
   
    start () {
        // api测试
        for(let i = 0;i < 20;i++) {
            console.log('random:' + Math.floor(Math.random() * 3));
        }
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
