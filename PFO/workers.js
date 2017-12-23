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
        update_saves_ability("strength","");
        update_babs_ability("strength","");
        update_cmd();
    });
    on("change:dexterity_mod", function() {
        update_ac_ability("dexterity");
        update_initiative();
        update_saves_ability("dexterity","");
        update_babs_ability("dexterity","");
        update_cmd();
    });
    on("change:constitution_mod", function() {
        update_ac_ability("constitution");
        update_saves_ability("constitution","");
        update_babs_ability("constitution","");
    });
    on("change:intelligence_mod", function() {
        update_ac_ability("intelligence");
        update_saves_ability("intelligence","");
        update_babs_ability("intelligence","");
    });
    on("change:wisdom_mod", function() {
        update_ac_ability("wisdom");
        update_saves_ability("wisdom","");
        update_babs_ability("wisdom","");
    });
    on("change:charisma_mod", function() {
        update_ac_ability("charisma");
        update_saves_ability("charisma","");
        update_babs_ability("charisma","");
    });

    // === Initiative
    on("change:initiative_misc change:initiative_bonus", function() {
        update_initiative();
    });

    // === AC
    on("change:ac_ability_primary change:ac_ability_secondary change:ac_ability_maximum", function(){
        update_ac_ability();
    });
    on("change:ac_bonus change:ac_armor change:ac_shield change:ac_ability change:ac_size change:ac_natural change:ac_deflection change:ac_misc change:ac_dodge change:ac_touch_bonus change:ac_flatfooted_bonus change:ac_noflatflooted change:ac_touchshield", function(){
        update_ac();
        update_cmd();
    });
    // AC Items
    on("remove:repeating_acitems change:repeating_acitems:equipped change:repeating_acitems:ac_bonus change:repeating_acitems:flatfooted_bonus change:repeating_acitems:touch_bonus change:repeating_acitems:type change:repeating_acitems:check_penalty change:repeating_acitems:max_dex_bonus change:repeating_acitems:spell_failure", function(){
        update_ac_items();
    });

    // === SAVES
    on("change:fortitude_ability change:reflex_ability change:will_ability", function(e){
        update_saves_ability(e.newValue,e.sourceAttribute);
    });
    on("change:fortitude_base change:fortitude_ability_mod change:fortitude_misc change:fortitude_bonus", function(){
        update_save("fortitude");
    });
    on("change:reflex_base change:reflex_ability_mod change:reflex_misc change:reflex_bonus", function(){
        update_save("reflex");
    });
    on("change:will_base change:will_ability_mod change:will_misc change:will_bonus", function(){
        update_save("will");
    });

    // === BAB / ATTACK MODS
    on("change:bab", function(){
        update_babs("cmb");
        update_babs("melee");
        update_babs("ranged");
        update_cmd();
    }):
    on("change:cmb_ability change:melee_ability change:ranged_ability", function(e){
        update_babs_ability(e.newValue,e.sourceAttribute);
    });
    on("change:cmb_ability_mod change:cmb_misc change:cmb_bonus", function(){
        update_babs("cmb");
    });
    on("change:melee_ability_mod change:melee_misc change:melee_bonus", function(){
        update_babs("melee");
    });
    on("change:ranged_ability_mod change:ranged_misc change:ranged_bonus", function(){
        update_babs("ranged");
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
    // === INITIATIVE
    var update_initiative = function () {
        getAttrs(["dexterity_mod","initiative_misc","initiative_bonus"], function(v) {
            setAttrs({"initiative_mod": (parseInt(v["dexterity_mod"]) || 0) + (parseInt(v["initiative_misc"]) || 0) + (parseInt(v["initiative_bonus"]) || 0)});
        });
    };
    // === AC
    var update_ac_items = function() {
        var update = {};
        var attrs = [];
        getSectionIDs("repeating_acitems", function(idarray) {
            _.each(idarray, function(itemid) {
                attrs.push("repeating_acitems_" + itemid + "_equipped");
                attrs.push("repeating_acitems_" + itemid + "_ac_bonus");
                attrs.push("repeating_acitems_" + itemid + "_flatfooted_bonus");
                attrs.push("repeating_acitems_" + itemid + "_touch_bonus");
                attrs.push("repeating_acitems_" + itemid + "_type");
                attrs.push("repeating_acitems_" + itemid + "_check_penalty");
                attrs.push("repeating_acitems_" + itemid + "_max_dex_bonus");
                attrs.push("repeating_acitems_" + itemid + "_spell_failure");

            });
            getAttrs(attrs, function(v) {
                var bonusarmor = 0,
                    bonusshield = 0,
                    bonusff = 0,
                    bonustouch = 0,
                    checkpen = 0,
                    maxdex = 99,
                    spellf = 0,
                    maxab = "-";
                _.each(idarray, function(itemid) {
                    if ( (parseInt(v["repeating_acitems_" + itemid + "_equipped"]) || 0) == 1 ) {
                        if ( v["repeating_acitems_" + itemid + "_type"] == "shield") {
                            bonusshield += parseInt(v["repeating_acitems_" + itemid + "_ac_bonus"]) || 0;
                        } else {
                            bonusarmor += parseInt(v["repeating_acitems_" + itemid + "_ac_bonus"]) || 0;
                        }
                        bonusff += parseInt(v["repeating_acitems_" + itemid + "_flatfooted_bonus"]) || 0;
                        bonustouch += parseInt(v["repeating_acitems_" + itemid + "_touch_bonus"]) || 0;
                        checkpen += parseInt(v["repeating_acitems_" + itemid + "_check_penalty"]) || 0;
                        if ((parseInt(v["repeating_acitems_" + itemid + "_max_dex_bonus"]) || 99) != 0) {
                            maxdex = Math.min(maxdex, parseInt(v["repeating_acitems_" + itemid + "_max_dex_bonus"]) || 99);
                        }
                        spellf += parseInt(v["repeating_acitems_" + itemid + "_spell_failure"]) || 0;
                    }
                });
                if (maxdex < 99) {
                    maxab = maxdex;
                }
                setAttrs({
                    "ac_armor": bonusarmor,
                    "ac_shield": bonusshield,
                    "ac_flatfooted_bonus": bonusff,
                    "ac_touch_bonus": bonustouch,
                    "ac_ability_maximum": maxab,
                    "armor_check_penalty": checkpen,
                    "armor_spell_failure": spellf
                });
            });
        });
    };
    var update_ac_ability = function(attr) {
        getAttrs(["ac_ability_primary","ac_ability_secondary","ac_ability_maximum"], function(v) {
            if( (attr == "") || (attr == v.ac_ability_primary) || (attr == v.ac_ability_secondary) ) {
                var attr_fields = [v.ac_ability_primary + "_mod",v.ac_ability_secondary + "_mod"];
                getAttrs(attr_fields, function(modz) {
                    var primary = parseInt(modz[v.ac_ability_primary + "_mod"]) || 0,
                        secondary = parseInt(modz[v.ac_ability_secondary + "_mod"]) || 0,
                        maxmod = parseInt(v.ac_ability_maximum) || 99;

                    setAttrs({"ac_ability": Math.min(primary + secondary,maxmod)});
                });
            }
        });
    };
    var update_ac = function() {
        var update = {};
        getAttrs(["ac_bonus","ac_ability","ac_armor","ac_shield","ac_size","ac_natural","ac_deflection","ac_misc","ac_dodge","ac_touch_bonus","ac_flatfooted_bonus","ac_noflatflooted","ac_touchshield"], function(v) {
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
                touch_bonus = parseInt(v.ac_touch_bonus) || 0,
                flatfooted_bonus = parseInt(v.ac_flatfooted_bonus) || 0,
                noflatflooted = parseInt(v.ac_noflatflooted) || 0,
                touchshield = parseInt(v.ac_touchshield) || 0;
            ac = base + bonus + ability + armor + shield + size + natural + deflection + misc + dodge;
            if (noflatflooted == 1) {acff = ac;}
            else {acff = base + bonus + armor + shield + size + natural + deflection + misc;}
            acff += flatfooted_bonus;
            actouch = base + bonus + ability + size + deflection + misc + dodge;
            if (touchshield == 1) {actouch += shield;}
            actouch += touch_bonus;
            setAttrs({
                "ac": ac,
                "ac_touch": actouch,
                "ac_flatfooted": acff
            });
        });
    };
    var update_cmd = function() {
        // TODO
    };
    // === SAVES
    var update_saves_ability = function(attr,saveab) {
        var update = {},
            modz = [];
            modz.push(attr + "_mod");
        if (String(attr) && String(saveab)) {
            getAttrs(modz, function(v) {
                update[saveab + "_mod"] = v[attr + "_mod"];
                setAttrs(update);
            });
        } else {
            getAttrs(["fortitude_ability","reflex_ability","will_ability"], function(savez) {
                if( (attr == savez.fortitude_ability) || (attr == savez.reflex_ability) || (attr == savez.will_ability) ) {
                    getAttrs(modz, function(v) {
                        if(attr == savez.fortitude_ability) {update["fortitude_ability_mod"] = v[attr + "_mod"];}
                        if(attr == savez.reflex_ability) {update["reflex_ability_mod"] = v[attr + "_mod"];}
                        if(attr == savez.will_ability) {update["will_ability_mod"] = v[attr + "_mod"];}
                        setAttrs(update);
                    });
                }
            });
        }
    };
    var update_save = function(attr) {
        var attr_fields = [attr + "_base",attr + "_ability_mod",attr + "_misc",attr + "_bonus"];
        getAttrs(attr_fields, function(v) {
            var update = {};
            update[attr] = (parseInt(v[attr + "_base"]) || 0) + (parseInt(v[attr + "_ability_mod"]) || 0) + (parseInt(v[attr + "_misc"]) || 0) + (parseInt(v[attr + "_bonus"]) || 0);
            setAttrs(update);
        });
    };

    // === BABS
    var update_babs_ability = function(attr,babsab) {
        // TODO
    };
    var update_babs = function(attr) {
        // TODO
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
