import GameView from "../View/GameView/GameView";
import GameCtrl from "./GameCtrl";


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
        this.m_GameView = cc.instantiate(this.gameViewPrefab).getComponent(GameView)
        this.node.addChild(this.m_GameView.node)
        this.m_GameCtrl = new GameCtrl();
        this.m_GameCtrl.Init(this.m_GameView)
        this.m_GameCtrl.Start()

    }

    // update (dt) {}
}
