
import GameCtrl from "./GameCtrl";
import GameView from "./GameView/GameView";


const {ccclass, property} = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {


    @property(cc.Prefab)
    pokerPrefab: cc.Prefab = null;

    @property(cc.Node)
    pokerContainer: cc.Node = null

    @property(cc.Prefab)
    gameViewPrefab: cc.Prefab = null

    private m_GameView: GameView = null;
    private m_GameCtrl: GameCtrl = null;
    
    start () {
        console.log(">> GameScene start!")
        this.m_GameView = cc.instantiate(this.gameViewPrefab).getComponent(GameView)
        this.node.addChild(this.m_GameView.node)
        this.m_GameCtrl = new GameCtrl();
        console.log(">> GameScene Init!")
        this.m_GameCtrl.Init(this.m_GameView)
        console.log(">> GameScene Play!")
        this.m_GameCtrl.Play()

    }

    onDestroy () {
        this.m_GameCtrl.Exit()
    }
}
