import UIPoker from "../../View/UIPoker/UIPoker";
import GameDB, { Poker } from "../GameDB";



const {ccclass, property} = cc._decorator;

@ccclass
export default class GameView extends cc.Component {
    @property(cc.Prefab) pokerPrefab: cc.Prefab = null
    @property(cc.Node) initPokerArea: cc.Node = null
    @property(cc.Node) closeSendArea: cc.Node = null
    @property(cc.Node) openSendArea: cc.Node = null
    @property(cc.Node) receiveAreaList: cc.Node[] = []
    @property(cc.Node) playGroupAnchor: cc.Node = null

    private playGroupAreaList: cc.Node[] = [] 

    /********************************************************************
    * private API
    ********************************************************************/

    public InitPokers(pokers: Poker[]){
        //创建所有扑克牌 UI
        pokers.forEach((poker, index) => {
            let uiPoker = this.CreateUIPoker(poker)
            uiPoker.node.x = 0.3*index
            uiPoker.node.y = 0.3*index
            this.initPokerArea.addChild(uiPoker.node)
        })

    }

    private OnPlay() {
        let stack: cc.Node[] = []
        for(let i = this.initPokerArea.children.length-1; i>=0; --i) {
            let child = this.initPokerArea.children[i]
            stack.push(child)
            this.initPokerArea.removeChild(child)
            
        }
        for(let i = stack.length-1; i>=0; --i) {
            let child = stack[i]
            this.closeSendArea.addChild(child)
        }
    }
    /********************************************************************
    * Event Handler
    ********************************************************************/
    public OnEventInit(pokers) {
        this.InitPokers(pokers)

    }

    public OnEventPlay(pokers) {
        this.OnPlay()
    }


    /********************************************************************
    * private API
    ********************************************************************/
    private CreateUIPoker(poker: Poker): UIPoker {
        let uiPokerNode = cc.instantiate(this.pokerPrefab)
        let uiPoker: UIPoker =uiPokerNode.getComponent(UIPoker)
        uiPoker.Init(poker)
        // uiPoker.node.setPosition(Math.random()*300-150,Math.random()*600-200)
        return uiPoker
    }

}
