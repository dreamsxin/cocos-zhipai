


import { puremvc } from "../../GameFamework/MVC/puremvc"
import GameModel from "./GameModel"
import GameView from "./GameView/GameView"
/**
 * 游戏牌局的管理者
 */
export default class GameController extends puremvc.Controller<GameModel,GameView> {
    // private m_GameModel: GameModel= null
    // private m_GameView: GameView = null

    // public Init(gameView: GameView) {
    //     console.log(">> GameCtroller Init!")
    //     this.m_GameView = gameView
    //     this.m_GameModel = new GameModel()
    //     this.m_GameView.BindModel(this.m_GameModel)  
    //     this.m_GameModel.Init()

    // }
    public static Create(gameView:GameView): GameController {
        let obj = new GameController(gameView)
        obj.CreateModel()
        obj.Play()
        return obj
    }

    public Play() {
        console.log(">> GameCtroller Play!")
        //移动所有牌到发牌区
        this.model.Play()
        
       
    }

    public Exit() {
        console.log(">> GameCtroller Exit!")
        // this.m_GameView.UnbindModel()
        this.view.Exit()
        this.model.Exit()
    }

    protected CreateModel(){
        this.model = new GameModel()
        this.view.model = this.model
        this.model.Init()
    }
  
}