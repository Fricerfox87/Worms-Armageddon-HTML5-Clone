///<reference path="../system/Physics.ts"/>

class Airstrike extends BaseWeapon
{
    private bombsLeft: number;
    private bombTimer: Timer;
    private targetX: number;
    private planeX: number;
    private planeY: number;
    private active: boolean;

    constructor(ammo: number)
    {
        super("Airstrike", ammo,
            Sprites.weapons.airstrike,
            Sprites.worms.idle1,
            Sprites.worms.idle1
        );
        this.requiresAiming = false;
        this.active = false;
    }

    activate(worm)
    {
        this.setIsActive(true);
        this.ammo--;
        this.worm   = worm;
        this.active = true;

        // X objetivo = posición del cursor del jugador
        this.targetX  = Physics.metersToPixels(worm.body.GetPosition().x);
        this.planeX   = -100;
        this.planeY   = 60;
        this.bombsLeft = 5;
        this.bombTimer = new Timer(400);

        AssetManager.getSound("airstrike") && AssetManager.getSound("airstrike").play(0.8);
        Logger.debug("Airstrike activated at X=" + this.targetX);
    }

    update()
    {
        if (!this.active) return;

        // El avión avanza hacia la derecha
        this.planeX += 6;
        this.bombTimer.update();

        // Suelta una bomba cada 400ms mientras está sobre la zona objetivo
        if (this.bombTimer.hasTimePeriodPassed() && this.bombsLeft > 0)
        {
            var spreadX = this.targetX + (Math.random() - 0.5) * 80;

            var bomb = new Projectile(
                this.planeX, this.planeY,
                0, 18,       // cae verticalmente
                6, 25,
                Sprites.projectiles.grenade
            );
            GameInstance.projectileManager.add(bomb);
            this.bombsLeft--;
        }

        if (this.bombsLeft <= 0 && this.planeX > GameInstance.camera.getWidth() + 200)
        {
            this.active = false;
            this.setIsActive(false);
            GameInstance.state.nextTurn();
        }
    }

    draw(ctx)
    {
        if (!this.active) return;

        // Dibujar avión simple como rectángulo mientras no haya sprite
        ctx.save();
        ctx.fillStyle = '#aaaaaa';
        ctx.fillRect(
            this.planeX - GameInstance.camera.getX(),
            this.planeY,
            60, 20
        );
        ctx.fillStyle = '#666666';
        ctx.fillRect(
            this.planeX - GameInstance.camera.getX() + 10,
            this.planeY - 10,
            30, 10
        );
        ctx.restore();
    }
}
