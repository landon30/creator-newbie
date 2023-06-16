
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Script_Tutorial
 * DateTime = Thu May 11 2023 17:17:50 GMT+0800 (中国标准时间)
 * Author = landon30
 * FileBasename = Script-Tutorial.ts
 * FileBasenameNoExtension = Script-Tutorial
 * URL = db://assets/Script-Tutorial.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('Script_Tutorial')
export class Script_Tutorial extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    start () {
        // [3]
        
        // 变量声明
        let hp: number = 100;
        let skill_name: string = '烈焰斩';
        let is_cd: boolean = false;
        let mp: any = 200;

        console.log(hp);
        console.log(skill_name);
        console.log(is_cd);
        console.log(mp);

        // any可以改变类型
        mp = "魔法";

        console.log(mp);

        // 不指定变量类型
        let name = 'landon';
        let age = 34;

        console.log('name=' + name);
        console.log('age=' + age);

        // todo 字符串 ""和''区别
        let s0: string = 'bigo landon';
        let s1: string = "bigo landon";

        console.log(s0);
        console.log(s1);
        // true
        console.log(s0 == s1);
        
        s0 = 'bigo "landon"';
        s1 = "bigo 'landon'";

        // bigo "landon"
        console.log(s0);
        // bigo 'landon'
        console.log(s1);

        // switch/case，case可以是字符串
        let job: string = `法师`;

        switch (job) {
            case '战士':
                console.log('斩击');
                break;
            case '法师':
                console.log('火球术');
                break;
            default:
                break;
        }

        // 数组，方括号
        let jobs: string[] = ['法师', '射手', '战士', '骑士'];

        // for循环两种遍历
        for(let i: number = 0; i < jobs.length; i++) {
            console.log(jobs[i]);
        }

        for(let job of jobs) {
            console.log(job);
        }

        // 对象
        let hero = {
            hp: 20,
            mp: 30,
            job: '刺客',
            equipment: ['头盔','肩甲','靴子']
        };

        console.log('hero.hp=' + hero.hp);
        console.log('hero.equipment=' + hero.equipment);

        // 函数
        function getJobByIndex(index: number): string {
            return jobs[index];
        }

        console.log('function getJobByIndex call=' + getJobByIndex(2));
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
