
import View from "../../../GameFamework/MVC/View";
import { EPokerStatus, ESuit } from "../../ConfigEnum";
import { Poker } from "../../GameScene/GameModel";
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

    private m_isTouchStart: boolean = false
    private m_isDragStart: boolean = false
    private m_StartToDragSchedule: Function = null
    private m_DragStartNodePostion: cc.Vec3 = null
    private m_TouchLocation: cc.Vec2 = null


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
    /********************************************************************
    * public Api
    ********************************************************************/
   //牌面是不是超上
   public isOpen(): boolean {
        //TODO
       return this.poker.status == EPokerStatus.OPEN
   }

   public isPoint(point:number): boolean {
        //TODO
        return this.poker.point == point
   }
    
    /********************************************************************
    * Event Handler
    ********************************************************************/
    onTouchStart (event: cc.Event.EventTouch) {
        if(this.m_isTouchStart){
            return
        }
        this.m_isTouchStart = true
        this.m_isDragStart = false
        // this.m_TouchLocation = event.getLocation()
        this.m_StartToDragSchedule = () => {
            console.log('>> UIPoker: Start TO Drag')
            this.m_isDragStart = true
            this.m_DragStartNodePostion = this.node.position
        }
        this.scheduleOnce(this.m_StartToDragSchedule, 0.2)
        let x = this.node.convertToNodeSpaceAR(event.getLocation()).x  
    }
    onTouchMove (event: cc.Event.EventTouch) {
        if(!this.m_isTouchStart){
            return
        }
        if(this.m_isDragStart) {
            if(this.m_TouchLocation == null) {
                this.m_TouchLocation = event.getLocation()
                console.log(`>> UIPoker: Touchx:${this.m_TouchLocation .x} Touchy: ${this.m_TouchLocation .y}`)

            }
            let newTouchLocation = event.getLocation()
            let dx = newTouchLocation.x - this.m_TouchLocation.x
            let dy = newTouchLocation.y - this.m_TouchLocation.y
            this.node.x = this.m_DragStartNodePostion.x + dx
            this.node.y = this.m_DragStartNodePostion.y + dy
            console.log(`>> UIPoker: x:${this.node.x} y: ${this.node.y}`)
        }
        
        // let x = this.node.convertToNodeSpaceAR(event.getLocation()).x
        
    }
    onTouchEnd (event: cc.Event.EventTouch) {
        if(!this.m_isTouchStart){
            return
        }
        this.m_isTouchStart = false
        this.unschedule(this.m_StartToDragSchedule)
        this.m_TouchLocation = null
        //复位动画
        if(this.m_isDragStart){
            this.m_isDragStart = false
            cc.tween(this.node)
                .to(0.2, {position: this.m_DragStartNodePostion})
                .start()
        }
        // let x = this.node.convertToNodeSpaceAR(event.getLocation()).x
        console.log(this.m_Poker)
        // this.m_View.OnClickUIPoker(this)
    }
}