import Model from "../../../GameFamework/MVC/Model";
import View from "../../../GameFamework/MVC/View";
import UIUtil from "../../../GameFamework/Util/UIUtil";
import { EPokerStatus } from "../../ConfigEnum";
import Pool from "../../Pool/Pool";
import UIPoker from "../../View/UIPoker/UIPoker";
import GameDB, { Poker } from "../GameModel";
import GameEvent from "../GameEvent";



const {ccclass, property} = cc._decorator;

@ccclass
export default class GameView extends View {
    @property(cc.Prefab) pokerPrefab: cc.Prefab = null
    @property(cc.Node) initPokerArea: cc.Node = null
    @property(cc.Node) closeSendArea: cc.Node = null
    @property(cc.Node) openSendArea: cc.Node = null
    @property(cc.Node) receiveAreaList: cc.Node[] = []
    @property(cc.Node) playGroupRoot: cc.Node = null

    private m_Model: GameDB = null

    /********************************************************************
    * LifeCycle
    ********************************************************************/
    public BindModel(model: GameDB) {
        this.m_Model = model
        this.m_Model.on(GameEvent.INIT_POKER, this.OnEventInitPokers, this)
        this.m_Model.on(GameEvent.PLAY, this.OnEventPlay, this)
        this.m_Model.on(GameEvent.INIT_GROUP_CARD, this.OnEventInitGroupCard, this)
        this.on(GameEvent.CS_POKER_MOVE_FROM_PLAYAREA_TO_RECEIVERAREA, this.m_Model.OnEventPokerMoveFromPlayAreaToReceiveArea, this.m_Model)
    }

    public UnbindModel() {
        this.m_Model.off(GameEvent.INIT_POKER, this.OnEventInitPokers)
        this.m_Model.off(GameEvent.PLAY, this.OnEventPlay)
        this.m_Model.off(GameEvent.INIT_GROUP_CARD, this.OnEventInitGroupCard)
        this.off(GameEvent.CS_POKER_MOVE_FROM_PLAYAREA_TO_RECEIVERAREA, this.m_Model.OnEventPokerMoveFromPlayAreaToReceiveArea)
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

    public Exit() {
        this.m_Model.pokers.forEach(p=>{
            Pool.getInstance().uipoker.put(p.view.node)
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
    listNotificationInterests(): string[]{
        return [GameEvent.INIT_POKER, GameEvent.PLAY, GameEvent.INIT_GROUP_CARD]
    }
    
    public OnEventInitPokers(pokers: Poker[]) {
         //创建所有扑克牌 UI
         pokers.forEach((poker, index) => {
            let uiPoker = this.CreateUIPoker(poker)
            uiPoker.node.x = 0.3*index
            uiPoker.node.y = 0.3*index
            this.initPokerArea.addChild(uiPoker.node)
        })

    }

    public OnEventPlay() {
        // |0 1 2 ... top
        for(let i = this.initPokerArea.children.length-1; i>=0; --i){
            let child = this.initPokerArea.children[i]
            this.initPokerArea.removeChild(child, false)
            this.closeSendArea.addChild(child)
        }
        //TODO 对各个节点进行排序
        this.m_Model.closeAreaPokers.forEach((p, index) => p.view.node.zIndex = index)
    }
 
    public OnEventInitGroupCard(groupIndex: number, cardIndex: number, poker: Poker){
        let index = GameDB.CONST_RECEIVE_GROUPS*cardIndex - cardIndex*(cardIndex-1)/2 - cardIndex + groupIndex
        console.log(`g:${groupIndex} c:${cardIndex} p:${poker.point} index:${index}`)
        //先移动UI
        let node = poker.view.node
        UIUtil.move(node,this.playGroupRoot)

        let delay = index*0.05
        let px = groupIndex*85
        let tw = cc.tween(node)
                    .delay(delay)
                    .call((node)=>{
                        node.zIndex = index
                    })
                    .to(0.5, {position: cc.v2(px, -30*pokerIndex)})
        if(poker.status == EPokerStatus.OPEN){
            tw = tw.to(0.3, {scaleX: 0})
                .call(() => {
                    //UI 的显示状态刷新过来
                      poker.view.Refresh()
                })
                .to(0.3, {scaleX: 1})
        }
        tw.start()
    }
    /********************************************************************
    * UI  Event Handler
    ********************************************************************/
    public OnClickNewGame() {
        this.facade.sendNotification(GameEvent.ON_CLICK_NEW_GAME)
    }

    /********************************************************************
    * Interface for UIPoker
    ********************************************************************/
    public OnClickUIPoker(uiPoker: UIPoker){
        //TODO
        //1.这张牌在玩牌区
        //2.这张牌是翻开的
        //3.这张牌是最上方的一张牌
        //4.这张牌的点数是A
        //-->这张牌可以移动到手牌区
        if(this.isLocationPlayArea(uiPoker)) {
            if(uiPoker.isOpen()) {
                if(this.isIndexPlayAreaGroupTop(uiPoker)) {
                    if(uiPoker.isPoint(1)) {
                        this.emit(GameEvent.CS_POKER_MOVE_FROM_PLAYAREA_TO_RECEIVERAREA, uiPoker.poker)
                    }
                }
            }
        }
    }


    /********************************************************************
    * private API
    ********************************************************************/
    private CreateUIPoker(poker: Poker): UIPoker {
        let uiPokerNode = Pool.getInstance().uipoker.get()
        if( uiPokerNode == null) {
            uiPokerNode = cc.instantiate(this.pokerPrefab)
        }
        
        let uiPoker: UIPoker =uiPokerNode.getComponent(UIPoker)
        uiPoker.Init(poker, this)
        return uiPoker
    }
    private isLocationPlayArea(uiPoker: UIPoker): boolean {
        return this.m_Model.isLocationPlayArea(uiPoker.poker)
    }
    private isIndexPlayAreaGroupTop(uiPoker: UIPoker): boolean {
        return this.m_Model.isIndexPlayAreaGroupTop(uiPoker.poker)
    }
    

}
