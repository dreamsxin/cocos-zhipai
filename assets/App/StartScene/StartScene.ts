
const {ccclass, property} = cc._decorator;

@ccclass
export default class StartScene extends cc.Component {

    @property(cc.Button)
    playBtn: cc.Button = null;

   

    onLoad () {
        console.log('>> StartScene: Onload..')
    }
    start () {
      
        this.playBtn.node.on('click',this.OnPlayBtnClick.bind(this))
    }
    OnPlayBtnClick(button){
        console.log(`button name: ${button.name}`)
        cc.director.loadScene('GameScene')
    }
    // update (dt) {}
}
