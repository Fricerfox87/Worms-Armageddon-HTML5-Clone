///<reference path="ProjectileWeapon.ts"/>

class Uzi extends ProjectileWeapon
{
    private burst: number;
    private burstMax: number;
    private burstTimer: Timer;

    constructor(ammo: number)
    {
        super("Uzi", ammo,
            Sprites.weapons.uzi,
            Sprites.worms.aimShotgun,
            Sprites.worms.aimShotgun
        );
        this.burstMax  = 8;
        this.burst     = 0;
        this.burstTimer = new Timer(80);
        this.requiresAiming = true;
    }

    activate(worm)
    {
        this.setIsActive(true);
        this.ammo--;
        this.worm = worm;
        this.burst = 0;
        Logger.debug("Uzi activated");
    }

    update()
    {
        if (this.getIsActive())
        {
            this.burstTimer.update();
            if (this.burstTimer.hasTimePeriodPassed() && this.burst < this.burstMax)
            {
                // Pequeña dispersion aleatoria
                var spread = (Math.random() - 0.5) * 0.3;
                var angle  = this.worm.target.getAngle() + spread;
                var power  = 25;

                var startX = Physics.metersToPixels(this.worm.body.GetPosition().x);
                var startY = Physics.metersToPixels(this.worm.body.GetPosition().y);

                var proj = new Projectile(
                    startX, startY,
                    Math.cos(angle) * power,
                    Math.sin(angle) * power,
                    3,   // radio pequeño
                    8,   // daño por bala
                    Sprites.projectiles.bullet
                );
                GameInstance.projectileManager.add(proj);
                AssetManager.getSound("shotgun").play(0.4);

                this.burst++;
            }

            if (this.burst >= this.burstMax)
            {
                this.setIsActive(false);
                GameInstance.state.nextTurn();
            }
        }
    }

    draw(ctx) {}
}
