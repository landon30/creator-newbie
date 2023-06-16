
import { _decorator, Component, EPhysics2DDrawFlags, Node, PhysicsSystem2D } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Settings
 * DateTime = Thu May 18 2023 10:09:18 GMT+0800 (中国标准时间)
 * Author = landon30
 * FileBasename = Settings.ts
 * FileBasenameNoExtension = Settings
 * URL = db://assets/scritps/Settings.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('Settings')
export class Settings extends Component {

    @property({type : Boolean})
    private isDebug: boolean = false;

    start () {
        this.showDebug();
    }

    // 勾选Canvas#Settings脚本的isDebug
    // 运行游戏会发现碰撞区域以及颜色标识
    showDebug() {
        if (this.isDebug) {
            // 绘制碰撞的物理区域
            PhysicsSystem2D.instance.debugDrawFlags = 
            EPhysics2DDrawFlags.Aabb | 
            EPhysics2DDrawFlags.Pair |
            EPhysics2DDrawFlags.CenterOfMass |
            EPhysics2DDrawFlags.Joint |
            EPhysics2DDrawFlags.Shape;
        } else  {
            // 关闭调试区域
            PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.None;
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
