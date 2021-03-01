import { Singleton } from "../Base/Singleton";

/**
 * 事件管理器
 */
export default class EventManager extends Singleton {

    private subscribes: {} = {}
    private m_emit_reference_count: number = 0

    public on (name, func, target?) {
        if(!this.subscribes[name]) {
            this.subscribes[name] = []
        }
        this.subscribes[name].push({ f: func, del: false, target: target})
        return () => {
            this.off(name, func)
        };
    }

    public once(name, func, target?) {
        let unsubscribe = undefined
        unsubscribe = this.on(name, (...args: any[]) => {
            func.apply(target, args);
            unsubscribe();
        }, target);
        return unsubscribe;
    }

    public emit(name, ...args) {
        ++this.m_emit_reference_count
        if(this.subscribes[name]) {
            this.subscribes[name].forEach((v) => {
                if (v.f && !v.del) { v.f.apply(v.target, args)}
            });
        }
        --this.m_emit_reference_count
        return
    }

    public off(name, func) {
        if (this.subscribes[name]) {
            if (func) {
                this.subscribes[name].forEach( v => {
                    if(v.f === func) { v.del = true }
                });
            }else{
                this.subscribes[name].forEach(v => {
                    v.del = true
                });
            }
        }
        if(this.m_emit_reference_count === 0) {
            this.clear()
        }
    }

    private clear() {
        for(let name in this.subscribes) {
            this.subscribes[name] = this.subscribes[name].filter((v) => !v.del)
        }
    }

    
}