
import Poker from "../View/Poker/Poker"
import GameView from "../View/GameView/GameView"
import GameDB from "./GameDB"
/**
 * 游戏牌局的管理者
 */
export default class GameCtrl{
    private pokers: Poker[] = []
    private m_GameDB: GameDB = null
    private m_GameView: GameView = null

    public Init(gameView: GameView){
        this.m_GameDB = GameDB.Create()
        this.m_GameView = gameView        
    }

    public Start(){
        console.log(">> Game Ctrl start!")
        this.m_GameView.CreatePokers(this.m_GameDB.pokers) 
    }

  
}