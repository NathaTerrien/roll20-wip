    /* === GLOBAL VARIABLES === */

    /* === EVENTS === */

    // === Version handling
    on("sheet:opened", function() {
        versioning();
    });

    // === Abilities
    on("change:strength_base change:strength_bonus", function() {
        update_attr("strength");
    });
    on("change:strength", function() {
        update_mod("strength");
    });
    on("change:dexterity_base change:dexterity_bonus", function() {
        update_attr("dexterity");
    });
    on("change:dexterity", function() {
        update_mod("dexterity");
    });
    on("change:constitution_base change:constitution_bonus", function() {
        update_attr("constitution");
    });
    on("change:constitution", function() {
        update_mod("constitution");
    });
    on("change:intelligence_base change:intelligence_bonus", function() {
        update_attr("intelligence");
    });
    on("change:intelligence", function() {
        update_mod("intelligence");
    });
    on("change:wisdom_base change:wisdom_bonus", function() {
        update_attr("wisdom");
    });
    on("change:wisdom", function() {
        update_mod("wisdom");
    });
    on("change:charisma_base change:charisma_bonus", function() {
        update_attr("charisma");
    });
    on("change:charisma", function() {
        update_mod("charisma");
    });

    // === Size
    on("change:size", function(e){
        update_size(e.newValue);
    });

    // === Mods
    on("change:strength_mod", function() {
        update_ac_ability("strength");
    });
    on("change:dexterity_mod", function() {
        update_ac_ability("dexterity");
        update_initiative();
    });
    on("change:constitution_mod", function() {
        update_ac_ability("constitution");
    });
    on("change:intelligence_mod", function() {
        update_ac_ability("intelligence");
    });
    on("change:wisdom_mod", function() {
        update_ac_ability("wisdom");
    });
    on("change:charisma_mod", function() {
        update_ac_ability("charisma");
    });

    // === Initiative
    on("change:initiative_misc change:initiative_bonus", function() {
        update_initiative();
    });

    // === AC
    on("change:ac_ability_primary change:ac_ability_secondary", function(){
        update_ac_ability("");
    });
    on("change:ac_bonus change:ac_armor change:ac_shield change:ac_ability change:ac_size change:ac_natural change:ac_deflection change:ac_misc change:ac_dodge change:ac_noflatflooted change:ac_touchshield", function(){
        update_ac();
    });

    /* === FUNCTIONS === */
    // === ABILITIES and MODS
    var update_attr = function(attr) {
        var update = {};
        var attr_fields = [attr + "_base",attr + "_bonus"];
        getAttrs(attr_fields, function(v) {
            var base = parseInt(v[attr + "_base"]) || 10;
            var bonus = parseInt(v[attr + "_bonus"]) || 0;
            update[attr + "_flag"] = bonus != 0 ? 1 : 0;
            update[attr] = base + bonus;
            setAttrs(update);
        });
    };
    var update_mod = function (attr) {
        getAttrs([attr], function(v) {
            var mod = Math.floor(((parseInt(v[attr]) || 10) - 10) / 2);
            var update = {};
            update[attr + "_mod"] = mod;
            setAttrs(update);
        });
    };
    // === Size
    var update_size = function(psize) {
        var size = psize || "medium",
            atkac = 0,
            cmb = 0,
            fly = 0,
            stealth = 0;
        switch(size) {
            case "fine":
                atkac = 8,
                cmb = -8,
                fly = 8,
                stealth = 16;
                break;
            case "diminutive":
                atkac = 4,
                cmb = -4,
                fly = 6,
                stealth = 12;
                break;
            case "tiny":
                atkac = 2,
                cmb = -2,
                fly = 4,
                stealth = 8;
                break;
            case "small":
                atkac = 1,
                cmb = -1,
                fly = 2,
                stealth = 4;
                break;
            case "medium":
                atkac = 0,
                cmb = 0,
                fly = 0,
                stealth = 0;
                break;
            case "large":
                atkac = -1,
                cmb = 1,
                fly = -2,
                stealth = -4;
                break;
            case "huge":
                atkac = -2,
                cmb = 2,
                fly = -4,
                stealth = -8;
                break;
            case "gargantuan":
                atkac = -4,
                cmb = 4,
                fly = -6,
                stealth = -12;
                break;
            case "colossal":
                atkac = -8,
                cmb = 8,
                fly = -8,
                stealth = -16;
                break;
        }
        setAttrs({
            "ac_size": atkac,
            "bab_size": atkac,
            "cmb_size": cmb,
            "fly_size": fly,
            "stealth_size": stealth
        });
    };
    // === AC
    var update_ac_ability = function(attr) {
        getAttrs(["ac_ability_primary","ac_ability_secondary"], function(v) {
            if( (attr == "") || (attr == v.ac_ability_primary) || (attr == v.ac_ability_secondary) ) {
                var attr_fields = [v.ac_ability_primary + "_mod",v.ac_ability_secondary + "_mod"];
                getAttrs(attr_fields, function(modz) {
                    var primary = parseInt(modz[v.ac_ability_primary + "_mod"]) || 0,
                        secondary = parseInt(modz[v.ac_ability_secondary + "_mod"]) || 0;
                    setAttrs({"ac_ability": primary + secondary});
                });
            }
        });
    };
    var update_ac = function() {
        var update = {};
        getAttrs(["ac_bonus","ac_ability","ac_armor","ac_shield","ac_size","ac_natural","ac_deflection","ac_misc","ac_dodge","ac_noflatflooted","ac_touchshield"], function(v) {
            var base = 10,
                ac = 0,
                actouch = 0,
                acff = 0,
                bonus = parseInt(v.ac_bonus) || 0,
                ability = parseInt(v.ac_ability) || 0,
                armor = parseInt(v.ac_armor) || 0,
                shield = parseInt(v.ac_shield) || 0,
                size = parseInt(v.ac_size) || 0,
                natural = parseInt(v.ac_natural) || 0,
                deflection = parseInt(v.ac_deflection) || 0,
                misc = parseInt(v.ac_misc) || 0,
                dodge = parseInt(v.ac_dodge) || 0,
                noflatflooted = parseInt(v.ac_noflatflooted) || 0,
                touchshield = parseInt(v.ac_touchshield) || 0;
            ac = base + bonus + ability + armor + shield + size + natural + deflection + misc + dodge;
            if (noflatflooted == 1) {acff = ac;}
            else {acff = base + bonus + armor + shield + size + natural + deflection + misc;}
            actouch = base + bonus + ability + size + deflection + misc + dodge;
            if (touchshield == 1) {actouch +=shield;}
            setAttrs({
                "ac": ac,
                "ac_touch": actouch,
                "ac_flatfooted": acff
            });
        });
    };
    // === INITIATIVE
    var update_initiative = function () {
        getAttrs(["dexterity_mod","initiative_misc","initiative_bonus"], function(v) {
            setAttrs({"initiative_mod": (parseInt(v["dexterity_mod"]) || 0) + (parseInt(v["initiative_misc"]) || 0) + (parseInt(v["initiative_bonus"]) || 0)});
        });
    };

    // === Version and updating
    var versioning = function() {
        getAttrs(["version"], function(v) {
            var vrs = parseFloat(v["version"]) || 0.0;
            if (vrs == 1.0) {
                console.log("Pathfinder by Roll20 v" + vrs);
                return;
            } else if (vrs < 1.0) {
                setAttrs({"version": "1.0"});
                versioning();
            }
        });
    };
