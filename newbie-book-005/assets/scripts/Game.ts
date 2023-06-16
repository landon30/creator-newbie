
import { _decorator, Component, director, instantiate, Label, Node, Prefab, resources, Script, Texture2D, Vec2, Vec3 } from 'cc';
import { Block } from './Block';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Game
 * DateTime = Thu May 18 2023 17:04:03 GMT+0800 (中国标准时间)
 * Author = landon30
 * FileBasename = Game.ts
 * FileBasenameNoExtension = Game
 * URL = db://assets/scripts/Game.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('Game')
export class Game extends Component {

    // 绑定prefab，用来实例化block
    @property({type: Prefab})
    private blockPrefab: Prefab = null;
    // 绑定bg节点，用来添加block节点到该节点下
    @property({type: Node})
    private bgNode: Node = null;

    // n * n的拼图，规模
    private blockNum: number = 2;
    // 保存拼图块节点的二维数组
    private picNodeArr: Node[][] = [];

    // 隐藏的拼图块，初始为右下角的块
    private hideBlockNode: Node = null;

    @property({type: Node})
    private tipsNode: Node = null;

    //@property({type: Node})
    // private audioNode: Node =  null;

    // 看原书的例子是直接将节点和脚本名称一致，然后直接声明AudioManager类型？
    // 测试过了，不需要，直接将audio节点拖过来绑定即可
    // 那这样的话确实比较方便，不用先获取，再获取脚本，再调用了...
    // 对比 A (this.audioNode.getComponent('AudioManager') as AudioManager).playClickPicSound();
    // 对比 B this.audioManager.playClickPicSound();
    @property({type: AudioManager})
    private audioManager: AudioManager = null;

    start () {
        // 隐藏tips
        this.tipsNode.active = false;

        this.loadPicture();

        // 监听block节点的点击事件
        director.on('click_pic',this.onClickPic,this)
    }

    // 响应图片点击，参数是图片的当前index
    public onClickPic(nowIndex: Vec2) : void {
        // 上下左右四个方向
        let dirs = [
            new Vec2(0,1),
            new Vec2(0,-1),
            new Vec2(-1,0),
            new Vec2(1,0),
        ];

        let nearBlockNode;
        let nearBlockIndex;

        // 从这个算法上看，就是检查上下左右是否有那个隐藏图片，然后交换啊
        // 因为只有隐藏图片是非active的
        for(let dir of dirs) {
            let nearIndex = nowIndex.clone().add(dir);

            if(nearIndex.x < 0 || nearIndex.x >= this.blockNum || nearIndex.y < 0 || nearIndex.y >= this.blockNum) {
                    continue;
            }

            let blockNode = this.picNodeArr[nearIndex.y][nearIndex.x];
            if(!blockNode || blockNode.active) {
                continue;
            }

            nearBlockNode = blockNode;
            nearBlockIndex = nearIndex.clone();
        }

        if(nearBlockNode) {
            // 直接交换
            // 运行起来效果就是和隐藏图片不断交换
            this.swapPicByIndex(nowIndex,nearBlockIndex);
            // 检查是否完成
            this.checkComplete();
        }

        // (this.audioNode.getComponent('AudioManager') as AudioManager).playClickPicSound();
        this.audioManager.playClickPicSound();
    }

    // TODO 可能存在随机的拼图，按照当前点击顺序，可能无法完成的情况
    public checkComplete(): void {
        let rightCount = 0;

        for(let i = 0;i < this.blockNum;i++) {
            for(let j = 0; j < this.blockNum;j++) {
                const blockNode = this.picNodeArr[i][j];
                const blockScript = blockNode.getComponent('Block') as Block;

                if(blockScript.nowIndex.equals(blockScript.originIndex)) {
                    rightCount++;
                }
            }
        }

        if(rightCount == this.blockNum * this.blockNum) {
            this.hideBlockNode.active = true;
            // todo 为什么这里为true后，还是无法显示tipLavel?
            // todo 挂到一个空节点下面？
            // 是因为被盖住了(白色的背景盖住了红字)，调整一下坐标即可
            this.tipsNode.active = true;
            console.log('拼图成功!');
        }
    }

    public loadPicture(): void {
        // 代码中动态加载的是resources文件夹下的pic_1图像的Texture2D资源
        // 因此填写的路径为【pic_1/texture】，其中texture为pic_1图像的子资源，可以通过资源管理器进行查看
        resources.load('pic_1/texture',Texture2D,(err,texture) => {
            if(err) {
                console.log(err);
                return;
            }

            this.initGame(texture);
            this.removeOnePic();
            this.randPic();
        });
    }

