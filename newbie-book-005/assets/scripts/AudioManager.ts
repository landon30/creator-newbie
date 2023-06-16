
import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = AudioManager
 * DateTime = Thu May 18 2023 23:02:18 GMT+0800 (中国标准时间)
 * Author = landon30
 * FileBasename = AudioManager.ts
 * FileBasenameNoExtension = AudioManager
 * URL = db://assets/scripts/AudioManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('AudioManager')
export class AudioManager extends Component {
    // 点击图片播放声音

    // 绑定要播放的音效文件，从资源管理器直接拖拽过去
    @property({type: AudioClip})
    public audioClip: AudioClip = null;

    private audioSource: AudioSource = null;

    start () {
        this.audioSource = this.getComponent(AudioSource);
    }

    public playClickPicSound(): void {
        this.audioSource.playOneShot(this.audioClip,1);
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
