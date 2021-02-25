

import GameDB, { Poker } from "./GameDB"
import GameView from "./GameView/GameView"
/**
 * 游戏牌局的管理者
 */
export default class GameCtrl{
    private pokers: Poker[] = []
    private m_GameDB: GameDB = null
    private m_GameView: GameView = null

    public Init(gameView: GameView){
        this.m_GameView = gameView  
        this.m_GameDB = GameDB.Create() 
        this.m_GameView.InitPokers(this.m_GameDB.pokers)

    }

    public Start(){
        console.log(">> Game Ctrl start!")
        //移动所有牌到发牌区
        this.m_GameDB.Start()
        this.m_GameView.Start()
       
    }

  
}