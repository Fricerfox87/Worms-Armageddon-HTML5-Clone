///<reference path="ProjectileWeapon.ts"/>

class Mortar extends ProjectileWeapon
{
    constructor(ammo: number)
    {
        super("Mortar", ammo,
            Sprites.weapons.mortar,
            Sprites.worms.aimBazooka,
            Sprites.worms.aimBazooka
        );
        this.requiresAiming = true;
    }

    activate(worm)
    {
        this.setIsActive(true);
        this.ammo--;
        this.worm = worm;

        var angle = this.worm.target.getAngle();
        var power = this.worm.target.getForce() * 0.8;

        var startX = Physics.metersToPixels(worm.body.GetPosition().x);
        var startY = Physics.metersToPixels(worm.body.GetPosition().y);

        // Proyectil principal
        var proj = new Projectile(
            startX, startY,
            Math.cos(angle) * power,
            Math.sin(angle) * power,
            8, 20,
            Sprites.projectiles.grenade
        );

        // Al impactar genera 4 fragmentos en distintas direcciones
        proj.onImpact = function(x, y)
        {
            var fragments = 4;
            for (var i = 0; i < fragments; i++)
            {
                var fAngle = (Math.PI * 2 / fragments) * i;
                var frag = new Projectile(
                    x, y,
                    Math.cos(fAngle) * 10,
                    Math.sin(fAngle) * 10,
                    4, 10,
                    Sprites.projectiles.bullet
                );
                GameInstance.projectileManager.add(frag);
            }
        };

        GameInstance.projectileManager.add(proj);
        AssetManager.getSound("fire").play(0.8);

        this.setIsActive(false);
        GameInstance.state.nextTurn();
    }

    draw(ctx) {}
}
