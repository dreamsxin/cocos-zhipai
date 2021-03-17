export function ClickLock(seconds: number) {
    return function (target, methodName: string, descriptor: PropertyDescriptor) {
        let oldMethod = descriptor.value
        let isLock = false
        descriptor.value = function(...args: any[]) {
            if(isLock) {
                console.log('Decorator:ClickLock:Locking')
                return
            }
            isLock = true
            setTimeout(()=>{
                isLock = false
            },seconds*1000)
            oldMethod.apply(this, args)
        }
        return descriptor
    }
}