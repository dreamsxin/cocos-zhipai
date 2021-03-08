

import GameDB, { Poker } from "./GameModel"
import GameView from "./GameView/GameView"
/**
 * 游戏牌局的管理者
 */
export default class GameCtroller {
    private m_GameDB: GameDB = null
    private m_GameView: GameView = null

    public Init(gameView: GameView) {
        this.m_GameView = gameView
        this.m_GameDB = new GameDB()
        this.m_GameView.BindModel(this.m_GameDB)  
        this.m_GameDB.Init()

    }

    public Play() {
        console.log(">> Game Ctrl start!")
        //移动所有牌到发牌区
        this.m_GameDB.Play()
        
       
    }

    public Exit() {
        this.m_GameView.UnbindModel()
    }
  
}