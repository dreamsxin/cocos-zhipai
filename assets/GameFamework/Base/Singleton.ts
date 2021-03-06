
export  class Singleton {
    // private static instance: any = null;
    public static getInstance<T extends {}>(this: new () => T): T {

        if (!(<any>this).instance) {
            (<any>this).instance = new this();
        }
        return (<any>this).instance;
    }
}
