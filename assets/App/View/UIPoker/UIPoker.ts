
import View from "../../../GameFamework/MVC/View";
import { EPokerStatus, ESuit } from "../../ConfigEnum";
import { Poker } from "../../GameScene/GameDB";
import GameEvent from "../../GameScene/GameEvent";
import GameView from "../../GameScene/GameView/GameView";

const POINT_MAP = {
    "1": "A",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "10": "10",
    "11": "J",
    "12": "Q",
    "13": "K",

}

const {ccclass, property} = cc._decorator

@ccclass
export default class UIPoker extends View {
    @property(cc.Sprite)
    bgSuitSprite: cc.Sprite =null;

    @property(cc.Sprite)
    bigSuitSprite: cc.Sprite =null;

    @property(cc.Sprite)
    smallSuitSprite: cc.Sprite =null;

    @property(cc.Label)
    pointLabel: cc.Label = null;

    //resources
    @property(cc.SpriteFrame) texFrontBG: cc.SpriteFrame = null
    @property(cc.SpriteFrame) texBackBG: cc.SpriteFrame = null
    @property(cc.SpriteFrame) bigSuits: cc.SpriteFrame[] = []
    @property(cc.SpriteFrame) smallSuits: cc.SpriteFrame[] = []
    @property(cc.SpriteFrame) texFaces: cc.SpriteFrame[] = []

    private redTextColor: cc.Color = cc.color(183, 24, 40)
    private blackTextColor: cc.Color = cc.Color.BLACK

    private m_Poker: Poker = null;
    public get poker(): Poker { return this.m_Poker }
    private m_View: GameView = null


    /********************************************************************
    * LifeCycle
    ********************************************************************/
    public start() {
        //注册触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
    }

    public Init(poker: Poker, view: GameView) {
        this.m_Poker = poker
        this.m_View = view
        poker.Bind(this)
        this.pointLabel.string = `${POINT_MAP[poker.point]}`;
        this.pointLabel.node.color = (poker.suit == ESuit.HEITAO || poker.suit == ESuit.MEIHUA ) ? this.blackTextColor : this.redTextColor

        if(poker.point >= 11){
            this.bigSuitSprite.spriteFrame = this.texFaces[poker.point-11]
        }else{
            this.bigSuitSprite.spriteFrame = this.bigSuits[poker.suit]
        }
        this.smallSuitSprite.spriteFrame = this.smallSuits[poker.suit]
        this.setStatus(poker.status)
    }

    private setStatus (status: EPokerStatus){
        if(status == EPokerStatus.CLOSE){
            this.pointLabel.node.active = false
            this.smallSuitSprite.node.active = false
            this.bigSuitSprite.node.active = false
            this.bgSuitSprite.spriteFrame = this.texBackBG
        }else{
            this.pointLabel.node.active = true
            this.smallSuitSprite.node.active = true
            this.bigSuitSprite.node.active = true
            this.bgSuitSprite.spriteFrame = this.texFrontBG

        }

    }

    onDestroy () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
    }

    public Refresh() {
        this.setStatus(this.m_Poker.status)
    }

    onTouchStart (event) {
        let x = this.node.convertTouchToNodeSpaceAR(event).x  
    }
    onTouchMove (event) {
        let x = this.node.convertTouchToNodeSpaceAR(event).x
        
    }
    onTouchEnd (event) {
        let x = this.node.convertTouchToNodeSpaceAR(event).x
        this.m_View.emit(GameEvent.CLICK_POKER, this.m_Poker)
        console.log(this.m_Poker)
        this.m_View.OnClickUIPoker(this)
    }
}