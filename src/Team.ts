/**
 * Team
 * License: Apache 2.0
 * author: Ciarán McCann
 * Modificado por PCD Software 2026
 */
///<reference path="Worm.ts"/>
///<reference path="system/Utilies.ts"/>
///<reference path="weapons/WeaponManager.ts"/>
///<reference path="animation/BounceArrow.ts"/>

class Team
{
    worms: Worm[];
    currentWorm: number;
    weaponManager: WeaponManager;
    color;
    name;
    graveStone: string;
    teamId;
    initalNumberOfWorms: number;
    hat: string;
    victoryCry: string;

    static teamCount = 0;

    constructor(playerId)
    {
        // ── Leer config personalizada si existe ──────────────────
        var cfg = null;
        if (typeof window !== 'undefined' && window['_myTeamConfig'])
        {
            cfg = window['_myTeamConfig'];
        }

        // Color
        this.color = cfg && cfg.color
            ? cfg.color
            : Utilies.pickUnqine(["#FA6C1D", "#12AB00", "#B46DD2", "#B31A35", "#23A3C6", "#9A4C44"], "colors");

        // Nombre del equipo
        this.name = cfg && cfg.name
            ? cfg.name
            : "Team " + Team.teamCount;

        // Sombrero
        this.hat = cfg && cfg.hat ? cfg.hat : "none";

        // Grito de victoria
        this.victoryCry = cfg && cfg.victory ? cfg.victory : "Victory!";

        // Lápida
        this.graveStone = Utilies.pickUnqine(["grave1","grave2","grave3","grave4","grave5","grave6"], "gravestones");

        this.teamId = playerId;
        Team.teamCount++;

        this.weaponManager = new WeaponManager();
        this.currentWorm = 0;
        this.initalNumberOfWorms = 4;

        this.worms = new Array(this.initalNumberOfWorms);
        for (var i = 0; i < this.initalNumberOfWorms; i++)
        {
            var tmp = Game.map.getNextSpawnPoint();
            // Nombre personalizado del gusano si existe
            var wormName = cfg && cfg.worms && cfg.worms[i] ? cfg.worms[i] : null;
            this.worms[i] = new Worm(this, tmp.x, tmp.y, wormName);
        }

        // Una vez usada la config, la borramos para que el equipo 2
        // no la reutilice si no tiene config propia
        if (typeof window !== 'undefined')
        {
            window['_myTeamConfig'] = null;
        }
    }

    getTeamNetData()
    {
        var packet = {};
        for (var w in this.worms)
        {
            packet[w] = this.worms[w].getWormNetData();
        }
        return packet;
    }

    setTeamNetData(packetStream)
    {
        for (var w in packetStream)
        {
            this.worms[w].setWormNetData(packetStream[w]);
        }
    }

    getPercentageHealth()
    {
        var totalHealth = 0;
        for (var worm in this.worms)
        {
            totalHealth += this.worms[worm].health;
        }
        return totalHealth / this.initalNumberOfWorms;
    }

    areAllWormsDead()
    {
        for (var worm in this.worms)
        {
            if (this.worms[worm].isDead == false)
            {
                return false;
            }
        }
        return true;
    }

    getCurrentWorm()
    {
        return this.worms[this.currentWorm];
    }

    nextWorm()
    {
        if (this.currentWorm + 1 == this.worms.length)
        {
            this.currentWorm = 0;
        }
        else
        {
            this.currentWorm++;
        }

        if (this.worms[this.currentWorm].isDead)
        {
            this.nextWorm();
        }
        else
        {
            this.worms[this.currentWorm].activeWorm();
        }
    }

    getWeaponManager()
    {
        return this.weaponManager;
    }

    setCurrentWorm(wormIndex)
    {
        this.currentWorm = wormIndex;
    }

    getWorms()
    {
        return this.worms;
    }

    celebrate()
    {
        for (var w in this.worms)
        {
            var worm: Worm = this.worms[w];
            worm.setSpriteDef(Sprites.worms.weWon, true);
        }

        // Mostrar grito de victoria personalizado
        if (typeof document !== 'undefined')
        {
            var cry = document.getElementById('victoryCryDisplay');
            if (!cry)
            {
                cry = document.createElement('div');
                cry.id = 'victoryCryDisplay';
                cry.style.cssText = 'position:fixed;top:30%;left:50%;transform:translateX(-50%);' +
                    'background:rgba(0,0,0,0.8);color:#ffff88;font-size:32px;' +
                    'padding:24px 48px;border-radius:12px;z-index:9999;text-align:center;';
                document.body.appendChild(cry);
            }
            cry.textContent = this.name + ': ' + this.victoryCry;
            cry.style.display = 'block';
            setTimeout(function() { cry.style.display = 'none'; }, 5000);
        }

        GameInstance.camera.panToPosition(Physics.vectorMetersToPixels(this.worms[0].body.GetPosition()));
        AssetManager.getSound("victory").play(1, 15);
        AssetManager.getSound("Ireland").play(1, 16);
    }

    update()
    {
        var cachedLenght = this.worms.length;
        for (var i = 0; i < cachedLenght; i++)
        {
            this.worms[i].update();
        }
    }

    draw(ctx)
    {
        var cachedLenght = this.worms.length;
        for (var i = 0; i < cachedLenght; i++)
        {
            this.worms[i].draw(ctx);
        }
    }
}

class TeamDataPacket
{
    wormsDataPacket: WormDataPacket[];
    name;
    graveStone;
    color;
    hat;
    victoryCry;

    constructor(team: Team)
    {
        this.graveStone  = team.graveStone;
        this.name        = team.name;
        this.color       = team.color;
        this.hat         = team.hat;
        this.victoryCry  = team.victoryCry;

        this.wormsDataPacket = [];
        for (var w in team.worms)
        {
            this.wormsDataPacket.push(new WormDataPacket(team.worms[w]));
        }
    }

    override(team: Team)
    {
        team.name       = this.name;
        team.graveStone = this.graveStone;
        team.color      = this.color;
        team.hat        = this.hat;
        team.victoryCry = this.victoryCry;

        for (var w in this.wormsDataPacket)
        {
            this.wormsDataPacket[w].override(team.getWorms()[w]);
        }
    }
}
