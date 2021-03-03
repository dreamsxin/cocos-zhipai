

import GameDB, { Poker } from "./GameDB"
import GameEvent from "./GameEvent"
import GameView from "./GameView/GameView"
/**
 * 游戏牌局的管理者
 */
export default class GameCtrl{
    private m_GameDB: GameDB = null
    private m_GameView: GameView = null

    public Init(gameView: GameView){
        this.m_GameView = gameView
        this.m_GameDB = new GameDB()  
        this.m_GameDB.on(GameEvent.INIT_POKER, this.m_GameView.OnEventInit, this.m_GameView)
        this.m_GameDB.on(GameEvent.PLAY, this.m_GameView.OnEventPlay, this.m_GameView)
        this.m_GameDB.on(GameEvent.INIT_GROUP_CARD, this.m_GameView.OnEventInitGroupCard, this.m_GameView)
        this.m_GameView.on(GameEvent.CLICK_POKER, this.m_GameDB.OnEventClickPoker, this.m_GameDB)
        this.m_GameDB.Init()

    }

    public Play(){
        console.log(">> Game Ctrl start!")
        //移动所有牌到发牌区
        this.m_GameDB.Play()
        
       
    }

    public Exit() {
        this.m_GameDB.off(GameEvent.INIT_POKER, this.m_GameView.OnEventInit)
        this.m_GameDB.off(GameEvent.PLAY, this.m_GameView.OnEventPlay)
        this.m_GameDB.off(GameEvent.INIT_GROUP_CARD, this.m_GameView.OnEventInitGroupCard)
        this.m_GameView.off(GameEvent.CLICK_POKER, this.m_GameDB.OnEventClickPoker)
    }
  
}