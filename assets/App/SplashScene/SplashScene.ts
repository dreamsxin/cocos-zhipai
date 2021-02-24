const {ccclass, property} = cc._decorator;

@ccclass
export default class SplashScene extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;


    start () {
        // init logic
        this.label.string = "这个是加载场景。。";
        setTimeout(() => {
            cc.director.loadScene('StartScene',() => {
                console.log('>> On Start Scene Launched Callback!')
            })
        }, 0)
    }
}
