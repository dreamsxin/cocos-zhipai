
import { puremvc } from "../../GameFamework/MVC/puremvc";
import { EPokerStatus, ESuit } from "../ConfigEnum";
import UIPoker from "../View/UIPoker/UIPoker";
import GameEvent from "./GameEvent";


export  class Poker {
    public point: number = -1;
    public suit: ESuit = ESuit.HEITAO;
    private _status: EPokerStatus = EPokerStatus.CLOSE
    public get status(): EPokerStatus { return this._status}
    public set status(status: EPokerStatus) {
        this._status = status
    }
    private _view: UIPoker = null
    public get view(): UIPoker { return this._view}
    public parent: any = null


    constructor(point: number, suit: ESuit, status: EPokerStatus){
        this.point = point
        this.suit = suit
        this._status = status
    }

    public Bind(view: UIPoker) {
        this._view = view
    }

    public UnBind() {
        this._view = null
    }

    public isConcatable(p: Poker): boolean {
        return this.point === p.point+1 && this.isSimilarSuit(p.suit)
      
    }

    private isSimilarSuit(suit: ESuit): boolean {
        return (suit + this.suit)%2 == 0
    }
}

export class PokerGroup{
    private _pokers: Poker[] = []
    public get Pokers(): Poker[] { return this._pokers }
    public AddPoker(poker: Poker) { 
        this._pokers.push(poker)
        poker.parent = this
        return poker
    }
    public RemovePoker(poker: Poker) { 
        console.assert(this.top == poker)
        this._pokers.length = this._pokers.length -1
        poker.parent = null
        return poker
    }

    public IsPokersEmpty(): boolean { return this._pokers.length === 0}
    public get top(): Poker { return this.IsPokersEmpty() ? null : this._pokers[this._pokers.length-1]}
    public index: number = null
}

class ReceivePokerGroup extends PokerGroup {
    suit:ESuit = null
    public IsNextPoker(poker: Poker): boolean {
        if(this.suit === poker.suit){
            if(this.top){
                return this.top.point+1 == poker.point
            }else{
                return poker.point === 1
            }
        }
        return false
    }
}

class PlayPokerGroup extends PokerGroup {
    public RemovePoker(poker: Poker) {
        let p = super.RemovePoker(poker)
        if(!this.IsPokersEmpty()) {
            this.top.status = EPokerStatus.OPEN
            // this.emit(GameEvent.SC_FLIP_POKER, this.top)
        }
        return poker
    }
}

export default class GameModel  extends puremvc.Model{
    /********************************************************************
        * getter & setter
    ********************************************************************/
    public get pokers(): Poker[] {return this._pokers}
    public get closeAreaPokers(): Poker[] { return this._closeAreaPokers}
    public get openAreaPokers(): Poker[] { return this._openAreaPokers}
    public get receiveAreaPokerGroups(): ReceivePokerGroup[] { return this._receiveAreaPokerGroups}
    public get playAreaPokerGroups(): PlayPokerGroup[] { return this._playAreaPokerGroups}
    /********************************************************************
            * property
    ********************************************************************/
    //所有扑克的原始数据
    private _pokers: Poker[] = []
    //发牌区盖着的扑克
    private _closeAreaPokers: Poker[] = []
    //发牌区开着的扑克
    private _openAreaPokers: Poker[] = []
    //收牌区
    private _receiveAreaPokerGroups: ReceivePokerGroup[] = []
    //玩牌区
    private _playAreaPokerGroups:PlayPokerGroup[] = []


