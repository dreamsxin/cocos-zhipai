
import { puremvc } from "../../../GameFamework/MVC/puremvc";
import UIUtil from "../../../GameFamework/Util/UIUtil";
import { EPokerStatus } from "../../ConfigEnum";
import Pool from "../../Pool/Pool";
import UIPoker from "../../View/UIPoker/UIPoker";
import GameEvent from "../GameEvent";
import GameModel, { Poker } from "../GameModel";



const {ccclass, property} = cc._decorator;

@ccclass
export default class GameView extends puremvc.View<GameModel> {
    @property(cc.Prefab) pokerPrefab: cc.Prefab = null
    @property(cc.Node) initPokerArea: cc.Node = null
    @property(cc.Node) closeSendArea: cc.Node = null
    @property(cc.Node) openSendArea: cc.Node = null
    @property(cc.Node) receiveAreaList: cc.Node[] = []
    @property(cc.Node) playGroupRoot: cc.Node = null

    private m_Model: GameModel = null
    /********************************************************************
    * LifeCycle
    ********************************************************************/
    // public BindModel(model: GameModel) {
    //     console.log('>> GameView:BindModel')
    //     this.m_Model = model
    //     this.m_Model.on(GameEvent.SC_INIT_POKER, this.OnEventInitPokers, this)
    //     this.m_Model.on(GameEvent.SC_PLAY, this.OnEventPlay, this)
    //     this.m_Model.on(GameEvent.SC_INIT_GROUP_CARD, this.OnEventInitGroupCard, this)
    //     // this.on(GameEvent.SC_MOVE_POKER_FROM_PLAY_TO_RECEIVE, this.OnEventMovePokerFromPlayToReceive, this.m_Model)   
    // }
    // public UnbindModel() {
    //     console.log('>> GameView:UnbindModel')
    //     this.m_Model.off(GameEvent.SC_INIT_POKER, this.OnEventInitPokers)
    //     this.m_Model.off(GameEvent.SC_PLAY, this.OnEventPlay)
    //     this.m_Model.off(GameEvent.SC_INIT_GROUP_CARD, this.OnEventInitGroupCard)
    //     // this.off(GameEvent.SC_MOVE_POKER_FROM_PLAY_TO_RECEIVE, this.OnEventMovePokerFromPlayToReceive)
    //     this.m_Model = null;
    // }
    // public InitPokers(pokers: Poker[]){
    //     //创建所有扑克牌 UI
    //     pokers.forEach((poker, index) => {
    //         let uiPoker = this.CreateUIPoker(poker)
    //         uiPoker.node.x = 0.3*index
    //         uiPoker.node.y = 0.3*index
    //         this.initPokerArea.addChild(uiPoker.node)
    //     })
    // }  
    public Exit() {
        this.m_Model.pokers.forEach(p=>{
            Pool.getInstance().uipoker.put(p.view.node)
        })
    }

    // private OnPlay() {
    //     let stack: cc.Node[] = []
    //     for(let i = this.initPokerArea.children.length-1; i>=0; --i) {
    //         let child = this.initPokerArea.children[i]
    //         stack.push(child)
    //         this.initPokerArea.removeChild(child)
            
    //     }
    //     for(let i = stack.length-1; i>=0; --i) {
    //         let child = stack[i]
    //         this.closeSendArea.addChild(child)
    //     }
    // }

    /********************************************************************
    * DB  Event Handler
    ********************************************************************/
    listNotificationInterests(): string[]{
        return [GameEvent.SC_INIT_POKER, 
            GameEvent.SC_PLAY, 
            GameEvent.SC_INIT_GROUP_CARD,
            GameEvent.SC_MOVE_POKER_FROM_PLAY_TO_RECEIVE,
            GameEvent.SC_FLIP_POKER
        ]

    }

