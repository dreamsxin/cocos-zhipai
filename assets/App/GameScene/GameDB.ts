import EventManager from "../../GameFamework/Event/EventManager";
import { EPokerStatus, ESuit } from "../ConfigEnum";
import GameEvent from "./GameEvent";


export  class Poker {
    public point: number = -1;
    public suit: ESuit = ESuit.HEITAO;
    public status: EPokerStatus = EPokerStatus.CLOSE
    constructor(point: number, suit: ESuit, status: EPokerStatus){
        this.point = point
        this.suit = suit
        this.status = status
    }
}

export class PokerGroup{
    private _pokers: Poker[] = []
    public get Pokers(): Poker[] { return this._pokers }
}

export default class GameDB {

    /********************************************************************
     * public startic API
     ********************************************************************/
    public static Create(): GameDB {
        let gameDB = new GameDB()

        return gameDB
    }

    public static readonly CONST_RECEIVE_GROUPS: number = null
    public static readonly CONST_PLAY_GROUPS: number = null
   /********************************************************************
     * public API
     ********************************************************************/
    public Play() {
        let tmp = this._closeAreaPokers
        this._closeAreaPokers = this._pokers
        this._pokers = this._closeAreaPokers
        //通知 UI 层，发生变化
        EventManager.getInstance().emit(GameEvent.PLAY, tmp)
        
    }





    /********************************************************************
     * private API
     ********************************************************************/
    constructor() {
        //初始化牌局机构
        for(let i=0; i<GameDB.CONST_RECEIVE_GROUPS; ++i){
            let pokerGroup = new PokerGroup()
            this._receiveAreaPokerGroups.push(pokerGroup)
        }
        //初始化牌局机构
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
        EventManager.getInstance().emit(GameEvent.INIT_POKER, this.pokers)
    }
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

 
}

