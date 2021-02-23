const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;


    start () {
        // init logic
        console.log("hello")
        this.label.string = "hello world cocos  55";
    }
}