    handleNotification( notification:puremvc.INotification ): void{
        let notificationName = notification.getName()
        let body = notification.getBody();
        switch(notificationName) {
            case GameEvent.SC_INIT_POKER:
                this.OnEventInitPokers(body as Poker[])
                break;
            case GameEvent.SC_PLAY:
                this.OnEventPlay()
                break;
            case GameEvent.SC_INIT_GROUP_CARD:
                let { groupIndex, pokerIndex, poker} : {groupIndex: number, pokerIndex: number, poker: Poker} = body;
                this.OnEventInitGroupCard(groupIndex, pokerIndex, poker)
                break;
            case GameEvent.SC_MOVE_POKER_FROM_PLAY_TO_RECEIVE:
                this.OnEventMovePokerFromPlayToReceive(body as Poker)
                break;
            case GameEvent.SC_FLIP_POKER:
                this.OnEventFlipPoker(body as Poker)
                break;
            default:
                break;
        }
    }

    
    public OnEventInitPokers(pokers: Poker[]) {
        console.log('>> GameView:OnEventInitPokers')
         //创建所有扑克牌 UI
         pokers.forEach((poker, index) => {
            let uiPoker = this.CreateUIPoker(poker)
            uiPoker.node.x = 0.3*index
            uiPoker.node.y = 0.3*index
            this.initPokerArea.addChild(uiPoker.node)
        })

    }

    public OnEventPlay() {
        console.log('>> GameView:OnEventPlay')
        // |0 1 2 ... top
        for(let i = this.initPokerArea.children.length-1; i>=0; --i){
            let child = this.initPokerArea.children[i]
            this.initPokerArea.removeChild(child, false)
            this.closeSendArea.addChild(child)
        }
        //TODO 对各个节点进行排序
        this.m_Model.closeAreaPokers.forEach((p, index) => p.view.node.zIndex = index)
    }
 
    public OnEventInitGroupCard(groupIndex: number, pokerIndex: number, poker: Poker){
        console.log('>> GameView:OnEventInitGroupCard')
        let index = GameModel.CONST_RECEIVE_GROUPS*pokerIndex - pokerIndex*(pokerIndex-1)/2 - pokerIndex + groupIndex
        // console.log(`g:${groupIndex} c:${pokerIndex} p:${poker.point} index:${index}`)
        //先移动UI
        let node = poker.view.node
        UIUtil.move(node,this.playGroupRoot)
        node.zIndex = -1

        let delay = index*0.05
        let px = groupIndex*85
        let tw = cc.tween(node)
                    .delay(delay)
                    .call((node)=>{
                        node.zIndex = index
                    })
                    .to(0.5, {position: cc.v3(px, -30*pokerIndex, 0)})
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

    public OnEventMovePokerFromPlayToReceive(poker: Poker) {
        console.log('>> GameView:OnEventMovePokerFromPlayToReceive')
        let receiveIndex: number = null
        let node = poker.view.node
        let receiveArea: cc.Node = this.receiveAreaList[receiveIndex]
        console.log(`>> GameView:${node} receiveArea:${receiveArea.position}`)
        UIUtil.move(node, receiveArea)
        node.zIndex = poker.point
        cc.tween(node)
            .to(0.5, {position: receiveArea.position})
            .start()
    }

    public OnEventFlipPoker(poker: Poker) {
        console.log('>> GameView:OnEventFlipPoker')
        cc.tween(poker.view.node)
            .to(0.3, {scaleX: 0})
            .call((node)=>{
                poker.view.Refresh()
            })
            .to(0.3, {scaleX: 1})
            .start()
    }
    /********************************************************************
    * UI  Event Handler
    ********************************************************************/
    public OnClickNewGame() {
        //  this.emit(GameEvent.ON_CLICK_NEW_GAME)    
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
            console.log('>> GameView:OnClickUIPoker1')
            if(uiPoker.isOpen()) {
                console.log('>> GameView:OnClickUIPoker2')
                if(this.isIndexPlayAreaGroupTop(uiPoker)) {
                    console.log('>> GameView:OnClickUIPoker3')
                    if(uiPoker.isPoint(1)) {
                        console.log('>> GameView:OnClickUIPoker4')

                        // this.emit(GameEvent.SC_MOVE_POKER_FROM_PLAY_TO_RECEIVE, uiPoker.poker)
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
            console.log('>> GameView:CreateUIPoker')
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
