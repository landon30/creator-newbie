
import { _decorator, Component, EventTarget, Input, input, Node } from 'cc';
const { ccclass, property } = _decorator;
const eventTarget = new EventTarget();

/**
 * Predefined variables
 * Name = EventTest
 * DateTime = Tue May 16 2023 11:42:11 GMT+0800 (中国标准时间)
 * Author = landon30
 * FileBasename = EventTest.ts
 * FileBasenameNoExtension = EventTest
 * URL = db://assets/scripts/EventTest.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('EventTest')
export class EventTest extends Component {
    private user_exp = 0;

    protected onLoad(): void {
        // 监听事件
        eventTarget.on('incr_exp', (exp) => {
            this.user_exp += exp;
            console.log('获得了' + exp +  ' 点经验，当前经验值： ' + this.user_exp)
        });

        // 输入事件系统input测试
        input.on(Input.EventType.TOUCH_START,(event) => {
            console.log('TOUCH_START');
            this.fire();
        },this);

        input.on(Input.EventType.TOUCH_MOVE,(event) => {
            console.log('TOUCH_MOVE');
        },this);

        input.on(Input.EventType.TOUCH_END,(event) => {
            console.log('TOUCH_END');
        },this);

        input.on(Input.EventType.TOUCH_CANCEL,(event) => {
            console.log('TOUCH_CANCEL');
        },this);
    }
    
    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_START,this.fire,this);
    }

    start () {
        // 发射事件
        eventTarget.emit('incr_exp',10);

        // 每1s发射一次
        setInterval(() => {
            eventTarget.emit('incr_exp',1);
        },1000);
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    fire() {
        console.log('发射子弹');
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
