/**
 * WeaponManager.ts
 * Modificado por PCD Software 2026 — armas nuevas añadidas
 */
///<reference path="../system/Graphics.ts"/>
///<reference path="../system/AssetManager.ts"/>
///<reference path="../system/Physics.ts"/>
///<reference path="../animation/Sprite.ts"/>
///<reference path="../weapons/Drill.ts"/>
///<reference path="../weapons/HolyGrenade.ts"/>
///<reference path="../weapons/HandGrenade.ts"/>
///<reference path="../weapons/Dynamite.ts"/>
///<reference path="../weapons/NinjaRope.ts"/>
///<reference path="../weapons/JetPack.ts"/>
///<reference path="../weapons/RayWeapon.ts"/>
///<reference path="../weapons/Shotgun.ts"/>
///<reference path="../weapons/Minigun.ts"/>
///<reference path="../weapons/LandMine.ts"/>
///<reference path="../weapons/Blowtorch.ts"/>
///<reference path="../weapons/ProjectileWeapon.ts"/>
///<reference path="../weapons/Uzi.ts"/>
///<reference path="../weapons/Mortar.ts"/>
///<reference path="../weapons/Airstrike.ts"/>

class WeaponManager
{
    private weaponsAndTools: BaseWeapon[];
    private currentWeaponIndex;

    constructor()
    {
        this.weaponsAndTools =
        [
            new Shotgun(99),
            new HandGrenade(20),
            new HolyGrenade(2),
            new Dynamite(5),
            new JetPack(5),
            new Minigun(4),
            new NinjaRope(50),
            new Drill(3),
            new Bazzoka(15),
            new Uzi(3),
            new Mortar(3),
            new Airstrike(2)
        ];

        this.currentWeaponIndex = 0;
    }

    checkWeaponHasAmmo(weaponIndex)
    {
        if (this.weaponsAndTools[weaponIndex].ammo)
        {
            return true;
        }
        return false;
    }

    getCurrentWeapon()
    {
        return this.weaponsAndTools[this.currentWeaponIndex];
    }

    setCurrentWeapon(index)
    {
        if (this.getCurrentWeapon().getIsActive() == false
            || this.getCurrentWeapon() instanceof JetPack
            || this.getCurrentWeapon() instanceof NinjaRope)
        {
            if (this.getCurrentWeapon() instanceof NinjaRope)
            {
                this.getCurrentWeapon().deactivate();
            }
            this.currentWeaponIndex = index;
        }
    }

    getListOfWeapons()
    {
        return this.weaponsAndTools;
    }
}