    // 注意，要修改bg以及blockPrefab的锚点为(0,1)，即锚点位于左上角
    // bg原来pos是(0,0,0)，锚点是(0.5,0.5),位于中心,改到左上角后，pos(-360,640,0)
    // todo 可以实际在editor操作看
    // todo 可以单独加一个anchorpoint场景，bg锚点(0,1) pos(-360,640,0)
    // 依次添加4个360*360的单色对象(同样修改锚点0/1)，从左到右，从上到下坐标分别是(0,0)(360,0)(0,-360)(360,-360,0)
    // 即左上角（0,0），向右x+，向下y-
    // todo bg下的节点坐标应该是相对的
    // 因为canvas的锚点是0.5,0.5,所以bg的坐标是相对canvas的，同理bg下的拼图块的坐标也是相对的
    /**
    block.init.index:(0.00, 0.00) spriteFrame.Rec:(0.00, 0.00, 360.00, 360.00)
    initGame.blockNode.pos:(0.00, 0.00, 0.00)
    block.init.index:(1.00, 0.00) spriteFrame.Rec:(360.00, 0.00, 360.00, 360.00)
    initGame.blockNode.pos:(360.00, 0.00, 0.00)
    block.init.index:(0.00, 1.00) spriteFrame.Rec:(0.00, 360.00, 360.00, 360.00)
    initGame.blockNode.pos:(0.00, -360.00, 0.00)
    block.init.index:(1.00, 1.00) spriteFrame.Rec:(360.00, 360.00, 360.00, 360.00)
    initGame.blockNode.pos:(360.00, -360.00, 0.00)
     */
    public initGame(texture: Texture2D) : void {
        let blockSide: number = texture.image.width / this.blockNum;
        
        for(let i = 0;i < this.blockNum;i++) {
            this.picNodeArr[i] = [];

            for(let j = 0;j < this.blockNum;j++) {
                // 用prefab实例化一个block节点
                const blockNode: Node = instantiate(this.blockPrefab);

                // 获取节点上的script组件 todo 因为可能挂多个脚本，所以不能直接传Script?只能传script的名字？
                // todo 注意这个as语法，加上之后，下面才可以调用方法，应该是指明class
                // 可以看到上面的import也多了 import { Block } from './Block';
                const blockScript = blockNode.getComponent('Block') as Block;
                // 注意从左到右，从上到下，所以是(j,i)
                blockScript.init(texture,blockSide,new Vec2(j,i));

                // 这里为什么是-i，可以看上面的解释 todo 直接在editor中看就行
                blockNode.setPosition(new Vec3(j * blockSide,-i * blockSide,0));

                console.log('initGame.blockNode.pos:' + blockNode.position);

                this.picNodeArr[i][j] = blockNode;
                this.bgNode.addChild(blockNode);
            }
        }
    }

    // 移除/隐藏最右下角的图块
    public removeOnePic() {
        let picNode = this.picNodeArr[this.blockNum -1][this.blockNum -1];
        picNode.active = false;
        this.hideBlockNode = picNode;

        // todo 图块index和二维数组下标的关系，2*2举例

        // (0,0) - (0,0)
        // (1,0) - (0,1)
        // (0,1) - (1,0)
        // (1,1) - (1,1)

        // 即知道index(x,y)，那么获取二维数组获取节点是array[y,x]

        // 3*3举例
        // (0,0) - (0,0)
        // (1,0) - (0,1)
        // (2,0) - (0,2)
        // (0,1) - (1,0)
        // (1,1) - (1,1)
        // (2,1) - (1,2)
        // (0,2) - (2,0)
        // (1,2) - (2,1)
        // (2,2) - (2,2)
    }

    // 打乱图块
    public randPic(): void {
        // 这里不和原文算法一致
        // 随机选择一个index
        for(let i = 0;i < 16;i++) {
            let randomX = Math.floor(Math.random() * this.blockNum);
            let randomY = Math.floor(Math.random() * this.blockNum);
            let randomIndex = new Vec2(randomX,randomY);

            // 交换hideNode和randomIndex的node
            let hideNodeScript = this.hideBlockNode.getComponent('Block') as Block;
            let hideNodeNowIndex = hideNodeScript.nowIndex;

            this.swapPicByIndex(hideNodeNowIndex,randomIndex);
        }
    }

    // 交换node(位置、index、数组下标)
    public swapPicByIndex(nowIndex: Vec2,randomIndex: Vec2): void {
        if(nowIndex.x == randomIndex.x && nowIndex.y == randomIndex.y) {
            return;
        }

        // 下标转换见上面
        let nowPicNode = this.picNodeArr[nowIndex.y][nowIndex.x];
        let randomPicNode = this.picNodeArr[randomIndex.y][randomIndex.x];

        // 交换位置
        let tmpPos: Vec3 = nowPicNode.position.clone();
        nowPicNode.position = randomPicNode.position;
        randomPicNode.position = tmpPos;

        // 交换标记
        let nowNodeScript = nowPicNode.getComponent('Block') as Block;
        let randomNodeScript = randomPicNode.getComponent('Block') as Block;
        let tmpIndex: Vec2 = nowNodeScript.nowIndex.clone();
        nowNodeScript.nowIndex = randomNodeScript.nowIndex;
        randomNodeScript.nowIndex = tmpIndex;

        // 交换数组值
        this.picNodeArr[nowIndex.y][nowIndex.x] = randomPicNode;
        this.picNodeArr[randomIndex.y][randomIndex.x] = nowPicNode;
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
