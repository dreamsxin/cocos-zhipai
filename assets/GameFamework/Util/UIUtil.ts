export default class UIUtil {
    public static move(this: UIUtil,node: cc.Node, targetParent: cc.Node, cleanup: boolean = false){
        let wp = node.convertToWorldSpaceAR(cc.v3(0,0, 0))
        let pp = targetParent.convertToNodeSpaceAR(wp)
        node.removeFromParent(cleanup)
        node.position = pp
        targetParent.addChild(node)
        return this
    }
}