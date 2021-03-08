import { Singleton } from "../../GameFamework/Base/Singleton";
import UIPoker from "../View/UIPoker/UIPoker";

export default class Pool extends Singleton {
    uipoker = new cc.NodePool(UIPoker)
}