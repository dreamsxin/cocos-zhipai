export namespace puremvc
{
    export interface INotification
	{
		getName():string;
		setBody( body:any ):void;
		getBody():any;
		setType( type:string ):void;
		getType():string;
		toString():string;
	}

    export interface INotifier
	{
		sendNotification( name:string, body?:any, type?:string ):void;
	}

    export interface IObserver
	{
		setNotifyMethod( notifyMethod:Function ):void;
		setNotifyContext( notifyContext:any ):void;
		notifyObserver( notification:INotification ):void;
		compareNotifyContext( object:any ):boolean;
	}

    interface ICommand
		extends INotifier
	{
		execute( notification:INotification ):void;
	}




}
