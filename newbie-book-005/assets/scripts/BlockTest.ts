
import { _decorator, Component, Node, Rect, resources, Sprite, SpriteFrame, Texture2D } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Block
 * DateTime = Thu May 18 2023 16:07:45 GMT+0800 (中国标准时间)
 * Author = landon30
 * FileBasename = Block.ts
 * FileBasenameNoExtension = Block
 * URL = db://assets/scripts/Block.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('BlockTest')
export class BlockTest extends Component {

    start () {
        // 加载resources目录的pic_1的texture
        resources.load('pic_1/texture',Texture2D,(err,texture) => {
            if(err) {
                console.log(err)
                return;
            }

            // 因为脚本是作为block节点的组件，所以this指block节点
            // 这里获取block节点的Sprite组件
            const sprite: Sprite = this.getComponent(Sprite);

            const spriteFrame: SpriteFrame = new SpriteFrame();
            spriteFrame.texture = texture;

            // 设置替换默认的资源（设置spriteFrame属性）
            // 运行后，背景的block由单色变为了动态加载的图像
            sprite.spriteFrame = spriteFrame;

            // 目前加载的是完整的图像纹理，而制作拼图只需要加载相应区域的纹理即可

            // 我们通过为rect属性赋值指定了需要的纹理区域。
            // 在Rect(x, y,width, height)中，x与y表示读取的纹理的起点坐标，width与height表示读取的纹理的宽和高
            // 可以理解为屏幕左上角是0,0，向右x+,向下y+，都是正
            
            // 指定纹理区域，2 * 2 左上角
            // sprite.spriteFrame.rect = new Rect(0,0,360,360);

            // 指定纹理区域，2 * 2 右上角
            // sprite.spriteFrame.rect = new Rect(360,0,360,360);

            // 指定纹理区域，2 * 2 左下角
            // sprite.spriteFrame.rect = new Rect(0,360,360,360);

            // 指定纹理区域，2 * 2 右下角
            sprite.spriteFrame.rect = new Rect(360,360,360,360);
        });
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
