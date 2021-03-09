export default class GameEvent {
    //内部通信消息
    public static ON_CLICK_NEW_GAME: string = 'ON_CLICK_NEW_GAME'
    //VieW 发出的消息
    // public static CLICK_POKER: string = 'CLICK_POKER'
    
    //数据库发出的消息
    public static SC_INIT_POKER: string = 'SC_INIT_POKER'
    public static SC_PLAY: string = 'SC_PLAY'
    public static SC_INIT_GROUP_CARD: string = 'SC_INIT_GROUP_CARD'
    public static SC_MOVE_POKER_FROM_PLAY_TO_RECEIVE: string = 'SC_MOVE_POKER_FROM_PLAY_TO_RECEIVE'
    public static SC_FLIP_POKER: string = 'SC_FLIP_POKER'

}