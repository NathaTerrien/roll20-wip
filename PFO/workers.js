    /* === GLOBAL VARIABLES === */
    var pfoglobals_i18n_obj = {};
    var pfoglobals_ispc = 1;

    /* === EVENTS === */

    // === Version handling
    on("sheet:opened", function() {
        getAttrs(["npc"], function(v) {
            if(v.npc == "1") {pfoglobals_ispc = 0;}
        });
        loadi18n();
        versioning();
    });

    // === Drop
    on("sheet:compendium-drop", function() {
        getAttrs(["hp_max","ac","size","cd_bar1_v","cd_bar1_m","cd_bar1_l","cd_bar2_v","cd_bar2_m","cd_bar2_l","cd_bar3_v","cd_bar3_m","cd_bar3_l"], function(v) {
            var default_attr = {};
            default_attr["width"] = 70;
            default_attr["height"] = 70;
            if(v["size"]) {
                var squares = 1.0;
                var squarelength = 70;
                switch(v["size"]) {
                    case "fine":
                        squares = 0.5;
                        break;
                    case "diminutive":
                        squares = 0.5;
                        break;
                    case "tiny":
                        squares = 0.5;
                        break;
                    case "small":
                        squares = 0.75;
                        break;
                    case "medium":
                        squares = 1.0;
                        break;
                    case "large":
                        squares = 2.0;
                        break;
                    case "huge":
                        squares = 3.0;
                        break;
                    case "gargantuan":
                        squares = 4.0;
                        break;
                    case "colossal":
                        squares = 5.0;
                        break;
                }
                var squaresize = parseInt(squarelength * squares);
                default_attr["width"] = squaresize;
                default_attr["height"] = squaresize;
            }

            var getList = {};
            for(x = 1; x<=3; x++) {
                _.each(["v", "m"], function(letter) {
                    var keyname = "cd_bar" + x + "_" + letter;
                    if(v[keyname] != undefined && isNaN(v[keyname])) {
                        getList[keyname] = v[keyname];
                    }
                });
            }

            getAttrs(_.values(getList), function(values) {
                _.each(_.keys(getList), function(keyname) {
                    v[keyname] = values[getList[keyname]] == undefined ? "" : values[getList[keyname]];
                });

                if(v["cd_bar1_l"]) {
                    default_attr["bar1_link"] = v["cd_bar1_l"];
                }
                else if(v["cd_bar1_v"] || v["cd_bar1_m"]) {
                    if(v["cd_bar1_v"]) {
                        default_attr["bar1_value"] = v["cd_bar1_v"];
                    }
                    if(v["cd_bar1_m"]) {
                        default_attr["bar1_max"] = v["cd_bar1_m"];
                    }
                }
                else {
                    default_attr["bar1_value"] = v["hp_max"];
                    default_attr["bar1_max"] = v["hp_max"];
                }

                if(v["cd_bar2_l"]) {
                    default_attr["bar2_link"] = v["cd_bar2_l"];
                }
                else if(v["cd_bar2_v"] || v["cd_bar2_m"]) {
                    if(v["cd_bar2_v"]) {
                        default_attr["bar2_value"] = v["cd_bar2_v"];
                    }
                    if(v["cd_bar2_m"]) {
                        default_attr["bar2_max"] = v["cd_bar2_m"];
                    }
                }

                if(v["cd_bar3_l"]) {
                    default_attr["bar3_link"] = v["cd_bar3_l"];
                }
                else if(v["cd_bar3_v"] || v["cd_bar3_m"]) {
                    if(v["cd_bar3_v"]) {
                        default_attr["bar3_value"] = v["cd_bar3_v"];
                    }
                    if(v["cd_bar3_m"]) {
                        default_attr["bar3_max"] = v["cd_bar3_m"];
                    }
                }
                else {
                    default_attr["bar3_link"] = "ac";
                }
                setDefaultToken(default_attr);
            });
        });
    });

    // === Generals
    on("change:npc", function(e) {
        pfoglobals_ispc = (e.newValue == "1") ? 0 : 1;
    });

    // === Abilities
    on("change:strength_base change:strength_race change:strength_bonus", function() {
        update_attr("strength");
    });
    on("change:strength", function() {
        update_mod("strength");
        if(pfoglobals_ispc) {
            update_encumbrance_load();
        }
    });
    on("change:dexterity_base change:dexterity_race change:dexterity_bonus", function() {
        update_attr("dexterity");
    });
    on("change:dexterity", function() {
        update_mod("dexterity");
    });
    on("change:constitution_base change:constitution_race change:constitution_bonus", function() {
        update_attr("constitution");
    });
    on("change:constitution", function() {
        update_mod("constitution");
    });
    on("change:intelligence_base change:intelligence_race change:intelligence_bonus", function() {
        update_attr("intelligence");
    });
    on("change:intelligence", function() {
        update_mod("intelligence");
    });
    on("change:wisdom_base change:wisdom_race change:wisdom_bonus", function() {
        update_attr("wisdom");
    });
    on("change:wisdom", function() {
        update_mod("wisdom");
    });
    on("change:charisma_base change:charisma_race change:charisma_bonus", function() {
        update_attr("charisma");
    });
    on("change:charisma", function() {
        update_mod("charisma");
    });

    // === Size
    on("change:size", function(e){
        if(pfoglobals_ispc) {
            update_size(e.newValue);
        } else {
            var update = {};
            update["size_display"] = getTranslationByKey(e.newValue);
            setAttrs(update);
        }
    });
    on("change:encumbrance_size", function() {
        if(pfoglobals_ispc) {
            update_encumbrance_load();
        }
    });

    // === Mods
    on("change:strength_mod", function() {
        if(pfoglobals_ispc) {
            update_cmd();
            update_ability_mod("strength");
        }
    });
    on("change:dexterity_mod", function() {
        if(pfoglobals_ispc) {
            update_cmd();
            update_ability_mod("dexterity");
            update_initiative();
        }
    });
    on("change:constitution_mod", function() {
        if(pfoglobals_ispc) {
            update_ability_mod("constitution");
        }
    });
    on("change:intelligence_mod", function() {
        if(pfoglobals_ispc) {
            update_ability_mod("intelligence");
        }
    });
    on("change:wisdom_mod", function() {
        if(pfoglobals_ispc) {
            update_ability_mod("wisdom");
        }
   });
    on("change:charisma_mod", function() {
        if(pfoglobals_ispc) {
            update_ability_mod("charisma");
        }
    });

    // === HP
    on("change:hp", function(e) {
        if (pfoglobals_ispc == 0) {
            if((parseInt(e.newValue) || 0) > 0) {
                getAttrs(["hp_max"], function(v) {
                    if((parseInt(v.hp_max) || 0) < (parseInt(e.newValue) || 0)) {
                        setAttrs({"hp_max":e.newValue},{silent:true});
                    }
                });
            }
        }
    });

    // === Class / Multiclassing / Musticasting
    on("change:class1_name change:class2_name change:class3_name change:caster1_flag change:caster2_flag", function(e) {
        if(pfoglobals_ispc) {
            update_class_names();
        }
    });
    on("change:caster1_class change:caster2_class", function(e){
       if(pfoglobals_ispc) {
            update_all_spells("all");
        }
    });
    on("change:class1_level change:class2_level change:class3_level", function(e) {
        if(pfoglobals_ispc) {
            update_class_numbers("level");
            update_class_names();
        }
    });
    on("change:class1_bab change:class2_bab change:class3_bab", function(e) {
        if(pfoglobals_ispc) {
            update_class_numbers("bab");
        }
    });
    on("change:class1_fortitude change:class2_fortitude change:class3_fortitude", function(e) {
        if(pfoglobals_ispc) {
            update_class_numbers("fortitude");
        }
    });
    on("change:class1_reflex change:class2_reflex change:class3_reflex", function(e) {
        if(pfoglobals_ispc) {
            update_class_numbers("reflex");
        }
    });
    on("change:class1_will change:class2_will change:class3_will", function(e) {
        if(pfoglobals_ispc) {
            update_class_numbers("will");
        }
    });

    // === Initiative
    on("change:initiative_misc change:initiative_bonus", function() {
        if(pfoglobals_ispc) {
            update_initiative();
        }
    });

    // === AC
    on("change:ac_ability_maximum change:encumbrance_ability_maximum", function(e){
        if(pfoglobals_ispc) {
            update_ac_ability(e.sourceAttribute);
        }
    });
    on("change:ac_ability_primary change:ac_ability_secondary", function(e){
        if(pfoglobals_ispc) {
            update_ac_ability(e.newValue);
        }
    });
    on("change:ac_bonus change:ac_armor change:ac_shield change:ac_ability_mod change:ac_size change:ac_natural change:ac_deflection change:ac_misc change:ac_dodge change:ac_touch_bonus change:ac_flatfooted_bonus change:ac_noflatflooted change:ac_touchshield", function(){
        if(pfoglobals_ispc) {
            update_ac();
            update_cmd();
        }
    });
    // AC Items
    on("remove:repeating_acitems change:repeating_acitems:equipped change:repeating_acitems:ac_bonus change:repeating_acitems:flatfooted_bonus change:repeating_acitems:touch_bonus change:repeating_acitems:type change:repeating_acitems:check_penalty change:repeating_acitems:max_dex_bonus change:repeating_acitems:spell_failure change:repeating_acitems:speed20 change:repeating_acitems:speed30 change:repeating_acitems:run_factor", function(){
        update_ac_items();
    });
    // -- Compendium drop adjustments
    on("change:repeating_acitems:compendium_ac_bonus change:repeating_acitems:compendium_check_penalty change:repeating_acitems:compendium_max_dex_bonus change:repeating_acitems:compendium_spell_failure", function(e){
        var update = {};
        var attr = e.sourceAttribute.replace("_compendium","");
        var val = parseInt(e.newValue.replace(/[^\d-]+/, "")) || 0;
        update[attr] = val;
        setAttrs(update,{silent:false});
    });
    on("change:repeating_acitems:compendium_armor_category", function(e) {
        var update = {};
        var val = "misc";
        var runfactor = 4;
        var typattr = e.sourceAttribute.replace("_compendium_armor_category","_type");
        var runattr =  e.sourceAttribute.replace("_compendium_armor_category","_run_factor");
        if(e.newValue.toLowerCase().includes("shield")) {val = "shield";}
        else if(e.newValue.toLowerCase().includes("light")) {val = "light";}
        else if(e.newValue.toLowerCase().includes("medium")) {val = "medium";}
        else if(e.newValue.toLowerCase().includes("heavy")) {
            val = "heavy";
            runfactor = 3;
        }
        update[typattr] = val;
        update[runattr] = runfactor;
        setAttrs(update,{silent:false});
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
    on("change:bab", function(e){
        if(pfoglobals_ispc) {
            update_babs_all(e.newValue);
        }
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
    on("change:cmb_mod", function(){
        if(pfoglobals_ispc) {
            update_attacks("cmb");
        }
    });
    on("change:melee_mod", function(){
        if(pfoglobals_ispc) {
            update_attacks("melee");
        }
    });
    on("change:ranged_mod", function(){
        if(pfoglobals_ispc) {
            update_attacks("ranged");
        }
    });

    // === GEAR - ENCUMBRANCE
    // -- Compendium drop adjustments
    on("change:repeating_gear:compendium_weight", function (e) {
        var update = {};
        var attr = e.sourceAttribute.replace("_compendium_weight","_weight");
        var wght = parseInt(e.newValue.replace(/\D+/g, "")) || 2;
        update[attr] = wght;
        setAttrs(update,{silent:false});
    });
    // -- Gear weight
    on("change:repeating_gear:weight change:repeating_gear:quantity", function (e) {
        var id = e.sourceAttribute.substring(15, 35);
        update_gear_weight(id);
    });
    on("change:repeating_gear:weight_total remove:repeating_gear", function() {
        update_gear_weight_total();
    });
    // -- Encumbrance
    on("change:encumbrance_load_bonus change:encumbrance_load_multiplier", function() {
        update_encumbrance_load();
    });
    // -- Overload
    on("change:encumbrance_gear_weight change:encumbrance_load_heavy", function() {
        check_encumbrance();
    });

    // === SPEED
    on("change:speed_race", function() {
        update_speed_base(1);
    });
    on("change:speed_notmodified change:speed_encumbrance change:speed_armor", function() {
        update_speed_base(0);
    });
    on("change:armor_run_factor change:encumbrance_run_factor", function() {
        update_run_factor();
    });
    on("change:speed_base change:speed_bonus change:speed_run_factor", function() {
        update_speed();
    });

    // === WEAPONS / ATTACKS
    // -- Display and roll calculation
    on("change:repeating_attacks:atkname change:repeating_attacks:atkflag change:repeating_attacks:atktype change:repeating_attacks:atktype2 change:repeating_attacks:atkmod change:repeating_attacks:atkcritrange change:repeating_attacks:atkrange change:repeating_attacks:dmgflag change:repeating_attacks:dmgbase change:repeating_attacks:dmgattr change:repeating_attacks:dmgmod change:repeating_attacks:dmgcritmulti change:repeating_attacks:dmgtype change:repeating_attacks:dmg2flag change:repeating_attacks:dmg2base change:repeating_attacks:dmg2attr change:repeating_attacks:dmg2mod change:repeating_attacks:dmg2critmulti change:repeating_attacks:dmg2type change:repeating_attacks:descflag change:repeating_attacks:atkdesc change:repeating_attacks:notes", function(e) {
        var attackid = e.sourceAttribute.substring(18, 38);
        update_attacks(attackid);
    });
    // -- Compendium drop adjustments
    on("change:repeating_attacks:category", function(e) {
        var typ = "";
        var dmg = "";
        var attr = e.sourceAttribute.replace("_compendium_critical_range","_atkcritrange");
        if (e.newValue.toLowerCase().includes("ranged")) {
            typ = "ranged";
            dmg = "0";
        }
        else if (e.newValue.toLowerCase().includes("melee")) {
            typ = "melee";
            if(e.newValue.toLowerCase().includes("two-handed")) {
                dmg = "strength_oneandahalf";
            } else {
                dmg = "strength";
            }
        }
        if (typ != "") {
            var update = {};
            var attratk = e.sourceAttribute.replace("_category","_atktype");
            var attrdmg = e.sourceAttribute.replace("_category","_dmgattr");
            update[attratk] = typ;
            update[attrdmg] = dmg;
            setAttrs(update,{silent:false});
        }
    });
    on("change:repeating_attacks:compendium_dmg_medium", function(e) {
        getAttrs(["size"], function(v) {
            if(["medium","large","huge","gargantuan","colossal"].includes(v.size)) {
                var update = {};
                var attr = e.sourceAttribute.replace("_compendium_dmg_medium","_dmgbase");
                update[attr] = e.newValue;
                setAttrs(update,{silent:false});
            }
        });
    });
    on("change:repeating_attacks:compendium_dmg_small", function(e) {
        getAttrs(["size"], function(v) {
            if(["fine","diminutive","tiny","small"].includes(v.size)) {
                var update = {};
                var attr = e.sourceAttribute.replace("_compendium_dmg_small","_dmgbase");
                update[attr] = e.newValue;
                setAttrs(update,{silent:false});
            }
        });
    });
    on("change:repeating_attacks:compendium_critical_range", function(e) {
        var update = {};
        var attr = e.sourceAttribute.replace("_compendium_critical_range","_atkcritrange");
        var crit = parseInt(e.newValue.substr(0,2)) || 2;
        update[attr] = crit;
        setAttrs(update,{silent:false});
    });
    on("change:repeating_attacks:compendium_critical_damage", function(e) {
        var update = {};
        var attr = e.sourceAttribute.replace("_compendium_critical_damage","_dmgcritmulti");
        var crit = parseInt(e.newValue.replace(/\D+/g, "")) || 2;
        update[attr] = crit;
        setAttrs(update,{silent:false});
    });

    // === SKILLS
    on("change:armor_check_penalty change:encumbrance_check_penalty", function() {
        getAttrs(["armor_check_penalty","encumbrance_check_penalty","skill_check_penalty"], function(v) {
            var newval = Math.min((parseInt(v.armor_check_penalty) || 0),(parseInt(v.encumbrance_check_penalty) || 0));
            if(newval != (parseInt(v.skill_check_penalty) || 0)) {
                setAttrs({"skill_check_penalty":newval},{silent: false});
            }
        });
    });
    on("change:acrobatics_ability change:appraise_ability change:bluff_ability change:climb_ability change:craft_ability change:diplomacy_ability change:disable_device_ability change:disguise_ability change:escape_artist_ability change:fly_ability change:handle_animal_ability change:heal_ability change:intimidate_ability change:knowledge_arcana_ability change:knowledge_dungeoneering_ability change:knowledge_engineering_ability change:knowledge_geography_ability change:knowledge_history_ability change:knowledge_local_ability change:knowledge_nature_ability change:knowledge_nobility_ability change:knowledge_planes_ability change:knowledge_religion_ability change:linguistics_ability change:perception_ability change:perform_ability change:profession_ability change:ride_ability change:sense_motive_ability change:sleight_of_hand_ability change:spellcraft_ability change:stealth_ability change:survival_ability change:swim_ability change:use_magic_device_ability change:repeating_skillcraft:ability change:repeating_skillknowledge:ability change:repeating_skillperform:ability change:repeating_skillprofession:ability change:repeating_skillcustom:ability", function(e){
        update_flex_ability(e.newValue,e.sourceAttribute);
    });
    on("change:acrobatics_classkill change:acrobatics_ability_mod change:acrobatics_ranks change:acrobatics_misc change:acrobatics_bonus change:acrobatics_armor_penalty", function(e) {update_skill("acrobatics",e.sourceAttribute);});
    on("change:appraise_classkill change:appraise_ability_mod change:appraise_ranks change:appraise_misc change:appraise_bonus change:appraise_armor_penalty", function(e) {
        update_skill("appraise",e.sourceAttribute);
    });
    on("change:bluff_classkill change:bluff_ability_mod change:bluff_ranks change:bluff_misc change:bluff_bonus change:bluff_armor_penalty", function(e) {update_skill("bluff",e.sourceAttribute);});
    on("change:climb_classkill change:climb_ability_mod change:climb_ranks change:climb_misc change:climb_bonus change:climb_armor_penalty", function(e) {update_skill("climb",e.sourceAttribute);});
    on("change:craft_classkill change:craft_ability_mod change:craft_ranks change:craft_misc change:craft_bonus change:craft_armor_penalty", function(e) {update_skill("craft",e.sourceAttribute);});
    on("change:repeating_skillcraft:classkill change:repeating_skillcraft:name change:repeating_skillcraft:ability_mod change:repeating_skillcraft:ranks change:repeating_skillcraft:misc change:repeating_skillcraft:bonus change:repeating_skillcraft:armor_penalty", function(e) {
        var skillid = e.sourceAttribute.substring(0, 41);
        update_skill(skillid,e.sourceAttribute);
    });
    on("change:diplomacy_classkill change:diplomacy_ability_mod change:diplomacy_ranks change:diplomacy_misc change:diplomacy_bonus change:diplomacy_armor_penalty", function(e) {update_skill("diplomacy",e.sourceAttribute);});
    on("change:disable_device_classkill change:disable_device_ability_mod change:disable_device_ranks change:disable_device_misc change:disable_device_bonus change:disable_device_armor_penalty", function(e) {update_skill("disable_device",e.sourceAttribute);});
    on("change:disguise_classkill change:disguise_ability_mod change:disguise_ranks change:disguise_misc change:disguise_bonus change:disguise_armor_penalty", function(e) {update_skill("disguise",e.sourceAttribute);});
    on("change:escape_artist_classkill change:escape_artist_ability_mod change:escape_artist_ranks change:escape_artist_misc change:escape_artist_bonus change:escape_artist_armor_penalty", function(e) {update_skill("escape_artist",e.sourceAttribute);});
    on("change:fly_classkill change:fly_ability_mod change:fly_ranks change:fly_misc change:fly_bonus change:fly_armor_penalty", function(e) {update_skill("fly",e.sourceAttribute);});
    on("change:handle_animal_classkill change:handle_animal_ability_mod change:handle_animal_ranks change:handle_animal_misc change:handle_animal_bonus change:handle_animal_armor_penalty", function(e) {update_skill("handle_animal",e.sourceAttribute);});
    on("change:heal_classkill change:heal_ability_mod change:heal_ranks change:heal_misc change:heal_bonus change:heal_armor_penalty", function(e) {update_skill("heal",e.sourceAttribute);});
    on("change:intimidate_classkill change:intimidate_ability_mod change:intimidate_ranks change:intimidate_misc change:intimidate_bonus change:intimidate_armor_penalty", function(e) {update_skill("intimidate",e.sourceAttribute);});
    on("change:knowledge_arcana_classkill change:knowledge_arcana_ability_mod change:knowledge_arcana_ranks change:knowledge_arcana_misc change:knowledge_arcana_bonus change:knowledge_arcana_armor_penalty", function(e) {update_skill("knowledge_arcana",e.sourceAttribute);});
    on("change:knowledge_dungeoneering_classkill change:knowledge_dungeoneering_ability_mod change:knowledge_dungeoneering_ranks change:knowledge_dungeoneering_misc change:knowledge_dungeoneering_bonus change:knowledge_dungeoneering_armor_penalty", function(e) {update_skill("knowledge_dungeoneering",e.sourceAttribute);});
    on("change:knowledge_engineering_classkill change:knowledge_engineering_ability_mod change:knowledge_engineering_ranks change:knowledge_engineering_misc change:knowledge_engineering_bonus change:knowledge_engineering_armor_penalty", function(e) {update_skill("knowledge_engineering",e.sourceAttribute);});
    on("change:knowledge_geography_classkill change:knowledge_geography_ability_mod change:knowledge_geography_ranks change:knowledge_geography_misc change:knowledge_geography_bonus change:knowledge_geography_armor_penalty", function(e) {update_skill("knowledge_geography",e.sourceAttribute);});
    on("change:knowledge_history_classkill change:knowledge_history_ability_mod change:knowledge_history_ranks change:knowledge_history_misc change:knowledge_history_bonus change:knowledge_history_armor_penalty", function(e) {update_skill("knowledge_history",e.sourceAttribute);});
    on("change:knowledge_local_classkill change:knowledge_local_ability_mod change:knowledge_local_ranks change:knowledge_local_misc change:knowledge_local_bonus change:knowledge_local_armor_penalty", function(e) {update_skill("knowledge_local",e.sourceAttribute);});
    on("change:knowledge_nature_classkill change:knowledge_nature_ability_mod change:knowledge_nature_ranks change:knowledge_nature_misc change:knowledge_nature_bonus change:knowledge_nature_armor_penalty", function(e) {update_skill("knowledge_nature",e.sourceAttribute);});
    on("change:knowledge_nobility_classkill change:knowledge_nobility_ability_mod change:knowledge_nobility_ranks change:knowledge_nobility_misc change:knowledge_nobility_bonus change:knowledge_nobility_armor_penalty", function(e) {update_skill("knowledge_nobility",e.sourceAttribute);});
    on("change:knowledge_planes_classkill change:knowledge_planes_ability_mod change:knowledge_planes_ranks change:knowledge_planes_misc change:knowledge_planes_bonus change:knowledge_planes_armor_penalty", function(e) {update_skill("knowledge_planes",e.sourceAttribute);});
    on("change:knowledge_religion_classkill change:knowledge_religion_ability_mod change:knowledge_religion_ranks change:knowledge_religion_misc change:knowledge_religion_bonus change:knowledge_religion_armor_penalty", function(e) {update_skill("knowledge_religion",e.sourceAttribute);});
    on("change:repeating_skillknowledge:classkill change:repeating_skillknowledge:name change:repeating_skillknowledge:ability_mod change:repeating_skillknowledge:ranks change:repeating_skillknowledge:misc change:repeating_skillknowledge:bonus change:repeating_skillknowledge:armor_penalty", function(e) {
        var skillid = e.sourceAttribute.substring(0, 45);
        update_skill(skillid,e.sourceAttribute);
    });
    on("change:linguistics_classkill change:linguistics_ability_mod change:linguistics_ranks change:linguistics_misc change:linguistics_bonus change:linguistics_armor_penalty", function(e) {update_skill("linguistics",e.sourceAttribute);});
    on("change:perception_classkill change:perception_ability_mod change:perception_ranks change:perception_misc change:perception_bonus change:perception_armor_penalty", function(e) {update_skill("perception",e.sourceAttribute);});
    on("change:perform_classkill change:perform_ability_mod change:perform_ranks change:perform_misc change:perform_bonus change:perform_armor_penalty", function(e) {update_skill("perform",e.sourceAttribute);});
    on("change:repeating_skillperform:classkill change:repeating_skillperform:name change:repeating_skillperform:ability_mod change:repeating_skillperform:ranks change:repeating_skillperform:misc change:repeating_skillperform:bonus change:repeating_skillperform:armor_penalty", function(e) {
        var skillid = e.sourceAttribute.substring(0, 43);
        update_skill(skillid,e.sourceAttribute);
    });
    on("change:profession_classkill change:profession_ability_mod change:profession_ranks change:profession_misc change:profession_bonus change:profession_armor_penalty", function(e) {update_skill("profession",e.sourceAttribute);});
    on("change:repeating_skillprofession:classkill change:repeating_skillprofession:name change:repeating_skillprofession:ability_mod change:repeating_skillprofession:ranks change:repeating_skillprofession:misc change:repeating_skillprofession:bonus change:repeating_skillprofession:armor_penalty", function(e) {
        var skillid = e.sourceAttribute.substring(0, 46);
        update_skill(skillid,e.sourceAttribute);
    });
    on("change:ride_classkill change:ride_ability_mod change:ride_ranks change:ride_misc change:ride_bonus change:ride_armor_penalty", function(e) {update_skill("ride",e.sourceAttribute);});
    on("change:sense_motive_classkill change:sense_motive_ability_mod change:sense_motive_ranks change:sense_motive_misc change:sense_motive_bonus change:sense_motive_armor_penalty", function(e) {update_skill("sense_motive",e.sourceAttribute);});
    on("change:sleight_of_hand_classkill change:sleight_of_hand_ability_mod change:sleight_of_hand_ranks change:sleight_of_hand_misc change:sleight_of_hand_bonus change:sleight_of_hand_armor_penalty", function(e) {update_skill("sleight_of_hand",e.sourceAttribute);});
    on("change:spellcraft_classkill change:spellcraft_ability_mod change:spellcraft_ranks change:spellcraft_misc change:spellcraft_bonus change:spellcraft_armor_penalty", function(e) {update_skill("spellcraft",e.sourceAttribute);});
    on("change:stealth_classkill change:stealth_ability_mod change:stealth_ranks change:stealth_misc change:stealth_bonus change:stealth_armor_penalty", function(e) {update_skill("stealth",e.sourceAttribute);});
    on("change:survival_classkill change:survival_ability_mod change:survival_ranks change:survival_misc change:survival_bonus change:survival_armor_penalty", function(e) {update_skill("survival",e.sourceAttribute);});
    on("change:swim_classkill change:swim_ability_mod change:swim_ranks change:swim_misc change:swim_bonus change:swim_armor_penalty", function(e) {update_skill("swim",e.sourceAttribute);});
    on("change:use_magic_device_classkill change:use_magic_device_ability_mod change:use_magic_device_ranks change:use_magic_device_misc change:use_magic_device_bonus change:use_magic_device_armor_penalty", function(e) {update_skill("use_magic_device",e.sourceAttribute);});
    on("change:repeating_skillcustom:classkill change:repeating_skillcustom:name change:repeating_skillcustom:ability_mod change:repeating_skillcustom:ranks change:repeating_skillcustom:misc change:repeating_skillcustom:bonus change:repeating_skillcustom:armor_penalty", function(e) {
        var skillid = e.sourceAttribute.substring(0, 42);
        update_skill(skillid,e.sourceAttribute);
    });
    on("change:skillfixed_ranks change:skillcraft_ranks change:skillknowledge_ranks change:skillperform_ranks change:skillprofession_ranks change:skillcustom_ranks", function() {sum_allskills_ranks();});

    on("remove:repeating_skillcraft remove:repeating_skillknowledge remove:repeating_skillperform remove:repeating_skillprofession remove:repeating_skillcustom", function(e) {sum_someskills_ranks(e.sourceAttribute + "_ranks")});
    // -- NPC skills display
    on("change:acrobatics change:acrobatics_notes change:appraise change:appraise_notes change:bluff change:bluff_notes change:climb change:climb_notes change:craft change:craft_notes change:diplomacy change:diplomacy_notes change:disable_device change:disable_device_notes change:disguise change:disguise_notes change:escape_artist change:escape_artist_notes change:fly change:fly_notes change:handle_animal change:handle_animal_notes change:heal change:heal_notes change:intimidate change:intimidate_notes change:knowledge_arcana change:knowledge_arcana_notes change:knowledge_dungeoneering change:knowledge_dungeoneering_notes change:knowledge_engineering change:knowledge_engineering_notes change:knowledge_geography change:knowledge_geography_notes change:knowledge_history change:knowledge_history_notes change:knowledge_local change:knowledge_local_notes change:knowledge_nature change:knowledge_nature_notes change:knowledge_nobility change:knowledge_nobility_notes change:knowledge_planes change:knowledge_planes_notes change:knowledge_religion change:knowledge_religion_notes change:linguistics change:linguistics_notes change:perception change:perception_notes change:perform change:perform_notes change:profession change:profession_notes change:ride change:ride_notes change:sense_motive change:sense_motive_notes change:sleight_of_hand change:sleight_of_hand_notes change:spellcraft change:spellcraft_notes change:stealth change:stealth_notes change:survival change:survival_notes change:swim change:swim_notes change:use_magic_device change:use_magic_device_notes", function(e) {
        if(pfoglobals_ispc != 1) {
            var skill = "";
            if (e.sourceAttribute.slice(-6) == "_notes") {
                skill = e.sourceAttribute.substring(0, e.sourceAttribute.indexOf("_notes"));
            } else {
                skill = e.sourceAttribute;
            }
            var fields = [skill, skill + "_notes"];
            getAttrs(fields, function(v) {
                var update = {};
                var display = "";
                var flag = 0;
                if ((parseInt(v[skill]) || 0) != 0 ) {
                    display += v[skill];
                    flag = 1;
                }
                if(v[skill + "_notes"] && (v[skill + "_notes"].length > 0)) {
                    if(display.length === 0) {
                        display += "0";
                    }
                    display += " (" + v[skill + "_notes"] + ")";
                    flag = 1;
                }
                update[skill + "_display"] = display;
                update[skill + "_flag"] = flag;
                setAttrs(update,{silent: true});
            });
        }
    });

    // SPELLS - SPELLCASTING
    // -- Armor spell failure
    on("change:armor_spell_failure change:caster1_spell_failure change:caster2_spell_failure", function() {
        getAttrs(["armor_spell_failure","caster1_spell_failure","caster2_flag","caster2_spell_failure"], function(v) {
            if( (v.armor_spell_failure != "0") && ((v.caster1_spell_failure == "1") || ((v.caster2_flag == "1") && (v.caster2_spell_failure == "1"))) ) {
                update_all_spells("all");
            }
        });
    });
    // -- Concentration & DCs
    on("change:caster1_ability change:caster2_ability", function(e) {update_flex_ability(e.newValue,e.sourceAttribute);});
    on("change:caster1_ability_mod change:caster2_ability_mod", function(e) {
        update_concentration(e.sourceAttribute);
        update_spellsdc(e.sourceAttribute);
    });
    on("change:caster1_level change:caster2_level", function(e) {
        if(pfoglobals_ispc) {
           update_concentration(e.sourceAttribute);
        }
    });
    on("change:caster1_concentration_misc change:caster1_concentration_bonus change:caster2_concentration_misc change:caster2_concentration_bonus", function(e) {
        update_concentration(e.sourceAttribute);
    });
    on("change:caster1_dc_misc change:caster1_dcbonus_level_0 change:caster1_dcbonus_level_1 change:caster1_dcbonus_level_2 change:caster1_dcbonus_level_3 change:caster1_dcbonus_level_4 change:caster1_dcbonus_level_5 change:caster1_dcbonus_level_6 change:caster1_dcbonus_level_7 change:caster1_dcbonus_level_8 change:caster1_dcbonus_level_9 change:caster2_dc_misc change:caster2_dcbonus_level_0 change:caster2_dcbonus_level_1 change:caster2_dcbonus_level_2 change:caster2_dcbonus_level_3 change:caster2_dcbonus_level_4 change:caster2_dcbonus_level_5 change:caster2_dcbonus_level_6 change:caster2_dcbonus_level_7 change:caster2_dcbonus_level_8 change:caster2_dcbonus_level_9", function(e) {
        update_spellsdc(e.sourceAttribute);
    });
    // -- Prepared / Total
    on("change:caster1_spells_perday_level_0 change:caster1_spells_perday_level_1 change:caster1_spells_perday_level_2 change:caster1_spells_perday_level_3 change:caster1_spells_perday_level_4 change:caster1_spells_perday_level_5 change:caster1_spells_perday_level_6 change:caster1_spells_perday_level_7 change:caster1_spells_perday_level_8 change:caster1_spells_perday_level_9 change:caster1_spells_bonus_level_0 change:caster1_spells_bonus_level_1 change:caster1_spells_bonus_level_2 change:caster1_spells_bonus_level_3 change:caster1_spells_bonus_level_4 change:caster1_spells_bonus_level_5 change:caster1_spells_bonus_level_6 change:caster1_spells_bonus_level_7 change:caster1_spells_bonus_level_8 change:caster1_spells_bonus_level_9", function(e) {
        update_spells_totals(e.sourceAttribute.charAt(e.sourceAttribute.length - 1),1);
    });
    on("change:caster2_spells_perday_level_0 change:caster2_spells_perday_level_1 change:caster2_spells_perday_level_2 change:caster2_spells_perday_level_3 change:caster2_spells_perday_level_4 change:caster2_spells_perday_level_5 change:caster2_spells_perday_level_6 change:caster2_spells_perday_level_7 change:caster2_spells_perday_level_8 change:caster2_spells_perday_level_9 change:caster2_spells_bonus_level_0 change:caster2_spells_bonus_level_1 change:caster2_spells_bonus_level_2 change:caster2_spells_bonus_level_3 change:caster2_spells_bonus_level_4 change:caster2_spells_bonus_level_5 change:caster2_spells_bonus_level_6 change:caster2_spells_bonus_level_7 change:caster2_spells_bonus_level_8 change:caster2_spells_bonus_level_9", function(e) {
        update_spells_totals(e.sourceAttribute.charAt(e.sourceAttribute.length - 1),2);
    });
    on("change:repeating_spell-0:spellprepared change:repeating_spell-1:spellprepared change:repeating_spell-2:spellprepared change:repeating_spell-3:spellprepared change:repeating_spell-4:spellprepared change:repeating_spell-5:spellprepared change:repeating_spell-6:spellprepared change:repeating_spell-7:spellprepared change:repeating_spell-8:spellprepared change:repeating_spell-9:spellprepared", function(e) {
        update_spells_prepared(e.sourceAttribute,e.newValue);
    });
    // -- Removing
    on("remove:repeating_spell-0 remove:repeating_spell-1 remove:repeating_spell-2 remove:repeating_spell-3 remove:repeating_spell-4 remove:repeating_spell-5 remove:repeating_spell-6 remove:repeating_spell-7 remove:repeating_spell-8 remove:repeating_spell-9", function(e) {
        update_spells_prepared(e.sourceAttribute,"");
    });
    // -- Rolls / Display
    on("change:caster1_dc_level_0 change:caster1_dc_level_1 change:caster1_dc_level_2 change:caster1_dc_level_3 change:caster1_dc_level_4 change:caster1_dc_level_5 change:caster1_dc_level_6 change:caster1_dc_level_7 change:caster1_dc_level_8 change:caster1_dc_level_9 change:caster2_dc_level_0 change:caster2_dc_level_1 change:caster2_dc_level_2 change:caster2_dc_level_3 change:caster2_dc_level_4 change:caster2_dc_level_5 change:caster2_dc_level_6 change:caster2_dc_level_7 change:caster2_dc_level_8 change:caster2_dc_level_9", function(e){
        update_spells(e.sourceAttribute.charAt(e.sourceAttribute.length - 1),"all");
    });
    on("change:repeating_spell-0:spellcaster change:repeating_spell-0:spellname change:repeating_spell-0:spellschool change:repeating_spell-0:spellclasslevel change:repeating_spell-0:spellcastingtime change:repeating_spell-0:spellcomponent change:repeating_spell-0:spellrange change:repeating_spell-0:spellarea change:repeating_spell-0:spelltargets change:repeating_spell-0:spelleffect change:repeating_spell-0:spellduration change:repeating_spell-0:spellsaveflag change:repeating_spell-0:spellsave change:repeating_spell-0:spelldc_mod change:repeating_spell-0:spellresistanceflag change:repeating_spell-0:spellresistance change:repeating_spell-0:spellatkflag change:repeating_spell-0:spellatktype change:repeating_spell-0:spellatkmod change:repeating_spell-0:spellatkcritrange change:repeating_spell-0:spelldmgcritmulti change:repeating_spell-0:spelldmgflag change:repeating_spell-0:spelldmg change:repeating_spell-0:spelldmgtype change:repeating_spell-0:spelldmg2flag change:repeating_spell-0:spelldmg2 change:repeating_spell-0:spelldmg2type change:repeating_spell-0:spelldescflag change:repeating_spell-0:spelldesc change:repeating_spell-0:notes", function(e) {
        var spellid = e.sourceAttribute.substring(18, 38);
        update_spells(0,spellid);
    });
    on("change:repeating_spell-1:spellcaster change:repeating_spell-1:spellname change:repeating_spell-1:spellschool change:repeating_spell-1:spellclasslevel change:repeating_spell-1:spellcastingtime change:repeating_spell-1:spellcomponent change:repeating_spell-1:spellrange change:repeating_spell-1:spellarea change:repeating_spell-1:spelltargets change:repeating_spell-1:spelleffect change:repeating_spell-1:spellduration change:repeating_spell-1:spellsaveflag change:repeating_spell-1:spellsave change:repeating_spell-1:spelldc_mod change:repeating_spell-1:spellresistanceflag change:repeating_spell-1:spellresistance change:repeating_spell-1:spellatkflag change:repeating_spell-1:spellatktype change:repeating_spell-1:spellatkmod change:repeating_spell-1:spellatkcritrange change:repeating_spell-1:spelldmgcritmulti change:repeating_spell-1:spelldmgflag change:repeating_spell-1:spelldmg change:repeating_spell-1:spelldmgtype change:repeating_spell-1:spelldmg2flag change:repeating_spell-1:spelldmg2 change:repeating_spell-1:spelldmg2type change:repeating_spell-1:spelldescflag change:repeating_spell-1:spelldesc change:repeating_spell-1:notes", function(e) {
        var spellid = e.sourceAttribute.substring(18, 38);
        update_spells(1,spellid);
    });
    on("change:repeating_spell-2:spellcaster change:repeating_spell-2:spellname change:repeating_spell-2:spellschool change:repeating_spell-2:spellclasslevel change:repeating_spell-2:spellcastingtime change:repeating_spell-2:spellcomponent change:repeating_spell-2:spellrange change:repeating_spell-2:spellarea change:repeating_spell-2:spelltargets change:repeating_spell-2:spelleffect change:repeating_spell-2:spellduration change:repeating_spell-2:spellsaveflag change:repeating_spell-2:spellsave change:repeating_spell-2:spelldc_mod change:repeating_spell-2:spellresistanceflag change:repeating_spell-2:spellresistance change:repeating_spell-2:spellatkflag change:repeating_spell-2:spellatktype change:repeating_spell-2:spellatkmod change:repeating_spell-2:spellatkcritrange change:repeating_spell-2:spelldmgcritmulti change:repeating_spell-2:spelldmgflag change:repeating_spell-2:spelldmg change:repeating_spell-2:spelldmgtype change:repeating_spell-2:spelldmg2flag change:repeating_spell-2:spelldmg2 change:repeating_spell-2:spelldmg2type change:repeating_spell-2:spelldescflag change:repeating_spell-2:spelldesc change:repeating_spell-2:notes", function(e) {
        var spellid = e.sourceAttribute.substring(18, 38);
        update_spells(2,spellid);
    });
    on("change:repeating_spell-3:spellcaster change:repeating_spell-3:spellname change:repeating_spell-3:spellschool change:repeating_spell-3:spellclasslevel change:repeating_spell-3:spellcastingtime change:repeating_spell-3:spellcomponent change:repeating_spell-3:spellrange change:repeating_spell-3:spellarea change:repeating_spell-3:spelltargets change:repeating_spell-3:spelleffect change:repeating_spell-3:spellduration change:repeating_spell-3:spellsaveflag change:repeating_spell-3:spellsave change:repeating_spell-3:spelldc_mod change:repeating_spell-3:spellresistanceflag change:repeating_spell-3:spellresistance change:repeating_spell-3:spellatkflag change:repeating_spell-3:spellatktype change:repeating_spell-3:spellatkmod change:repeating_spell-3:spellatkcritrange change:repeating_spell-3:spelldmgcritmulti change:repeating_spell-3:spelldmgflag change:repeating_spell-3:spelldmg change:repeating_spell-3:spelldmgtype change:repeating_spell-3:spelldmg2flag change:repeating_spell-3:spelldmg2 change:repeating_spell-3:spelldmg2type change:repeating_spell-3:spelldescflag change:repeating_spell-3:spelldesc change:repeating_spell-3:notes", function(e) {
        var spellid = e.sourceAttribute.substring(18, 38);
        update_spells(3,spellid);
    });
    on("change:repeating_spell-4:spellcaster change:repeating_spell-4:spellname change:repeating_spell-4:spellschool change:repeating_spell-4:spellclasslevel change:repeating_spell-4:spellcastingtime change:repeating_spell-4:spellcomponent change:repeating_spell-4:spellrange change:repeating_spell-4:spellarea change:repeating_spell-4:spelltargets change:repeating_spell-4:spelleffect change:repeating_spell-4:spellduration change:repeating_spell-4:spellsaveflag change:repeating_spell-4:spellsave change:repeating_spell-4:spelldc_mod change:repeating_spell-4:spellresistanceflag change:repeating_spell-4:spellresistance change:repeating_spell-4:spellatkflag change:repeating_spell-4:spellatktype change:repeating_spell-4:spellatkmod change:repeating_spell-4:spellatkcritrange change:repeating_spell-4:spelldmgcritmulti change:repeating_spell-4:spelldmgflag change:repeating_spell-4:spelldmg change:repeating_spell-4:spelldmgtype change:repeating_spell-4:spelldmg2flag change:repeating_spell-4:spelldmg2 change:repeating_spell-4:spelldmg2type change:repeating_spell-4:spelldescflag change:repeating_spell-4:spelldesc change:repeating_spell-4:notes", function(e) {
        var spellid = e.sourceAttribute.substring(18, 38);
        update_spells(4,spellid);
    });
    on("change:repeating_spell-5:spellcaster change:repeating_spell-5:spellname change:repeating_spell-5:spellschool change:repeating_spell-5:spellclasslevel change:repeating_spell-5:spellcastingtime change:repeating_spell-5:spellcomponent change:repeating_spell-5:spellrange change:repeating_spell-5:spellarea change:repeating_spell-5:spelltargets change:repeating_spell-5:spelleffect change:repeating_spell-5:spellduration change:repeating_spell-5:spellsaveflag change:repeating_spell-5:spellsave change:repeating_spell-5:spelldc_mod change:repeating_spell-5:spellresistanceflag change:repeating_spell-5:spellresistance change:repeating_spell-5:spellatkflag change:repeating_spell-5:spellatktype change:repeating_spell-5:spellatkmod change:repeating_spell-5:spellatkcritrange change:repeating_spell-5:spelldmgcritmulti change:repeating_spell-5:spelldmgflag change:repeating_spell-5:spelldmg change:repeating_spell-5:spelldmgtype change:repeating_spell-5:spelldmg2flag change:repeating_spell-5:spelldmg2 change:repeating_spell-5:spelldmg2type change:repeating_spell-5:spelldescflag change:repeating_spell-5:spelldesc change:repeating_spell-5:notes", function(e) {
        var spellid = e.sourceAttribute.substring(18, 38);
        update_spells(5,spellid);
    });
    on("change:repeating_spell-6:spellcaster change:repeating_spell-6:spellname change:repeating_spell-6:spellschool change:repeating_spell-6:spellclasslevel change:repeating_spell-6:spellcastingtime change:repeating_spell-6:spellcomponent change:repeating_spell-6:spellrange change:repeating_spell-6:spellarea change:repeating_spell-6:spelltargets change:repeating_spell-6:spelleffect change:repeating_spell-6:spellduration change:repeating_spell-6:spellsaveflag change:repeating_spell-6:spellsave change:repeating_spell-6:spelldc_mod change:repeating_spell-6:spellresistanceflag change:repeating_spell-6:spellresistance change:repeating_spell-6:spellatkflag change:repeating_spell-6:spellatktype change:repeating_spell-6:spellatkmod change:repeating_spell-6:spellatkcritrange change:repeating_spell-6:spelldmgcritmulti change:repeating_spell-6:spelldmgflag change:repeating_spell-6:spelldmg change:repeating_spell-6:spelldmgtype change:repeating_spell-6:spelldmg2flag change:repeating_spell-6:spelldmg2 change:repeating_spell-6:spelldmg2type change:repeating_spell-6:spelldescflag change:repeating_spell-6:spelldesc change:repeating_spell-6:notes", function(e) {
        var spellid = e.sourceAttribute.substring(18, 38);
        update_spells(6,spellid);
    });
    on("change:repeating_spell-7:spellcaster change:repeating_spell-7:spellname change:repeating_spell-7:spellschool change:repeating_spell-7:spellclasslevel change:repeating_spell-7:spellcastingtime change:repeating_spell-7:spellcomponent change:repeating_spell-7:spellrange change:repeating_spell-7:spellarea change:repeating_spell-7:spelltargets change:repeating_spell-7:spelleffect change:repeating_spell-7:spellduration change:repeating_spell-7:spellsaveflag change:repeating_spell-7:spellsave change:repeating_spell-7:spelldc_mod change:repeating_spell-7:spellresistanceflag change:repeating_spell-7:spellresistance change:repeating_spell-7:spellatkflag change:repeating_spell-7:spellatktype change:repeating_spell-7:spellatkmod change:repeating_spell-7:spellatkcritrange change:repeating_spell-7:spelldmgcritmulti change:repeating_spell-7:spelldmgflag change:repeating_spell-7:spelldmg change:repeating_spell-7:spelldmgtype change:repeating_spell-7:spelldmg2flag change:repeating_spell-7:spelldmg2 change:repeating_spell-7:spelldmg2type change:repeating_spell-7:spelldescflag change:repeating_spell-7:spelldesc change:repeating_spell-7:notes", function(e) {
        var spellid = e.sourceAttribute.substring(18, 38);
        update_spells(7,spellid);
    });
    on("change:repeating_spell-8:spellcaster change:repeating_spell-8:spellname change:repeating_spell-8:spellschool change:repeating_spell-8:spellclasslevel change:repeating_spell-8:spellcastingtime change:repeating_spell-8:spellcomponent change:repeating_spell-8:spellrange change:repeating_spell-8:spellarea change:repeating_spell-8:spelltargets change:repeating_spell-8:spelleffect change:repeating_spell-8:spellduration change:repeating_spell-8:spellsaveflag change:repeating_spell-8:spellsave change:repeating_spell-8:spelldc_mod change:repeating_spell-8:spellresistanceflag change:repeating_spell-8:spellresistance change:repeating_spell-8:spellatkflag change:repeating_spell-8:spellatktype change:repeating_spell-8:spellatkmod change:repeating_spell-8:spellatkcritrange change:repeating_spell-8:spelldmgcritmulti change:repeating_spell-8:spelldmgflag change:repeating_spell-8:spelldmg change:repeating_spell-8:spelldmgtype change:repeating_spell-8:spelldmg2flag change:repeating_spell-8:spelldmg2 change:repeating_spell-8:spelldmg2type change:repeating_spell-8:spelldescflag change:repeating_spell-8:spelldesc change:repeating_spell-8:notes", function(e) {
        var spellid = e.sourceAttribute.substring(18, 38);
        update_spells(8,spellid);
    });
    on("change:repeating_spell-9:spellcaster change:repeating_spell-9:spellname change:repeating_spell-9:spellschool change:repeating_spell-9:spellclasslevel change:repeating_spell-9:spellcastingtime change:repeating_spell-9:spellcomponent change:repeating_spell-9:spellrange change:repeating_spell-9:spellarea change:repeating_spell-9:spelltargets change:repeating_spell-9:spelleffect change:repeating_spell-9:spellduration change:repeating_spell-9:spellsaveflag change:repeating_spell-9:spellsave change:repeating_spell-9:spelldc_mod change:repeating_spell-9:spellresistanceflag change:repeating_spell-9:spellresistance change:repeating_spell-9:spellatkflag change:repeating_spell-9:spellatktype change:repeating_spell-9:spellatkmod change:repeating_spell-9:spellatkcritrange change:repeating_spell-9:spelldmgcritmulti change:repeating_spell-9:spelldmgflag change:repeating_spell-9:spelldmg change:repeating_spell-9:spelldmgtype change:repeating_spell-9:spelldmg2flag change:repeating_spell-9:spelldmg2 change:repeating_spell-9:spelldmg2type change:repeating_spell-9:spelldescflag change:repeating_spell-9:spelldesc change:repeating_spell-9:notes", function(e) {
        var spellid = e.sourceAttribute.substring(18, 38);
        update_spells(9,spellid);
    });
    // --- PC/NPC Spell-like abilities
    on("change:repeating_spell-like:spellname change:repeating_spell-like:spellschool change:repeating_spell-like:spellclasslevel change:repeating_spell-like:spellcastingtime change:repeating_spell-like:spellrange change:repeating_spell-like:spellarea change:repeating_spell-like:spelltargets change:repeating_spell-like:spelleffect change:repeating_spell-like:spellduration change:repeating_spell-like:spellsaveflag change:repeating_spell-like:spellsave change:repeating_spell-like:spelldc_mod change:repeating_spell-like:spellresistanceflag change:repeating_spell-like:spellresistance change:repeating_spell-like:spellatkflag change:repeating_spell-like:spellatktype change:repeating_spell-like:spellatkmod change:repeating_spell-like:spellatkcritrange change:repeating_spell-like:spelldmgcritmulti change:repeating_spell-like:spelldmgflag change:repeating_spell-like:spelldmg change:repeating_spell-like:spelldmgtype change:repeating_spell-like:spelldmg2flag change:repeating_spell-like:spelldmg2 change:repeating_spell-like:spelldmg2type change:repeating_spell-like:spelldescflag change:repeating_spell-like:spelldesc change:repeating_spell-like:notes change:repeating_spell-like:timesperday change:repeating_spell-like:perday_max", function(e) {
        var spellid = e.sourceAttribute.substring(21, 41);
        update_spells("like",spellid);
    });

    // === NPC
    // --- Npc Compendium drop
    on("change:compendium_npc_size", function(e){
        if(["fine","diminutive","tiny","small","medium","large","huge","gargantuan","colossal"].includes(e.newValue.toLowerCase())) {
            setAttrs({"size":e.newValue.toLowerCase()});
        } else {
            setAttrs({"size_display":e.newValue});
        }
    });
    // --- Npc Attacks Display and Roll
    on("change:repeating_npcatk-melee:atkname change:repeating_npcatk-melee:atkmod change:repeating_npcatk-melee:multipleatk_flag change:repeating_npcatk-melee:atkmod2 change:repeating_npcatk-melee:atkmod3 change:repeating_npcatk-melee:atkmod4 change:repeating_npcatk-melee:atkmod5 change:repeating_npcatk-melee:atkmod6 change:repeating_npcatk-melee:atkmod7 change:repeating_npcatk-melee:atkmod8 change:repeating_npcatk-melee:atkmod9 change:repeating_npcatk-melee:atkcritrange change:repeating_npcatk-melee:dmgflag change:repeating_npcatk-melee:dmgbase change:repeating_npcatk-melee:dmgtype change:repeating_npcatk-melee:dmgcritmulti change:repeating_npcatk-melee:dmg2flag change:repeating_npcatk-melee:dmg2base change:repeating_npcatk-melee:dmg2type change:repeating_npcatk-melee:dmg2critmulti", function(e) {
            var atkid = e.sourceAttribute.substring(23, 43);
            update_npc_attack("melee",atkid);
    });
    on("change:repeating_npcatk-ranged:atkname change:repeating_npcatk-ranged:atkmod change:repeating_npcatk-ranged:multipleatk_flag change:repeating_npcatk-ranged:atkmod2 change:repeating_npcatk-ranged:atkmod3 change:repeating_npcatk-ranged:atkmod4 change:repeating_npcatk-ranged:atkmod5 change:repeating_npcatk-ranged:atkmod6 change:repeating_npcatk-ranged:atkmod7 change:repeating_npcatk-ranged:atkmod8 change:repeating_npcatk-ranged:atkmod9 change:repeating_npcatk-ranged:atkcritrange change:repeating_npcatk-ranged:atkrange change:repeating_npcatk-ranged:dmgflag change:repeating_npcatk-ranged:dmgbase change:repeating_npcatk-ranged:dmgtype change:repeating_npcatk-ranged:dmgcritmulti change:repeating_npcatk-ranged:dmg2flag change:repeating_npcatk-ranged:dmg2base change:repeating_npcatk-ranged:dmg2type change:repeating_npcatk-ranged:dmg2critmulti", function(e) {
            var atkid = e.sourceAttribute.substring(24, 44);
            update_npc_attack("ranged",atkid);
    });

    // === CONFIGURATION
    on("change:whispertype change:rollshowchar", function(){
       update_attacks("all");
       update_all_spells("all");
    });
    on("change:rollmod_attack change:rollnotes_attack change:rollmod_damage", function(){
       update_attacks("all");
    });

    /* === FUNCTIONS === */

    // === ABILITIES and MODS
    var update_attr = function(attr) {
        var update = {};
        var attr_fields = [attr + "_base",attr + "_race", attr + "_bonus"];
        getAttrs(attr_fields, function(v) {
            var base = parseInt(v[attr + "_base"]) || 10;
            var race = parseInt(v[attr + "_race"]) || 0;
            var bonus = parseInt(v[attr + "_bonus"]) || 0;
            update[attr + "_flag"] = bonus != 0 ? 1 : 0;
            update[attr] = base + race + bonus;
            setAttrs(update);
        });
    };
    var update_mod = function(attr) {
        getAttrs([attr], function(v) {
            var update = {};
            var mod = Math.floor(((parseInt(v[attr]) || 10) - 10) / 2);
            update[attr + "_mod"] = mod;
            if (attr == "strength") {
                update["strength_half_mod"] = Math.floor(mod*0.5);
                update["strength_oneandahalf_mod"] = Math.floor(mod*1.5);
            }
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
            var fields = ["fortitude_ability","reflex_ability","will_ability","cmb_ability","melee_ability","ranged_ability","acrobatics_ability","appraise_ability","bluff_ability","climb_ability","craft_ability","diplomacy_ability","disable_device_ability","disguise_ability","escape_artist_ability","fly_ability","handle_animal_ability","heal_ability","intimidate_ability","knowledge_arcana_ability","knowledge_dungeoneering_ability","knowledge_engineering_ability","knowledge_geography_ability","knowledge_history_ability","knowledge_local_ability","knowledge_nature_ability","knowledge_nobility_ability","knowledge_planes_ability","knowledge_religion_ability","linguistics_ability","perception_ability","perform_ability","profession_ability","ride_ability","sense_motive_ability","sleight_of_hand_ability","spellcraft_ability","stealth_ability","survival_ability","swim_ability","use_magic_device_ability","caster1_ability"];
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
    var update_flex_ability_repsection = function (attr,repsec) {
        var fields = [];
        getSectionIDs(repsec, function(idarray){
            if ( (parseInt(idarray.length) || 0) > 0) {
                _.each(idarray, function(id) {
                    fields.push("repeating_" + repsec + "_" + id + "_ability");
                });
                getAttrs(fields, function(ablts) {
                    var flexes = [];
                    _.each(fields, function(field){
                        if(ablts[field] == attr) {
                            flexes.push(field + "_mod");
                        }
                    });
                    if ( (parseInt(flexes.length) || 0) > 0) {
                        var modz = [];
                        modz.push(attr + "_mod");
                        getAttrs(modz, function(v) {
                            var update = {};
                            _.each(flexes, function(flex) {
                                update[flex] = v[attr + "_mod"];
                            });
                            setAttrs(update);
                        });
                    }
                });
            }
        });
    };
    var update_ability_mod = function(attr) {
        update_flex_ability(attr,"");
        update_ac_ability(attr);
        update_attacks(attr);
        update_flex_ability_repsection(attr,"skillcraft");
        update_flex_ability_repsection(attr,"skillknowledge");
        update_flex_ability_repsection(attr,"skillperform");
        update_flex_ability_repsection(attr,"skillprofession");
        update_flex_ability_repsection(attr,"skillcustom");
    };

    // === SIZE
    var update_size = function(psize) {
        var size = psize || "medium";
        var atkac = 0;
        var cmb = 0;
        var fly = 0;
        var stealth = 0;
        var load = 1;
        switch(size) {
            case "fine":
                atkac = 8;
                cmb = -8;
                fly = 8;
                stealth = 16;
                load = 0.125;
                break;
            case "diminutive":
                atkac = 4;
                cmb = -4;
                fly = 6;
                stealth = 12;
                load = 0.25;
                break;
            case "tiny":
                atkac = 2;
                cmb = -2;
                fly = 4;
                stealth = 8;
                load = 0.5;
                break;
            case "small":
                atkac = 1;
                cmb = -1;
                fly = 2;
                stealth = 4;
                load = 0.75;
                break;
            case "medium":
                atkac = 0;
                cmb = 0;
                fly = 0;
                stealth = 0;
                load = 1;
                break;
            case "large":
                atkac = -1;
                cmb = 1;
                fly = -2;
                stealth = -4;
                load = 2;
                break;
            case "huge":
                atkac = -2;
                cmb = 2;
                fly = -4;
                stealth = -8;
                load = 4;
                break;
            case "gargantuan":
                atkac = -4;
                cmb = 4;
                fly = -6;
                stealth = -12;
                load = 8;
                break;
            case "colossal":
                atkac = -8;
                cmb = 8;
                fly = -8;
                stealth = -16;
                load = 16;
                break;
        }
        setAttrs({
            "ac_size": atkac,
            "bab_size": atkac,
            "cmb_size": cmb,
            "fly_size": fly,
            "stealth_size": stealth,
            "encumbrance_size": load
        });
    };

    // === INITIATIVE
    var update_initiative = function () {
        getAttrs(["dexterity_mod","initiative_misc","initiative_bonus"], function(v) {
            var update = {};
            update["initiative"] = (parseInt(v.dexterity_mod) || 0) + (parseInt(v.initiative_misc) || 0) + (parseInt(v.initiative_bonus) || 0);
            setAttrs(update);
        });
    };

    // === Class / Mutliclassing / Multicasting
    var update_class_names = function() {
        var fields = ["class1_name","class2_name","class3_name","caster1_flag","caster2_flag","class1_level","class2_level","class3_level"];
        var update = {};
        getAttrs(fields, function(v) {
            var cls = "";
            var cc1 = " ";
            var cc2 = " ";
            if (typeof v.class1_name != "undefined") {
                if (v.class1_name.length > 0) {
                    cls += v.class1_name;
                    if (v.caster1_flag != "0") {
                        cc1 = v.class1_name;
                    }
                }
            }
            if (typeof v.class2_name != "undefined") {
                if (v.class2_name.length > 0) {
                    cls += (cls.length > 0) ? (" " + (parseInt(v.class1_level) || 1) + ", ") : "";
                    cls += v.class2_name + " " + (parseInt(v.class2_level) || 0);
                    if (v.caster2_flag != "0") {
                        cc2 = v.class2_name;
                    }
                }
            }
            if (typeof v.class3_name != "undefined") {
                if (v.class3_name.length > 0) {
                    cls += ((cls.length > 0) ? ", " : "") + v.class3_name + " " + (parseInt(v.class3_level) || 0);
                }
            }
            update["class"] = cls;
            update["caster1_class"] = cc1;
            update["caster2_class"] = cc2;
            update["caster_flag"] = (parseInt(v.caster1_flag) || 0) + (parseInt(v.caster2_flag) || 0);
            setAttrs(update);
        });
    };
    var update_class_numbers = function(attr) {
        var fields = ["class1_" + attr,"class2_" + attr,"class3_" + attr ];
        var update = {};
        getAttrs(fields, function(v) {
            var finalattr = "";
            var total = 0;
            total = (parseInt(v["class1_" + attr]) || 0) + (parseInt(v["class2_" + attr]) || 0) + (parseInt(v["class3_" + attr]) || 0);
            if (["level","bab"].includes(attr)) {finalattr = attr;}
            else {finalattr = attr + "_base";}
            update[finalattr] = total;
            setAttrs(update);
        });
    };

    // === AC / DEFENSE
    var update_ac_items = function() {
        var update = {};
        var attrs = ["speed_race"];
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
                attrs.push("repeating_acitems_" + itemid + "_spell_failure");
                attrs.push("repeating_acitems_" + itemid + "_speed20");
                attrs.push("repeating_acitems_" + itemid + "_speed30");
                attrs.push("repeating_acitems_" + itemid + "_run_factor");
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
                var speedrace = parseInt(v.speed_race) || 30;
                var speedreduced = calc_reduced_speed(speedrace); // heavy and medium armor
                var speed = speedrace;
                var run = 4;
                _.each(idarray, function(itemid) {
                    if ( v["repeating_acitems_" + itemid + "_equipped"] == "1" ) {
                        if (v["repeating_acitems_" + itemid + "_type"] == "shield") {
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
                        if(["heavy","medium"].includes(v["repeating_acitems_" + itemid + "_type"])) {
                            speed = Math.min(speed,speedrace,speedreduced);
                        }
                        run = Math.min(run, parseInt(v["repeating_acitems_" + itemid + "_run_factor"]) || 4);
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
                    "armor_spell_failure": spellf,
                    "speed_armor": speed,
                    "armor_run_factor":run
                });
            });
        });
    };
    var update_ac_ability = function(attr) {
        getAttrs(["ac_ability_primary","ac_ability_secondary"], function(v) {
            if( (attr == "encumbrance_ability_maximum") || (attr == "ac_ability_maximum") || (attr == v.ac_ability_primary) || (attr == v.ac_ability_secondary) ) {
                var attr_fields = [v.ac_ability_primary + "_mod",v.ac_ability_secondary + "_mod","ac_ability_maximum","encumbrance_ability_maximum"];
                getAttrs(attr_fields, function(modz) {
                    var primary = parseInt(modz[v.ac_ability_primary + "_mod"]) || 0;
                    var secondary = parseInt(modz[v.ac_ability_secondary + "_mod"]) || 0;
                    var maxmod = Math.min(parseInt(modz.ac_ability_maximum) || 99, parseInt(modz.encumbrance_ability_maximum) || 99);
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
            var flag = bonus !=0 ? 1 : 0;
            ac = base + bonus + ability + armor + shield + size + natural + deflection + misc + dodge;
            if (noflatflooted == 1) {acff = ac;}
            else {acff = base + bonus + ( (ability < 0) ? ability : 0 ) + armor + shield + size + natural + deflection + misc;}
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
    var update_babs_all = function(newbab) {
        // babs for multi attack array
        var bab = parseInt(newbab) || 0;
        var update = {};
        var babarray = [];
        var multi = bab;
        do {
            babarray.push(multi);
            multi = multi - 5;
        } while (multi > 0);
        update["bab_multi"] = babarray;
        setAttrs(update, {silent: true}, function() {
            update_attacks("bab");
            update_babs("cmb");
            update_babs("melee");
            update_babs("ranged");
            update_cmd();
        });
    }
    var update_babs = function(attr) {
        var fields = ["bab","bab_multi","bab_size",attr + "_ability_mod",attr + "_misc",attr + "_bonus"];
        getAttrs(fields, function(v) {
            var update = {};
            if (typeof v.bab_multi !== 'undefined') {
                var babarray = JSON.parse("[" + v.bab_multi + "]");
            } else {
                var babarray = [];
            }
            var atkarray = [];
            update[attr + "_mod"] = (parseInt(v.bab) || 0) + (parseInt(v.bab_size) || 0) + (parseInt(v[attr + "_ability_mod"]) || 0) + (parseInt(v[attr + "_misc"]) || 0) + (parseInt(v[attr + "_bonus"]) || 0);
            if (babarray.length) {
                var tmp = 0;
                _.each(babarray, function(babval) {
                    tmp = (parseInt(babval) || 0) + (parseInt(v.bab_size) || 0) + (parseInt(v[attr + "_ability_mod"]) || 0) + (parseInt(v[attr + "_misc"]) || 0) + (parseInt(v[attr + "_bonus"]) || 0);
                    atkarray.push(tmp);
                });
            } else {
                atkarray.push(update[attr + "_mod"]);
            }
            update[attr + "_multi"] = atkarray;
            setAttrs(update,{silent: false});
        });
    };

    // === WEAPONS/ATTACKS
    var update_attacks = function(update_id) {
        console.log("DOING UPDATE_ATTACKS: " + update_id);
        if(update_id.substring(0,1) === "-" && update_id.length === 20) {
            do_update_attack([update_id]);
        }
        else if(["strength","dexterity","constitution","intelligence","wisdom","charisma","melee","ranged","cmb","bab","all"].includes(update_id)) {
            getSectionIDs("repeating_attacks", function(idarray) {
                if(update_id === "all") {
                    do_update_attack(idarray);
                } else {
                    var attack_attribs = [];
                    _.each(idarray, function(id) {
                        attack_attribs.push("repeating_attacks_" + id + "_atktype");
                        attack_attribs.push("repeating_attacks_" + id + "_atktype2");
                        attack_attribs.push("repeating_attacks_" + id + "_dmgattr");
                        attack_attribs.push("repeating_attacks_" + id + "_dmg2attr");
                    });
                    getAttrs(attack_attribs, function(v) {
                        var attr_attack_ids = [];
                        _.each(idarray, function(id) {
                            if( (v["repeating_attacks_" + id + "_atktype"] && v["repeating_attacks_" + id + "_atktype"].includes(update_id)) ||
                                (v["repeating_attacks_" + id + "_atktype2"] && v["repeating_attacks_" + id + "_atktype2"].includes(update_id)) ||
                                (v["repeating_attacks_" + id + "_dmgattr"] && v["repeating_attacks_" + id + "_dmgattr"].includes(update_id)) ||
                                (v["repeating_attacks_" + id + "_dmg2attr"] && v["repeating_attacks_" + id + "_dmg2attr"].includes(update_id))) {
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
    var do_update_attack = function(attack_array) {
        var attack_attribs = ["strength_mod","strength_oneandahalf_mod","strength_half_mod","dexterity_mod","constitution_mod","intelligence_mod","wisdom_mod","charisma_mod","melee_mod","ranged_mod","cmb_mod","bab","rollmod_attack","rollnotes_attack","rollmod_damage","whispertype","rollshowchar","bab_multi","melee_multi","ranged_multi","cmb_multi"];
        _.each(attack_array, function(attackid) {
            attack_attribs.push("repeating_attacks_" + attackid + "_atkname");
            attack_attribs.push("repeating_attacks_" + attackid + "_atkflag");
            attack_attribs.push("repeating_attacks_" + attackid + "_atktype");
            attack_attribs.push("repeating_attacks_" + attackid + "_atktype2");
            attack_attribs.push("repeating_attacks_" + attackid + "_atkmod");
            attack_attribs.push("repeating_attacks_" + attackid + "_atkvs");
            attack_attribs.push("repeating_attacks_" + attackid + "_atkcritrange");
            attack_attribs.push("repeating_attacks_" + attackid + "_atkrange");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmgflag");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmgbase");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmgattr");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmgmod");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmgcritmulti");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmgtype");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmg2flag");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmg2base");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmg2attr");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmg2mod");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmg2critmulti");
            attack_attribs.push("repeating_attacks_" + attackid + "_dmg2type");
            attack_attribs.push("repeating_attacks_" + attackid + "_descflag");
            attack_attribs.push("repeating_attacks_" + attackid + "_atkdesc");
            attack_attribs.push("repeating_attacks_" + attackid + "_notes");
        });
        getAttrs(attack_attribs, function(v) {
            _.each(attack_array, function(attackid) {
                console.log("UPDATING ATTACK: " + attackid);
                var update = {};
                var i = 0;
                var tmpint = 0;
                var stemp = "";
                var atkbonus = 0;
                var atkbonusdisplay = "-";
                var atkbonusdisplay1 = " ";
                var atkbonusdisplay2 = " ";
                var atkbonusdisplay3 = " ";
                var atkdmg = "";
                var atkdmgbonus = 0;
                var atkdmg2bonus = 0;
                var atkdmgdisplay = "-";
                var atkdmg2display = "-";
                var atkdisplay = " ";
                var rollbase = "";
                var rollatk = " ";
                var rollatk1 = " ";
                var rollatk2 = " ";
                var rollatk3 = " ";
                var rolldmg = "";
                var rolldmgonly = "";
                var rolltype = "";
                var rollnotes = "";
                var atkname = v["repeating_attacks_" + attackid + "_atkname"];
                var atkflag = v["repeating_attacks_" + attackid + "_atkflag"];
                var atktype = 0;
                if (v["repeating_attacks_" + attackid + "_atktype"] == "bab") {
                    atktype = parseInt(v.bab) || 0;
                } else {
                    atktype = parseInt(v[v["repeating_attacks_" + attackid + "_atktype"] + "_mod"]) || 0;
                }
                var atktype2 = parseInt(v[v["repeating_attacks_" + attackid + "_atktype2"] + "_mod"]) || 0;
                var atktypearray = [];
                var atkmod = v["repeating_attacks_" + attackid + "_atkmod"];
                var atkvs = v["repeating_attacks_" + attackid + "_atkvs"];
                var atkcritrange = parseInt(v["repeating_attacks_" + attackid + "_atkcritrange"]) || 20;
                var atkrange = v["repeating_attacks_" + attackid + "_atkrange"];
                var dmgflag = v["repeating_attacks_" + attackid + "_dmgflag"];
                var dmgbase = v["repeating_attacks_" + attackid + "_dmgbase"];
                var dmgattr = parseInt(v[v["repeating_attacks_" + attackid + "_dmgattr"] + "_mod"]) || 0;
                var dmgmod = v["repeating_attacks_" + attackid + "_dmgmod"];
                var dmgcritmulti = parseInt(v["repeating_attacks_" + attackid + "_dmgcritmulti"]) || 1;
                var dmgtype = v["repeating_attacks_" + attackid + "_dmgtype"];
                var dmg2flag = v["repeating_attacks_" + attackid + "_dmg2flag"];
                var dmg2base = v["repeating_attacks_" + attackid + "_dmg2base"];
                var dmg2attr = parseInt(v[v["repeating_attacks_" + attackid + "_dmg2attr"] + "_mod"]) || 0;
                var dmg2mod = v["repeating_attacks_" + attackid + "_dmg2mod"];
                var dmg2critmulti = parseInt(v["repeating_attacks_" + attackid + "_dmg2critmulti"]) || 1;
                var dmg2type = v["repeating_attacks_" + attackid + "_dmg2type"];
                var descflag = v["repeating_attacks_" + attackid + "_descflag"];
                var atkdesc = v["repeating_attacks_" + attackid + "_atkdesc"];
                var atknotes = v["repeating_attacks_" + attackid + "_notes"];
                // Handling empty values
                if (atkmod.length == 0) {atkmod = "0";}
                if (dmgmod.length == 0) {dmgmod = "0";}
                if (dmg2mod.length == 0) {dmg2mod = "0";}
                // Multi attack base handling
                if (["bab","melee","ranged","cmb"].includes(v["repeating_attacks_" + attackid + "_atktype"])) {
                    atktypearray = JSON.parse("[" + v[v["repeating_attacks_" + attackid + "_atktype"] + "_multi"] + "]");
                }
                // == Display handling
                atkbonus = atktype + atktype2 + (parseInt(atkmod) || 0);
                atkdmgbonus = dmgattr + (parseInt(dmgmod) || 0);
                atkdmg2bonus = dmg2attr + (parseInt(dmg2mod) || 0);
                if(atkflag != "0") {
                    atkdisplay ="";
                    if (v["repeating_attacks_" + attackid + "_atktype"] != "0") {
                        atkdisplay += pfoglobals_i18n_obj[v["repeating_attacks_" + attackid + "_atktype"]];
                    }
                    if (v["repeating_attacks_" + attackid + "_atktype2"] != "0") {
                        if (atkdisplay.trim().length >0) {atkdisplay += "+";}
                        atkdisplay += pfoglobals_i18n_obj[v["repeating_attacks_" + attackid + "_atktype2"]];
                    }
                    atkdisplay = "(" + atkdisplay + " " + pfoglobals_i18n_obj["vs"] + " " + pfoglobals_i18n_obj[atkvs] + ")";
                    atkbonusdisplay = "" + (atkbonus < 0 ? "" : "+") + atkbonus;
                    if (atktypearray.length > 1) {
                        tmpint = (parseInt(atktypearray[1]) || 0) + atktype2 + (parseInt(atkmod) || 0);
                        atkbonusdisplay1 = "/" + (tmpint < 0 ? "" : "+") + tmpint;
                    }
                    if (atktypearray.length > 2) {
                        tmpint = (parseInt(atktypearray[2]) || 0) + atktype2 + (parseInt(atkmod) || 0);
                        atkbonusdisplay2 = "/" + (tmpint < 0 ? "" : "+") + tmpint;
                    }
                    if (atktypearray.length > 3) {
                        tmpint = (parseInt(atktypearray[3]) || 0) + atktype2 + (parseInt(atkmod) || 0);
                        atkbonusdisplay3 = "/" + (tmpint < 0 ? "" : "+") + tmpint;
                    }
                }
                if(dmgflag != "0") {atkdmgdisplay = "" + dmgbase + (atkdmgbonus < 0 ? "" : "+") + atkdmgbonus;}
                if(dmg2flag != "0") {atkdmg2display = "" + dmg2base + (atkdmg2bonus < 0 ? "" : "+") + atkdmg2bonus;}
                update["repeating_attacks_" + attackid + "_atkdisplay"] = atkdisplay;
                update["repeating_attacks_" + attackid + "_atkbonusdisplay"] = atkbonusdisplay;
                update["repeating_attacks_" + attackid + "_atkbonusdisplay1"] = atkbonusdisplay1;
                update["repeating_attacks_" + attackid + "_atkbonusdisplay2"] = atkbonusdisplay2;
                update["repeating_attacks_" + attackid + "_atkbonusdisplay3"] = atkbonusdisplay3;
                update["repeating_attacks_" + attackid + "_atkdmgdisplay"] = atkdmgdisplay;
                update["repeating_attacks_" + attackid + "_atkdmgdisplay2"] = atkdmg2display;
                // == Rolls handling
                // desc
                if(descflag != "0") {
                    atkdesc = "{{descflag=[[1]]}}{{desc=" + atkdesc + "}}";
                }
                // notes
                if(v["rollnotes_attack"] != "0") {
                    rollnotes = "{{shownotes=[[1]]}}{{notes=" + atknotes + "}}";
                }
                // range
                if(atkrange.length != 0) {
                    atkrange = "{{range=" + atkrange + "}}";
                }
                // roll attack
                if(atkflag != "0") {
                    stemp = atktype + "[" + pfoglobals_i18n_obj[v["repeating_attacks_" + attackid + "_atktype"]] + "]+"
                            + atktype2 + "[" + pfoglobals_i18n_obj[v["repeating_attacks_" + attackid + "_atktype2"]] + "]+"
                            + atkmod + "[MOD]+@{rollmod_attack}[BONUS]]]}}";
                    rollatk = "{{roll=[[1d20cs>" + atkcritrange + "+" + stemp + "{{atkvs=" + atkdisplay + "}}";
                    rollatk += "{{critconfirm=[[1d20cs20+" + stemp;
                    if (atktypearray.length > 1) {
                        stemp = atktypearray[1] + "[" + pfoglobals_i18n_obj[v["repeating_attacks_" + attackid + "_atktype"]] + "]+"
                                + atktype2 + "[" + pfoglobals_i18n_obj[v["repeating_attacks_" + attackid + "_atktype2"]] + "]+"
                                + atkmod + "[MOD]+@{rollmod_attack}[BONUS]]]}}";
                        rollatk1 = "{{roll1=[[1d20cs>" + atkcritrange + "+" + stemp;
                        rollatk1 += "{{critconfirm1=[[1d20cs20+" + stemp;
                    }
                    if (atktypearray.length > 2) {
                        stemp = atktypearray[2] + "[" + pfoglobals_i18n_obj[v["repeating_attacks_" + attackid + "_atktype"]] + "]+"
                                + atktype2 + "[" + pfoglobals_i18n_obj[v["repeating_attacks_" + attackid + "_atktype2"]] + "]+"
                                + atkmod + "[MOD]+@{rollmod_attack}[BONUS]]]}}";
                        rollatk2 = "{{roll2=[[1d20cs>" + atkcritrange + "+" + stemp;
                        rollatk2 += "{{critconfirm2=[[1d20cs20+" + stemp;
                    }
                    if (atktypearray.length > 3) {
                        stemp = atktypearray[3] + "[" + pfoglobals_i18n_obj[v["repeating_attacks_" + attackid + "_atktype"]] + "]+"
                                + atktype2 + "[" + pfoglobals_i18n_obj[v["repeating_attacks_" + attackid + "_atktype2"]] + "]+"
                                + atkmod + "[MOD]+@{rollmod_attack}[BONUS]]]}}";
                        rollatk3 = "{{roll3=[[1d20cs>" + atkcritrange + "+" + stemp;
                        rollatk3 += "{{critconfirm3=[[1d20cs20+" + stemp;
                    }
                    rolltype += "attack";
                    rollbase += atkflag + atkrange + rollatk + rollatk1 + rollatk2 + rollatk3;
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
                if( (dmgflag != "0") || (dmg2flag != "0") ) {
                    rolltype += "damage";
                    if(dmgflag != "0") {
                        stemp = dmgbase + "+" + dmgattr + "[" + pfoglobals_i18n_obj[v["repeating_attacks_" + attackid + "_dmgattr"]] + "]+" + dmgmod + "[MOD]+@{rollmod_damage}[BONUS]";
                        if ( (atkflag != "0") && (atktypearray.length > 1) ) {
                            // One damage roll per attack
                            rolldmg += "{{rolldmg1=[[" + stemp + "]]}}{{rolldmg1type=" + dmgtype +"}}";
                            if (atktypearray.length > 1) {rolldmg += "{{roll1dmg1=[[" + stemp + "]]}}{{roll1dmg1type=" + dmgtype +"}}";}
                            if (atktypearray.length > 2) {rolldmg += "{{roll2dmg1=[[" + stemp + "]]}}{{roll2dmg1type=" + dmgtype +"}}";}
                            if (atktypearray.length > 3) {rolldmg += "{{roll3dmg1=[[" + stemp + "]]}}{{roll3dmg1type=" + dmgtype +"}}";}
                        } else {
                            // No attack (damage only) or just one attack
                            rolldmg += dmgflag + "{{dmg1=[[" + stemp + "]]}}{{dmg1type=" + dmgtype +"}}";
                        }
                        rolldmgonly += dmgflag + "{{dmg1=[[" + stemp + "]]}}{{dmg1type=" + dmgtype +"}}";
                        if (dmgcritmulti > 1) {
                            // Critical damage
                            stemp = "";
                            for (i=1; i <= dmgcritmulti; i++) {
                                stemp += ((stemp.length > 0) ? "+" : "") + dmgbase;
                            }
                            stemp = "[[((" + stemp + ")+(" + dmgattr + "[" + pfoglobals_i18n_obj[v["repeating_attacks_" + attackid + "_dmgattr"]] + "]+" + dmgmod + "[MOD]+@{rollmod_damage}[BONUS])*" + dmgcritmulti + ")]]";
                            if ( (atkflag != "0") && (atktypearray.length > 1) ) {
                                // One crit damage roll per attack
                                rolldmg += "{{rolldmg1crit=" + stemp + "}}";
                                if (atktypearray.length > 1) {rolldmg += "{{roll1dmg1crit=" + stemp + "}}";}
                                if (atktypearray.length > 2) {rolldmg += "{{roll2dmg1crit=" + stemp + "}}";}
                                if (atktypearray.length > 3) {rolldmg += "{{roll3dmg1crit=" + stemp + "}}";}
                            } else {
                                // No attack (damage only) or just one attack
                                rolldmg += "{{dmg1crit=" + stemp + "}}";
                            }
                            rolldmgonly += "{{dmg1crit=" + stemp + "}}";
                        }
                    }
                    if(dmg2flag != "0") {
                        stemp = dmg2base + "+" + dmg2attr + "[" + pfoglobals_i18n_obj[v["repeating_attacks_" + attackid + "_dmg2attr"]] + "]+" + dmg2mod + "[MOD]+@{rollmod_damage}[BONUS]";
                        if ( (atkflag != "0") && (atktypearray.length > 1) ) {
                            // One damage roll per attack
                            rolldmg += "{{rolldmg2=[[" + stemp + "]]}}{{rolldmg2type=" + dmg2type +"}}";
                            if (atktypearray.length > 1) {rolldmg += "{{roll1dmg2=[[" + stemp + "]]}}{{roll1dmg2type=" + dmg2type +"}}";}
                            if (atktypearray.length > 2) {rolldmg += "{{roll2dmg2=[[" + stemp + "]]}}{{roll2dmg2type=" + dmg2type +"}}";}
                            if (atktypearray.length > 3) {rolldmg += "{{roll3dmg2=[[" + stemp + "]]}}{{roll3dmg2type=" + dmg2type +"}}";}
                        } else {
                            // No attack (damage only) or just one attack
                            rolldmg += dmg2flag + "{{dmg2=[[" + stemp + "]]}}{{dmg2type=" + dmg2type +"}}";
                        }
                        rolldmgonly += dmg2flag + "{{dmg2=[[" + stemp + "]]}}{{dmg2type=" + dmg2type +"}}";
                        if (dmg2critmulti > 1) {
                            // Critical damage
                            stemp = "";
                            for (i=1; i <= dmg2critmulti; i++) {
                                stemp += ((stemp.length > 0) ? "+" : "") + dmg2base;
                            }
                            stemp = "[[((" + stemp + ")+(" + dmg2attr + "[" + pfoglobals_i18n_obj[v["repeating_attacks_" + attackid + "_dmg2attr"]] + "]+" + dmg2mod + "[MOD]+@{rollmod_damage}[BONUS])*" + dmg2critmulti + ")]]";
                            if ( (atkflag != "0") && (atktypearray.length > 1) ) {
                                // One crit damage roll per attack
                                rolldmg += "{{rolldmg2crit=" + stemp + "}}";
                                if (atktypearray.length > 1) {rolldmg += "{{roll1dmg2crit=" + stemp + "}}";}
                                if (atktypearray.length > 2) {rolldmg += "{{roll2dmg2crit=" + stemp + "}}";}
                                if (atktypearray.length > 3) {rolldmg += "{{roll3dmg2crit=" + stemp + "}}";}
                            } else {
                                // No attack (damage only) or just one attack
                                rolldmg += "{{dmg2crit=" + stemp + "}}";
                            }
                            rolldmgonly += "{{dmg2crit=" + stemp + "}}";
                        }
                    }
                    // desc
                    if((descflag != "0") && (atkflag == "0")) {
                        rolldmg += atkdesc;
                        rolldmgonly += atkdesc;
                    }
                    // notes
                    if((v["rollnotes_attack"] != "0") && (atkflag == "0")) {
                        rolldmg += rollnotes;
                        rolldmgonly += rollnotes;
                    }
                    rollbase += rolldmg;
                }
                // final rolls values
                if (rollbase.trim().length > 0) {
                    rollbase = "@{whispertype} &{template:pc" + "}{{name=" + atkname + "}}{{type=" + rolltype + "}}{{showchar=@{rollshowchar}}}{{charname=@{character_name}}}" + rollbase;
                }
                if (rollatk.trim().length > 0) {
                    rollatk = "@{whispertype} &{template:pc" + "}{{name=" + atkname + "}}{{type=attack}}{{showchar=@{rollshowchar}}}{{charname=@{character_name}}}" + atkflag + atkrange + rollatk;
                }
                if (rollatk1.trim().length > 0) {
                    rollatk1 = "@{whispertype} &{template:pc" + "}{{smallname=" + atkname + "}}{{type=attack}}{{showchar=@{rollshowchar}}}{{charname=@{character_name}}}" + atkflag + rollatk1;
                }
                if (rollatk2.trim().length > 0) {
                    rollatk2 = "@{whispertype} &{template:pc" + "}{{smallname=" + atkname + "}}{{type=attack}}{{showchar=@{rollshowchar}}}{{charname=@{character_name}}}" + atkflag + rollatk2;
                }
                if (rollatk3.trim().length > 0) {
                    rollatk3 = "@{whispertype} &{template:pc" + "}{{smallname=" + atkname + "}}{{type=attack}}{{showchar=@{rollshowchar}}}{{charname=@{character_name}}}" + atkflag + rollatk3;
                }
                if (rolldmg.trim().length > 0) {
                    rolldmgonly = "@{whispertype} &{template:pc" + "}{{smallname=" + atkname + "}}{{type=damage}}{{showchar=@{rollshowchar}}}{{charname=@{character_name}}}" + rolldmgonly;
                }
                update["repeating_attacks_" + attackid + "_rollbase"] = rollbase;
                update["repeating_attacks_" + attackid + "_rollbase_atk"] = rollatk;
                update["repeating_attacks_" + attackid + "_rollbase_atk1"] = rollatk1;
                update["repeating_attacks_" + attackid + "_rollbase_atk2"] = rollatk2;
                update["repeating_attacks_" + attackid + "_rollbase_atk3"] = rollatk3;
                update["repeating_attacks_" + attackid + "_rollbase_dmg"] = rolldmgonly;
                // == update
                setAttrs(update, {silent: true});
            });
        });
    };
    // --- NPC attacks
    var update_npc_attacks_all = function() {
        update_npc_attacks_melee();
        update_npc_attacks_ranged();
    };
    var update_npc_attacks_melee = function() {
        getSectionIDs("repeating_npcatk-melee", function(idarray) {
            _.each(idarray, function(id) {
                update_npc_attack("melee",id);
            });
        });
    };
    var update_npc_attacks_ranged = function () {
        getSectionIDs("repeating_npcatk-ranged", function(idarray) {
            _.each(idarray, function(id) {
                update_npc_attack("ranged",id);
            });
        });
    };
    var update_npc_attack = function (type,id) {
        // type = "melee" / "ranged"
        var update = {};
        var i=0;
        var display = "";
        var multi = "";
        var sdmg1 = "";
        var sdmg2 = "";
        var scrit1 = "";
        var scrit2 = "";
        var base = "repeating_npcatk-" + type + "_" + id + "_";
        var fields = [base + "atkname",base + "atkflag",base + "atkmod",base + "multipleatk_flag",base + "atkmod2",base + "atkmod3",base + "atkmod4",base + "atkmod5",base + "atkmod6",base + "atkmod7",base + "atkmod8",base + "atkmod9",base + "atkcritrange",base + "dmgflag",base + "dmgbase",base + "dmgtype",base + "dmgcritmulti",base + "dmg2flag",base + "dmg2base",base + "dmg2type",base + "dmg2critmulti"];
        if(type == "ranged") {fields.push(base + "atkrange");}
        getAttrs(fields, function(v){
            display = v[base + "atkname"];
            display += " " + (((parseInt(v[base  + "atkmod"]) || 0) > 0) ? "+" : "") + v[base  + "atkmod"];
            var dmgcritmulti = parseInt(v[base + "dmgcritmulti"]) || 1;
            var dmg2critmulti = parseInt(v[base + "dmg2critmulti"]) || 1;
            // First attack
            multi = "{{roll=[[1d20cs>@{atkcritrange}+@{atkmod}[MOD]+@{rollmod_attack}[BONUS]]]}}";
            multi += "{{critconfirm=[[1d20cs20+@{atkmod}[MOD]+@{rollmod_attack}[BONUS]]]}}";
            // Damage
            if( (v[base + "dmgflag"] != "0") && (v[base + "dmgbase"].length > 0) ){
                sdmg1 = "[[" + v[base + "dmgbase"] + "+@{rollmod_damage}[BONUS]]]";
                multi += "{{rolldmg1=" + sdmg1 + "}}{{rolldmg1type=@{dmgtype}}}";
                if(dmgcritmulti > 1) {
                    scrit1 = "";
                    for (i=1; i <= dmgcritmulti; i++) {
                        scrit1 += ((scrit1.length > 0) ? "+" : "") + v[base + "dmgbase"];
                    }
                    scrit1 = "[[(" + scrit1 + ")+(@{rollmod_damage}[BONUS]*" + dmgcritmulti + ")]]";
                    multi += "{{rolldmg1crit=" + scrit1 + "}}";
                }
            }
            if( (v[base + "dmg2flag"] != "0") && (v[base + "dmg2base"].length > 0) ){
                sdmg2 = "[[" + v[base + "dmg2base"] + "+@{rollmod_damage}[BONUS]]]";
                multi += "{{rolldmg2=" + sdmg2 + "}}{{rolldmg2type=@{dmg2type}}}";
                if(dmg2critmulti > 1) {
                    scrit2 = "";
                    for (i=1; i <= dmg2critmulti; i++) {
                        scrit2 += ((scrit2.length > 0) ? "+" : "") + v[base + "dmg2base"];
                    }
                    scrit2 = "[[(" + scrit2 + ")+(@{rollmod_damage}[BONUS]*" + dmg2critmulti + ")]]";
                    multi += "{{rolldmg2crit=" + scrit2 + "}}";
                }
            }
            // Multi attack
            if(v[base + "multipleatk_flag"] == "1"){
                for (var i = 2; i < 10; i++) {
                    if (v[base  + "atkmod" + i] != "") {
                        display += "/" + (((parseInt(v[base  + "atkmod" + i]) || 0) > 0) ? "+" : "") + v[base  + "atkmod" + i];
                        multi += "{{roll" + (i-1) + "=[[1d20cs>@{atkcritrange}+@{atkmod" + i + "}[MOD]+@{rollmod_attack}[BONUS]]]}}{{critconfirm" + (i-1) + "=[[1d20cs20+@{atkmod" + i + "}[MOD]+@{rollmod_attack}[BONUS]]]}}";
                        if(sdmg1.length) {
                            multi += "{{roll" + (i-1) + "dmg1=" + sdmg1 + "}}{{roll" + (i-1) + "dmg1type=" + v[base + "dmgtype"] +"}}";
                            if(dmgcritmulti > 1) {
                                multi += "{{roll" + (i-1) + "dmg1crit=" + scrit1 + "}}";
                            }
                        }
                        if(v[base + "dmg2flag"] == "1") {
                            multi += "{{roll" + (i-1) + "dmg2=" + sdmg2 + "}}{{roll" + (i-1) + "dmg2type=" + v[base + "dmg2type"] +"}}";
                            if(dmg2critmulti > 1) {
                                multi += "{{roll" + (i-1) + "dmg2crit=" + scrit2 + "}}";
                            }
                        }
                    }
                }
            }
            if((type == "ranged") && (v[base + "atkrange"] != "")) {
                display += " " + v[base + "atkrange"];
            }
            if ((v[base  + "dmgflag"] != "0")||(v[base  + "dmg2flag"] != "0")) {
                var dmg = "";
                var dmg1 = "";
                var dmg2 = "";
                if(v[base  + "dmgflag"] != "0") {
                    dmg1 += v[base + "dmgbase"];
                    if((parseInt(v[base + "atkcritrange"]) || 20) < 20) {dmg1 += "/" + v[base + "atkcritrange"] + "-20";}
                    if((parseInt(v[base + "dmgcritmulti"]) || 2) != 2) {dmg1 += "/x" + v[base + "dmgcritmulti"];}
                    if(v[base + "dmgtype"] != "") {dmg1 += " " + v[base + "dmgtype"];}
                }
                if (v[base  + "dmg2flag"] != "0") {
                    if(v[base + "dmg2base"].trim() != "0") {dmg2 += v[base + "dmg2base"];}
                    if(v[base + "dmg2type"] != "") {dmg2 += " " + v[base + "dmg2type"];}
                    if((parseInt(v[base + "dmg2critmulti"]) || 1) != 1) {dmg2 += "/x" + v[base + "dmg2critmulti"];}
                }
                dmg = dmg1 + ((dmg2.length >0) ? ", " : "") + dmg2;
                if (dmg.length >0) {
                    display += " (" + dmg + ")";
                }
            }
            update[base + "atkdisplay"] = display;
            update[base + "multipleatk"] = multi;
            setAttrs(update,{silent:true});
        });
    };

    // === SKILLS
    var update_skill = function(attr,source) {
        var fields = [attr + "_classkill",attr + "_ability", attr + "_ability_mod",attr + "_ranks",attr + "_misc",attr + "_bonus",attr + "_armor_penalty","skill_check_penalty","strength_mod","dexterity_mod","constitution_mod","intelligence_mod","wisdom_mod","charisma_mod"];
        getAttrs(fields, function(v) {
            var update = {};
            var cls = parseInt(v[attr + "_classkill"]) || 0;
            var ranks = parseInt(v[attr + "_ranks"]) || 0;
            var penlt = 0;
            if (["strength","dexterity"].includes(v[attr + "_ability"])) {
                penlt = v[attr + "_armor_penalty"] != "0" ? (parseInt(v.skill_check_penalty) || 0) : 0;
            } else {
                update[attr + "_armor_penalty"] = "0";
            }
            var clsbonus = (cls * ranks) != 0 ? 3 : 0;
            var flag = (penlt != 0 ? 1 : 0) + (((parseInt(v[attr + "_bonus"]) || 0) != 0 ? 1 : 0) * 2);
            update[attr + "_penalty_flag"] = flag;
            var abltmod = 0;
            if (String(v[attr + "_ability_mod"] || "")) {
                abltmod  = parseInt(v[attr + "_ability_mod"]) || 0;
            } else {
                abltmod = parseInt(v[v[attr + "_ability"] + "_mod"]) || 0;
                update[attr + "_ability_mod"] = abltmod;
            }
            var skill = clsbonus + ranks + penlt + abltmod + (parseInt(v[attr + "_misc"]) || 0) + (parseInt(v[attr + "_bonus"]) || 0);
            if (attr.substr(0, 15) == "repeating_skill") {update[attr + "_skill"] = skill;}
            else {update[attr] = skill;}
            setAttrs(update, {silent: true}, sum_someskills_ranks(source));
        });
    };
    var sum_someskills_ranks = function(source) {
        if (source.slice(-5) == "ranks") {
            var fields = [];
            var ranks = 0;
            var update = {};
            if (source.includes("repeating_skill")) {
                var repsec = "";
                if (source.includes("skillcraft")) {repsec = "skillcraft";}
                else if (source.includes("skillknowledge")) {repsec = "skillknowledge";}
                else if (source.includes("skillperform")) {repsec = "skillperform";}
                else if (source.includes("skillprofession")) {repsec = "skillprofession";}
                else if (source.includes("skillcustom")) {repsec = "skillcustom";}
                if (repsec.length > 0 ){
                    getSectionIDs("repeating_" + repsec, function(idarray) {
                        _.each(idarray, function(id) {
                            fields.push("repeating_" + repsec + "_" + id + "_ranks");
                        });
                        getAttrs(fields, function(v){
                            _.each(fields, function(fld){
                                ranks += parseInt(v[fld]) || 0;
                            });
                            update[repsec + "_ranks"] = ranks;
                            setAttrs(update,{silent:false});
                        });
                    });
                }
            } else {
                fields = ["acrobatics_ranks","appraise_ranks","bluff_ranks","climb_ranks","craft_ranks","diplomacy_ranks","disable_device_ranks","disguise_ranks","escape_artist_ranks","fly_ranks","handle_animal_ranks","heal_ranks","intimidate_ranks","knowledge_arcana_ranks","knowledge_dungeoneering_ranks","knowledge_engineering_ranks","knowledge_geography_ranks","knowledge_history_ranks","knowledge_local_ranks","knowledge_nature_ranks","knowledge_nobility_ranks","knowledge_planes_ranks","knowledge_religion_ranks","linguistics_ranks","perception_ranks","perform_ranks","profession_ranks","ride_ranks","sense_motive_ranks","sleight_of_hand_ranks","spellcraft_ranks","stealth_ranks","survival_ranks","swim_ranks","use_magic_device_ranks"];
                getAttrs(fields, function(v){
                    _.each(fields, function(fld){
                        ranks += parseInt(v[fld]) || 0;
                    });
                    update["skillfixed_ranks"] = ranks;
                    setAttrs(update,{silent:false});
                });
            }
        }
    };
    var sum_allskills_ranks = function() {
        var fields = ["skillfixed_ranks","skillcraft_ranks","skillknowledge_ranks","skillperform_ranks","skillprofession_ranks","skillcustom_ranks"];
        getAttrs(fields, function(v){
            var ranks = 0;
            _.each(fields, function(fld){
                ranks += parseInt(v[fld]) || 0;
            });
            setAttrs({"skills_ranks_total":ranks},{silent:true});
        });
    };

    // === SPEED
    var update_speed_base = function(recalc) {
        if (recalc == "1") {
            // Force recalculation of speed_encumbrance and speed_armor
            var fields = ["speed_race","encumbrance"];
            getAttrs(fields, function(v) {
                var update = {};
                var speedrace = parseInt(v.speed_race) || 30;
                var speed = speedrace;
                if (["medium","heavy"].includes(v.encumbrance)) {
                    speed = calc_reduced_speed(speedrace);
                } else if (v.encumbrance == "over") {
                    speed = 5;
                }
                update["speed_encumbrance"] = speed;
                setAttrs(update,{silent: false},function() {update_ac_items();});
            });
        } else {
            var fields = ["speed_race","speed_notmodified","speed_encumbrance","speed_armor"];
            getAttrs(fields, function(v) {
                var update = {};
                var speed = parseInt(v.speed_race) || 30;
                if (v.speed_notmodified != "1") {
                    speed = Math.min(speed, parseInt(v.speed_encumbrance) || 30, parseInt(v.speed_armor) || 30);
                }
                update["speed_base"] = speed;
                setAttrs(update, {silent: false});
            });
        }
    };
    var update_run_factor = function() {
        var fields = ["encumbrance_run_factor","armor_run_factor"];
        getAttrs(fields, function(v) {
            var update = {};
            var runfac = Math.min((parseInt(v.encumbrance_run_factor) || 4),(parseInt(v.armor_run_factor) || 4));
            update["speed_run_factor"] = runfac;
            setAttrs(update, {silent: false});
        });
    };
    var update_speed = function() {
        var fields = ["speed_base","speed_bonus","speed_run_factor"];
        getAttrs(fields, function(v) {
            var update = {};
            var runfac = parseInt(v.speed_run_factor) || 4;
            var speed = (parseInt(v.speed_base) || 30) + (parseInt(v.speed_bonus) || 0);
            var fourth = calc_round_speed(speed/4);
            update["speed"] = speed;
            update["speed_run"] = (speed * runfac);
            update["speed_swim"] = fourth;
            update["speed_climb"] = fourth;
            setAttrs(update, {silent: true});
        });
    };
    var calc_reduced_speed = function(basespeed) {
        var base = parseInt(basespeed) || 30;
        var speed = Math.ceil((((base/5)/3)*2))*5;
        return speed;
    };
    var calc_round_speed = function(rawspeed) {
        var base = parseFloat(rawspeed) || 0.0;
        var speed = Math.floor(base/5)*5;
        speed = (speed < 5) ? 5 : speed;
        return speed;
    };

    // === GEAR / ENCUMBRANCE
    var update_gear_weight = function(id) {
        var fields = ["repeating_gear_" + id + "_weight","repeating_gear_" + id + "_quantity"];
        getAttrs(fields, function(v) {
            var update = {};
            var weight = (parseFloat(v["repeating_gear_" + id + "_weight"]) || 0.0) * (parseFloat(v["repeating_gear_" + id + "_quantity"]) || 0.0);
            if ((weight - parseInt(weight)) > 0) {
                weight = weight.toFixed(1);
            }
            update["repeating_gear_" + id + "_weight_total"] = weight;
            setAttrs(update, {silent: false});
        });
    };
    var update_gear_weight_total = function() {
        getSectionIDs("repeating_gear", function(idarray) {
            var attribs = [];
            _.each(idarray, function(id) {
                attribs.push("repeating_gear_" + id + "_weight_total");
            });
            getAttrs(attribs, function(v) {
                var total = 0;
                var update = {}
                _.each(idarray, function(id) {
                    total += parseFloat(v["repeating_gear_" + id + "_weight_total"]) || 0.0;
                });
                if ((total - parseInt(total)) > 0) {
                    total = total.toFixed(1);
                }
                update["encumbrance_gear_weight"] = total;
                setAttrs(update, {silent: false});
            });
        });
    };
    // Encumbrance
    var update_encumbrance_load = function() {
        getAttrs(["encumbrance_load_bonus","encumbrance_load_multiplier","strength","encumbrance_size"], function(v) {
            var bonus = parseInt(v.encumbrance_load_bonus) || 0;
            var str = (parseInt(v.strength) || 10) + bonus;
            var multi = parseInt(v.encumbrance_load_multiplier) || 1;
            var size = parseFloat(v.encumbrance_size) || 1.0;
            var heavy = (calc_max_load(str) * size) * multi;
            var medium = Math.floor((heavy / 3) * 2);
            var light = Math.floor(heavy / 3);
            var update = {};
            update["encumbrance_load_light"] = light;
            update["encumbrance_load_medium"] = medium;
            update["encumbrance_load_heavy"] = heavy;
            update["encumbrance_lift_head"] = heavy;
            update["encumbrance_lift_ground"] = heavy * 2;
            update["encumbrance_drag_push"] = heavy * 5;
            setAttrs(update, {silent: false});
        });
    };
    var calc_max_load = function(str) {
        if((str >= 0) && (str <= 10)) {
            return (str * 10);
        } else if (str > 14) {
            return (2 * calc_max_load(str - 5));
        } else {
            return ([115, 130, 150, 175][str - 11]);
        }
    };
    var check_encumbrance = function() {
        var fields = ["encumbrance_gear_weight","encumbrance_load_light","encumbrance_load_medium","encumbrance_load_heavy","speed_race","encumbrance","encumbrance_display"];
        getAttrs(fields, function(v) {
            var update = {};
            var checkpen = 0;
            var speedrace = parseInt(v.speed_race) || 30;
            var speed = speedrace;
            var dexmax = 99;
            var maxab = "-";
            var runfactor = 4;
            var display = "";
            var weight = parseInt(v.encumbrance_gear_weight) || 0;
            var light = parseInt(v.encumbrance_load_light) || 1;
            var medium = parseInt(v.encumbrance_load_medium) || 2;
            var heavy = parseInt(v.encumbrance_load_heavy) || 3;
            var prevenc = v.encumbrance; // light / medium / heavy / over
            var newenc = prevenc;
            if (typeof v.encumbrance_display !== 'undefined') {display = v.encumbrance_display;}
            if((weight > light) && (weight <= medium)) {
                newenc = "medium";
                checkpen = -3;
                speed = calc_reduced_speed(speedrace);
                dexmax = 3;
                runfactor = 4;
            } else if ((weight > medium) && (weight <= heavy)) {
                newenc = "heavy";
                checkpen = -6;
                speed = calc_reduced_speed(speedrace);
                dexmax = 1;
                runfactor = 3;
            } else if (weight > heavy) {
                newenc = "over";
                checkpen = -6;
                speed = 5;
                dexmax = 1;
                runfactor = 3;
            } else {
                newenc = "light";
            }
            if((prevenc != newenc) || (display == "")) {
                if (dexmax < 99) {
                    maxab = dexmax;
                }
                update["encumbrance"] = newenc;
                update["encumbrance_display"] = getTranslationByKey(newenc + "-load");
                update["encumbrance_check_penalty"] = checkpen;
                update["speed_encumbrance"] = speed;
                update["encumbrance_ability_maximum"] = maxab;
                update["encumbrance_run_factor"] = runfactor;
                setAttrs(update,{silent: false});
            }
        });
    };

    // === SPELLS / SPELLCASTING
    var update_concentration = function(srcattr) {
        var cster = srcattr.substr(0,7).slice(-1);
        var fields = ["caster" + cster + "_level","caster" + cster + "_ability_mod","caster" + cster + "_concentration_misc","caster" + cster + "_concentration_bonus"];
        getAttrs(fields, function(v) {
            var update = {};
            update["caster" + cster + "_concentration"] = (parseInt(v["caster" + cster + "_level"]) || 0) + (parseInt(v["caster" + cster + "_ability_mod"]) || 0) + (parseInt(v["caster" + cster + "_concentration_misc"]) || 0) + (parseInt(v["caster" + cster + "_concentration_bonus"]) || 0);
            setAttrs(update, {silent: true});
        });
    };
    var update_spellsdc = function (attr) {
        var cster = attr.substr(0,7).slice(-1);
        var fields = ["caster" + cster + "_ability_mod","caster" + cster + "_dc_misc"];
        var minlvl = 0;
        var maxlvl = 0;
        if (fields.includes(attr)) {
            maxlvl = 10;
            fields = fields.concat(["caster" + cster + "_dcbonus_level_0","caster" + cster + "_dcbonus_level_1","caster" + cster + "_dcbonus_level_2","caster" + cster + "_dcbonus_level_3","caster" + cster + "_dcbonus_level_4","caster" + cster + "_dcbonus_level_5","caster" + cster + "_dcbonus_level_6","caster" + cster + "_dcbonus_level_7","caster" + cster + "_dcbonus_level_8","caster" + cster + "_dcbonus_level_9"]);
        } else {
            minlvl = parseInt(attr.charAt(attr.length - 1));
            maxlvl = 1 + minlvl;
            fields.push("caster" + cster + "_dcbonus_level_" + minlvl);
        }
        if ((minlvl >= 0) && (maxlvl <= 10)) {
            getAttrs(fields, function(v) {
                var update = {};
                var i = 0;
                for (i = minlvl; i < maxlvl; i++) {
                    update["caster" + cster + "_dc_level_" + i] = 10 + i + (parseInt(v["caster" + cster + "_ability_mod"]) || 0) + (parseInt(v["caster" + cster + "_dc_misc"]) || 0) + (parseInt(v["caster" + cster + "_dcbonus_level_" + i]) || 0);
                }
                setAttrs(update, {silent: false});
            });
        }
    };
    var update_spells_totals = function(level,cster) {
        var fields = ["caster" + cster + "_spells_perday_level_" + level,"caster" + cster + "_spells_bonus_level_" + level, "caster1_spells_total_level_" + level, "caster2_spells_total_level_" + level];
        getAttrs(fields, function(v) {
            var update = {};
            var cstertot = (parseInt(v["caster" + cster + "_spells_perday_level_" + level]) || 0) + (parseInt(v["caster" + cster + "_spells_bonus_level_" + level]) || 0);
            var tot = 0;
            if (cster == 1) {
                tot = cstertot + (parseInt(v["caster2_spells_total_level_" + level]) || 0);
            } else {
                tot = cstertot + (parseInt(v["caster1_spells_total_level_" + level]) || 0);
            }
            update["caster" + cster + "_spells_total_level_" + level] = cstertot;
            update["caster_spells_total_level_" + level] = tot;
            setAttrs(update, {silent: true});
        });
    };
    var update_spells_prepared = function (src,val) {
        var update = {};
        var repsec = src.substr(0,17);
        var level = repsec.charAt(repsec.length - 1);
        getSectionIDs("repeating_spell-" + level, function(idarray) {
            var spell_attribs = ["caster1_spells_total_level_" + level,"caster2_spells_total_level_" + level];
            _.each(idarray, function(spellid) {
                spell_attribs.push("repeating_spell-" + level + "_" + spellid + "_spellprepared");
                spell_attribs.push("repeating_spell-" + level + "_" + spellid + "_spellcaster");
            });
            getAttrs(spell_attribs, function(v) {
                var total1 = 0;
                var total2 = 0;
                _.each(idarray, function(id) {
                    if (v["repeating_spell-" + level + "_" + id + "_spellcaster"] == "2") {
                        total2 += parseInt(v["repeating_spell-" + level + "_" + id + "_spellprepared"]) || 0;
                    } else {
                        total1 += parseInt(v["repeating_spell-" + level + "_" + id + "_spellprepared"]) || 0;
                    }
                });
                update["caster1_spells_prepared_level_" + level] = total1;
                update["caster1_spells_prepared_flag_" + level] = (total1 > (parseInt(v["caster1_spells_total_level_" + level]) || 0)) ? 1 : 0;
                update["caster2_spells_prepared_level_" + level] = total2;
                update["caster2_spells_prepared_flag_" + level] = (total2 > (parseInt(v["caster2_spells_total_level_" + level]) || 0)) ? 1 : 0;
                setAttrs(update, {silent: true});
            });
        });
    };
    var update_all_spells = function(update_id) {
        update_spells(0,update_id);
        update_spells(1,update_id);
        update_spells(2,update_id);
        update_spells(3,update_id);
        update_spells(4,update_id);
        update_spells(5,update_id);
        update_spells(6,update_id);
        update_spells(7,update_id);
        update_spells(8,update_id);
        update_spells(9,update_id);
        update_spells("like",update_id);
    };
    var update_spells = function(level,update_id) {
        console.log("DOING UPDATE_SPELLS: " + level + " / " + update_id);
        if(update_id.substring(0,1) === "-" && update_id.length === 20) {
            do_update_spell(level,[update_id]);
        }
        else if(["strength","dexterity","constitution","intelligence","wisdom","charisma","melee","ranged","cmb","all"].includes(update_id)) {
            getSectionIDs("repeating_spell-" + level, function(idarray) {
                if(update_id === "all") {
                    do_update_spell(level,idarray);
                } else {
                    var spell_attribs = [];
                    _.each(idarray, function(spellid) {
                        spell_attribs.push("repeating_spell-" + level + "_" + spellid + "_spellatktype");
                    });
                    getAttrs(spell_attribs, function(v) {
                        var attr_spell_ids = [];
                        _.each(idarray, function(id) {
                            if(v["repeating_spell-" + level + "_" + id + "_spellatktype"] && v["repeating_spell-" + level + "_" + id + "_spellatktype"].includes(update_id)) {attr_spell_ids.push(id);}
                        });
                        if(attr_spell_ids.length > 0) {do_update_spell(level,attr_spell_ids);}
                    });
                }
            });
        }
    };
    var do_update_spell = function(spell_level,spell_array) {
        var spell_attribs = ["strength_mod","dexterity_mod","constitution_mod","intelligence_mod","wisdom_mod","charisma_mod","melee_mod","ranged_mod","cmb_mod","rollmod_attack","rollnotes_spell","rollmod_damage","whispertype","rollshowchar","caster1_level", "caster1_dc_level_" + spell_level,"caster2_level","caster2_dc_level_" + spell_level,"caster1_flag","caster2_flag","caster1_class","caster2_class","armor_spell_failure","caster1_spell_failure","caster2_spell_failure","npc","caster1_concentration_roll","caster2_concentration_roll"];
        _.each(spell_array, function(spellid) {
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spelllevel");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellcaster");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellname");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellschool");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellclasslevel");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellcastingtime");
            if (spell_level != "like") {
                spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellcomponent");
            }
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellrange");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellarea");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spelltargets");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spelleffect");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellduration");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellsaveflag");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellsave");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spelldc_mod");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellresistanceflag");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellresistance");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellatkflag");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellatktype");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellatkmod");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellatkcritrange");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spelldmgcritmulti");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spelldmgflag");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spelldmg");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spelldmgtype");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spelldmg2flag");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spelldmg2");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spelldmg2type");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spelldescflag");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spelldesc");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_notes");
            if(spell_level == "like") {
                spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_timesperday");
                spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_perday_max");
            }
        });
        getAttrs(spell_attribs, function(v) {
            _.each(spell_array, function(spellid) {
                console.log("UPDATING SPELL: " + spell_level + " / " + spellid);
                var update = {};
                var stemp = "";
                var rollbase = "";
                var rollbasetemplate = "pc";
                if (v.npc == "1") {
                    rollbasetemplate = "npc";
                }
                var atkflag = v["repeating_spell-" + spell_level + "_" + spellid + "_spellatkflag"];
                //var atktype = parseInt(v[v["repeating_spell-" + spell_level + "_" + spellid + "_spellatktype"] + "_mod"]) || 0;
                var atktype = v["repeating_spell-" + spell_level + "_" + spellid + "_spellatktype"];
                var atkmod = v["repeating_spell-" + spell_level + "_" + spellid + "_spellatkmod"];
                var atkcritrange = parseInt(v["repeating_spell-" + spell_level + "_" + spellid + "_spellatkcritrange"]) || 20;
                var dmgflag = v["repeating_spell-" + spell_level + "_" + spellid + "_spelldmgflag"];
                var dmgbase = v["repeating_spell-" + spell_level + "_" + spellid + "_spelldmg"];
                var dmgcritmulti = parseInt(v["repeating_spell-" + spell_level + "_" + spellid + "_spelldmgcritmulti"]) || 1;
                var dmgtype = v["repeating_spell-" + spell_level + "_" + spellid + "_spelldmgtype"];
                var dmg2flag = v["repeating_spell-" + spell_level + "_" + spellid + "_spelldmg2flag"];
                var dmg2base = v["repeating_spell-" + spell_level + "_" + spellid + "_spelldmg2"];
                var dmg2type = v["repeating_spell-" + spell_level + "_" + spellid + "_spelldmg2type"];
                var cster = v["repeating_spell-" + spell_level + "_" + spellid + "_spellcaster"];
                // == Display and Multiclass handling
                if (spell_level == "like") {
                    update["repeating_spell-" + spell_level + "_" + spellid + "_spelldisplay"] = v["repeating_spell-" + spell_level + "_" + spellid + "_spellname"] + " — " + pfoglobals_i18n_obj[v["repeating_spell-" + spell_level + "_" + spellid + "_timesperday"]];
                    update["repeating_spell-" + spell_level + "_" + spellid + "_spellprepared"] = (v["repeating_spell-" + spell_level + "_" + spellid + "_timesperday"] == "per-day") ? 1 : 0;
                } else {
                    update["repeating_spell-" + spell_level + "_" + spellid + "_spelldisplay"] = v["repeating_spell-" + spell_level + "_" + spellid + "_spellname"];
                    // Multicasting
                    if ((v.caster1_flag == "1") && (typeof v.caster1_class != "undefined")) {
                        update["repeating_spell-" + spell_level + "_" + spellid + "_spellcaster1_class"] = (v.caster1_class.length > 0) ? v.caster1_class : " ";
                    } else {
                        update["repeating_spell-" + spell_level + "_" + spellid + "_spellcaster1_class"] = " ";
                    }
                    if ((v.caster2_flag == "1") && (typeof v.caster2_class != "undefined")) {
                        update["repeating_spell-" + spell_level + "_" + spellid + "_spellcaster2_class"] = (v.caster2_class.length > 0) ? v.caster2_class : " ";
                    } else {
                        update["repeating_spell-" + spell_level + "_" + spellid + "_spellcaster2_class"] = " ";
                    }
                    if ((v.caster1_flag == "1") && (v.caster2_flag == "1")) {
                        update["repeating_spell-" + spell_level + "_" + spellid + "_spellmulticasters-flag"] = 1;
                    } else {
                        update["repeating_spell-" + spell_level + "_" + spellid + "_spellmulticasters-flag"] = 0;
                        if (v.caster1_flag == "1") {
                            update["repeating_spell-" + spell_level + "_" + spellid + "_spellcaster"] = 1;
                            cster = "1";
                        }
                        else if (v.caster2_flag == "1") {
                            update["repeating_spell-" + spell_level + "_" + spellid + "_spellcaster"] = 2;
                            cster = "2";
                        }
                    }
                }
                // == Save DC
                var savedc = 0 + (parseInt(v["caster" + cster + "_dc_level_" + spell_level]) || 0) + (parseInt(v["repeating_spell-" + spell_level + "_" + spellid + "_spelldc_mod"]) || 0);
                // == Rolls handling
                // base
                rollbase = "@{whispertype} &{template:" + rollbasetemplate + "}{{name=" + v["repeating_spell-" + spell_level + "_" + spellid + "_spellname"] + "}}{{type=spell}}{{showchar=@{rollshowchar}}}{{charname=@{character_name}}}";
                // spell level
                if (spell_level == "like") {
                    if (v.npc == "1") {
                        rollbase += "{{level=" + v.caster2_level + "}}";
                    }
                } else {
                    rollbase += "{{level=" + spell_level + "}}";
                }
                // caster class
                if ((v.npc == "0") && (v.caster1_flag == "1") && (v.caster2_flag == "1") && (typeof v.caster1_class != "undefined") && (typeof v.caster2_class != "undefined")) {
                    rollbase += "{{casterclass=" + ((cster == "1") ? v.caster1_class : v.caster2_class) + "}}";
                }
                // school
                if(v["repeating_spell-" + spell_level + "_" + spellid + "_spellschool"].length != 0) {rollbase += "{{school=" + v["repeating_spell-" + spell_level + "_" + spellid + "_spellschool"] + "}}";}
                // casting time
                if(v["repeating_spell-" + spell_level + "_" + spellid + "_spellcastingtime"].length != 0) {rollbase += "{{castingtime=" + v["repeating_spell-" + spell_level + "_" + spellid + "_spellcastingtime"] + "}}";}
                // component
                if (spell_level != "like") {
                    if(v["repeating_spell-" + spell_level + "_" + spellid + "_spellcomponent"].length != 0) {rollbase += "{{component=" + v["repeating_spell-" + spell_level + "_" + spellid + "_spellcomponent"] + "}}";}
                }
                // range
                if(v["repeating_spell-" + spell_level + "_" + spellid + "_spellrange"].length != 0) {rollbase += "{{range=" + v["repeating_spell-" + spell_level + "_" + spellid + "_spellrange"] + "}}";}
                // area
                if(v["repeating_spell-" + spell_level + "_" + spellid + "_spellarea"].length != 0) {rollbase += "{{area=" + v["repeating_spell-" + spell_level + "_" + spellid + "_spellarea"] + "}}";}
                // targets
                if(v["repeating_spell-" + spell_level + "_" + spellid + "_spelltargets"].length != 0) {rollbase += "{{targets=" + v["repeating_spell-" + spell_level + "_" + spellid + "_spelltargets"] + "}}";}
                // effect
                if(v["repeating_spell-" + spell_level + "_" + spellid + "_spelleffect"].length != 0) {rollbase += "{{effect=" + v["repeating_spell-" + spell_level + "_" + spellid + "_spelleffect"] + "}}";}
                // duration
                if(v["repeating_spell-" + spell_level + "_" + spellid + "_spellduration"].length != 0) {rollbase += "{{duration=" + v["repeating_spell-" + spell_level + "_" + spellid + "_spellduration"] + "}}";}
                // saving throw
                if(v["repeating_spell-" + spell_level + "_" + spellid + "_spellsaveflag"] != "0") {rollbase += "{{save=1}}{{savedc=[[" + savedc + "]]}}{{saveeffect=" + v["repeating_spell-" + spell_level + "_" + spellid + "_spellsave"] + "}}";}
                // spell resistance
                if(v["repeating_spell-" + spell_level + "_" + spellid + "_spellresistanceflag"] != "0") {rollbase += "{{sr=1}}{{spellresistance=" + v["repeating_spell-" + spell_level + "_" + spellid + "_spellresistance"] + "}}";}
                // desc
                if(v["repeating_spell-" + spell_level + "_" + spellid + "_spelldescflag"] != "0") {rollbase += "{{descflag=[[1]]}}{{desc=" + v["repeating_spell-" + spell_level + "_" + spellid + "_spelldesc"] + "}}";}
                // roll attack
                if(atkflag != "0") {
                    if (atktype != "0") {atktype = "@{" + atktype + "_mod}";}
                    if (atkmod.length == 0) {atkmod = "0";}
                    rollbase += atkflag + "{{roll=[[1d20cs>" + atkcritrange + "+" + atktype + "[" + pfoglobals_i18n_obj[v["repeating_spell-" + spell_level + "_" + spellid + "_spellatktype"]] + "]+" + atkmod + "[MOD]+@{rollmod_attack}[BONUS]]]}}";
                    rollbase += "{{critconfirm=[[1d20cs20+" + atktype + "[" + pfoglobals_i18n_obj[v["repeating_spell-" + spell_level + "_" + spellid + "_spellatktype"]] + "]+" + atkmod + "[MOD]+@{rollmod_attack}[BONUS]]]}}";
                }
                // roll damage
                if((dmgflag != "0") || (dmg2flag != "0")) {
                    if(dmgflag != "0") {
                        stemp = "" + dmgbase + "+@{rollmod_damage}[BONUS]";
                        rollbase += dmgflag + "{{dmg1=[[" + stemp + "]]}}{{dmg1type=" + dmgtype +"}}";
                        if( (atkflag != "0") && (dmgcritmulti >1) ) {
                            // Critical damage
                            stemp = "";
                            for (i=1; i <= dmgcritmulti; i++) {
                                stemp += ((stemp.length > 0) ? "+" : "") + dmgbase;
                            }
                            rollbase += "{{dmg1crit=[[(" + stemp +")+(@{rollmod_damage}*" + dmgcritmulti + ")[BONUS]]]}}";
                        }
                    }
                    if(dmg2flag != "0") {
                        stemp = "" + dmg2base + "+@{rollmod_damage}[BONUS]";
                        rollbase += dmg2flag + "{{dmg2=[[" + stemp +"]]}}{{dmg2type=" + dmg2type + "}}";
                        if( (atkflag != "0") && (dmgcritmulti >1) ) {
                            // Critical damage
                            stemp = "";
                            for (i=1; i <= dmgcritmulti; i++) {
                                stemp += ((stemp.length > 0) ? "+" : "") + dmg2base;
                            }
                            rollbase += "{{dmg2crit=[[(" + stemp +")+(@{rollmod_damage}*" + dmgcritmulti + ")[BONUS]]]}}";
                        }
                    }
                }
                // spell failure
                if ((v.npc == "0") && (spell_level != "like")) {
                    if( (v.armor_spell_failure != "0") && ( ((v.caster1_spell_failure == "1") && (cster == "1")) || ((cster == "2") && (v.caster2_spell_failure == "1"))) ) {
                        rollbase += "{{spellfailureroll=[[1d100]]}}";
                        rollbase += "{{spellfailure=[[" + v.armor_spell_failure + "]]}}";
                    }
                }
                // concentration
                if ((v.npc == "0") && (spell_level != "like")) {
                    update["repeating_spell-" + spell_level + "_" + spellid + "_rollconcentration"] = v["caster" + cster + "_concentration_roll"];
                    rollbase += "{{concentration=[" + getTranslationByKey("concentration") + "](~repeating_spell-" + spell_level + "_concentration)}}";
                }
                // notes
                if (v.npc == "0") {
                    if(v["rollnotes_spell"] != "0") {rollbase += "{{shownotes=[[1]]}}{{notes=" + v["repeating_spell-" + spell_level + "_" + spellid + "_notes"] + "}}";}
                }
                // == update
                update["repeating_spell-" + spell_level + "_" + spellid + "_spelldc"] = savedc;
                update["repeating_spell-" + spell_level + "_" + spellid + "_rollcontent"] = rollbase;
                setAttrs(update, {silent: true});
            });
        });
    };

    // === Multi Lingual handling
    var loadi18n = function() {
        pfoglobals_i18n_obj["strength"] = getTranslationByKey("str-u");
        pfoglobals_i18n_obj["dexterity"] = getTranslationByKey("dex-u");
        pfoglobals_i18n_obj["constitution"] = getTranslationByKey("con-u");
        pfoglobals_i18n_obj["intelligence"] = getTranslationByKey("int-u");
        pfoglobals_i18n_obj["wisdom"] = getTranslationByKey("wis-u");
        pfoglobals_i18n_obj["charisma"] = getTranslationByKey("cha-u");
        pfoglobals_i18n_obj["bab"] = getTranslationByKey("bab-u");
        pfoglobals_i18n_obj["melee"] = getTranslationByKey("melee");
        pfoglobals_i18n_obj["ranged"] = getTranslationByKey("ranged");
        pfoglobals_i18n_obj["cmb"] = getTranslationByKey("cmb-u");
        pfoglobals_i18n_obj["cmd"] = getTranslationByKey("cmd-u");
        pfoglobals_i18n_obj["ac"] = getTranslationByKey("ac-u");
        pfoglobals_i18n_obj["touch"] = getTranslationByKey("touch");
        pfoglobals_i18n_obj["flatfooted"] = getTranslationByKey("flat-footed");
        pfoglobals_i18n_obj["fftouch"] = getTranslationByKey("ff-touch");
        pfoglobals_i18n_obj["other"] = getTranslationByKey("other");
        pfoglobals_i18n_obj["fortitude"] = getTranslationByKey("fort-u");
        pfoglobals_i18n_obj["reflex"] = getTranslationByKey("ref-u");
        pfoglobals_i18n_obj["will"] = getTranslationByKey("will-u");
        pfoglobals_i18n_obj["vs"] = getTranslationByKey("vs");
        pfoglobals_i18n_obj["0"] = "";
        pfoglobals_i18n_obj["constant"] = getTranslationByKey("constant");
        pfoglobals_i18n_obj["at-will"] = getTranslationByKey("at-will");
        pfoglobals_i18n_obj["per-day"] = getTranslationByKey("per-day");
    };

    // === Version and updating
    var initializeChar = function(doneupdating) {
        getAttrs(["character_name"], function(v) {
            console.log("Initializing character " + v.character_name);
            var update = {};
            // Attributes
            update["strength_mod"] = 0;
            update["dexterity_mod"] = 0;
            update["constitution_mod"] = 0;
            update["intelligence_mod"] = 0;
            update["wisdom_mod"] = 0;
            update["charisma_mod"] = 0;
            update["initiative"] = 0;
            // Size
            update["ac_size"] = 0;
            update["bab_size"] = 0;
            update["cmb_size"] = 0;
            update["fly_size"] = 0;
            update["stealth_size"] = 0;
            update["encumbrance_size"] = 1;
            // AC
            update["ac_armor"] = 0;
            update["ac_shield"] = 0;
            update["ac_flatfooted_bonus"] = 0;
            update["ac_touch_bonus"] = 0;
            update["ac_ability_maximum"] = "-";
            update["armor_check_penalty"] = 0;
            update["armor_spell_failure"] = 0;
            update["armor_run_factor"] = 4;
            update["ac"] = 10;
            update["ac_touch"] = 0;
            update["ac_flatfooted"] = 0;
            // Saves
            update["fortitude_base"] = 0;
            update["reflex_base"] = 0;
            update["will_base"] = 0;
            update["fortitude_ability_mod"] = 0;
            update["reflex_ability_mod"] = 0;
            update["will_ability_mod"] = 0;
            update["fortitude"] = 0;
            update["reflex"] = 0;
            update["will"] = 0;
            // BABs
            update["bab"] = 0;
            update["cmb_ability_mod"] = 0;
            update["melee_ability_mod"] = 0;
            update["ranged_ability_mod"] = 0;
            update["cmb_mod"] = 0;
            update["melee_mod"] = 0;
            update["ranged_mod"] = 0;
            update["cmd_mod"] = 10;
            // Speed
            update["speed"] = 30;
            update["speed_base"] = 30;
            update["speed_encumbrance"] = 30;
            update["speed_armor"] = 30;
            update["speed_run_factor"] = 4;
            update["speed_run"] = 120;
            update["speed_swim"] = 7.5;
            update["speed_climb"] = 7.5;
            // Encumbrance
            update["encumbrance_load_light"] = 33;
            update["encumbrance_load_medium"] = 66;
            update["encumbrance_load_heavy"] = 100;
            update["encumbrance_lift_head"] = 100;
            update["encumbrance_lift_ground"] = 200;
            update["encumbrance_drag_push"] = 500;
            update["encumbrance_check_penalty"] = 0;
            update["encumbrance_ability_maximum"] = "-";
            update["encumbrance_run_factor"] = 4;
            // Skills
            update["acrobatics_ability_mod"] = 0;
            update["appraise_ability_mod"] = 0;
            update["bluff_ability_mod"] = 0;
            update["climb_ability_mod"] = 0;
            update["craft_ability_mod"] = 0;
            update["diplomacy_ability_mod"] = 0;
            update["disable_device_ability_mod"] = 0;
            update["disguise_ability_mod"] = 0;
            update["escape_artist_ability_mod"] = 0;
            update["fly_ability_mod"] = 0;
            update["handle_animal_ability_mod"] = 0;
            update["heal_ability_mod"] = 0;
            update["intimidate_ability_mod"] = 0;
            update["knowledge_arcana_ability_mod"] = 0;
            update["knowledge_dungeoneering_ability_mod"] = 0;
            update["knowledge_engineering_ability_mod"] = 0;
            update["knowledge_geography_ability_mod"] = 0;
            update["knowledge_history_ability_mod"] = 0;
            update["knowledge_local_ability_mod"] = 0;
            update["knowledge_nature_ability_mod"] = 0;
            update["knowledge_nobility_ability_mod"] = 0;
            update["knowledge_planes_ability_mod"] = 0;
            update["knowledge_religion_ability_mod"] = 0;
            update["linguistics_ability_mod"] = 0;
            update["perception_ability_mod"] = 0;
            update["perform_ability_mod"] = 0;
            update["profession_ability_mod"] = 0;
            update["ride_ability_mod"] = 0;
            update["sense_motive_ability_mod"] = 0;
            update["sleight_of_hand_ability_mod"] = 0;
            update["spellcraft_ability_mod"] = 0;
            update["stealth_ability_mod"] = 0;
            update["survival_ability_mod"] = 0;
            update["swim_ability_mod"] = 0;
            update["use_magic_device_ability_mod"] = 0;
            update["acrobatics"] = 0;
            update["appraise"] = 0;
            update["bluff"] = 0;
            update["climb"] = 0;
            update["craft"] = 0;
            update["diplomacy"] = 0;
            update["disable_device"] = 0;
            update["disguise"] = 0;
            update["escape_artist"] = 0;
            update["fly"] = 0;
            update["handle_animal"] = 0;
            update["heal"] = 0;
            update["intimidate"] = 0;
            update["knowledge_arcana"] = 0;
            update["knowledge_dungeoneering"] = 0;
            update["knowledge_engineering"] = 0;
            update["knowledge_geography"] = 0;
            update["knowledge_history"] = 0;
            update["knowledge_local"] = 0;
            update["knowledge_nature"] = 0;
            update["knowledge_nobility"] = 0;
            update["knowledge_planes"] = 0;
            update["knowledge_religion"] = 0;
            update["linguistics"] = 0;
            update["perception"] = 0;
            update["perform"] = 0;
            update["profession"] = 0;
            update["ride"] = 0;
            update["sense_motive"] = 0;
            update["sleight_of_hand"] = 0;
            update["spellcraft"] = 0;
            update["stealth"] = 0;
            update["survival"] = 0;
            update["swim"] = 0;
            update["use_magic_device"] = 0;
            update["acrobatics_ability"] = "dexterity";
            update["acrobatics_armor_penalty"] = "@{skill_check_penalty}";
            update["climb_ability"] = "strength";
            update["climb_armor_penalty"] = "@{skill_check_penalty}";
            update["disable_device_ability"] = "dexterity";
            update["disable_device_armor_penalty"] = "@{skill_check_penalty}";
            update["escape_artist_ability"] = "dexterity";
            update["escape_artist_armor_penalty"] = "@{skill_check_penalty}";
            update["fly_ability"] = "dexterity";
            update["fly_armor_penalty"] = "@{skill_check_penalty}";
            update["ride_ability"] = "dexterity";
            update["ride_armor_penalty"] = "@{skill_check_penalty}";
            update["sleight_of_hand_ability"] = "dexterity";
            update["sleight_of_hand_armor_penalty"] = "@{skill_check_penalty}";
            update["stealth_ability"] = "dexterity";
            update["stealth_armor_penalty"] = "@{skill_check_penalty}";
            update["swim_ability"] = "strength";
            update["swim_armor_penalty"] = "@{skill_check_penalty}";
            update["skill_check_penalty"] = 0;
            // Spells / spellcasting
            update["caster1_ability_mod"] = 0;
            update["caster1_concentration"] = 0;
            update["caster1_dc_level_0"] = 0;
            update["caster1_dc_level_1"] = 0;
            update["caster1_dc_level_2"] = 0;
            update["caster1_dc_level_3"] = 0;
            update["caster1_dc_level_4"] = 0;
            update["caster1_dc_level_5"] = 0;
            update["caster1_dc_level_6"] = 0;
            update["caster1_dc_level_7"] = 0;
            update["caster1_dc_level_8"] = 0;
            update["caster1_dc_level_9"] = 0;
            update["caster2_ability_mod"] = 0;
            update["caster2_concentration"] = 0;
            update["caster2_dc_level_0"] = 0;
            update["caster2_dc_level_1"] = 0;
            update["caster2_dc_level_2"] = 0;
            update["caster2_dc_level_3"] = 0;
            update["caster2_dc_level_4"] = 0;
            update["caster2_dc_level_5"] = 0;
            update["caster2_dc_level_6"] = 0;
            update["caster2_dc_level_7"] = 0;
            update["caster2_dc_level_8"] = 0;
            update["caster2_dc_level_9"] = 0;
            // UPDATE
            setAttrs(update
                    ,{silent: true}
                    ,function() {
                        doneupdating();
                    });
        });
    };
    var update_to_1_01 = function(doneupdating) {
        update_npc_attacks_all();
        update_attacks("all");
        update_all_spells("all");
        doneupdating();
    };
    var update_to_1_02 = function(doneupdating) {
        // Multi class
        getAttrs(["class","level","caster1_class","caster1_level"], function(v) {
            var update = {};
            if(typeof v.class != "undefined") {
                update["class1_name"] = v.class;
            }
            if(typeof v.level != "undefined") {
                update["class1_level"] = v.level;
            }
            if(typeof v.caster1_class != "undefined") {
                update["caster1_flag"] = ((v.caster1_class.length > 0) || ((parseInt(v.caster1_level) || 0) > 0)) ? 1 : 0;
            }
            setAttrs(update,{"silent": true});
        });
        // NPC Attacks
        getSectionIDs("repeating_npcatk-melee", function(idarray) {
            var update = {};
            var fields = [];
            if ( (parseInt(idarray.length) || 0) > 0) {
                _.each(idarray, function(id) {
                    fields.push("repeating_npcatk-melee_" + id + "_dmgflag");
                    fields.push("repeating_npcatk-melee_" + id + "_dmg2flag");
                });
                getAttrs(fields, function(v) {
                    _.each(idarray, function(id) {
                        if(v["repeating_npcatk-melee_" + id + "_dmgflag"] != "0") {
                            update["repeating_npcatk-melee_" + id + "_dmgflag"] = 1;
                        }
                        if(v["repeating_npcatk-melee_" + id + "_dmg2flag"] != "0") {
                            update["repeating_npcatk-melee_" + id + "_dmg2flag"] = 1;
                        }
                    });
                    setAttrs(update,{"silent": true}, function() {update_npc_attacks_melee();});
                });

            }
        });
        getSectionIDs("repeating_npcatk-ranged", function(idarray){
            var update = {};
            var fields = [];
            if ( (parseInt(idarray.length) || 0) > 0) {
                _.each(idarray, function(id) {
                    fields.push("repeating_npcatk-ranged_" + id + "_dmgflag");
                    fields.push("repeating_npcatk-ranged_" + id + "_dmg2flag");
                });
                getAttrs(fields, function(v) {
                    _.each(idarray, function(id) {
                        if(v["repeating_npcatk-ranged_" + id + "_dmgflag"] != "0") {
                            update["repeating_npcatk-ranged_" + id + "_dmgflag"] = 1;
                        }
                        if(v["repeating_npcatk-ranged_" + id + "_dmg2flag"] != "0") {
                            update["repeating_npcatk-ranged_" + id + "_dmg2flag"] = 1;
                        }
                    });
                    setAttrs(update,{"silent": true}, function() {update_npc_attacks_ranged();});
                });

            }
        });
        // Spells
        update_all_spells("all");
        // End
        doneupdating();
    };
    var update_to_1_03 = function(doneupdating) {
        getAttrs(["caster1_flag","caster2_flag"], function(v) {
            var cflg = (parseInt(v.caster1_flag) || 0) + (parseInt(v.caster2_flag) || 0);
            setAttrs({"caster_flag": cflg},{"silent": true}, function() {doneupdating();});
        });
        // TODO caster_spells_total_level_X = caster1_spells_total_level_X + caster2_spells_total_level_X
    };
    var versioning = function() {
        getAttrs(["version"], function(v) {
            var vrs = parseFloat(v["version"]) || 0.0;
            if (vrs === 1.03) {
                console.log("Pathfinder by Roll20 v" + vrs);
                return;
            } else if (vrs < 1.0) {
                initializeChar(function () {
                    setAttrs({"version": "1.0"});
                    versioning();
                });
            } else if (vrs < 1.01) {
                update_to_1_01(function () {
                    setAttrs({"version": "1.01"});
                    versioning();
                });
            } else if (vrs < 1.02) {
                update_to_1_02(function () {
                    setAttrs({"version": "1.02"});
                    versioning();
                });
            } else if (vrs < 1.03) {
                update_to_1_03(function () {
                    setAttrs({"version": "1.03"});
                    versioning();
                });
            }
        });
    };
