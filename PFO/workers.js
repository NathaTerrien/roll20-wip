    /* === GLOBAL VARIABLES === */
    var pfoglobals_i18n_obj = {};
    var pfoglobals_ispc = 1;

    /* === EVENTS === */

    // === Version handling
    on("sheet:opened", function() {
        getAttrs(["npc_toggle"], function(v) {
            if(v.npc_toggle != "1") {pfoglobals_ispc = 0;}
        });
        loadi18n();
        versioning();
    });

    // === Generals
    on("change:npc_toggle", function(e) {
        pfoglobals_ispc = (e.newValue == "1") ? 0 : 1;
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
        if(pfoglobals_ispc) {
            update_size(e.newValue);
        } else {
            var update = {};
            update["size_display"] = getTranslationByKey(e.newValue);
            setAttrs(update);
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

    // === Initiative
    on("change:initiative_misc change:initiative_bonus", function() {
        update_initiative();
    });

    // === AC
    on("change:ac_ability_maximum change:ac_ability_primary change:ac_ability_secondary", function(e){
        update_ac_ability(e.sourceAttribute);
    });
    on("change:ac_bonus change:ac_armor change:ac_shield change:ac_ability_mod change:ac_size change:ac_natural change:ac_deflection change:ac_misc change:ac_dodge change:ac_touch_bonus change:ac_flatfooted_bonus change:ac_noflatflooted change:ac_touchshield", function(){
        update_ac();
        update_cmd();
    });
    // AC Items
    on("remove:repeating_acitems change:repeating_acitems:equipped change:repeating_acitems:ac_bonus change:repeating_acitems:flatfooted_bonus change:repeating_acitems:touch_bonus change:repeating_acitems:type change:repeating_acitems:check_penalty change:repeating_acitems:max_dex_bonus change:repeating_acitems:spell_failure", function(){
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
        var attr = e.sourceAttribute.replace("_compendium_armor_category","_type");
        if(e.newValue.toLowerCase().includes("shield")) {val = "shield";}
        else if(e.newValue.toLowerCase().includes("light")) {val = "light";}
        else if(e.newValue.toLowerCase().includes("medium")) {val = "medium";}
        else if(e.newValue.toLowerCase().includes("heavy")) {val = "heavy";}
        update[attr] = val;
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
    on("change:bab", function(){
        if(pfoglobals_ispc) {
            update_babs("cmb");
            update_babs("melee");
            update_babs("ranged");
            update_cmd();
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
            update_attacks("cmb","");
        }
    });
    on("change:melee_mod", function(){
        if(pfoglobals_ispc) {
            update_attacks("melee","");
        }
    });
    on("change:ranged_mod", function(){
        if(pfoglobals_ispc) {
            update_attacks("ranged","");
        }
    });

    // === WEAPONS / ATTACKS
    // -- Display and roll calculation
    on("change:repeating_attacks:atkname change:repeating_attacks:atkflag change:repeating_attacks:atktype change:repeating_attacks:atkmod change:repeating_attacks:atkcritrange change:repeating_attacks:atkrange change:repeating_attacks:dmgflag change:repeating_attacks:dmgbase change:repeating_attacks:dmgattr change:repeating_attacks:dmgmod change:repeating_attacks:dmgcritmulti change:repeating_attacks:dmgtype change:repeating_attacks:dmg2flag change:repeating_attacks:dmg2base change:repeating_attacks:dmg2attr change:repeating_attacks:dmg2mod change:repeating_attacks:dmg2critmulti change:repeating_attacks:dmg2type change:repeating_attacks:descflag change:repeating_attacks:atkdesc change:repeating_attacks:notes", function(e) {
        var attackid = e.sourceAttribute.substring(18, 38);
        update_attacks(attackid,"");
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
            };
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
    // -- Concentration & DCs
    on("change:caster1_ability", function(e) {update_flex_ability(e.newValue,e.sourceAttribute);});
    on("change:caster1_ability_mod", function(e) {
        update_concentration(e.sourceAttribute);
        update_spellsdc(e.sourceAttribute);
    });
    on("change:caster1_level", function() {
        if(pfoglobals_ispc) {
           update_concentration(e.sourceAttribute);
        }
    });
    on("change:caster1_concentration_misc change:caster1_concentration_bonus", function() {
        update_concentration(e.sourceAttribute);
    });
    on("change:caster1_dc_misc change:caster1_dcbonus_level_0 change:caster1_dcbonus_level_1 change:caster1_dcbonus_level_2 change:caster1_dcbonus_level_3 change:caster1_dcbonus_level_4 change:caster1_dcbonus_level_5 change:caster1_dcbonus_level_6 change:caster1_dcbonus_level_7 change:caster1_dcbonus_level_8 change:caster1_dcbonus_level_9", function(e) {
        update_spellsdc(e.sourceAttribute);
    });
    // -- Prepared / Total
    on("change:caster1_spells_perday_level_0 change:caster1_spells_perday_level_1 change:caster1_spells_perday_level_2 change:caster1_spells_perday_level_3 change:caster1_spells_perday_level_4 change:caster1_spells_perday_level_5 change:caster1_spells_perday_level_6 change:caster1_spells_perday_level_7 change:caster1_spells_perday_level_8 change:caster1_spells_perday_level_9 change:caster1_spells_bonus_level_0 change:caster1_spells_bonus_level_1 change:caster1_spells_bonus_level_2 change:caster1_spells_bonus_level_3 change:caster1_spells_bonus_level_4 change:caster1_spells_bonus_level_5 change:caster1_spells_bonus_level_6 change:caster1_spells_bonus_level_7 change:caster1_spells_bonus_level_8 change:caster1_spells_bonus_level_9", function(e) {
        update_spells_totals(e.sourceAttribute.charAt(e.sourceAttribute.length - 1),1);
    });
    on("change:repeating_spell-0:spellprepared change:repeating_spell-1:spellprepared change:repeating_spell-2:spellprepared change:repeating_spell-3:spellprepared change:repeating_spell-4:spellprepared change:repeating_spell-5:spellprepared change:repeating_spell-6:spellprepared change:repeating_spell-7:spellprepared change:repeating_spell-8:spellprepared change:repeating_spell-9:spellprepared", function(e) {
        update_spells_prepared(e.sourceAttribute,e.newValue);
    });
    // -- Removing
    on("remove:repeating_spell-0 remove:repeating_spell-1 remove:repeating_spell-2 remove:repeating_spell-3 remove:repeating_spell-4 remove:repeating_spell-5 remove:repeating_spell-6 remove:repeating_spell-7 remove:repeating_spell-8 remove:repeating_spell-9", function(e) {
        update_spells_prepared(e.sourceAttribute,"");
    });
    // -- Rolls / Display
    on("change:caster1_dc_level_0 change:caster1_dc_level_1 change:caster1_dc_level_2 change:caster1_dc_level_3 change:caster1_dc_level_4 change:caster1_dc_level_5 change:caster1_dc_level_6 change:caster1_dc_level_7 change:caster1_dc_level_8 change:caster1_dc_level_9", function(e){
        update_spells(e.sourceAttribute.charAt(e.sourceAttribute.length - 1),"all","");
    });
    on("change:repeating_spell-0:spellname change:repeating_spell-0:spellschool change:repeating_spell-0:spellclasslevel change:repeating_spell-0:spellcastingtime change:repeating_spell-0:spellcomponent change:repeating_spell-0:spellrange change:repeating_spell-0:spellarea change:repeating_spell-0:spelltargets change:repeating_spell-0:spelleffect change:repeating_spell-0:spellduration change:repeating_spell-0:spellsaveflag change:repeating_spell-0:spellsave change:repeating_spell-0:spelldc_mod change:repeating_spell-0:spellresistanceflag change:repeating_spell-0:spellresistance change:repeating_spell-0:spellatkflag change:repeating_spell-0:spellatktype change:repeating_spell-0:spellatkmod change:repeating_spell-0:spellatkcritrange change:repeating_spell-0:spelldmgcritmulti change:repeating_spell-0:spelldmgflag change:repeating_spell-0:spelldmg change:repeating_spell-0:spelldmgtype change:repeating_spell-0:spelldmg2flag change:repeating_spell-0:spelldmg2 change:repeating_spell-0:spelldmg2type change:repeating_spell-0:spelldescflag change:repeating_spell-0:spelldesc change:repeating_spell-0:notes", function(e) {
        var spellid = e.sourceAttribute.substring(18, 38);
        update_spells(0,spellid,"");
    });
    on("change:repeating_spell-1:spellname change:repeating_spell-1:spellschool change:repeating_spell-1:spellclasslevel change:repeating_spell-1:spellcastingtime change:repeating_spell-1:spellcomponent change:repeating_spell-1:spellrange change:repeating_spell-1:spellarea change:repeating_spell-1:spelltargets change:repeating_spell-1:spelleffect change:repeating_spell-1:spellduration change:repeating_spell-1:spellsaveflag change:repeating_spell-1:spellsave change:repeating_spell-1:spelldc_mod change:repeating_spell-1:spellresistanceflag change:repeating_spell-1:spellresistance change:repeating_spell-1:spellatkflag change:repeating_spell-1:spellatktype change:repeating_spell-1:spellatkmod change:repeating_spell-1:spellatkcritrange change:repeating_spell-1:spelldmgcritmulti change:repeating_spell-1:spelldmgflag change:repeating_spell-1:spelldmg change:repeating_spell-1:spelldmgtype change:repeating_spell-1:spelldmg2flag change:repeating_spell-1:spelldmg2 change:repeating_spell-1:spelldmg2type change:repeating_spell-1:spelldescflag change:repeating_spell-1:spelldesc change:repeating_spell-1:notes", function(e) {
        var spellid = e.sourceAttribute.substring(18, 38);
        update_spells(1,spellid,"");
    });
    on("change:repeating_spell-2:spellname change:repeating_spell-2:spellschool change:repeating_spell-2:spellclasslevel change:repeating_spell-2:spellcastingtime change:repeating_spell-2:spellcomponent change:repeating_spell-2:spellrange change:repeating_spell-2:spellarea change:repeating_spell-2:spelltargets change:repeating_spell-2:spelleffect change:repeating_spell-2:spellduration change:repeating_spell-2:spellsaveflag change:repeating_spell-2:spellsave change:repeating_spell-2:spelldc_mod change:repeating_spell-2:spellresistanceflag change:repeating_spell-2:spellresistance change:repeating_spell-2:spellatkflag change:repeating_spell-2:spellatktype change:repeating_spell-2:spellatkmod change:repeating_spell-2:spellatkcritrange change:repeating_spell-2:spelldmgcritmulti change:repeating_spell-2:spelldmgflag change:repeating_spell-2:spelldmg change:repeating_spell-2:spelldmgtype change:repeating_spell-2:spelldmg2flag change:repeating_spell-2:spelldmg2 change:repeating_spell-2:spelldmg2type change:repeating_spell-2:spelldescflag change:repeating_spell-2:spelldesc change:repeating_spell-2:notes", function(e) {
        var spellid = e.sourceAttribute.substring(18, 38);
        update_spells(2,spellid,"");
    });
    on("change:repeating_spell-3:spellname change:repeating_spell-3:spellschool change:repeating_spell-3:spellclasslevel change:repeating_spell-3:spellcastingtime change:repeating_spell-3:spellcomponent change:repeating_spell-3:spellrange change:repeating_spell-3:spellarea change:repeating_spell-3:spelltargets change:repeating_spell-3:spelleffect change:repeating_spell-3:spellduration change:repeating_spell-3:spellsaveflag change:repeating_spell-3:spellsave change:repeating_spell-3:spelldc_mod change:repeating_spell-3:spellresistanceflag change:repeating_spell-3:spellresistance change:repeating_spell-3:spellatkflag change:repeating_spell-3:spellatktype change:repeating_spell-3:spellatkmod change:repeating_spell-3:spellatkcritrange change:repeating_spell-3:spelldmgcritmulti change:repeating_spell-3:spelldmgflag change:repeating_spell-3:spelldmg change:repeating_spell-3:spelldmgtype change:repeating_spell-3:spelldmg2flag change:repeating_spell-3:spelldmg2 change:repeating_spell-3:spelldmg2type change:repeating_spell-3:spelldescflag change:repeating_spell-3:spelldesc change:repeating_spell-3:notes", function(e) {
        var spellid = e.sourceAttribute.substring(18, 38);
        update_spells(3,spellid,"");
    });
    on("change:repeating_spell-4:spellname change:repeating_spell-4:spellschool change:repeating_spell-4:spellclasslevel change:repeating_spell-4:spellcastingtime change:repeating_spell-4:spellcomponent change:repeating_spell-4:spellrange change:repeating_spell-4:spellarea change:repeating_spell-4:spelltargets change:repeating_spell-4:spelleffect change:repeating_spell-4:spellduration change:repeating_spell-4:spellsaveflag change:repeating_spell-4:spellsave change:repeating_spell-4:spelldc_mod change:repeating_spell-4:spellresistanceflag change:repeating_spell-4:spellresistance change:repeating_spell-4:spellatkflag change:repeating_spell-4:spellatktype change:repeating_spell-4:spellatkmod change:repeating_spell-4:spellatkcritrange change:repeating_spell-4:spelldmgcritmulti change:repeating_spell-4:spelldmgflag change:repeating_spell-4:spelldmg change:repeating_spell-4:spelldmgtype change:repeating_spell-4:spelldmg2flag change:repeating_spell-4:spelldmg2 change:repeating_spell-4:spelldmg2type change:repeating_spell-4:spelldescflag change:repeating_spell-4:spelldesc change:repeating_spell-4:notes", function(e) {
        var spellid = e.sourceAttribute.substring(18, 38);
        update_spells(4,spellid,"");
    });
    on("change:repeating_spell-5:spellname change:repeating_spell-5:spellschool change:repeating_spell-5:spellclasslevel change:repeating_spell-5:spellcastingtime change:repeating_spell-5:spellcomponent change:repeating_spell-5:spellrange change:repeating_spell-5:spellarea change:repeating_spell-5:spelltargets change:repeating_spell-5:spelleffect change:repeating_spell-5:spellduration change:repeating_spell-5:spellsaveflag change:repeating_spell-5:spellsave change:repeating_spell-5:spelldc_mod change:repeating_spell-5:spellresistanceflag change:repeating_spell-5:spellresistance change:repeating_spell-5:spellatkflag change:repeating_spell-5:spellatktype change:repeating_spell-5:spellatkmod change:repeating_spell-5:spellatkcritrange change:repeating_spell-5:spelldmgcritmulti change:repeating_spell-5:spelldmgflag change:repeating_spell-5:spelldmg change:repeating_spell-5:spelldmgtype change:repeating_spell-5:spelldmg2flag change:repeating_spell-5:spelldmg2 change:repeating_spell-5:spelldmg2type change:repeating_spell-5:spelldescflag change:repeating_spell-5:spelldesc change:repeating_spell-5:notes", function(e) {
        var spellid = e.sourceAttribute.substring(18, 38);
        update_spells(5,spellid,"");
    });
    on("change:repeating_spell-6:spellname change:repeating_spell-6:spellschool change:repeating_spell-6:spellclasslevel change:repeating_spell-6:spellcastingtime change:repeating_spell-6:spellcomponent change:repeating_spell-6:spellrange change:repeating_spell-6:spellarea change:repeating_spell-6:spelltargets change:repeating_spell-6:spelleffect change:repeating_spell-6:spellduration change:repeating_spell-6:spellsaveflag change:repeating_spell-6:spellsave change:repeating_spell-6:spelldc_mod change:repeating_spell-6:spellresistanceflag change:repeating_spell-6:spellresistance change:repeating_spell-6:spellatkflag change:repeating_spell-6:spellatktype change:repeating_spell-6:spellatkmod change:repeating_spell-6:spellatkcritrange change:repeating_spell-6:spelldmgcritmulti change:repeating_spell-6:spelldmgflag change:repeating_spell-6:spelldmg change:repeating_spell-6:spelldmgtype change:repeating_spell-6:spelldmg2flag change:repeating_spell-6:spelldmg2 change:repeating_spell-6:spelldmg2type change:repeating_spell-6:spelldescflag change:repeating_spell-6:spelldesc change:repeating_spell-6:notes", function(e) {
        var spellid = e.sourceAttribute.substring(18, 38);
        update_spells(6,spellid,"");
    });
    on("change:repeating_spell-7:spellname change:repeating_spell-7:spellschool change:repeating_spell-7:spellclasslevel change:repeating_spell-7:spellcastingtime change:repeating_spell-7:spellcomponent change:repeating_spell-7:spellrange change:repeating_spell-7:spellarea change:repeating_spell-7:spelltargets change:repeating_spell-7:spelleffect change:repeating_spell-7:spellduration change:repeating_spell-7:spellsaveflag change:repeating_spell-7:spellsave change:repeating_spell-7:spelldc_mod change:repeating_spell-7:spellresistanceflag change:repeating_spell-7:spellresistance change:repeating_spell-7:spellatkflag change:repeating_spell-7:spellatktype change:repeating_spell-7:spellatkmod change:repeating_spell-7:spellatkcritrange change:repeating_spell-7:spelldmgcritmulti change:repeating_spell-7:spelldmgflag change:repeating_spell-7:spelldmg change:repeating_spell-7:spelldmgtype change:repeating_spell-7:spelldmg2flag change:repeating_spell-7:spelldmg2 change:repeating_spell-7:spelldmg2type change:repeating_spell-7:spelldescflag change:repeating_spell-7:spelldesc change:repeating_spell-7:notes", function(e) {
        var spellid = e.sourceAttribute.substring(18, 38);
        update_spells(7,spellid,"");
    });
    on("change:repeating_spell-8:spellname change:repeating_spell-8:spellschool change:repeating_spell-8:spellclasslevel change:repeating_spell-8:spellcastingtime change:repeating_spell-8:spellcomponent change:repeating_spell-8:spellrange change:repeating_spell-8:spellarea change:repeating_spell-8:spelltargets change:repeating_spell-8:spelleffect change:repeating_spell-8:spellduration change:repeating_spell-8:spellsaveflag change:repeating_spell-8:spellsave change:repeating_spell-8:spelldc_mod change:repeating_spell-8:spellresistanceflag change:repeating_spell-8:spellresistance change:repeating_spell-8:spellatkflag change:repeating_spell-8:spellatktype change:repeating_spell-8:spellatkmod change:repeating_spell-8:spellatkcritrange change:repeating_spell-8:spelldmgcritmulti change:repeating_spell-8:spelldmgflag change:repeating_spell-8:spelldmg change:repeating_spell-8:spelldmgtype change:repeating_spell-8:spelldmg2flag change:repeating_spell-8:spelldmg2 change:repeating_spell-8:spelldmg2type change:repeating_spell-8:spelldescflag change:repeating_spell-8:spelldesc change:repeating_spell-8:notes", function(e) {
        var spellid = e.sourceAttribute.substring(18, 38);
        update_spells(8,spellid,"");
    });
    on("change:repeating_spell-9:spellname change:repeating_spell-9:spellschool change:repeating_spell-9:spellclasslevel change:repeating_spell-9:spellcastingtime change:repeating_spell-9:spellcomponent change:repeating_spell-9:spellrange change:repeating_spell-9:spellarea change:repeating_spell-9:spelltargets change:repeating_spell-9:spelleffect change:repeating_spell-9:spellduration change:repeating_spell-9:spellsaveflag change:repeating_spell-9:spellsave change:repeating_spell-9:spelldc_mod change:repeating_spell-9:spellresistanceflag change:repeating_spell-9:spellresistance change:repeating_spell-9:spellatkflag change:repeating_spell-9:spellatktype change:repeating_spell-9:spellatkmod change:repeating_spell-9:spellatkcritrange change:repeating_spell-9:spelldmgcritmulti change:repeating_spell-9:spelldmgflag change:repeating_spell-9:spelldmg change:repeating_spell-9:spelldmgtype change:repeating_spell-9:spelldmg2flag change:repeating_spell-9:spelldmg2 change:repeating_spell-9:spelldmg2type change:repeating_spell-9:spelldescflag change:repeating_spell-9:spelldesc change:repeating_spell-9:notes", function(e) {
        var spellid = e.sourceAttribute.substring(18, 38);
        update_spells(9,spellid,"");
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
    // --- Npc Attacks Display name
    on("change:repeating_npcatk-melee:atkname change:repeating_npcatk-melee:atkflag change:repeating_npcatk-melee:atkmod change:repeating_npcatk-melee:atkcritrange change:repeating_npcatk-melee:dmgflag change:repeating_npcatk-melee:dmgbase change:repeating_npcatk-melee:dmgtype change:repeating_npcatk-melee:dmgcritmulti change:repeating_npcatk-melee:dmg2flag change:repeating_npcatk-melee:dmg2base change:repeating_npcatk-melee:dmg2type change:repeating_npcatk-melee:dmg2critmulti", function(e) {
            var atkid = e.sourceAttribute.substring(23, 43);
            update_npc_attack("melee",atkid);
    });
    on("change:repeating_npcatk-ranged:atkname change:repeating_npcatk-ranged:atkflag change:repeating_npcatk-ranged:atkmod change:repeating_npcatk-ranged:atkcritrange change:repeating_npcatk-ranged:atkrange change:repeating_npcatk-ranged:dmgflag change:repeating_npcatk-ranged:dmgbase change:repeating_npcatk-ranged:dmgtype change:repeating_npcatk-ranged:dmgcritmulti change:repeating_npcatk-ranged:dmg2flag change:repeating_npcatk-ranged:dmg2base change:repeating_npcatk-ranged:dmg2type change:repeating_npcatk-ranged:dmg2critmulti", function(e) {
            var atkid = e.sourceAttribute.substring(24, 44);
            update_npc_attack("ranged",atkid);
    });

    // === CONFIGURATION
    on("change:whispertype change:rollshowchar", function(){
       update_attacks("all","");
       update_all_spells("all","");
    });
    on("change:rollmod_attack change:rollnotes_attack change:rollmod_damage", function(){
       update_attacks("all","all","");
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
        update_attacks(attr,"");
        update_flex_ability_repsection(attr,"skillcraft");
        update_flex_ability_repsection(attr,"skillknowledge");
        update_flex_ability_repsection(attr,"skillperform");
        update_flex_ability_repsection(attr,"skillprofession");
        update_flex_ability_repsection(attr,"skillcustom");
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
            var update = {};
            update["initiative"] = (parseInt(v.dexterity_mod) || 0) + (parseInt(v.initiative_misc) || 0) + (parseInt(v.initiative_bonus) || 0);
            update["initiative_bonus_flag"] = (parseInt(v.initiative_bonus) || 0) !=0 ? 1 : 0;
            setAttrs(update);
        });
    };
    // === AC / DEFENSE
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
        getAttrs(["ac_ability_primary","ac_ability_secondary"], function(v) {
            if( (attr == "ac_ability_maximum") || (attr == v.ac_ability_primary) || (attr == v.ac_ability_secondary) ) {
                var attr_fields = [v.ac_ability_primary + "_mod",v.ac_ability_secondary + "_mod","ac_ability_maximum"];
                getAttrs(attr_fields, function(modz) {
                    var primary = parseInt(modz[v.ac_ability_primary + "_mod"]) || 0;
                    var secondary = parseInt(modz[v.ac_ability_secondary + "_mod"]) || 0;
                    var maxmod = parseInt(modz.ac_ability_maximum) || 99;
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
            else {acff = base + bonus + armor + shield + size + natural + deflection + misc;}
            acff += flatfooted_bonus;
            actouch = base + bonus + ability + size + deflection + misc + dodge;
            if (touchshield == 1) {actouch += shield;}
            actouch += touch_bonus;
            setAttrs({
                "ac": ac,
                "ac_touch": actouch,
                "ac_flatfooted": acff,
                "ac_bonus_flag": flag
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
            update["cmd_bonus_flag"] = (parseInt(v.cmd_bonus) || 0) !=0 ? 1 : 0;
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
            update[attr + "_bonus_flag"] = (parseInt(v[attr + "_bonus"]) || 0) !=0 ? 1 : 0;
            setAttrs(update);
        });
    };

    // === BABS
    var update_babs = function(attr) {
        var fields = ["bab","bab_size",attr + "_ability_mod",attr + "_misc",attr + "_bonus"];
        getAttrs(fields, function(v) {
            var update = {};
            update[attr + "_mod"] = (parseInt(v.bab) || 0) + (parseInt(v.bab_size) || 0) + (parseInt(v[attr + "_ability_mod"]) || 0) + (parseInt(v[attr + "_misc"]) || 0) + (parseInt(v[attr + "_bonus"]) || 0);
            update[attr + "_bonus_flag"] = (parseInt(v[attr + "_bonus"]) || 0) !=0 ? 1 : 0;
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
        var attack_attribs = ["strength_mod","strength_oneandahalf_mod","strength_half_mod","dexterity_mod","constitution_mod","intelligence_mod","wisdom_mod","charisma_mod","melee_mod","ranged_mod","cmb_mod","rollmod_attack","rollnotes_attack","rollmod_damage","whispertype","rollshowchar"];
        _.each(attack_array, function(attackid) {
            attack_attribs.push("repeating_attacks_" + attackid + "_atkname");
            attack_attribs.push("repeating_attacks_" + attackid + "_atkflag");
            attack_attribs.push("repeating_attacks_" + attackid + "_atktype");
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
                // == Display handling
                atkbonus = atktype + (parseInt(atkmod) || 0);
                atkdmgbonus = dmgattr + (parseInt(dmgmod) || 0);
                if(atkflag != "0") {
                    atkdisplay = " (" + pfoglobals_i18n_obj[v["repeating_attacks_" + attackid + "_atktype"]] + " " + pfoglobals_i18n_obj["vs"] + " " + pfoglobals_i18n_obj[atkvs] + ")";
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
                    rollnotes = "{{shownotes=1}}{{notes=" + atknotes + "}}";
                }
                // range
                if(atkrange.length != 0) {
                    atkrange = "{{range=" + atkrange + "}}";
                }
                // roll attack
                if(atkflag != "0") {
                    rollatk = "" + atkflag + "{{roll=[[1d20cs" + atkcritrange + "+" + atktype + "[" + pfoglobals_i18n_obj[v["repeating_attacks_" + attackid + "_atktype"]] + "]+" + atkmod + "[MOD]+@{rollmod_attack}[BONUS]]]}}{{atkvs=" + atkdisplay + "}}";
                    rollatk += atkrange + "{{critconfirm=[[1d20cs20+" + atktype + "[" + pfoglobals_i18n_obj[v["repeating_attacks_" + attackid + "_atktype"]] + "]+" + atkmod + "[MOD]+@{rollmod_attack}[BONUS]]]}}";
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
                        stemp = dmgbase + "+" + dmgattr + "[" + pfoglobals_i18n_obj[v["repeating_attacks_" + attackid + "_dmgattr"]] + "]+" + dmgmod + "[MOD]+@{rollmod_damage}[BONUS]";
                        rolldmg += dmgflag + "{{dmg1=[[" + stemp + "]]}}{{dmg1type=" + dmgtype +"}}";
                        if(atkflag != "0") {rolldmg += "{{dmg1crit=[[(" + stemp + ")*" + dmgcritmulti + "]]}}";}
                    }
                    if(dmg2flag != "0") {
                        stemp = dmg2base + "+" + dmg2attr + "[" + pfoglobals_i18n_obj[v["repeating_attacks_" + attackid + "_dmg2attr"]] + "]+" + dmg2mod + "[MOD]+@{rollmod_damage}[BONUS]";
                        rolldmg += dmg2flag + "{{dmg2=[[" + stemp +"]]}}{{dmg2type=" + dmg2type + "}}";
                        if(atkflag != "0") {rolldmg += "{{dmg2crit=[[(" + stemp + ")*" + dmg2critmulti + "]]}}";}
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
    var update_npc_attack = function (type,id) {
        // type = "melee" / "ranged" / "special"
        var update = {};
        var display = "";
        var base = "repeating_npcatk-" + type + "_" + id + "_";
        var fields = [base + "atkname",base + "atkflag",base + "atkmod",base + "atkcritrange",base + "dmgflag",base + "dmgbase",base + "dmgtype",base + "dmgcritmulti",base + "dmg2flag",base + "dmg2base",base + "dmg2type",base + "dmg2critmulti"];
        if(type == "ranged") {fields.push(base + "atkrange");}
        // todo "special" fields
        getAttrs(fields, function(v){
            display = v[base + "atkname"];
            if (v[base  + "atkflag"] != "0") {
                display += " +" + v[base + "atkmod"];
                if((type == "ranged") && (v[base + "atkrange"] != "")) {
                    display += " " + v[base + "atkrange"];
                }
            }
            if ((v[base  + "dmgflag"] != "0")||(v[base  + "dmg2flag"] != "0")) {
                display += " ("
                if(v[base  + "dmgflag"] != "0") {
                    display += v[base + "dmgbase"];
                    if(v[base + "dmgtype"] != "") {display += " " + v[base + "dmgtype"];}
                    if((parseInt(v[base + "atkcritrange"]) || 20) < 20) {display += "/" + v[base + "atkcritrange"] + "-20";}
                    if((parseInt(v[base + "dmgcritmulti"]) || 2) != 2) {display += "/x" + v[base + "dmgcritmulti"];}
                }
                if (v[base  + "dmg2flag"] != "0") {
                    display += ", ";
                    display += v[base + "dmg2base"];
                    if(v[base + "dmg2type"] != "") {display += " " + v[base + "dmg2type"];}
                    if((parseInt(v[base + "dmg2critmulti"]) || 1) != 1) {display += "/x" + v[base + "dmg2critmulti"];}
                }
                display += ")";
            }
            update[base + "atkdisplay"] = display;
            setAttrs(update,{silent:true});
        });
    };
    // === SKILLS
    var update_skill = function(attr,source) {
        var fields = [attr + "_classkill",attr + "_ability", attr + "_ability_mod",attr + "_ranks",attr + "_misc",attr + "_bonus",attr + "_armor_penalty","armor_check_penalty","strength_mod","dexterity_mod","constitution_mod","intelligence_mod","wisdom_mod","charisma_mod"];
        getAttrs(fields, function(v) {
            var update = {};
            var cls = parseInt(v[attr + "_classkill"]) || 0;
            var ranks = parseInt(v[attr + "_ranks"]) || 0;
            var penlt = 0;
            if (["strength","dexterity"].includes(v[attr + "_ability"])) {
                penlt = v[attr + "_armor_penalty"] != "0" ? (parseInt(v.armor_check_penalty) || 0) : 0;
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

    // === SPELLS / SPELLCASTING
    var update_concentration = function(srcattr) {
        var cster = srcattr.substr(0,7).slice(-1);
        var fields = ["caster" + cster + "_level","caster" + cster + "_ability_mod","caster" + cster + "_concentration_misc","caster" + cster + "_concentration_bonus"];
        getAttrs(fields, function(v) {
            var update = {};
            update["caster" + cster + "_concentration"] = (parseInt(v["caster" + cster + "_level"]) || 0) + (parseInt(v["caster" + cster + "_ability_mod"]) || 0) + (parseInt(v["caster" + cster + "_concentration_misc"]) || 0) + (parseInt(v["caster" + cster + "_concentration_bonus"]) || 0);
            update["caster" + cster + "_concentration_bonus_flag"] = (parseInt(v["caster" + cster + "_concentration_bonus"]) || 0) !=0 ? 1 : 0;
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
                    update["caster" + cster + "_dcflag_level_" + i] = (parseInt(v["caster" + cster + "_dcbonus_level_" + i]) || 0) !=0 ? 1 : 0;
                }
                setAttrs(update, {silent: false});
            });
        }
    };
    var update_spells_totals = function(level,cster) {
        var fields = ["caster" + cster + "_spells_perday_level_" + level,"caster" + cster + "_spells_bonus_level_" + level];
        getAttrs(fields, function(v) {
            var update = {};
            update["caster" + cster + "_spells_total_level_" + level] = (parseInt(v["caster" + cster + "_spells_perday_level_" + level]) || 0) + (parseInt(v["caster" + cster + "_spells_bonus_level_" + level]) || 0);
            setAttrs(update, {silent: true});
        });
    };
    var update_spells_prepared = function (src,val) {
        var update = {};
        var repsec = src.substr(0,17);
        var level = repsec.charAt(repsec.length - 1);
        if (val != "") {
            var splid = src.substring(18, 38);
            var prep = parseInt(val) || 0;
            update["repeating_spell-" + level + "_" + splid + "_spellprepared-flag"] = (prep > 0) ? 1 : 0;
        }
        getSectionIDs("repeating_spell-" + level, function(idarray) {
            var spell_attribs = ["caster1_spells_total_level_" + level];
            _.each(idarray, function(spellid) {
                spell_attribs.push("repeating_spell-" + level + "_" + spellid + "_spellprepared");
            });
            getAttrs(spell_attribs, function(v) {
                var total = 0;
                _.each(idarray, function(id) {
                    total += parseInt(v["repeating_spell-" + level + "_" + id + "_spellprepared"]) || 0;
                });
                update["spells_prepared_level_" + level] = total;
                update["spells_prepared_flag_" + level] = (total > (parseInt(v["caster1_spells_total_level_" + level]) || 0)) ? 1 : 0;
                setAttrs(update, {silent: true});
            });
        });
    };
    var update_all_spells = function(update_id, source) {
        update_spells(0,update_id,source);
        update_spells(1,update_id,source);
        update_spells(2,update_id,source);
        update_spells(3,update_id,source);
        update_spells(4,update_id,source);
        update_spells(5,update_id,source);
        update_spells(6,update_id,source);
        update_spells(7,update_id,source);
        update_spells(8,update_id,source);
        update_spells(9,update_id,source);
    };
    var update_spells = function(level,update_id, source) {
        console.log("DOING UPDATE_SPELLS: " + level + " / " + update_id);
        if(update_id.substring(0,1) === "-" && update_id.length === 20) {
            do_update_spell(level,[update_id], source);
        }
        else if(["strength","dexterity","constitution","intelligence","wisdom","charisma","melee","ranged","cmb","all"].includes(update_id)) {
            getSectionIDs("repeating_spell-" + level, function(idarray) {
                if(update_id === "all") {
                    do_update_spell(level,idarray,source);
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
                        if(attr_spell_ids.length > 0) {do_update_spell(level,attr_spell_ids,source);}
                    });
                }
            });
        }
    };
    var do_update_spell = function(spell_level,spell_array, source) {
        var spell_attribs = ["strength_mod","dexterity_mod","constitution_mod","intelligence_mod","wisdom_mod","charisma_mod","melee_mod","ranged_mod","cmb_mod","rollmod_attack","rollnotes_spell","rollmod_damage","whispertype","rollshowchar","caster1_dc_level_" + spell_level]; // "caster2_dc_level_" + spell_level "caster3_dc_level_" + spell_level
        _.each(spell_array, function(spellid) {
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spelllevel");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellcaster");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellname");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellschool");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellclasslevel");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellcastingtime");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellcomponent");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellrange");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellarea");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spelltargets");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spelleffect");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellduration");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellsaveflag");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spellsave");
            spell_attribs.push("repeating_spell-" + spell_level + "_" + spellid + "_spelldc_mod");
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
        });
        getAttrs(spell_attribs, function(v) {
            _.each(spell_array, function(spellid) {
                console.log("UPDATING SPELL: " + spell_level + " / " + spellid);
                var update = {};
                var stemp = "";
                var rollbase = "";
                var rollbasetemplate = "default";
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
                // == Display handling
                update["repeating_spell-" + spell_level + "_" + spellid + "_spelldisplay"] = v["repeating_spell-" + spell_level + "_" + spellid + "_spellname"];
                // == Save DC
                var savedc = 0 + (parseInt(v["caster" + cster + "_dc_level_" + spell_level]) || 0) + (parseInt(v["repeating_spell-" + spell_level + "_" + spellid + "_spelldc_mod"]) || 0);
                // == Rolls handling
                rollbase = "@{whispertype} &{template:" + rollbasetemplate + "}{{name=" + v["repeating_spell-" + spell_level + "_" + spellid + "_spellname"] + "}}{{type=spell}}{{showchar=@{rollshowchar}}}{{charname=@{character_name}}}{{level=" + spell_level + "}}";
                // school
                if(v["repeating_spell-" + spell_level + "_" + spellid + "_spellschool"].length != 0) {rollbase += "{{school=" + v["repeating_spell-" + spell_level + "_" + spellid + "_spellschool"] + "}}";}
                // casting time
                if(v["repeating_spell-" + spell_level + "_" + spellid + "_spellcastingtime"].length != 0) {rollbase += "{{castingtime=" + v["repeating_spell-" + spell_level + "_" + spellid + "_spellcastingtime"] + "}}";}
                // component
                if(v["repeating_spell-" + spell_level + "_" + spellid + "_spellcomponent"].length != 0) {rollbase += "{{component=" + v["repeating_spell-" + spell_level + "_" + spellid + "_spellcomponent"] + "}}";}
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
                if(v["repeating_spell-" + spell_level + "_" + spellid + "_spellsaveflag"] != "0") {rollbase += "{{save=1}}{{savedc=" + savedc + "}}{{saveeffect=" + v["repeating_spell-" + spell_level + "_" + spellid + "_spellsave"] + "}}";}
                // spell resistance
                if(v["repeating_spell-" + spell_level + "_" + spellid + "_spellsaveflag"] != "0") {rollbase += "{{sr=1}}{{spellresistance=" + v["repeating_spell-" + spell_level + "_" + spellid + "_spellresistance"] + "}}";}
                // desc
                if(v["repeating_spell-" + spell_level + "_" + spellid + "_spelldescflag"] != "0") {rollbase += "{{desc=" + v["repeating_spell-" + spell_level + "_" + spellid + "_spelldesc"] + "}}";}
                // roll attack
                if(atkflag != "0") {
                    if (atktype != "0") {atktype = "@{" + atktype + "_mod}";}
                    if (atkmod.length == 0) {atkmod = "0";}
                    rollbase += atkflag + "{{roll=[[1d20cs" + atkcritrange + "+" + atktype + "[" + pfoglobals_i18n_obj[v["repeating_spell-" + spell_level + "_" + spellid + "_spellatktype"]] + "]+" + atkmod + "[MOD]+@{rollmod_attack}[BONUS]]]}}";
                    rollbase += "{{critconfirm=[[1d20cs20+" + atktype + "[" + pfoglobals_i18n_obj[v["repeating_spell-" + spell_level + "_" + spellid + "_spellatktype"]] + "]+" + atkmod + "[MOD]+@{rollmod_attack}[BONUS]]]}}";
                }
                // roll damage
                if((dmgflag != "0") || (dmg2flag != "0")) {
                    if(dmgflag != "0") {
                        stemp = "" + dmgbase + "+@{rollmod_damage}[BONUS]";
                        rollbase += dmgflag + "{{dmg1=[[" + stemp + "]]}}{{dmg1type=" + dmgtype +"}}";
                        if(atkflag != "0") {rollbase += "{{dmg1crit=[[(" + stemp +")*" + dmgcritmulti + "]]}}";}
                    }
                    if(dmg2flag != "0") {
                        stemp = "" + dmg2base + "+@{rollmod_damage}[BONUS]";
                        rollbase += dmg2flag + "{{dmg2=[[" + stemp +"]]}}{{dmg2type=" + dmg2type + "}}";
                        if(atkflag != "0") {rollbase += "{{dmg2crit=[[(" + stemp +")*" + dmgcritmulti + "]]}}";}
                    }
                }
                // notes
                if(v["rollnotes_spell"] != "0") {rollbase += "{{shownotes=1}}{{notes=" + v["repeating_spell-" + spell_level + "_" + spellid + "_notes"] + "}}";}
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
            update["initiative"] = 0;
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
            update["cmb_mod"] = 0;
            update["melee_mod"] = 0;
            update["ranged_mod"] = 0;
            update["cmd_mod"] = 10;
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
            update["climb_ability"] = "strength";
            update["disable_device_ability"] = "dexterity";
            update["escape_artist_ability"] = "dexterity";
            update["fly_ability"] = "dexterity";
            update["ride_ability"] = "dexterity";
            update["sleight_of_hand_ability"] = "dexterity";
            update["stealth_ability"] = "dexterity";
            update["swim_ability"] = "strength";
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
            // UPDATE
            setAttrs(update
                    ,{silent: true}
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
