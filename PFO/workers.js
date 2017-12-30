    /* === GLOBAL VARIABLES === */
    var i18n_obj = {};

    /* === EVENTS === */

    // === Version handling
    on("sheet:opened", function() {
        versioning();
        loadi18n();
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
        update_flex_ability("strength","");
        update_cmd();
        update_attacks("strength","");
    });
    on("change:dexterity_mod", function() {
        update_ac_ability("dexterity");
        update_initiative();
        update_flex_ability("dexterity","");
        update_cmd();
        update_attacks("dexterity","");
    });
    on("change:constitution_mod", function() {
        update_ac_ability("constitution");
        update_flex_ability("constitution","");
        update_attacks("constitution","");
    });
    on("change:intelligence_mod", function() {
        update_ac_ability("intelligence");
        update_flex_ability("intelligence","");
        update_attacks("intelligence","");
    });
    on("change:wisdom_mod", function() {
        update_ac_ability("wisdom");
        update_flex_ability("wisdom","");
        update_attacks("wisdom","");
   });
    on("change:charisma_mod", function() {
        update_ac_ability("charisma");
        update_flex_ability("charisma","");
        update_attacks("charisma","");
    });

    // === Initiative
    on("change:initiative_misc change:initiative_bonus", function() {
        update_initiative();
    });

    // === AC
    on("change:ac_ability_primary change:ac_ability_secondary change:ac_ability_maximum", function(){
        update_ac_ability();
    });
    on("change:ac_bonus change:ac_armor change:ac_shield change:ac_ability_mod change:ac_size change:ac_natural change:ac_deflection change:ac_misc change:ac_dodge change:ac_touch_bonus change:ac_flatfooted_bonus change:ac_noflatflooted change:ac_touchshield", function(){
        update_ac();
        update_cmd();
    });
    // AC Items
    on("remove:repeating_acitems change:repeating_acitems:equipped change:repeating_acitems:ac_bonus change:repeating_acitems:flatfooted_bonus change:repeating_acitems:touch_bonus change:repeating_acitems:type change:repeating_acitems:check_penalty change:repeating_acitems:max_dex_bonus change:repeating_acitems:spell_failure", function(){
        update_ac_items();
    });

    // === SAVES
    on("change:fortitude_ability change:reflex_ability change:will_ability", function(e){
        update_flex_ability(e.newValue,e.sourceAttribute);
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

    // === BAB / ATTACK MODS / DEFENSE
    on("change:bab", function(){
        update_babs("cmb");
        update_babs("melee");
        update_babs("ranged");
        update_cmd();
    });
    on("change:cmb_ability change:melee_ability change:ranged_ability", function(e){
        update_flex_ability(e.newValue,e.sourceAttribute);
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
    on("change:cmd_misc change:cmd_bonus", function() {
        update_cmd();
    });
    on("change:cmb_mod", function(){update_attacks("cmb","");});
    on("change:melee_mod", function(){update_attacks("melee","");});
    on("change:ranged_mod", function(){update_attacks("ranged","");});

    // === WEAPONS / ATTACKS
    on("change:repeating_attacks:atkname change:repeating_attacks:atkflag change:repeating_attacks:atktype change:repeating_attacks:atkmod change:repeating_attacks:atkcritrange change:repeating_attacks:atkcritmulti change:repeating_attacks:dmgflag change:repeating_attacks:dmgbase change:repeating_attacks:dmgattr change:repeating_attacks:dmgmod change:repeating_attacks:dmgtype change:repeating_attacks:dmg2flag change:repeating_attacks:dmg2base change:repeating_attacks:dmg2attr change:repeating_attacks:dmg2mod change:repeating_attacks:dmg2type change:repeating_attacks:descflag change:repeating_attacks:atkdesc change:repeating_attacks:notes", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;}
        var attackid = eventinfo.sourceAttribute.substring(18, 38);
        update_attacks(attackid,"");
    });

    // === CONFIGURATION
    on("change:rollmod_attack change:rollnotes_attack change:rollmod_damage change:whispertype change:rollshowchar", function(){
       update_attacks("all","");
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
    var update_mod = function(attr) {
        getAttrs([attr], function(v) {
            var mod = Math.floor(((parseInt(v[attr]) || 10) - 10) / 2);
            var update = {};
            update[attr + "_mod"] = mod;
            setAttrs(update);
        });
    };
    var update_flex_ability = function(attr,ablt) {
        var update = {};
        var modz = [];
            modz.push(attr + "_mod");
        if (String(attr) && String(ablt)) {
            getAttrs(modz, function(v) {
                update[ablt + "_mod"] = v[attr + "_mod"];
                setAttrs(update);
            });
        } else {
            var fields = ["fortitude_ability","reflex_ability","will_ability","cmb_ability","melee_ability","ranged_ability"];
            var flexes = [];
            getAttrs(fields, function(ablts) {
                _.each(fields, function(field){
                    if(ablts[field] == attr) {
                        flexes.push(field + "_mod");
                    }
                });
                if ( (parseInt(flexes.length) || 0) > 0) {
                    getAttrs(modz, function(v) {
                        _.each(flexes, function(flex) {
                            update[flex] = v[attr + "_mod"];
                        });
                        setAttrs(update);
                    });
                }
            });
        }
    };

    // === Size
    var update_size = function(psize) {
        var size = psize || "medium";
        var atkac = 0;
        var cmb = 0;
        var fly = 0;
        var stealth = 0;
        switch(size) {
            case "fine":
                atkac = 8;
                cmb = -8;
                fly = 8;
                stealth = 16;
                break;
            case "diminutive":
                atkac = 4;
                cmb = -4;
                fly = 6;
                stealth = 12;
                break;
            case "tiny":
                atkac = 2;
                cmb = -2;
                fly = 4;
                stealth = 8;
                break;
            case "small":
                atkac = 1;
                cmb = -1;
                fly = 2;
                stealth = 4;
                break;
            case "medium":
                atkac = 0;
                cmb = 0;
                fly = 0;
                stealth = 0;
                break;
            case "large":
                atkac = -1;
                cmb = 1;
                fly = -2;
                stealth = -4;
                break;
            case "huge":
                atkac = -2;
                cmb = 2;
                fly = -4;
                stealth = -8;
                break;
            case "gargantuan":
                atkac = -4;
                cmb = 4;
                fly = -6;
                stealth = -12;
                break;
            case "colossal":
                atkac = -8;
                cmb = 8;
                fly = -8;
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
                var bonusarmor = 0;
                var bonusshield = 0;
                var bonusff = 0;
                var bonustouch = 0;
                var checkpen = 0;
                var maxdex = 99;
                var spellf = 0;
                var maxab = "-";
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
                    var primary = parseInt(modz[v.ac_ability_primary + "_mod"]) || 0;
                    var secondary = parseInt(modz[v.ac_ability_secondary + "_mod"]) || 0;
                    var maxmod = parseInt(v.ac_ability_maximum) || 99;
                    setAttrs({"ac_ability_mod": Math.min(primary + secondary,maxmod)});
                });
            }
        });
    };
    var update_ac = function() {
        var update = {};
        getAttrs(["ac_bonus","ac_ability_mod","ac_armor","ac_shield","ac_size","ac_natural","ac_deflection","ac_misc","ac_dodge","ac_touch_bonus","ac_flatfooted_bonus","ac_noflatflooted","ac_touchshield"], function(v) {
            var base = 10;
            var ac = 0;
            var actouch = 0;
            var acff = 0;
            var bonus = parseInt(v.ac_bonus) || 0;
            var ability = parseInt(v.ac_ability_mod) || 0;
            var armor = parseInt(v.ac_armor) || 0;
            var shield = parseInt(v.ac_shield) || 0;
            var size = parseInt(v.ac_size) || 0;
            var natural = parseInt(v.ac_natural) || 0;
            var deflection = parseInt(v.ac_deflection) || 0;
            var misc = parseInt(v.ac_misc) || 0;
            var dodge = parseInt(v.ac_dodge) || 0;
            var touch_bonus = parseInt(v.ac_touch_bonus) || 0;
            var flatfooted_bonus = parseInt(v.ac_flatfooted_bonus) || 0;
            var noflatflooted = parseInt(v.ac_noflatflooted) || 0;
            var touchshield = parseInt(v.ac_touchshield) || 0;
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
        var fields = ["bab","strength_mod","dexterity_mod","cmb_size","ac_dodge","ac_deflection","cmd_misc","cmd_bonus"];
        getAttrs(fields, function(v) {
            var update = {};
            update["cmd_mod"] = 10
                            + (parseInt(v.bab) || 0)
                            + (parseInt(v.strength_mod) || 0)
                            + (parseInt(v.dexterity_mod) || 0)
                            + (parseInt(v.cmb_size) || 0)
                            + (parseInt(v.ac_dodge) || 0)
                            + (parseInt(v.ac_deflection) || 0)
                            + (parseInt(v.cmd_misc) || 0)
                            + (parseInt(v.cmd_bonus) || 0);
            setAttrs(update);
        });
        return;
    };
    // === SAVES
    var update_save = function(attr) {
        var fields = [attr + "_base",attr + "_ability_mod",attr + "_misc",attr + "_bonus"];
        getAttrs(fields, function(v) {
            var update = {};
            update[attr] = (parseInt(v[attr + "_base"]) || 0) + (parseInt(v[attr + "_ability_mod"]) || 0) + (parseInt(v[attr + "_misc"]) || 0) + (parseInt(v[attr + "_bonus"]) || 0);
            setAttrs(update);
        });
    };

    // === BABS
    var update_babs = function(attr) {
        var fields = ["bab","bab_size",attr + "_ability_mod",attr + "_misc",attr + "_bonus"];
        getAttrs(fields, function(v) {
            var update = {};
            update[attr + "_mod"] = (parseInt(v.bab) || 0) + (parseInt(v.bab_size) || 0) + (parseInt(v[attr + "_ability_mod"]) || 0) + (parseInt(v[attr + "_misc"]) || 0) + (parseInt(v[attr + "_bonus"]) || 0);
            setAttrs(update);
        });
    };

    // === WEAPONS/ATTACKS
    var update_attacks = function(update_id, source) {
        console.log("DOING UPDATE_ATTACKS: " + update_id);
        if(update_id.substring(0,1) === "-" && update_id.length === 20) {
            do_update_attack([update_id], source);
        }
        else if(["strength","dexterity","constitution","intelligence","wisdom","charisma","melee","ranged","cmb","all"].includes(update_id)) {
            getSectionIDs("repeating_attacks", function(idarray) {
                if(update_id === "all") {
                    do_update_attack(idarray);
                } else {
                    var attack_attribs = [];
                    _.each(idarray, function(id) {
                        attack_attribs.push("repeating_attacks_" + id + "_atktype");
                        attack_attribs.push("repeating_attacks_" + id + "_dmgattr");
                        attack_attribs.push("repeating_attacks_" + id + "_dmg2attr");
                    });
                    getAttrs(attack_attribs, function(v) {
                        var attr_attack_ids = [];
                        _.each(idarray, function(id) {
                            if((v["repeating_attacks_" + id + "_atktype"] && v["repeating_attacks_" + id + "_atktype"].includes(update_id)) || (v["repeating_attacks_" + id + "_dmgattr"] && v["repeating_attacks_" + id + "_dmgattr"].includes(update_id)) || (v["repeating_attacks_" + id + "_dmg2attr"] && v["repeating_attacks_" + id + "_dmg2attr"].includes(update_id))) {
                                attr_attack_ids.push(id);
                            }
                        });
                        if(attr_attack_ids.length > 0) {
                            do_update_attack(attr_attack_ids);
                        }
                    });
                };
            });
        };
    };
    var do_update_attack = function(attack_array, source) {
        var attack_attribs = ["strength_mod","dexterity_mod","constitution_mod","intelligence_mod","wisdom_mod","charisma_mod","melee_mod","ranged_mod","cmb_mod","rollmod_attack","rollnotes_attack","rollmod_damage","whispertype","rollshowchar"];
        _.each(attack_array, function(attackid) {
            attack_attribs.push("repeating_attacks_" + attackid + "_atkname");
            attack_attribs.push("repeating_attacks_" + attackid + "_atkflag");
            attack_attribs.push("repeating_attacks_" + attackid + "_atktype");
            attack_attribs.push("repeating_attacks_" + attackid + "_atkmod");
            attack_attribs.push("repeating_attacks_" + attackid + "_atkvs");
            attack_attribs.push("repeating_attacks_" + attackid + "_atkcritrange");
            attack_attribs.push("repeating_attacks_" + attackid + "_atkcritmulti");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmgflag");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmgbase");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmgattr");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmgmod");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmgtype");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmg2flag");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmg2base");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmg2attr");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmg2mod");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmg2type");
            attack_attribs.push("repeating_attacks_" + attackid + "_descflag");
            attack_attribs.push("repeating_attacks_" + attackid + "_atkdesc");
            attack_attribs.push("repeating_attacks_" + attackid + "_notes");
        });
        getAttrs(attack_attribs, function(v) {
            _.each(attack_array, function(attackid) {
                console.log("UPDATING ATTACK: " + attackid);
                var update = {};
                var stemp = "";
                var atkbonus = 0;
                var atkbonusdisplay = "-";
                var atkdmg = "";
                var atkdmgbonus = 0;
                var atkdmgdisplay = "-";
                var atkdisplay = " ";
                var rollbase = " ";
                var rollatk = " ";
                var rolldmg = " ";
                var rolltype = "";
                var rollnotes = "";
                var rollbasetemplate = "default";
                var rollatktemplate = "default";
                var rolldmgtemplate = "default";
                var atkname = v["repeating_attacks_" + attackid + "_atkname"];
                var atkflag = v["repeating_attacks_" + attackid + "_atkflag"];
                var atktype = parseInt(v[v["repeating_attacks_" + attackid + "_atktype"] + "_mod"]) || 0;
                var atkmod = v["repeating_attacks_" + attackid + "_atkmod"];
                var atkvs = v["repeating_attacks_" + attackid + "_atkvs"];
                var atkcritrange = parseInt(v["repeating_attacks_" + attackid + "_atkcritrange"]) || 20;
                var atkcritmulti = parseInt(v["repeating_attacks_" + attackid + "_atkcritmulti"]) || 1;
                var dmgflag = v["repeating_attacks_" + attackid + "_dmgflag"];
                var dmgbase = v["repeating_attacks_" + attackid + "_dmgbase"];
                var dmgattr = parseInt(v[v["repeating_attacks_" + attackid + "_dmgattr"] + "_mod"]) || 0;
                var dmgmod = v["repeating_attacks_" + attackid + "_dmgmod"];
                var dmgtype = v["repeating_attacks_" + attackid + "_dmgtype"];
                var dmg2flag = v["repeating_attacks_" + attackid + "_dmg2flag"];
                var dmg2base = v["repeating_attacks_" + attackid + "_dmg2base"];
                var dmg2attr = parseInt(v[v["repeating_attacks_" + attackid + "_dmg2attr"] + "_mod"]) || 0;
                var dmg2mod = v["repeating_attacks_" + attackid + "_dmg2mod"];
                var dmg2type = v["repeating_attacks_" + attackid + "_dmg2type"];
                var descflag = v["repeating_attacks_" + attackid + "_descflag"];
                var atkdesc = v["repeating_attacks_" + attackid + "_atkdesc"];
                var atknotes = v["repeating_attacks_" + attackid + "_notes"];
                // == Display handling
                atkbonus = atktype + (parseInt(atkmod) || 0);
                atkdmgbonus = dmgattr + (parseInt(dmgmod) || 0);
                if(atkflag != "0") {
                    atkdisplay = " (" + i18n_obj[v["repeating_attacks_" + attackid + "_atktype"]] + " " + i18n_obj["vs"] + " " + i18n_obj[atkvs] + ")";
                    atkbonusdisplay = "" + (atkbonus < 0 ? "" : "+") + atkbonus;
                }
                if(dmgflag != "0") {atkdmgdisplay = "" + dmgbase + (atkdmgbonus < 0 ? "" : "+") + atkdmgbonus;}
                update["repeating_attacks_" + attackid + "_atkdisplay"] = atkdisplay;
                update["repeating_attacks_" + attackid + "_atkbonusdisplay"] = atkbonusdisplay;
                update["repeating_attacks_" + attackid + "_atkdmgdisplay"] = atkdmgdisplay;
                // == Rolls handling
                // desc
                if(descflag != "0") {
                    atkdesc = "{{desc=" + atkdesc + "}}";
                }
                // notes
                if(v["rollnotes_attack"] != "0") {
                    rollnotes = "{{shownotes=[[1]]}}{{notes=" + atknotes + "}}";
                }
                // roll attack
                if(atkflag != "0") {
                    rollatk = "" + atkflag + "{{roll=[[1d20cs" + atkcritrange + "+" + atktype + "[" + i18n_obj[v["repeating_attacks_" + attackid + "_atktype"]] + "]+" + atkmod + "[MOD]+@{rollmod_attack}[BONUS]]]}}{{atkvs=" + atkdisplay + "}}";
                    rollatk += "{{critconfirm=[[1d20cs20+" + atktype + "[" + i18n_obj[v["repeating_attacks_" + attackid + "_atktype"]] + "]+" + atkmod + "[MOD]+@{rollmod_attack}[BONUS]]]}}";
                    rolltype += "attack";
                    rollbase += rollatk;
                    // desc
                    if(descflag != "0") {
                        rollatk += atkdesc;
                        rollbase += atkdesc;
                    }
                    // notes
                    if(v["rollnotes_attack"] != "0") {
                        rollatk += rollnotes;
                        rollbase += rollnotes;
                    }
                }
                // roll damage
                if((dmgflag != "0") || (dmg2flag != "0")) {
                    rolltype += "damage";
                    if(dmgflag != "0") {
                        stemp = dmgbase + "+" + dmgattr + "[" + i18n_obj[v["repeating_attacks_" + attackid + "_dmgattr"]] + "]+" + dmgmod + "[MOD]+@{rollmod_damage}[BONUS]";
                        rolldmg += dmgflag + "{{dmg1=[[" + stemp + "]]}}{{dmg1type=" + dmgtype +"}}{{dmg1crit=[[(" + stemp +")*" + atkcritmulti + "]]}}";
                    }
                    if(dmg2flag != "0") {
                        stemp = dmg2base + "+" + dmg2attr + "[" + i18n_obj[v["repeating_attacks_" + attackid + "_dmg2attr"]] + "]+" + dmg2mod + "[MOD]+@{rollmod_damage}[BONUS]";
                        rolldmg += dmg2flag + "{{dmg2=[[" + stemp +"]]}}{{dmg2type=" + dmg2type + "}}";
                    }
                    // desc
                    if((descflag != "0") && (atkflag == "0")) {
                        rolldmg += atkdesc;
                    }
                    // notes
                    if((v["rollnotes_attack"] != "0") && (atkflag == "0")) {
                        rolldmg += rollnotes;
                    }
                    rollbase += rolldmg;
                }
                // final rolls values
                if (rollbase.trim().length > 0) {
                    rollbase = "@{whispertype} &{template:" + rollbasetemplate + "}{{name=" + atkname + "}}{{type=" + rolltype + "}}{{showchar=@{rollshowchar}}}{{charname=@{character_name}}}" + rollbase;
                }
                if (rollatk.trim().length > 0) {
                    rollatk = "@{whispertype} &{template:" + rollatktemplate + "}{{name=" + atkname + "}}{{type=attack}}{{showchar=@{rollshowchar}}}{{charname=@{character_name}}}"  + rollatk;
                }
                if (rolldmg.trim().length > 0) {
                    rolldmg = "@{whispertype} &{template:" + rolldmgtemplate + "}{{name=" + atkname + "}}{{type=damage}}{{showchar=@{rollshowchar}}}{{charname=@{character_name}}}" + rolldmg;
                }
                update["repeating_attacks_" + attackid + "_rollbase"] = rollbase;
                update["repeating_attacks_" + attackid + "_rollbase_atk"] = rollatk;
                update["repeating_attacks_" + attackid + "_rollbase_dmg"] = rolldmg;
                // == update
                setAttrs(update, {silent: true});
            });
        });
    };

    // === Multi Lingual handling
    var loadi18n = function() {
        i18n_obj["strength"] = getTranslationByKey("str-u");
        i18n_obj["dexterity"] = getTranslationByKey("dex-u");
        i18n_obj["constitution"] = getTranslationByKey("con-u");
        i18n_obj["intelligence"] = getTranslationByKey("int-u");
        i18n_obj["wisdom"] = getTranslationByKey("wis-u");
        i18n_obj["charisma"] = getTranslationByKey("cha-u");
        i18n_obj["melee"] = getTranslationByKey("melee");
        i18n_obj["ranged"] = getTranslationByKey("ranged");
        i18n_obj["cmb"] = getTranslationByKey("cmb-u");
        i18n_obj["cmd"] = getTranslationByKey("cmd-u");
        i18n_obj["ac"] = getTranslationByKey("ac-u");
        i18n_obj["touch"] = getTranslationByKey("touch");
        i18n_obj["flatfooted"] = getTranslationByKey("flat-footed");
        i18n_obj["fftouch"] = getTranslationByKey("ff-touch");
        i18n_obj["other"] = getTranslationByKey("other");
        i18n_obj["fortitude"] = getTranslationByKey("fort-u");
        i18n_obj["reflex"] = getTranslationByKey("ref-u");
        i18n_obj["will"] = getTranslationByKey("will-u");
        i18n_obj["vs"] = getTranslationByKey("vs");
        i18n_obj["0"] = "";
    };

    // === Version and updating
    var initializeChar = function(doneupdating) {
        getAttrs(["character_name"], function(v) {
            console.log("Initializing character " + v.character_name);
            var update = {};
            update["strength_mod"] = 0;
            update["dexterity_mod"] = 0;
            update["constitution_mod"] = 0;
            update["intelligence_mod"] = 0;
            update["wisdom_mod"] = 0;
            update["charisma_mod"] = 0;
            update["initiative_mod"] = 0;
            update["initiative_mod"] = 0;
            update["ac_size"] = 0;
            update["bab_size"] = 0;
            update["cmb_size"] = 0;
            update["fly_size"] = 0;
            update["stealth_size"] = 0;
            update["ac_armor"] = 0;
            update["ac_shield"] = 0;
            update["ac_flatfooted_bonus"] = 0;
            update["ac_touch_bonus"] = 0;
            update["ac_ability_maximum"] = 0;
            update["armor_check_penalty"] = 0;
            update["armor_spell_failure"] = 0;
            update["ac"] = 10;
            update["ac_touch"] = 0;
            update["ac_flatfooted"] = 0;
            update["fortitude_ability_mod"] = 0;
            update["reflex_ability_mod"] = 0;
            update["will_ability_mod"] = 0;
            update["cmb_ability_mod"] = 0;
            update["melee_ability_mod"] = 0;
            update["ranged_ability_mod"] = 0;
            update["fortitude"] = 0;
            update["reflex"] = 0;
            update["will"] = 0;
            update["cmb"] = 0;
            update["melee"] = 0;
            update["ranged"] = 0;
            update["cmd"] = 10;
            setAttrs(update
                    ,{silent: false}
                    ,function() {
                        doneupdating();
                    });
        });
    };
    var versioning = function() {
        getAttrs(["version"], function(v) {
            var vrs = parseFloat(v["version"]) || 0.0;
            if (vrs == 1.0) {
                console.log("Pathfinder by Roll20 v" + vrs);
                return;
            } else if (vrs < 1.0) {
                initializeChar(function () {
                    setAttrs({"version": "1.0"});
                    versioning();
                });
            }
        });
    };
