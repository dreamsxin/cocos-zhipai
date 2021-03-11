


import GameModel from "./GameModel"
import GameView from "./GameView/GameView"
/**
 * 游戏牌局的管理者
 */
export default class GameCtroller {
    private m_GameModel: GameModel= null
    private m_GameView: GameView = null

    public Init(gameView: GameView) {
        console.log(">> GameCtroller Init!")
        this.m_GameView = gameView
        this.m_GameModel = new GameModel()
        this.m_GameView.BindModel(this.m_GameModel)  
        this.m_GameModel.Init()

    }

    public Play() {
        console.log(">> GameCtroller Play!")
        //移动所有牌到发牌区
        this.m_GameModel.Play()
        
       
    }

    public Exit() {
        console.log(">> GameCtroller Exit!")
        this.m_GameView.UnbindModel()
    }
  
}