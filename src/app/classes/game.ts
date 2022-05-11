export class Game {
    public gameId: number;
    public name: string;
    public shortName: string;
    public type: string;
    public turn: string;
    public round: number;
    public attack: number;
    public timeLeft: string;
    public myNation: string;
    public status: string;
    public turnObj: any;
    public numPlayers: number;
    public size: number;
    public showDetailsFlg: boolean;
    public mmFlg: boolean;
    public host: string;
    public gameType: string;
    public autoStart: boolean;
    public autoSkip: boolean;
    public fogofwar: boolean;
    public hardFog: boolean;
    public auto_assign_flg: boolean;
    public restrict_units_flg: boolean;
    public no_stats_flg: boolean;
    public joinGameFlg: boolean;
    public bugFlg: boolean;
    public chatFlg: boolean;
    public inGame: boolean;
    public accountSitFlg: boolean;
    public slowResponseFlg: boolean;
    public staleFlg: boolean;
    public minRank: number;
    public maxRank: number;
    public players: any;


    constructor(obj: any) {
        this.gameId = obj.gameId;
        this.name = obj.name;
        this.shortName = obj.name;
        if (obj.name.length > 18)
            this.shortName = obj.name.substring(0, 18);
        this.type = obj.type;
        this.turn = obj.turn;
        this.round = obj.round;
        this.attack = obj.attack;
        this.timeLeft = obj.timeLeft;
        this.myNation = obj.myNation;
        this.turnObj = obj.turnObj;
        this.status = obj.status;
        this.numPlayers = obj.numPlayers;
        this.size = obj.size;
        this.mmFlg = obj.mmFlg;
        this.host = obj.host;
        this.autoStart = obj.autoStart;
        this.autoSkip = obj.autoSkip;
        this.fogofwar = obj.fogofwar;
        this.hardFog = obj.hardFog;
        this.auto_assign_flg = obj.auto_assign_flg;
        this.restrict_units_flg = obj.restrict_units_flg;
        this.no_stats_flg = obj.no_stats_flg;
        this.minRank = obj.minRank;
        this.maxRank = obj.maxRank;
        this.players = obj.players;
        this.joinGameFlg = obj.joinGameFlg;
        this.bugFlg = obj.bugFlg;
        this.chatFlg = obj.chatFlg;
        this.gameType = obj.gameType;
        this.inGame = obj.inGame;
        this.accountSitFlg = obj.accountSitFlg;
        this.slowResponseFlg = obj.slowResponseFlg;

        this.showDetailsFlg = false;
        this.staleFlg = false;
        if (this.timeLeft == '-Times up-')
            this.staleFlg = true;
        if (this.turnObj.seconds > 93600)
            this.staleFlg = true;
    }
}