    public static readonly CONST_RECEIVE_GROUPS: number = 4
    public static readonly CONST_PLAY_GROUPS: number = 7
    /********************************************************************
     * public startic API
    ********************************************************************/
    public static Create(): GameModel {
        let gameModel = new GameModel()

        return gameModel
    }
    /********************************************************************
     * public API
    ********************************************************************/
    public Init() {
        //初始化牌局结构
        for(let i=0; i< GameModel.CONST_RECEIVE_GROUPS; ++i){
            let pokerGroup = new ReceivePokerGroup()
            pokerGroup.index = this._receiveAreaPokerGroups.length
            pokerGroup.suit = i
            this._receiveAreaPokerGroups.push(pokerGroup)
        }
        //初始化牌局结构
        for(let i=0; i< GameModel.CONST_PLAY_GROUPS; ++i){
            let pokerGroup = new PokerGroup()
            pokerGroup.index = this._playAreaPokerGroups.length
            this._playAreaPokerGroups.push(pokerGroup)
        }
        //初始化扑克
        for(let point =1; point <= 13; point++){
            for(let suit = 0;suit < 4; suit++){
                let poker = new Poker(point, suit, EPokerStatus.CLOSE)
                this._pokers.push(poker)
            }
        }
        //派发初始化牌局的事件
        // this.emit(GameEvent.SC_INIT_POKER, this._pokers)
        this.facade.sendNotification(GameEvent.SC_INIT_POKER, this._pokers);
    }
    public Play() {
        //洗牌
        this.shuffle(this._pokers, 500)
        //将牌放到了发牌区
        let tmp = this._closeAreaPokers
        this._closeAreaPokers = this._pokers
        this._pokers = tmp
        //通知 UI 层，发生变化
        // this.emit(GameEvent.SC_PLAY, tmp)
        this.facade.sendNotification(GameEvent.SC_PLAY, tmp)
        //发牌
        for(let cards = GameModel.CONST_RECEIVE_GROUPS; cards >= 1; --cards) {
            for(let i=0; i<cards; ++i){
                let cardGroupIndex = GameModel.CONST_RECEIVE_GROUPS - cards + i
                let cardGroup: PokerGroup = this._playAreaPokerGroups[cardGroupIndex]
                let poker = this._closeAreaPokers[this._closeAreaPokers.length - 1]
                this._closeAreaPokers.length = this._closeAreaPokers.length -1 
                poker.status = i === 0? EPokerStatus.OPEN : EPokerStatus.CLOSE
                cardGroup.AddPoker(poker)
                //派发通知
                // this.emit(GameEvent.SC_INIT_GROUP_CARD, cardGroupIndex, GameModel.CONST_RECEIVE_GROUPS - cards, poker)
                this.facade.sendNotification(GameEvent.SC_INIT_GROUP_CARD,{
                    groupIndex: cardGroupIndex,
                    pokerIndex: GameModel.CONST_PLAY_GROUPS -cards,
                    poker: poker
                })
            }
        }
        
    }

    public isLocationPlayArea(poker: Poker): boolean {
        return this.playAreaPokerGroups.filter(
            pg => pg.Pokers.filter(p => p.point === poker.point && p.suit === poker.suit).length > 0).length > 0
    }
    public isIndexPlayAreaGroupTop(poker: Poker): boolean {
        for(let pg of this.playAreaPokerGroups) {
            let pokers = pg.Pokers
            if(pokers.length > 0) {
                let p = pokers[pokers.length-1]
                if(p.point === poker.point && p.suit === poker.suit){
                    return true
                }
            }
        }
        return false
    }
    /********************************************************************
     * Event Handler
    ********************************************************************/ 
    public OnPlayAreaPokerClick(poker: Poker) {
        console.log(`GameModel:OnEventPokerMoveFromPlayAreaToReceiveArea >> ${poker}`)
        if(poker.status == EPokerStatus.OPEN) {
            if(this.isIndexPlayAreaGroupTop(poker)){
                //TODO 询问收牌区是否有牌，是否可以承接纸牌
                for(let i=0; i<GameModel.CONST_RECEIVE_GROUPS; i++){
                    let rpg: ReceivePokerGroup = this._receiveAreaPokerGroups[i]
                    
                        if(rpg.IsNextPoker(poker)){
                            //TODO 做连接的数据操作
                            let parent: PlayPokerGroup = poker.parent
                            parent.RemovePoker(poker)
                            rpg.AddPoker(poker)
                            //do sth.
                            //派发消息
                            // this.emit(GameEvent.SC_MOVE_POKER_FROM_PLAY_TO_RECEIVE, poker)
                            // return
                            this.facade.sendNotification(GameEvent.SC_MOVE_POKER_FROM_PLAY_TO_RECEIVE,poker)
                        }
                    
                }
            }
        }
    }


    /********************************************************************
     * private API
    ********************************************************************/ 
    //洗牌
    private shuffle(pokers: Poker[], count: number = 100) {
        for(let i = 0; i<count; ++i) {
            let sIdx = parseInt('' + Math.random()* pokers.length, 10)
            let eIdx = parseInt('' + Math.random()* pokers.length, 10)
            let tmpVal = pokers[sIdx]
            pokers[sIdx] = pokers[eIdx]
            pokers[eIdx] = tmpVal
        }
    }
}

