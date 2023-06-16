
import { _decorator, Button, Component, Director, find, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Menu
 * DateTime = Thu May 18 2023 14:18:15 GMT+0800 (中国标准时间)
 * Author = landon30
 * FileBasename = Menu.ts
 * FileBasenameNoExtension = Menu
 * URL = db://assets/scritps/Menu.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('Menu')
export class Menu extends Component {

    start () {
        // 直接获取按钮节点，注册事件，之前最早都是声明一个属性，然后拖拽进行绑定
        // 之前最早的demo是直接在editor#Button组件上#ClickEvents，选择回调函数

        // 我们使用了find函数获取startBtn节点，通过这种方式只需要在find函数中传入节点对应的路径即可
        // 当存在对应节点时即可获取节点对象，省去了在属性检查器中进行绑定的步骤

        // 通常情况下，在稍微复杂的项目中，一般会使用一个全局脚本来统一管理节点，不会采用属性检查器拖动管理的方式
        // 这里需要注意的是，由于我们的项目本身并不复杂，所以大部分情况下都直接采用了拖动的方式进行绑定
        let btnNode = find('/Canvas/bg/startBtn');
        // 注意这里第二个，这里没有用lambda，直接传了一个函数引用，没有括号
        // 由于startBtn节点已经添加了Button组件，因此在获取该节点后，我们可以直接监听它的按钮点击事件
        btnNode.on(Button.EventType.CLICK,this.gameStart,this);
    }

    // 按钮按下的回调函数
    public gameStart(): void{
        Director.instance.loadScene('Game');
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
