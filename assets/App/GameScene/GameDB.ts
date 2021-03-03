
import Model from "../../GameFamework/MVC/Model";
import { EPokerStatus, ESuit } from "../ConfigEnum";
import UIPoker from "../View/UIPoker/UIPoker";
import GameEvent from "./GameEvent";


export  class Poker {
    public point: number = -1;
    public suit: ESuit = ESuit.HEITAO;
    public get status(): EPokerStatus { return this._status}
    public set status(status: EPokerStatus) {
        this._status = status
    }
    private _status: EPokerStatus = EPokerStatus.CLOSE
    public get view(): UIPoker { return this._view}
    private _view: UIPoker = null

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
}

export class PokerGroup{
    private _pokers: Poker[] = []
    public get Pokers(): Poker[] { return this._pokers }
    public AddPoker(poker: Poker) {
        this._pokers.push(poker)
    }
}

export default class GameDB  extends Model{
    /********************************************************************
        * getter & setter
    ********************************************************************/
    public get pokers(): Poker[] {return this._pokers}
    public get closeAreaPokers(): Poker[] { return this._closeAreaPokers}
    public get openAreaPokers(): Poker[] { return this._openAreaPokers}
    public get receiveAreaPokerGroups(): PokerGroup[] { return this._receiveAreaPokerGroups}
    public get playAreaPokerGroups(): PokerGroup[] { return this._playAreaPokerGroups}
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
    private _receiveAreaPokerGroups: PokerGroup[] = []
    //玩牌区
    private _playAreaPokerGroups:PokerGroup[] = []


    public static readonly CONST_RECEIVE_GROUPS: number = 7
    public static readonly CONST_PLAY_GROUPS: number = 7
    /********************************************************************
     * public startic API
    ********************************************************************/
    public static Create(): GameDB {
        let gameDB = new GameDB()

        return gameDB
    }
    /********************************************************************
     * public API
    ********************************************************************/
    public Init() {
        //初始化牌局结构
        for(let i=0; i<GameDB.CONST_RECEIVE_GROUPS; ++i){
            let pokerGroup = new PokerGroup()
            this._receiveAreaPokerGroups.push(pokerGroup)
        }
        //初始化牌局结构
        for(let i=0; i<GameDB.CONST_PLAY_GROUPS; ++i){
            let pokerGroup = new PokerGroup()
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
        this.emit(GameEvent.INIT_POKER, this.pokers)
    }
    public Play() {
        //洗牌
        this.shuffle(this._pokers, 500)
        //将牌放到了发牌区
        let tmp = this._closeAreaPokers
        this._closeAreaPokers = this._pokers
        this._pokers = tmp
        //通知 UI 层，发生变化
        this.emit(GameEvent.PLAY, tmp)

        //发牌
        for(let cards = GameDB.CONST_RECEIVE_GROUPS; cards >= 1; --cards) {
            for(let i=0; i<cards; ++i){
                let cardGroupIndex = GameDB.CONST_RECEIVE_GROUPS - cards + i
                let cardGroup: PokerGroup = this._playAreaPokerGroups[cardGroupIndex]
                let poker = this._closeAreaPokers[this._closeAreaPokers.length - 1]
                this._closeAreaPokers.length = this._closeAreaPokers.length -1 
                poker.status = i === 0? EPokerStatus.OPEN : EPokerStatus.CLOSE
                cardGroup.AddPoker(poker)
                this.emit(GameEvent.INIT_GROUP_CARD, cardGroupIndex, GameDB.CONST_RECEIVE_GROUPS - cards, poker)
            }
        }
        
    }
    /********************************************************************
     * Event Handler
    ********************************************************************/ 
    public OnEventClickPoker(poker: Poker) {
        console.log(poker)
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

