import View from "../../../GameFamework/MVC/View";
import UIUtil from "../../../GameFamework/Util/UIUtil";
import { EPokerStatus } from "../../ConfigEnum";
import UIPoker from "../../View/UIPoker/UIPoker";
import GameDB, { Poker } from "../GameDB";



const {ccclass, property} = cc._decorator;

@ccclass
export default class GameView extends View {
    @property(cc.Prefab) pokerPrefab: cc.Prefab = null
    @property(cc.Node) initPokerArea: cc.Node = null
    @property(cc.Node) closeSendArea: cc.Node = null
    @property(cc.Node) openSendArea: cc.Node = null
    @property(cc.Node) receiveAreaList: cc.Node[] = []
    @property(cc.Node) playGroupRoot: cc.Node = null


    /********************************************************************
    * LifeCycle
    ********************************************************************/
   public onLoad() {
    //    for(let i = 0; i <= GameDB.CONST_RECEIVE_GROUPS; ++i) {
    //        let playGroup = new cc.Node()
    //        playGroup.position = new cc.Vec3(96*i,0 ,0)
    //        this.playGroupAnchor.addChild(playGroup)
    //        this.playGroupList.push(playGroup)
    //    }
   }

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
    * DB  Event Handler
    ********************************************************************/
    public OnEventInit(pokers) {
        this.InitPokers(pokers)

    }

    public OnEventPlay(pokers) {
        this.OnPlay()
    }
 
    public OnEventInitGroupCard(groupIndex: number, cardIndex: number, poker: Poker){
        let index = GameDB.CONST_RECEIVE_GROUPS*cardIndex - cardIndex*(cardIndex-1)/2 - cardIndex + groupIndex
        console.log(`g:${groupIndex} c:${cardIndex} p:${poker.point} index:${index}`)
        //先移动UI
        let node = poker.view.node
        UIUtil.move(node,this.playGroupRoot)

        let delay = index*0.05
        let px = groupIndex*85
        if(poker.status == EPokerStatus.OPEN){
            cc.tween(node)
                .delay(delay)
                .to(0.5, {position: cc.v3(px, -60*cardIndex)})
                .to(0.3, {scaleX: 0})
                .call(() => {
                    //UI 的显示状态刷新过来
                      poker.view.Refresh()
                })
                .to(0.3, {scaleX: 1})
                .start()
        }else{
            cc.tween(node)
                .delay(delay)
                .to(0.5, {position: cc.v3(px, -60*cardIndex)})
                .start()      
        }
        

    }

    /********************************************************************
    * private API
    ********************************************************************/
    private CreateUIPoker(poker: Poker): UIPoker {
        let uiPokerNode = cc.instantiate(this.pokerPrefab)
        let uiPoker: UIPoker =uiPokerNode.getComponent(UIPoker)
        uiPoker.Init(poker, this)
        return uiPoker
    }

}
