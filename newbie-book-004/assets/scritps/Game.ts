
import { _decorator, Collider2D, Component, Contact2DType, Director, input, Input, instantiate, Label, Node, Prefab, RigidBody2D, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Game
 * DateTime = Thu May 18 2023 10:14:37 GMT+0800 (中国标准时间)
 * Author = landon30
 * FileBasename = Game.ts
 * FileBasenameNoExtension = Game
 * URL = db://assets/scritps/Game.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

// 游戏相当于利用反弹的空中时间等待下一块跳板
@ccclass('Game')
export class Game extends Component {

    @property({type: Node})
    private ballNode: Node = null;

    // 记录小球第一次落地时的速度，用来反弹同样的高度
    // 否则会出现触摸后，下落速度增大，反弹高度也变大
    // 实现 1. 下落可触摸加速 2. 反弹时到同样的高度
    private bounceSpeed: number = 0;

    // 绑定资源管理器的block prefab
    // 拖拽block.prefab到该属性上进行绑定
    // landon-因为这个是从资源管理器直接拿过去的，所以需要实例化。
    // 之前的都是直接从资源管理器拖拽到层级管理器（应该是直接初始化了）
    @property({type: Prefab})
    private blockPrefab: Prefab = null;
    // 两块跳板的间距
    private blockGap: number = 250;
    // blocks节点，block的父节点
    @property({type: Node})
    private blocksNode: Node = null;

    // 游戏状态 0 等待 1 开始 2 结束
    private gameState: number = 0;

    @property({type: Label})
    private scoreLabel: Label = null;
    private score: number = 0;

    start () {
        // 监听触摸事件
        input.on(Input.EventType.TOUCH_START,this.onTouchStart,this);

        this.onCollisionHandler();

        // 设置小球初始位置，偏左上方
        this.ballNode.position = new Vec3(-250,200,0);

        this.initBlock();
    }

    // 触摸事件回调
    onTouchStart() {
        // 先让小球第一次按照正常速度下落
        if(this.bounceSpeed == 0) {
            return;
        }

        // 获取小球节点，获取2d刚体组件，修改瞬时速度
        let rigidBody = this.ballNode.getComponent(RigidBody2D);
        // 修改刚体移动速度
        rigidBody.linearVelocity = new Vec2(0,-this.bounceSpeed * 1.5);

        this.gameState = 1;
    }

    // 碰撞回调处理
    // 为触发碰撞回调，需要勾选EnableContactListener
    onCollisionHandler() {
        let rigidBody = this.ballNode.getComponent(RigidBody2D);
        let collider = this.ballNode.getComponent(Collider2D);

        collider.on(Contact2DType.BEGIN_CONTACT, () => {
            if(this.bounceSpeed == 0) {
                // 记录第一次下落的瞬时速度
                this.bounceSpeed = Math.abs(rigidBody.linearVelocity.y);
            } else {
                // 再次反弹时，用记录的速度，保证回弹同样的高度
                rigidBody.linearVelocity = new Vec2(0,this.bounceSpeed);
            }
        },this);
    }

    // 初始化跳板
    initBlock() {
        let posX;
        // 3块跳板就够了
        for(let i = 0;i < 3; i++) {
            if(i == 0) {
                // 第一块跳板在小球下方
                posX = this.ballNode.position.x;
            } else {
                // 根据间隔生成下一块跳板的位置
                posX += this.blockGap;
            }

            this.createNewBlock(new Vec3(posX,0,0));
        }
    }

    // 这次用了完整的函数声明
    public createNewBlock(position: Vec3) : void  {
        // 创建（实例化）预制体的跳板节点
        let blockNode = instantiate(this.blockPrefab);
        // 设置跳板位置
        blockNode.position = position;
        // 添加到父节点blocks下
        this.blocksNode.addChild(blockNode);
    }

    // update中向左移动跳板，看起来小球向右跑动
    update (deltaTime: number) {
        if(this.gameState == 1) {
            this.moveAllBlock(deltaTime);
        }
    }

    // 向左移动所有的block
    // 由于当前的引擎编辑器的设计问题，在使用Box2D物理模块的情况下，我们不能通过在脚本中移动父节点的方式来让子节点整体移动
    // 如果需要移动所有的跳板，则必须遍历所有的block节点，并对其单独操作
    public moveAllBlock(deltaTime: number) : void {
        let speed = -300 * deltaTime;
        // 遍历所有blocks下的block所有节点，改变位置
        for(let blockNode of this.blocksNode.children) {
            // 注意这里clone了一下，正常position是只读
            let pos = blockNode.position.clone();
            pos.x += speed;
            // 重新赋值
            blockNode.position = pos;

            // 这里如果直接运行游戏，跳板向左，全部消失，小球就掉下去了
            // 这里需要左侧消失一块，右侧增加一块
            this.checkBlockOut(blockNode);
        }
    }

    // 跳板出界处理
    // 体验游戏的时候，发现有点卡，因为方法频繁的创建和销毁，比较损耗性能
    public checkBlockOut(blockNode: Node): void {
        // 超出屏幕后，需要销毁该节点，并在右侧生成新的跳板
        if(blockNode.position.x < -400) {
            // A 获取最后1块跳板的位置，后面加1块
            // this.createNewBlock(new Vec3(this.getLastBlockPosx() + this.blockGap));
            // blockNode.destroy;

            // B 为了避免性能问题，不再create和destroy，而是复用这块超出屏幕的节点
            // 增加趣味性，高度随机调整
            let randomPosY = (Math.random() > 0.5 ? 1 : -1) * (10 + 40 * Math.random());
            blockNode.position = new Vec3(this.getLastBlockPosx() + this.blockGap,randomPosY);

            // 跳板消失1块，此时点击屏幕，跳到下一块，说明增加1分
            // TODO 运行游戏明显看到分数涨的很快，为什么?
            // 使用了B段代码之后，就正常了，为什么？可能实例化和destory是异步的
            this.score += 1;
            this.scoreLabel.string = String(this.score);
        }

        // 检查小球位置,跳出屏幕
        if(this.ballNode.position.y < -700) {
            this.gameState = 2;
            Director.instance.loadScene('Game');
        }
    }

    // 获取最后1块跳板的位置，准备生成新跳板
    public getLastBlockPosx(): number {
        let lastBlockPosx = 0;

        for(let blockNode of this.blocksNode.children) {
            if(blockNode.position.x > lastBlockPosx) {
                lastBlockPosx = blockNode.position.x;
            }
        }

        return lastBlockPosx;
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
