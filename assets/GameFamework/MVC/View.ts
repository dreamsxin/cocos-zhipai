import Event from "../Event/Event";

const {ccclass} = cc._decorator;

@ccclass
export default class View extends cc.Component {
    private m_Event: Event = new Event()

    public on (name, func, target?) { return this.m_Event.on(name, func, target) }
    public once (name, func, target?) { return this.m_Event.once(name, func, target) }
    public emit (name, ...args) { return this.m_Event.emit(name, ...args) }
    public off (name, func) { return this.m_Event.off(name, func) }


}
