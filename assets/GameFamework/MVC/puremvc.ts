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

    interface INotifier
	{
		sendNotification( name:string, body?:any, type?:string ):void;
	}

    interface IObserver
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

	interface IMacroCommand
		extends ICommand
	{
		initiaLizeMacroCommand(): void;
	}

    interface IMediator
		extends INotifier
	{
		getMediatorName():string;
		getViewComponent():any;
		setViewComponent( viewComponent:any ):void;
		listNotificationInterests( ):string[];
		handleNotification( notification:INotification ):void;
		onRegister():void;
		onRemove():void;
	}
    interface IModel
	{
		registerProxy( proxy:IProxy ):void;
		removeProxy( proxyName:string ):IProxy;
		retrieveProxy<T extends IProxy>( proxyName:string ):T;
		hasProxy( proxyName:string ):boolean;
	}

	interface IController
	{
		executeCommand( notification:INotification ):void;
		registerCommand( notificationName:string, commandClassRef:Function ):void;
		hasCommand( notificationName:string ):boolean;
		removeCommand( notificationName:string ):void;
	}
	interface HView {
		registerObserver( notificationName:string, observer:IObserver ):void;
		removeObserver( notificationName:string, notifyContext:any ):void;
		notifyObservers( notification:INotification ):void;
		registerMediator( mediator:IMediator ):void;
		retrieveMediator( mediatorName:string ):IMediator;
		removeMediator( mediatorName:string ):IMediator;
		hasMediator( mediatorName:string ):boolean;
	  }

    interface IProxy
		extends INotifier
	{
		getProxyName():string;
		setData( data:any ):void;
		getData():any;
		onRegister( ):void;
		onRemove( ):void;
	}

	
	interface IFacade
		extends INotifier
	{
		registerCommand( notificationName:string, commandClassRef:Function ):void;
		removeCommand( notificationName:string ): void;
		hasCommand( notificationName:string ):boolean;
		registerProxy( proxy:IProxy ):void;
		retrieveProxy<T extends IProxy>( proxyName:string ):T;
		removeProxy( proxyName:string ):IProxy;
		hasProxy( proxyName:string ):boolean;
		registerMediator( mediator:IMediator ):void;
		retrieveMediator( mediatorName:string ):IMediator;
		removeMediator( mediatorName:string ):IMediator;
		hasMediator( mediatorName:string ):boolean;
		notifyObservers( notification:INotification ):void;
	}


	class HHModel implements IModel 
	{
		proxyMap: Object = null;
		constructor() {
			if (HHModel.instance)
				throw Error(HHModel.SINGLETON_MSG);
			HHModel.instance = this;
			this.proxyMap = {};
			this.initializeModel();
		}	
		initializeModel(): void {
		}
		
		registerProxy(proxy: IProxy): void {
			this.proxyMap[proxy.getProxyName()] = proxy;
			proxy.onRegister();
		}
		removeProxy(proxyName: string): IProxy {
			var proxy: IProxy = this.proxyMap[proxyName];
			if (proxy) {
				delete this.proxyMap[proxyName];
				proxy.onRemove();
			}
	
			return proxy;
		}
		retrieveProxy<T extends IProxy>(proxyName: string): T {
			//Return a strict null when the proxy doesn't exist
			return this.proxyMap[proxyName] || null;
		}
		hasProxy(proxyName: string): boolean {
			return this.proxyMap[proxyName] != null;
		}
		static SINGLETON_MSG: string = "Model singleton already constructed!";

		static instance: IModel;
		static getInstance(): IModel {
			if (!HHModel.instance)
				HHModel.instance = new HHModel();
			return HHModel.instance;
		}
	}

	class HHController implements IController {
		view: HView = null;
		commandMap: Object = null;
		constructor() {
			if (HHController.instance)
				throw Error(HHController.SINGLETON_MSG);
			HHController.instance = this;
			this.commandMap = {};
			this.initializeController();
		}
		initializeController(): void {
			this.view = HHView.getInstance();
		}
		executeCommand(notification: INotification): void {
		
			var commandClassRef: any = this.commandMap[notification.getName()];
			if (commandClassRef) {
				var command: ICommand = <ICommand> /*</>*/ new commandClassRef();
				command.execute(notification);
			}
		}
		registerCommand(notificationName: string, commandClassRef: Function): void {
			if (!this.commandMap[notificationName])
            this.view.registerObserver(notificationName, new Observer(this.executeCommand, this));
        	this.commandMap[notificationName] = commandClassRef;
		}
		hasCommand(notificationName: string): boolean {
			return this.commandMap[notificationName] != null;
		}
		removeCommand(notificationName: string): void {
			if (this.hasCommand(notificationName)) {
				this.view.removeObserver(notificationName, this);
				delete this.commandMap[notificationName];
			}
		}
		static instance: IController;
		static SINGLETON_MSG: string = "Controller singleton already constructed!";
		static getInstance(): IController {
			if (!HHController.instance)
				HHController.instance = new HHController();
			return HHController.instance;
		}
	}

	class HHView implements HView {
		mediatorMap: Object = null;
		observerMap: Object = null;
		constructor() {
			if (HHView.instance)
				throw Error(HHView.SINGLETON_MSG);
			HHView.instance = this;
			this.mediatorMap = {};
			this.observerMap = {};
			this.initializeView();
		}
		initializeView(): void {
		}
		registerObserver(notificationName: string, observer: IObserver): void {
			var observers: IObserver[] = this.observerMap[notificationName];
			if (observers)
				observers.push(observer);
			else
				this.observerMap[notificationName] = [observer];
		}
		removeObserver(notificationName: string, notifyContext: any): void {
			//The observer list for the notification under inspection
			var observers: IObserver[] = this.observerMap[notificationName];
			//Find the observer for the notifyContext.
			var i: number = observers.length;
			while (i--) {
				var observer: IObserver = observers[i];
				if (observer.compareNotifyContext(notifyContext)) {
					observers.splice(i, 1);
					break;
				}
			}
			if (observers.length == 0)
				delete this.observerMap[notificationName];
		}
		notifyObservers(notification: INotification): void {
			var notificationName: string = notification.getName();
	
			var observersRef/*Array*/ = this.observerMap[notificationName];
			if (observersRef) {
				// Copy the array.
				var observers/*Array*/ = observersRef.slice(0);
				var len/*Number*/ = observers.length;
				for (var i/*Number*/ = 0; i < len; i++) {
					var observer/*Observer*/ = observers[i];
					observer.notifyObserver(notification);
				}
			}
		}
		registerMediator(mediator: IMediator): void {
			var name: string = mediator.getMediatorName();
			//Do not allow re-registration (you must removeMediator first).
			if (this.mediatorMap[name])
				return;
			//Register the Mediator for retrieval by name.
			this.mediatorMap[name] = mediator;
	
			//Get Notification interests, if any.
			var interests: string[] = mediator.listNotificationInterests();
			var len: Number = interests.length;
			if (len > 0) {
				//Create Observer referencing this mediator's handlNotification method.
				var observer: IObserver = new Observer(mediator.handleNotification, mediator);
				//Register Mediator as Observer for its list of Notification interests.
				for (var i: number = 0; i < len; i++)
					this.registerObserver(interests[i], observer);
			}
	
			//Alert the mediator that it has been registered.
			mediator.onRegister();
		}
		retrieveMediator(mediatorName: string): IMediator {
			//Return a strict null when the mediator doesn't exist
			return this.mediatorMap[mediatorName] || null;
		}
		removeMediator(mediatorName: string): IMediator {
			// Retrieve the named mediator
			var mediator: IMediator = this.mediatorMap[mediatorName];
			if (!mediator)
				return null;
			//Get Notification interests, if any.
			var interests: string[] = mediator.listNotificationInterests();
			//For every notification this mediator is interested in...
			var i: number = interests.length;
			while (i--)
				this.removeObserver(interests[i], mediator);
			// remove the mediator from the map
			delete this.mediatorMap[mediatorName];
			//Alert the mediator that it has been removed
			mediator.onRemove();
			return mediator;
		}
		hasMediator(mediatorName: string): boolean {
			return this.mediatorMap[mediatorName] != null;
		}
		static SINGLETON_MSG: string = "View singleton already constructed!";
		static instance: HView;
		static getInstance(): HView {
			if (!HHView.instance)
				HHView.instance = new HHView();
			return HHView.instance;
		}
	}
	
	class Notifier
		implements INotifier
	{
        facade: IFacade = null;
        constructor (){

		}
        public sendNotification(name: string, body: any=null, type: string=null): void
		{

		}
    }
	export class MacroCommand
		extends Notifier
		implements ICommand, INotifier
	{
        subCommands: Function[] = null;
        constructor ()
		{
			super();
			this.subCommands = [];
			this.initializeMacroCommand();
		}
        initializeMacroCommand(): void
		{

		}
        addSubCommand(commandClassRef: Function): void
		{
			this.subCommands.push(commandClassRef);
		}
        execute(notification: INotification): void
		{
			var subCommands:Function[] = this.subCommands.slice(0);
			var len:number             = this.subCommands.length;
			for(var i:number; i<len; i++)
			{
				var commandClassRef:any     =subCommands[i];
				var commandInstance:ICommand = <ICommand> new commandClassRef();
				commandInstance.execute(notification);
			}
			this.subCommands.splice(0);
		}
    }
	
	export  class SimpleCommand
		extends Notifier
		implements ICommand, INotifier
	{
		execute(notification: INotification): void 
		{

		}
	}

	class Mediator<T>
		extends Notifier
		implements IMediator, INotifier
	{
		mediatorName: string = null;
		view:T = null;
		constructor (mediatorName: string=null, viewComponent: any=null)
		{
			super();
			this.mediatorName = (mediatorName != null) ? mediatorName : Mediator.NAME;
			this.view = viewComponent;
		}
		getMediatorName(): string
		{
			return this.mediatorName;
		}
		getViewComponent(): T
		{
			return this.view;
		}
	    setViewComponent(viewComponent: T): void
		{
			this.view = viewComponent;
		}
		listNotificationInterests(): string[]
		{
			return new Array<string>();
		}
		handleNotification(notification: INotification): void
		{

		}
		onRegister(): void
		{

		}
		onRemove(): void
		{

		}
		static NAME: string = 'Mediator';
	}

	class Observer
		implements IObserver
	{
		notify: Function = null;
		context: any = null;
		constructor (notifyMethod: Function, notifyContext: any)
		{
			this.setNotifyMethod( notifyMethod );
			this.setNotifyContext( notifyContext );
		}
		private getNotifyMethod(): Function
		{
			return this.notify;
		}
		setNotifyMethod( notifyMethod: Function ): void
		{
			this.notify = notifyMethod;
		}
		private getNotifyContext(): any
		{
			return this.context;
		}
		setNotifyContext(notifyContext: any): void
		{
			this.context = notifyContext
		}
		notifyObserver(notification: INotification): void
		{
			this.getNotifyMethod().call( this.getNotifyContext(), notification);
		}
		compareNotifyContext(object: any): boolean
		{
			return object === this.context;
		}
	}

	class Notification
		implements INotification
	{
		name: string = null;
		body: any = null;
		type: string = null;
		constructor (name: string, body?: any, type?: string)
		{
			this.name = name;
			this.body = body;
			this.type = type;
		}
		getName(): string
		{
			return this.name
		}
		setBody(body: any): void
		{
			this.body = body;
		}
		getBody(): any
		{
			return this.body;
		}
		setType(type: string): void
		{
			this.type = type
		}
		getType(): string
		{
			return this.type;
		}
		toString(): string
		{
			var msg:string = "Notification name: " + this.getName();
				msg       += "\nBody:" + (( this.getBody() == null) ? "null" : this.getBody().toString());
				msg       += "\nType:" + (( this.getType() == null) ? "null" : this.getType());
			return msg;
				
		}
	}

	class Proxy
		extends Notifier
		implements IProxy, INotifier
	{
        proxyName: string = null;
        data: any = null;
        constructor (proxyName: string=null, data: any=null){
			super()
			this.proxyName = (proxyName != null) ? proxyName: Proxy.NAME;
			if( data != null ) this.setData(data) ;
		}
        getProxyName(): string
		{
			return this.proxyName;
		}
        setData(data: any): void
		{
			this.data = data;
		}
        getData(): any
		{
			return this.data
		}
        onRegister(): void
		{

		}
        onRemove(): void
		{

		}
        static NAME: string = "Proxy";
    }

	export class Facade
		implements IFacade
	{
		model: HHModel = null;
		view: HHView = null;
		controller: HHController = null;
		constructor ()
		{
			if( Facade.instance )
				throw Error( Facade.SINGLETON_MSG );
			Facade.instance = this;
			this.initializeFacade();
		}
		initializeFacade(): void
		{
			this.initializeModel();
			this.initializeController();
			this.initializeView();
		}
		initializeModel(): void
		{
			// if( !this.model )
			// 	this.model = HHModel.getInstance();
		}
		initializeController(): void
		{
			// if( !this.controller )
			// 	this.controller = Controller.getInstance();
		}
		initializeView(): void
		{
			// if( !this.view)
			// 	this.view = View.getInstance();
		}
		registerCommand(notificationName: string, commandClassRef: Function): void
		{
			this.controller.registerCommand( notificationName, commandClassRef)
		}
		removeCommand(notificationName: string): void
		{
			this.controller.removeCommand( notificationName);
		}
		hasCommand(notificationName: string): boolean
		{
			return this.controller.hasCommand(notificationName);
		}
		registerProxy(proxy: IProxy): void
		{
			this.model.registerProxy( proxy);
		}
		retrieveProxy<T extends IProxy>(proxyName: string): T
		{
			return this.model.retrieveProxy( proxyName)
		}
		removeProxy(proxyName: string): IProxy
		{
			var proxy: IProxy;
			if (this.model)
            proxy = this.model.removeProxy(proxyName);
        	return proxy;
		}
		hasProxy(proxyName: string): boolean
		{
			return this.model.hasProxy( proxyName)
		}
		registerMediator(mediator: IMediator): void
		{
			if(this.view )
				this.view.registerMediator(mediator );
		}
		retrieveMediator(mediatorName: string): IMediator
		{
			return this.view.retrieveMediator( mediatorName );
		}
		removeMediator(mediatorName: string): IMediator
		{
			var mediator: IMediator;
			if( this.view )
				mediator = this.view.removeMediator( mediatorName);
			return mediator;
		}
		hasMediator(mediatorName: string): boolean
		{
			return this.view.hasMediator( mediatorName );
		}
		notifyObservers(notification: INotification): void
		{
			if(this.view)
				this.view.notifyObservers( notification);
		}
		sendNotification(name: string, body: any=null, type: string=null): void
		{
			this.notifyObservers( new Notification( name, body, type))
		}
		static SINGLETON_MSG: string = "Facade singleton already constructed!";
		static instance: IFacade;
		static getInstance(): IFacade
		{
			if(!Facade.instance)
				Facade.instance = new Facade();
			return Facade.instance;
		}
	}

	/**
   * COCOS Creator 增强
   */
	 interface IView {
		listNotificationInterests()                     :string[];
		handleNotification( notification: INotification):void;
	  }
	
	  interface IViewMediator {
		onLoad();
		onDestroy();
	  }
	
	  class ViewMediator<M> extends Mediator<View<M>> implements IViewMediator {
		private static _mediator_id: number = 0;
		constructor(viewComponent: View<M> )
		{
		  ++ViewMediator._mediator_id;
		  let mediatorName:string = "Mediator_" + ViewMediator._mediator_id
		  super(mediatorName, viewComponent);
		}
	
		onLoad() {
		  this.facade.registerMediator(this);
		}
	
		onDestroy() {
		  this.facade.removeMediator(this.getMediatorName());
		}
		
		onRegister() {
	
		}
	
		onRemove() {
	
		}
	
		listNotificationInterests(): string[] {
		  let viewComponent = this.getViewComponent();
		  return viewComponent.listNotificationInterests();
		}
	
		handleNotification( notification: INotification): void{
		  let viewComponent = this.getViewComponent();
		  return viewComponent.handleNotification(notification);
		}
	
	  }
	
	  export class Logic<T> extends Mediator<T> {
		private static _mediator_id: number = 0;
		protected constructor(viewComponent: T = null){
		  ++Logic._mediator_id;
		  let mediatorName:string = "LG_" + Logic._mediator_id;
		  super(mediatorName, viewComponent);
		}
	  }
	
	const {ccclass, property} = cc._decorator;
	
	  @ccclass
	  export class View<M> extends cc.Component implements IView {
		facade : IFacade     = null;
		private mediator_: ViewMediator<M> = null;
		protected _model: M = null;
		public get model(): M { return this._model;}
		public set model( model: M ) { this._model = model; }
		constructor() {
		  super();
		  this.facade  = Facade.getInstance();
		  this.mediator_ = new ViewMediator<M>(this);
		}
		onLoad() {
			this.mediator_.onLoad();
		}
		onDestroy() {
			this.mediator_.onDestroy();
		}
		listNotificationInterests(): string[] {
			return []
		}
		handleNotification( notification: INotification ):void{
			//通常由子类实现
		}
		
	  }
	  export class Controller<M, V> extends Logic<V> {
		protected _model: M = null;
		public get model(): M { return this._model }
		public set model(model: M) { this._model = model}
		protected constructor(viewComponent: V = null) 
		{
		  super(viewComponent);
		}
		
	  }
	
	  export class Model extends Proxy {
		constructor(proxyName: string=null, data:any = null) {
		  super(proxyName, data)
		  this.facade.registerProxy(this);
		}
		public Exit() {
			console.log(`Model:Exit:${this.proxyName}`)
			this.facade.removeProxy(this.proxyName)
		}  
	
	  }

	  
}
