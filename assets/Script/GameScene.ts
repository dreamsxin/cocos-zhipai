

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        console.log('>> GameScene: Onload..')
    }

    start () {

        console.log('>> GameScene: start..')
        this.label.string = "这个是游戏场景..."
    }

    // update (dt) {}
}
