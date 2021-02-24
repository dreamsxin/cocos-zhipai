import Poker from "../Poker/Poker";
import UIPoker from "../Poker/UIPoker";


const {ccclass, property} = cc._decorator;

@ccclass
export default class GameView extends cc.Component {
    @property(cc.Prefab) pokerPrefab: cc.Prefab = null
    @property(cc.Node) closeSendArea: cc.Node = null
    @property(cc.Node) openSendArea: cc.Node = null
    @property(cc.Node) receiveAreaList: cc.Node[] = []
    @property(cc.Node) playGroupAnchor: cc.Node = null

    private playGroupAreaList: cc.Node[] = []

    public CreatePokers(pokers: Poker[]){
        //创建所有扑克牌 UI
        pokers.forEach((poker, index) => {
            let uiPoker = this.CreateUIPoker(poker)
            uiPoker.node.x = 0.5*index
            this.closeSendArea.addChild(uiPoker.node)
        })

    }

    private CreateUIPoker(poker: Poker): UIPoker {
        let uiPokerNode = cc.instantiate(this.pokerPrefab)
        let uiPoker: UIPoker =uiPokerNode.getComponent(UIPoker)
        uiPoker.Init(poker)
        // uiPoker.node.setPosition(Math.random()*300-150,Math.random()*600-200)
        return uiPoker
    }

}
