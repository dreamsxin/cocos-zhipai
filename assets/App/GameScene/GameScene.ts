

import { puremvc } from "../../GameFamework/MVC/puremvc";
import GameController from "./GameController";
import GameEvent from "./GameEvent";
import GameView from "./GameView/GameView";


const {ccclass, property} = cc._decorator;

@ccclass
export default class GameScene extends puremvc.View<any> {


    @property(cc.Prefab)pokerPrefab: cc.Prefab = null;
    @property(cc.Prefab)gameViewPrefab: cc.Prefab = null

    private m_GameView: GameView = null;
    private m_GameController: GameController = null;
    
    start () {
        console.log(">> GameScene start!")
        this.m_GameView = cc.instantiate(this.gameViewPrefab).getComponent(GameView)
        this.node.addChild(this.m_GameView.node)
        // this.m_GameCtroller = new GameCtroller();
        // this.m_GameCtroller.Init(this.m_GameView)
        // this.m_GameCtroller.Play()
        this.m_GameController = GameController.Create(this.m_GameView)

    }


    NewGame() {
        console.log(">> GameScene NewGame!")
        this.ExitGame(this.m_GameController)
        this.m_GameController = GameController.Create(this.m_GameView)
    }
    ExitGame(gameController: GameController) {
        if(gameController != null) {
            gameController.Exit()
        }
    }

    listNotificationInterests(): string[]
    {
        return [ GameEvent.ON_CLICK_NEW_GAME]
    }
    handleNotification( notification: puremvc.INotification ): void
    {
        let notificationName = notification.getName();
        let body = notification.getBody;
        console.log(`>>GameScene: handleNotification:${notification}`)
        switch (notificationName) {
            case GameEvent.ON_CLICK_NEW_GAME:
                this.NewGame()
                break;
            default:
                break;
        }
    }

}
