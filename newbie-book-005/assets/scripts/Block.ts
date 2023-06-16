
import { _decorator, Component, director, Node, Rect, Sprite, SpriteFrame, Texture2D, UITransform, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Block
 * DateTime = Thu May 18 2023 16:44:56 GMT+0800 (中国标准时间)
 * Author = landon30
 * FileBasename = Block.ts
 * FileBasenameNoExtension = Block
 * URL = db://assets/scripts/Block.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('Block')
export class Block extends Component {

    // 拼图所在的原始位置，当所有拼图块都在正确的位置时，拼图完成
    public originIndex: Vec2 = new Vec2(0,0);
    // 当前的位置下标，因为拼图游戏开始后会随机打乱位置以及可以变换位置，所以这个坐标是变化的
    public nowIndex: Vec2 = new Vec2(0,0);

    start () {
        // 监听屏幕点击 这个是点击到了具体的节点的监听
        this.node.on(Node.EventType.TOUCH_START,this.onBlockTouch,this);
    }

    // 点击节点拼图块响应
    public onBlockTouch() : void {
        // 发射/抛出一个全局事件
        director.emit('click_pic',this.nowIndex);
    }

    // 拼图块的初始化
    // 全图的纹理,拼图块的边长,所在块的坐标/下标
    // 比如2*2 (0,0) 左上角 (1,0) 右上角 (0,1) 左下角 (1,1) 右下角
    // 用来计算拼图块对应的纹理区域
    public init(texture: Texture2D,blockSide: number,index: Vec2): void {
        const sprite: Sprite = this.getComponent(Sprite);

        // 设置纹理和对应的纹理区域
        const spriteFrame: SpriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        spriteFrame.rect = new Rect(index.x * blockSide,index.y * blockSide,blockSide,blockSide);

        sprite.spriteFrame = spriteFrame;

        // 设置大小
        const uiTransform: UITransform = this.getComponent(UITransform);
        uiTransform.setContentSize(blockSide,blockSide);

        this.originIndex = index;
        this.nowIndex = index;

        console.log('block.init.index:' + index + " spriteFrame.Rec:" + spriteFrame.rect);
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
