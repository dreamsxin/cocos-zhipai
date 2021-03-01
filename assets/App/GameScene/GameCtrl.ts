

import EventManager from "../../GameFamework/Event/EventManager"
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
        EventManager.getInstance().on(GameEvent.INIT_POKER, this.m_GameView.OnEventInit, this.m_GameView)
        EventManager.getInstance().on(GameEvent.PLAY, this.m_GameView.OnEventPlay, this.m_GameView)
        this.m_GameDB = GameDB.Create()

    }

    public Play(){
        console.log(">> Game Ctrl start!")
        //移动所有牌到发牌区
        this.m_GameDB.Play()
        
       
    }

    public Exit() {
        EventManager.getInstance().off(GameEvent.INIT_POKER, this.m_GameView.OnEventInit)
    }
  
}