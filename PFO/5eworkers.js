
    on("sheet:opened", function(eventinfo) {
        // getCompendiumPage("Fireball", function(pageData) {
        //     dropCompendiumData("licensecontainer", pageData, function() {
        //         console.log("FINISHED DROP!!!!!");
        //     })
        // });
        versioning();
        // cleanup_drop_fields();
        v2_old_values_check();
    });

    on("sheet:compendium-drop", function() {
        getAttrs(["hp_max","npc_senses","token_size","cd_bar1_v","cd_bar1_m","cd_bar1_l","cd_bar2_v","cd_bar2_m","cd_bar2_l","cd_bar3_v","cd_bar3_m","cd_bar3_l"], function(v) {
            var default_attr = {};
            default_attr["width"] = 70;
            default_attr["height"] = 70;
            if(v["npc_senses"].toLowerCase().match(/(darkvision|blindsight|tremorsense|truesight)/)) {
                default_attr["light_radius"] = Math.max.apply(Math, v["npc_senses"].match(/\d+/g));
            }
            if(v["token_size"]) {
                var squarelength = 70;
                if(v["token_size"].indexOf(",") > -1) {
                    var setwidth = !isNaN(v["token_size"].split(",")[0]) ? v["token_size"].split(",")[0] : 1;
                    var setheight = !isNaN(v["token_size"].split(",")[1]) ? v["token_size"].split(",")[1] : 1;
                    default_attr["width"] = setwidth * squarelength;
                    default_attr["height"] = setheight * squarelength;
                }
                else {
                    default_attr["width"] = squarelength * v["token_size"]
                    default_attr["height"] = squarelength * v["token_size"]
                };
            }

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
            else {
                default_attr["bar2_link"] = "npc_ac";
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

            setDefaultToken(default_attr);
        });
    });

    on("change:strength_base change:strength_bonus", function() {
        update_attr("strength");
    });

    on("change:strength", function() {
        update_mod("strength");
        check_customac("Strength");
        update_weight();
    });

    on("change:dexterity_base change:dexterity_bonus", function() {
        update_attr("dexterity");
        update_initiative();
    });

    on("change:dexterity", function() {
        update_mod("dexterity");
        check_customac("Dexterity");
    });

    on("change:constitution_base change:constitution_bonus", function() {
        update_attr("constitution");
    });

    on("change:constitution", function() {
        update_mod("constitution");
        check_customac("Constitution");
    });

    on("change:intelligence_base change:intelligence_bonus", function() {
        update_attr("intelligence");
    });

    on("change:intelligence", function() {
        update_mod("intelligence");
        check_customac("Intelligence");
    });

    on("change:wisdom_base change:wisdom_bonus", function() {
        update_attr("wisdom");
    });

    on("change:wisdom", function() {
        update_mod("wisdom");
        check_customac("Wisdom");
    });

    on("change:charisma_base change:charisma_bonus", function() {
        update_attr("charisma");
    });

    on("change:charisma", function() {
        update_mod("charisma");
        check_customac("Charisma");
    });

    on("change:strength_mod", function() {
        update_save("strength");
        update_skills(["athletics"]);
        update_attacks("strength");
        update_tool("strength");
        update_spell_info("strength");
    });

    on("change:dexterity_mod", function() {
        update_save("dexterity");
        update_skills(["acrobatics", "sleight_of_hand", "stealth"]);
        update_attacks("dexterity");
        update_tool("dexterity");
        update_spell_info("dexterity");
        update_ac();
        update_initiative();
    });

    on("change:constitution_mod", function() {
        update_save("constitution");
        update_attacks("constitution");
        update_tool("constitution");
        update_spell_info("constitution");
    });

    on("change:intelligence_mod", function() {
        update_save("intelligence");
        update_skills(["arcana", "history", "investigation", "nature", "religion"]);
        update_attacks("intelligence");
        update_tool("intelligence");
        update_spell_info("intelligence");
    });

    on("change:wisdom_mod", function() {
        update_save("wisdom");
        update_skills(["animal_handling", "insight", "medicine", "perception", "survival"]);
        update_attacks("wisdom");
        update_tool("wisdom");
        update_spell_info("wisdom");
    });

    on("change:charisma_mod", function() {
        update_save("charisma");
        update_skills(["deception", "intimidation", "performance", "persuasion"]);
        update_attacks("charisma");
        update_tool("charisma");
        update_spell_info("charisma");
    });

    on("change:strength_save_prof change:strength_save_mod", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_save("strength");
    });

    on("change:dexterity_save_prof change:dexterity_save_mod", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_save("dexterity");
    });

    on("change:constitution_save_prof change:constitution_save_mod", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_save("constitution");
    });

    on("change:intelligence_save_prof change:intelligence_save_mod", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_save("intelligence");
    });

    on("change:wisdom_save_prof change:wisdom_save_mod", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_save("wisdom");
    });

    on("change:charisma_save_prof change:charisma_save_mod", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_save("charisma");
    });

    on("change:globalsavemod", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_all_saves();
    });

    on("change:death_save_mod", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_save("death");
    });

    on("change:acrobatics_prof change:acrobatics_type change:acrobatics_flat", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_skills(["acrobatics"]);
    });

    on("change:animal_handling_prof change:animal_handling_type change:animal_handling_flat", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_skills(["animal_handling"]);
    });

    on("change:arcana_prof change:arcana_type change:arcana_flat", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_skills(["arcana"]);
    });

    on("change:athletics_prof change:athletics_type change:athletics_flat", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_skills(["athletics"]);
    });

    on("change:deception_prof change:deception_type change:deception_flat", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_skills(["deception"]);
    });

    on("change:history_prof change:history_type change:history_flat", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_skills(["history"]);
    });

    on("change:insight_prof change:insight_type change:insight_flat", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_skills(["insight"]);
    });

    on("change:intimidation_prof change:intimidation_type change:intimidation_flat", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_skills(["intimidation"]);
    });

    on("change:investigation_prof change:investigation_type change:investigation_flat", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_skills(["investigation"]);
    });

    on("change:medicine_prof change:medicine_type change:medicine_flat", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_skills(["medicine"]);
    });

    on("change:nature_prof change:nature_type change:nature_flat", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_skills(["nature"]);
    });

    on("change:perception_prof change:perception_type change:perception_flat", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_skills(["perception"]);
    });

    on("change:performance_prof change:performance_type change:performance_flat", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_skills(["performance"]);
    });

    on("change:persuasion_prof change:persuasion_type change:persuasion_flat", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_skills(["persuasion"]);
    });

    on("change:religion_prof change:religion_type change:religion_flat", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_skills(["religion"]);
    });

    on("change:sleight_of_hand_prof change:sleight_of_hand_type change:sleight_of_hand_flat", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_skills(["sleight_of_hand"]);
    });

    on("change:stealth_prof change:stealth_type change:stealth_flat", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_skills(["stealth"]);
    });

    on("change:survival_prof change:survival_type change:survival_flat", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {return;};
        update_skills(["survival"]);
    });

    on("change:repeating_tool:toolname change:repeating_tool:toolbonus_base change:repeating_tool:toolattr_base change:repeating_tool:tool_mod", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {
            return;
        }
        var tool_id = eventinfo.sourceAttribute.substring(15, 35);
        update_tool(tool_id);
    });

    on("change:repeating_attack:atkname change:repeating_attack:atkflag change:repeating_attack:atkattr_base change:repeating_attack:atkmod change:repeating_attack:atkmagic change:repeating_attack:atkprofflag change:repeating_attack:dmgflag change:repeating_attack:dmgbase change:repeating_attack:dmgattr change:repeating_attack:dmgmod change:repeating_attack:dmgtype change:repeating_attack:dmg2flag change:repeating_attack:dmg2base change:repeating_attack:dmg2attr change:repeating_attack:dmg2mod change:repeating_attack:dmg2type change:repeating_attack:saveflag change:repeating_attack:savedc change:repeating_attack:saveflat change:repeating_attack:dmgcustcrit change:repeating_attack:dmg2custcrit change:repeating_attack:ammo", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {
            return;
        }

        var attackid = eventinfo.sourceAttribute.substring(17, 37);
        update_attacks(attackid);
    });

    on("change:drop_category", function(eventinfo) {
        if(eventinfo.newValue === "Monsters") {
            getAttrs(["class","race","speed","hp"], function(v) {
                if(v["class"] != "" || v["race"] != "" || v["speed"] != "" || v["hp"] != "") {
                    setAttrs({monster_confirm_flag: 1});
                }
                else {
                    handle_drop(eventinfo.newValue);
                }
            });
        }
        else {
            handle_drop(eventinfo.newValue);
        }
    });

    on("change:repeating_inventory:hasattack", function(eventinfo) {
        if(eventinfo.sourceType === "sheetworker") {
            return;
        }

        var itemid = eventinfo.sourceAttribute.substring(20, 40);
        getAttrs(["repeating_inventory_" + itemid + "_hasattack", "repeating_inventory_" + itemid + "_itemattackid"], function(v) {
            var attackid = v["repeating_inventory_" + itemid + "_itemattackid"];
            var hasattack = v["repeating_inventory_" + itemid + "_hasattack"];
            if(attackid && attackid != "" && hasattack == 0) {
                remove_attack(attackid);
            }
            else if(hasattack == 1) {
                create_attack_from_item(itemid);
            };
        });
    })

    on("change:repeating_inventory:itemname change:repeating_inventory:itemproperties change:repeating_inventory:itemmodifiers change:repeating_inventory:itemcount", function(eventinfo) {
        if(eventinfo.sourceType && eventinfo.sourceType === "sheetworker") {
            return;
        }

        var itemid = eventinfo.sourceAttribute.substring(20, 40);
        getAttrs(["repeating_inventory_" + itemid + "_itemattackid", "repeating_inventory_" + itemid + "_itemresourceid"], function(v) {
            var attackid = v["repeating_inventory_" + itemid + "_itemattackid"];
            var resourceid = v["repeating_inventory_" + itemid + "_itemresourceid"];
            if(attackid) {
                update_attack_from_item(itemid, attackid);
            }
            if(resourceid) {
                update_resource_from_item(itemid, resourceid);
            }
        });
    });

    on("change:repeating_inventory:useasresource", function(eventinfo) {
        if(eventinfo.sourceType && eventinfo.sourceType === "sheetworker") {
            return;
        }

        var itemid = eventinfo.sourceAttribute.substring(20, 40);
        getAttrs(["repeating_inventory_" + itemid + "_useasresource", "repeating_inventory_" + itemid + "_itemresourceid"], function(v) {
            var useasresource = v["repeating_inventory_" + itemid + "_useasresource"];
            var resourceid = v["repeating_inventory_" + itemid + "_itemresourceid"];
            if(useasresource == 1) {
                create_resource_from_item(itemid);
            }
            else {
                remove_resource(resourceid);
            };
        });
    });

    on("change:other_resource change:other_resource_name change:repeating_resource:resource_left change:repeating_resource:resource_left_name change:repeating_resource:resource_right change:repeating_resource:resource_right_name", function(eventinfo) {

        if(eventinfo.sourceType && eventinfo.sourceType === "sheetworker") {
            return;
        }

        var resourceid = eventinfo.sourceAttribute;
        if(eventinfo.sourceAttribute.indexOf("other") > -1) {
            resourceid = "other_resource";
        }
        else if(eventinfo.sourceAttribute.substring(eventinfo.sourceAttribute.length - 5) == "_name") {
            resourceid = eventinfo.sourceAttribute.substring(0, eventinfo.sourceAttribute.length - 5);
        };

        getAttrs([resourceid, resourceid + "_name", resourceid + "_itemid"], function(v) {
            if(!v[resourceid + "_name"]) {
                remove_resource(resourceid);
            }
            else if(v[resourceid + "_itemid"] && v[resourceid + "_itemid"] != ""){
                update_item_from_resource(resourceid, v[resourceid + "_itemid"]);
            };
        });

    });

    on("change:repeating_inventory:itemweight change:repeating_inventory:itemcount change:cp change:sp change:ep change:gp change:pp change:encumberance_setting change:size change:carrying_capacity_mod", function() {
        update_weight();
    });

    on("change:repeating_inventory:itemmodifiers change:repeating_inventory:equipped", function(eventinfo) {
        if(eventinfo.sourceType && eventinfo.sourceType === "sheetworker") {
            return;
        }
        var itemid = eventinfo.sourceAttribute.substring(20, 40);
        getAttrs(["repeating_inventory_" + itemid + "_itemmodifiers"], function(v) {
            if(v["repeating_inventory_" + itemid + "_itemmodifiers"]) {
                check_itemmodifiers(v["repeating_inventory_" + itemid + "_itemmodifiers"], eventinfo.previousValue);
            };
        });
    });

    on("change:globalacmod change:custom_ac_flag change:custom_ac_base change:custom_ac_part1 change:custom_ac_part2", function(eventinfo) {
        if(eventinfo.sourceType && eventinfo.sourceType === "sheetworker") {
            return;
        }
        update_ac();
    });

    on("change:repeating_spell-cantrip:spellname change:repeating_spell-1:spellname change:repeating_spell-1:spellprepared change:repeating_spell-2:spellname change:repeating_spell-2:spellprepared change:repeating_spell-3:spellname change:repeating_spell-3:spellprepared change:repeating_spell-4:spellname change:repeating_spell-4:spellprepared change:repeating_spell-5:spellname change:repeating_spell-5:spellprepared change:repeating_spell-6:spellname change:repeating_spell-6:spellprepared change:repeating_spell-7:spellname change:repeating_spell-7:spellprepared change:repeating_spell-8:spellname change:repeating_spell-8:spellprepared change:repeating_spell-9:spellname change:repeating_spell-9:spellprepared change:repeating_spell-cantrip:spellrange change:repeating_spell-1:spellrange change:repeating_spell-2:spellrange change:repeating_spell-3:spellrange change:repeating_spell-4:spellrange change:repeating_spell-5:spellrange change:repeating_spell-6:spellrange change:repeating_spell-7:spellrange change:repeating_spell-8:spellrange change:repeating_spell-9:spellrange change:repeating_spell-cantrip:spelltarget change:repeating_spell-1:spelltarget change:repeating_spell-2:spelltarget change:repeating_spell-3:spelltarget change:repeating_spell-4:spelltarget change:repeating_spell-5:spelltarget change:repeating_spell-6:spelltarget change:repeating_spell-7:spelltarget change:repeating_spell-8:spelltarget change:repeating_spell-9:spelltarget change:repeating_spell-cantrip:spelldamage change:repeating_spell-1:spelldamage change:repeating_spell-2:spelldamage change:repeating_spell-3:spelldamage change:repeating_spell-4:spelldamage change:repeating_spell-5:spelldamage change:repeating_spell-6:spelldamage change:repeating_spell-7:spelldamage change:repeating_spell-8:spelldamage change:repeating_spell-9:spelldamage change:repeating_spell-cantrip:spelldamagetype change:repeating_spell-1:spelldamagetype change:repeating_spell-2:spelldamagetype change:repeating_spell-3:spelldamagetype change:repeating_spell-4:spelldamagetype change:repeating_spell-5:spelldamagetype change:repeating_spell-6:spelldamagetype change:repeating_spell-7:spelldamagetype change:repeating_spell-8:spelldamagetype change:repeating_spell-9:spelldamagetype change:repeating_spell-cantrip:spelldamage2 change:repeating_spell-1:spelldamage2 change:repeating_spell-2:spelldamage2 change:repeating_spell-3:spelldamage2 change:repeating_spell-4:spelldamage2 change:repeating_spell-5:spelldamage2 change:repeating_spell-6:spelldamage2 change:repeating_spell-7:spelldamage2 change:repeating_spell-8:spelldamage2 change:repeating_spell-9:spelldamage2 change:repeating_spell-cantrip:spelldamagetype2 change:repeating_spell-1:spelldamagetype2 change:repeating_spell-2:spelldamagetype2 change:repeating_spell-3:spelldamagetype2 change:repeating_spell-4:spelldamagetype2 change:repeating_spell-5:spelldamagetype2 change:repeating_spell-6:spelldamagetype2 change:repeating_spell-7:spelldamagetype2 change:repeating_spell-8:spelldamagetype2 change:repeating_spell-9:spelldamagetype2 change:repeating_spell-cantrip:spellhealing change:repeating_spell-1:spellhealing change:repeating_spell-2:spellhealing change:repeating_spell-3:spellhealing change:repeating_spell-4:spellhealing change:repeating_spell-5:spellhealing change:repeating_spell-6:spellhealing change:repeating_spell-7:spellhealing change:repeating_spell-8:spellhealing change:repeating_spell-9:spellhealing change:repeating_spell-cantrip:spelldmgmod change:repeating_spell-1:spelldmgmod change:repeating_spell-2:spelldmgmod change:repeating_spell-3:spelldmgmod change:repeating_spell-4:spelldmgmod change:repeating_spell-5:spelldmgmod change:repeating_spell-6:spelldmgmod change:repeating_spell-7:spelldmgmod change:repeating_spell-8:spelldmgmod change:repeating_spell-9:spelldmgmod change:repeating_spell-cantrip:spellsave change:repeating_spell-1:spellsave change:repeating_spell-2:spellsave change:repeating_spell-3:spellsave change:repeating_spell-4:spellsave change:repeating_spell-5:spellsave change:repeating_spell-6:spellsave change:repeating_spell-7:spellsave change:repeating_spell-8:spellsave change:repeating_spell-9:spellsave change:repeating_spell-cantrip:spellsavesuccess change:repeating_spell-1:spellsavesuccess change:repeating_spell-2:spellsavesuccess change:repeating_spell-3:spellsavesuccess change:repeating_spell-4:spellsavesuccess change:repeating_spell-5:spellsavesuccess change:repeating_spell-6:spellsavesuccess change:repeating_spell-7:spellsavesuccess change:repeating_spell-8:spellsavesuccess change:repeating_spell-9:spellsavesuccess change:repeating_spell-cantrip:spellhldie change:repeating_spell-1:spellhldie change:repeating_spell-2:spellhldie change:repeating_spell-3:spellhldie change:repeating_spell-4:spellhldie change:repeating_spell-5:spellhldie change:repeating_spell-6:spellhldie change:repeating_spell-7:spellhldie change:repeating_spell-8:spellhldie change:repeating_spell-9:spellhldie change:repeating_spell-cantrip:spellhldietype change:repeating_spell-1:spellhldietype change:repeating_spell-2:spellhldietype change:repeating_spell-3:spellhldietype change:repeating_spell-4:spellhldietype change:repeating_spell-5:spellhldietype change:repeating_spell-6:spellhldietype change:repeating_spell-7:spellhldietype change:repeating_spell-8:spellhldietype change:repeating_spell-9:spellhldietype change:repeating_spell-cantrip:spell_updateflag change:repeating_spell-1:spell_updateflag change:repeating_spell-2:spell_updateflag change:repeating_spell-3:spell_updateflag change:repeating_spell-4:spell_updateflag change:repeating_spell-5:spell_updateflag change:repeating_spell-6:spell_updateflag change:repeating_spell-7:spell_updateflag change:repeating_spell-8:spell_updateflag change:repeating_spell-9:spell_updateflag change:repeating_spell-cantrip:spellattack change:repeating_spell-1:spellattack change:repeating_spell-2:spellattack change:repeating_spell-3:spellattack change:repeating_spell-4:spellattack change:repeating_spell-5:spellattack change:repeating_spell-6:spellattack change:repeating_spell-7:spellattack change:repeating_spell-8:spellattack change:repeating_spell-9:spellattack change:repeating_spell-cantrip:spellhlbonus change:repeating_spell-1:spellhlbonus change:repeating_spell-2:spellhlbonus change:repeating_spell-3:spellhlbonus change:repeating_spell-4:spellhlbonus change:repeating_spell-5:spellhlbonus change:repeating_spell-6:spellhlbonus change:repeating_spell-7:spellhlbonus change:repeating_spell-8:spellhlbonus change:repeating_spell-9:spellhlbonus change:repeating_spell-cantrip:includedesc change:repeating_spell-1:includedesc change:repeating_spell-2:includedesc change:repeating_spell-3:includedesc change:repeating_spell-4:includedesc change:repeating_spell-5:includedesc change:repeating_spell-6:includedesc change:repeating_spell-7:includedesc change:repeating_spell-8:includedesc change:repeating_spell-9:includedesc change:repeating_spell-cantrip:spellathigherlevels change:repeating_spell-1:spellathigherlevels change:repeating_spell-2:spellathigherlevels change:repeating_spell-3:spellathigherlevels change:repeating_spell-4:spellathigherlevels change:repeating_spell-5:spellathigherlevels change:repeating_spell-6:spellathigherlevels change:repeating_spell-7:spellathigherlevels change:repeating_spell-8:spellathigherlevels change:repeating_spell-9:spellathigherlevels change:repeating_spell-cantrip:spelldescription change:repeating_spell-1:spelldescription change:repeating_spell-2:spelldescription change:repeating_spell-3:spelldescription change:repeating_spell-4:spelldescription change:repeating_spell-5:spelldescription change:repeating_spell-6:spelldescription change:repeating_spell-7:spelldescription change:repeating_spell-8:spelldescription change:repeating_spell-9:spelldescription change:repeating_spell-cantrip:innate change:repeating_spell-1:innate change:repeating_spell-2:innate change:repeating_spell-3:innate change:repeating_spell-4:innate change:repeating_spell-5:innate change:repeating_spell-6:innate change:repeating_spell-7:innate change:repeating_spell-8:innate change:repeating_spell-9:innate", function(eventinfo) {
        if(eventinfo.sourceType && eventinfo.sourceType === "sheetworker") {
            return;
        }
        var repeating_source = eventinfo.sourceAttribute.substring(0, eventinfo.sourceAttribute.lastIndexOf('_'));
        getAttrs([repeating_source + "_spellattackid", repeating_source + "_spelllevel"], function(v) {
            var spellid = repeating_source.slice(-20);
            var attackid = v[repeating_source + "_spellattackid"];
            var lvl = v[repeating_source + "_spelllevel"];
            if(attackid && lvl && spellid) {
                update_attack_from_spell(lvl, spellid, attackid)
            }
        });
    });

    on("change:repeating_spell-cantrip:spelloutput change:repeating_spell-1:spelloutput change:repeating_spell-2:spelloutput change:repeating_spell-3:spelloutput change:repeating_spell-4:spelloutput change:repeating_spell-5:spelloutput change:repeating_spell-6:spelloutput change:repeating_spell-7:spelloutput change:repeating_spell-8:spelloutput change:repeating_spell-9:spelloutput", function(eventinfo) {
        if(eventinfo.sourceType && eventinfo.sourceType === "sheetworker") {
            return;
        }
        var repeating_source = eventinfo.sourceAttribute.substring(0, eventinfo.sourceAttribute.lastIndexOf('_'));
        getAttrs([repeating_source + "_spellattackid", repeating_source + "_spelllevel", repeating_source + "_spelloutput", repeating_source + "_spellattackid", repeating_source + "_spellathigherlevels","character_id"], function(v) {
            var update = {};
            var spelloutput = v[repeating_source + "_spelloutput"];
            var spellid = repeating_source.slice(-20);
            var attackid = v[repeating_source + "_spellattackid"];
            var lvl = v[repeating_source + "_spelllevel"];
            if(spelloutput && spelloutput === "ATTACK") {
                create_attack_from_spell(lvl, spellid, v["character_id"]);
            }
            else if(spelloutput && spelloutput === "SPELLCARD" && attackid && attackid != "") {
                remove_attack(attackid);
                var spelllevel = "@{spelllevel}";
                if(v[repeating_source + "_spellathigherlevels"]) {
                    var lvl = parseInt(v[repeating_source + "_spelllevel"],10);
                    spelllevel = "?{Cast at what level?";
                    for(i = 0; i < 10-lvl; i++) {
                        spelllevel = spelllevel + "|Level " + (parseInt(i, 10) + parseInt(lvl, 10)) + "," + (parseInt(i, 10) + parseInt(lvl, 10));
                    }
                    spelllevel = spelllevel + "}";
                }
                update[repeating_source + "_rollcontent"] = "@{wtype}&{template:spell} {{level=@{spellschool} " + spelllevel + "}} {{name=@{spellname}}} {{castingtime=@{spellcastingtime}}} {{range=@{spellrange}}} {{target=@{spelltarget}}} @{spellcomp_v} @{spellcomp_s} @{spellcomp_m} {{material=@{spellcomp_materials}}} {{duration=@{spellduration}}} {{description=@{spelldescription}}} {{athigherlevels=@{spellathigherlevels}}} @{spellritual} {{innate=@{innate}}} @{spellconcentration} @{charname_output}";
            }
            setAttrs(update, {silent: true});
        });
    });

    on("change:repeating_spell-cantrip:spellathigherlevels change:repeating_spell-1:spellathigherlevels change:repeating_spell-2:spellathigherlevels change:repeating_spell-3:spellathigherlevels change:repeating_spell-4:spellathigherlevels change:repeating_spell-5:spellathigherlevels change:repeating_spell-6:spellathigherlevels change:repeating_spell-7:spellathigherlevels change:repeating_spell-8:spellathigherlevels change:repeating_spell-9:spellathigherlevels", function(eventinfo) {
        if(eventinfo.sourceType && eventinfo.sourceType === "sheetworker") {
            return;
        }
        var repeating_source = eventinfo.sourceAttribute.substring(0, eventinfo.sourceAttribute.lastIndexOf('_'));
        getAttrs([repeating_source + "_spelllevel", repeating_source + "_spelloutput", repeating_source + "_spellathigherlevels"], function(v) {
            var update = {};
            var spelloutput = v[repeating_source + "_spelloutput"];
            var lvl = v[repeating_source + "_spelllevel"];
            if(spelloutput && spelloutput === "SPELLCARD") {
                var spelllevel = "@{spelllevel}";
                if(v[repeating_source + "_spellathigherlevels"]) {
                    var lvl = parseInt(v[repeating_source + "_spelllevel"],10);
                    spelllevel = "?{Cast at what level?";
                    for(i = 0; i < 10-lvl; i++) {
                        spelllevel = spelllevel + "|Level " + (parseInt(i, 10) + parseInt(lvl, 10)) + "," + (parseInt(i, 10) + parseInt(lvl, 10));
                    }
                    spelllevel = spelllevel + "}";
                }
                update[repeating_source + "_rollcontent"] = "@{wtype}&{template:spell} {{level=@{spellschool} " + spelllevel + "}} {{name=@{spellname}}} {{castingtime=@{spellcastingtime}}} {{range=@{spellrange}}} {{target=@{spelltarget}}} @{spellcomp_v} @{spellcomp_s} @{spellcomp_m} {{material=@{spellcomp_materials}}} {{duration=@{spellduration}}} {{description=@{spelldescription}}} {{athigherlevels=@{spellathigherlevels}}} @{spellritual} {{innate=@{innate}}} @{spellconcentration} @{charname_output}";
            }
            setAttrs(update, {silent: true});
        });
    });

    on("change:class change:custom_class change:cust_classname change:cust_hitdietype change:cust_spellcasting_ability change:cust_spellslots change:cust_strength_save_prof change:cust_dexterity_save_prof change:cust_constitution_save_prof change:cust_intelligence_save_prof change:cust_wisdom_save_prof change:cust_charisma_save_prof", function(eventinfo) {
        if(eventinfo.sourceType && eventinfo.sourceType === "sheetworker") {
            return;
        }
        update_class();
    });

    on("change:base_level change:multiclass1_flag change:multiclass1 change:multiclass1_lvl change:multiclass2_flag change:multiclass2 change:multiclass2_lvl change:multiclass3_flag change:multiclass3 change:multiclass3_lvl change:arcane_fighter change:arcane_rogue", function(eventinfo) {
        if(eventinfo.sourceType && eventinfo.sourceType === "sheetworker") {
            return;
        }
        set_level();
    });

    on("change:level_calculations change:caster_level change:lvl1_slots_mod change:lvl2_slots_mod change:lvl3_slots_mod change:lvl4_slots_mod change:lvl5_slots_mod change:lvl6_slots_mod change:lvl7_slots_mod change:lvl8_slots_mod change:lvl9_slots_mod", function(eventinfo) {
        if(eventinfo.sourceType && eventinfo.sourceType === "sheetworker") {
            return;
        }
        getAttrs(["level_calculations"], function(v) {
            if(!v["level_calculations"] || v["level_calculations"] == "on") {
                update_spell_slots();
            };
        });
    });

    on("change:caster_level", function(eventinfo) {
        getAttrs(["caster_level","npc"], function(v) {
            var casterlvl = v["caster_level"] && !isNaN(parseInt(v["caster_level"], 10)) ? parseInt(v["caster_level"], 10) : 0;
            if(v["npc"] && v["npc"] == 1 && casterlvl > 0) {
                setAttrs({level: casterlvl})
            };
        });
    });

    on("change:pb_type change:pb_custom", function(eventinfo) {
        if(eventinfo.sourceType && eventinfo.sourceType === "sheetworker") {
            return;
        }
        update_pb();
    });

    on("change:dtype", function(eventinfo) {
        if(eventinfo.sourceType && eventinfo.sourceType === "sheetworker") {
            return;
        }
        update_attacks("all");
        update_npc_action("all");
    });

    on("change:jack_of_all_trades", function(eventinfo) {
        if(eventinfo.sourceType && eventinfo.sourceType === "sheetworker") {
            return;
        }
        update_jack_attr();
        update_initiative();
        update_skills(["athletics", "acrobatics", "sleight_of_hand", "stealth", "arcana", "history", "investigation", "nature", "religion", "animal_handling", "insight", "medicine", "perception", "survival","deception", "intimidation", "performance", "persuasion"]);
    });

    on("change:initmod change:init_tiebreaker", function(eventinfo) {
        if(eventinfo.sourceType && eventinfo.sourceType === "sheetworker") {
            return;
        }
        update_initiative();
    });

    on("change:spellcasting_ability change:spell_dc_mod change:globalmagicmod", function(eventinfo) {
        if(eventinfo.sourceType && eventinfo.sourceType === "sheetworker") {
            return;
        }
        update_spell_info();
        update_attacks("spells");
    });

    on("change:npc_challenge", function() {
        update_challenge();
    });

    on("change:npc_str_save_base change:npc_dex_save_base change:npc_con_save_base change:npc_int_save_base change:npc_wis_save_base change:npc_cha_save_base", function(eventinfo) {
        update_npc_saves();
    });

    on("change:npc_acrobatics_base change:npc_animal_handling_base change:npc_arcana_base change:npc_athletics_base change:npc_deception_base change:npc_history_base change:npc_insight_base change:npc_intimidation_base change:npc_investigation_base change:npc_medicine_base change:npc_nature_base change:npc_perception_base change:npc_performance_base change:npc_persuasion_base change:npc_religion_base change:npc_sleight_of_hand_base change:npc_stealth_base change:npc_survival_base", function(eventinfo) {
        update_npc_skills();
    });

    on("change:repeating_npcaction:attack_flag change:repeating_npcaction:attack_type change:repeating_npcaction:attack_range change:repeating_npcaction:attack_target change:repeating_npcaction:attack_tohit change:repeating_npcaction:attack_damage change:repeating_npcaction:attack_damagetype change:repeating_npcaction:attack_damage2 change:repeating_npcaction:attack_damagetype2 change:repeating_npcaction-l:attack_flag change:repeating_npcaction-l:attack_type change:repeating_npcaction-l:attack_range change:repeating_npcaction-l:attack_target change:repeating_npcaction-l:attack_tohit change:repeating_npcaction-l:attack_damage change:repeating_npcaction-l:attack_damagetype change:repeating_npcaction-l:attack_damage2 change:repeating_npcaction-l:attack_damagetype2 change:repeating_npcaction:show_desc change:repeating_npcaction-l:show_desc change:repeating_npcaction:description change:repeating_npcaction-l:description", function(eventinfo) {
        var actionid = eventinfo.sourceAttribute.substring(20, 40);
        var legendary = eventinfo.sourceAttribute.indexOf("npcaction-l") > -1 ? true : false;
        if(legendary) {
            actionid = eventinfo.sourceAttribute.substring(22, 42);
        }
        update_npc_action(actionid, legendary);
    });

    on("change:core_die change:halflingluck_flag", function() {
        getAttrs(["core_die","halflingluck_flag"], function(v) {
            core = v.core_die && v.core_die != "" ? v.core_die : "1d20";
            luck = v.halflingluck_flag && v.halflingluck_flag === "1" ? "ro<1" : "";
            update = {};
            update["d20"] = core + luck;
            if(!v.core_die || v.core_die === "") {
                update["core_die"] = "1d20";
            }
            setAttrs(update);
        });
    });

    on("change:global_attack_mod", function(eventinfo) {
        if(eventinfo.newValue) {
            getAttrs(["global_attack_mod_field"], function(v) {
                if(!v["global_attack_mod_field"] || v["global_attack_mod_field"] === "") {
                    setAttrs({global_attack_mod_field: "1d4[BLESS]"})
                }
            });
        };
    });

    on("change:global_damage_mod", function(eventinfo) {
        if(eventinfo.newValue) {
            getAttrs(["global_damage_mod_field"], function(v) {
                if(!v["global_damage_mod_field"] || v["global_damage_mod_field"] === "") {
                    setAttrs({global_damage_mod_field: "1d6[SNEAK ATTACK]"})
                }
            });
        };
    });

    on("change:global_attack_mod_field", function(eventinfo) {
        if(!eventinfo.newValue) {
            setAttrs({global_attack_mod: 0});
        };
    });

    on("change:global_damage_mod_field", function(eventinfo) {
        var update = {};
        if(!eventinfo.newValue) {
            update["global_damage_mod"] = 0;
            update["global_damage_mod_crit"] = 0;
        }
        else {
            update["global_damage_mod_crit"] = "{{globaldamagecrit=[[@{global_damage_mod_field}]]}}";
        }
        setAttrs(update);
    });

    on("change:confirm", function(eventinfo) {
        getAttrs(["drop_category"], function(v) {
            if(v["drop_category"]) {
                handle_drop(v["drop_category"]);
            }
        });
    });

    on("change:cancel", function(eventinfo) {
        cleanup_drop_fields();
    });

    on("change:passiveperceptionmod", function(eventinfo) {
        update_passive_perception();
    });

    on("remove:repeating_inventory", function(eventinfo) {
        var itemid = eventinfo.sourceAttribute.substring(20, 40);
        var attackid = eventinfo.removedInfo && eventinfo.removedInfo["repeating_inventory_" + itemid + "_itemattackid"] ? eventinfo.removedInfo["repeating_inventory_" + itemid + "_itemattackid"] : undefined;
        var resourceid = eventinfo.removedInfo && eventinfo.removedInfo["repeating_inventory_" + itemid + "_itemresourceid"] ? eventinfo.removedInfo["repeating_inventory_" + itemid + "_itemresourceid"] : undefined;

        if(attackid) {
            remove_attack(attackid);
        }
        if(resourceid) {
            remove_resource(resourceid);
        }

        if(eventinfo.removedInfo && eventinfo.removedInfo["repeating_inventory_" + itemid + "_itemmodifiers"]) {
            check_itemmodifiers(eventinfo.removedInfo["repeating_inventory_" + itemid + "_itemmodifiers"]);
        }

        update_weight();
    });

    on("remove:repeating_attack", function(eventinfo) {
        var attackid = eventinfo.sourceAttribute.substring(17, 37);
        var itemid = eventinfo.removedInfo["repeating_attack_" + attackid + "_itemid"];
        var spellid = eventinfo.removedInfo["repeating_attack_" + attackid + "_spellid"];
        var spelllvl = eventinfo.removedInfo["repeating_attack_" + attackid + "_spelllevel"];
        if(itemid) {
            getAttrs(["repeating_inventory_" + itemid + "_hasattack"], function(v) {
                if(v["repeating_inventory_" + itemid + "_hasattack"] && v["repeating_inventory_" + itemid + "_hasattack"] == 1) {
                    var update = {};
                    update["repeating_inventory_" + itemid + "_itemattackid"] = "";
                    update["repeating_inventory_" + itemid + "_hasattack"] = 0;
                    setAttrs(update, {silent: true});
                }
            });
        };
        if(spellid && spelllvl) {
            getAttrs(["repeating_spell-" + spelllvl + "_" + spellid + "_spelloutput"], function(v) {
                if(v["repeating_spell-" + spelllvl + "_" + spellid + "_spelloutput"] && v["repeating_spell-" + spelllvl + "_" + spellid + "_spelloutput"] == "ATTACK") {
                    var update = {};
                    update["repeating_spell-" + spelllvl + "_" + spellid + "_spellattackid"] = "";
                    update["repeating_spell-" + spelllvl + "_" + spellid + "_spelloutput"] = "SPELLCARD";
                    setAttrs(update, {silent: true});
                }
            });
        };

    });

    on("remove:repeating_resource", function(eventinfo) {
        var resourceid = eventinfo.sourceAttribute.substring(19, 39);
        var left_itemid = eventinfo.removedInfo["repeating_resource_" + resourceid + "_resource_left_itemid"];
        var right_itemid = eventinfo.removedInfo["repeating_resource_" + resourceid + "_resource_right_itemid"];
        var update = {};
        if(left_itemid) {
            update["repeating_inventory_" + left_itemid + "_useasresource"] = 0;
            update["repeating_inventory_" + left_itemid + "_itemresourceid"] = "";
        }
        if(right_itemid) {
            update["repeating_inventory_" + right_itemid + "_useasresource"] = 0;
            update["repeating_inventory_" + right_itemid + "_itemresourceid"] = "";
        }
        setAttrs(update, {silent: true});
    });

    on("remove:repeating_spell-cantrip remove:repeating_spell-1 remove:repeating_spell-2 remove:repeating_spell-3 remove:repeating_spell-4 remove:repeating_spell-5 remove:repeating_spell-6 remove:repeating_spell-7 remove:repeating_spell-8 remove:repeating_spell-9", function(eventinfo) {
        var attackid = eventinfo.removedInfo[eventinfo.sourceAttribute + "_spellattackid"];
        if(attackid) {
            remove_attack(attackid);
        }
    });

    var update_attr = function(attr) {
        var update = {};
        var attr_fields = [attr + "_base",attr + "_bonus"];
        getSectionIDs("repeating_inventory", function(idarray) {
            _.each(idarray, function(currentID, i) {
                attr_fields.push("repeating_inventory_" + currentID + "_equipped");
                attr_fields.push("repeating_inventory_" + currentID + "_itemmodifiers");
            });
            getAttrs(attr_fields, function(v) {
                var base = v[attr + "_base"] && !isNaN(parseInt(v[attr + "_base"], 10)) ? parseInt(v[attr + "_base"], 10) : 10;
                var bonus = v[attr + "_bonus"] && !isNaN(parseInt(v[attr + "_bonus"], 10)) ? parseInt(v[attr + "_bonus"], 10) : 0;
                var item_base = 0;
                var item_bonus = 0;
                _.each(idarray, function(currentID) {
                    if((!v["repeating_inventory_" + currentID + "_equipped"] || v["repeating_inventory_" + currentID + "_equipped"] === "1") && v["repeating_inventory_" + currentID + "_itemmodifiers"] && v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().indexOf(attr > -1)) {
                        var mods = v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().split(",");
                        _.each(mods, function(mod) {
                            if(mod.indexOf(attr) > -1 && mod.indexOf("save") === -1) {
                                if(mod.indexOf(":") > -1) {
                                    var new_base = !isNaN(parseInt(mod.replace(/[^0-9]/g, ""), 10)) ? parseInt(mod.replace(/[^0-9]/g, ""), 10) : false;
                                    item_base = new_base && new_base > item_base ? new_base : item_base;
                                }
                                else if(mod.indexOf("-") > -1) {
                                    var new_mod = !isNaN(parseInt(mod.replace(/[^0-9]/g, ""), 10)) ? parseInt(mod.replace(/[^0-9]/g, ""), 10) : false;
                                    item_bonus = new_mod ? item_bonus - new_mod : item_bonus;
                                }
                                else {
                                    var new_mod = !isNaN(parseInt(mod.replace(/[^0-9]/g, ""), 10)) ? parseInt(mod.replace(/[^0-9]/g, ""), 10) : false;
                                    item_bonus = new_mod ? item_bonus + new_mod : item_bonus;
                                }
                            };
                        });
                    }
                });

                update[attr + "_flag"] = bonus > 0 || item_bonus > 0 || item_base > base ? 1 : 0;
                base = base > item_base ? base : item_base;
                update[attr] = base + bonus + item_bonus;
                setAttrs(update);
            });
        });
    };

    var update_mod = function (attr) {
        getAttrs([attr], function(v) {
            var attr_abr = attr.substring(0,3);
            var finalattr = v[attr] && isNaN(v[attr]) === false ? Math.floor((parseInt(v[attr], 10) - 10) / 2) : 0;
            var update = {};
            update[attr + "_mod"] = finalattr;
            update["npc_" + attr_abr + "_negative"] = v[attr] && !isNaN(v[attr]) && parseInt(v[attr], 10) < 10 ? 1 : 0;
            setAttrs(update);
        });
    };

    var update_save = function (attr) {
        console.log("UPDATING SAVE: " + attr);
        var save_attrs = [attr + "_mod", attr + "_save_prof", attr + "_save_mod","pb","globalsavemod","pb_type"];
        getSectionIDs("repeating_inventory", function(idarray) {
            _.each(idarray, function(currentID, i) {
                save_attrs.push("repeating_inventory_" + currentID + "_equipped");
                save_attrs.push("repeating_inventory_" + currentID + "_itemmodifiers");
            });

            getAttrs(save_attrs, function(v) {
                var attr_mod = v[attr + "_mod"] ? parseInt(v[attr + "_mod"], 10) : 0;
                var prof = v[attr + "_save_prof"] && v[attr + "_save_prof"] != 0 && !isNaN(v["pb"]) ? parseInt(v["pb"], 10) : 0;
                var save_mod = v[attr + "_save_mod"] && !isNaN(parseInt(v[attr + "_save_mod"], 10)) ? parseInt(v[attr + "_save_mod"], 10) : 0;
                var global = v["globalsavemod"] && !isNaN(v["globalsavemod"]) ? parseInt(v["globalsavemod"], 10) : 0;
                var items = 0;
                _.each(idarray, function(currentID) {
                    if(v["repeating_inventory_" + currentID + "_equipped"] && v["repeating_inventory_" + currentID + "_equipped"] === "1" && v["repeating_inventory_" + currentID + "_itemmodifiers"] && (v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().indexOf("saving throws") > -1 || v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().indexOf(attr + " save") > -1)) {
                        var mods = v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().split(",");
                        _.each(mods, function(mod) {
                            if(mod.indexOf(attr + " save") > -1) {
                                var substr = mod.slice(mod.lastIndexOf(attr + " save") + attr.length + " save".length);
                                var bonus = substr && substr.length > 0 && !isNaN(parseInt(substr,10)) ? parseInt(substr,10) : 0;
                            }
                            else if(mod.indexOf("saving throws") > -1) {
                                var substr = mod.slice(mod.lastIndexOf("saving throws") + "saving throws".length);
                                var bonus = substr && substr.length > 0 && !isNaN(parseInt(substr,10)) ? parseInt(substr,10) : 0;
                            };
                            if(bonus && bonus != 0) {
                                items = items + bonus;
                            };
                        });
                    }
                });
                var total = attr_mod + prof + save_mod + global + items;
                if(v["pb_type"] && v["pb_type"] === "die" && v[attr + "_save_prof"] != 0 && attr != "death") {
                    total = total + "+" + v["pb"];
                };
                var update = {};
                update[attr + "_save_bonus"] = total;
                setAttrs(update, {silent: true});
            });
        });
    };

    var update_all_saves = function() {
        update_save("strength");
        update_save("dexterity");
        update_save("constitution");
        update_save("intelligence");
        update_save("wisdom");
        update_save("charisma");
        update_save("death");
    };

    var update_skills = function (skills_array) {
        var skill_parent = {athletics: "strength", acrobatics: "dexterity", sleight_of_hand: "dexterity", stealth: "dexterity", arcana: "intelligence", history: "intelligence", investigation: "intelligence", nature: "intelligence", religion: "intelligence", animal_handling: "wisdom", insight: "wisdom", medicine: "wisdom", perception: "wisdom", survival: "wisdom", deception: "charisma", intimidation: "charisma", performance: "charisma", persuasion: "charisma"};
        var attrs_to_get = ["pb","pb_type","jack_of_all_trades","jack"];
        var update = {};
        var callbacks = [];

        if(skills_array.indexOf("perception") > -1) {
            callbacks.push( function() {update_passive_perception();} )
        };

        _.each(skills_array, function(s) {
            if(skill_parent[s] && attrs_to_get.indexOf(skill_parent[s]) === -1) {attrs_to_get.push(skill_parent[s] + "_mod")};
            attrs_to_get.push(s + "_prof");
            attrs_to_get.push(s + "_type");
            attrs_to_get.push(s + "_flat");
        });

        getSectionIDs("repeating_inventory", function(idarray) {
            _.each(idarray, function(currentID, i) {
                attrs_to_get.push("repeating_inventory_" + currentID + "_equipped");
                attrs_to_get.push("repeating_inventory_" + currentID + "_itemmodifiers");
            });

            getAttrs(attrs_to_get, function(v) {
                _.each(skills_array, function(s) {
                    console.log("UPDATING SKILL: " + s);
                    var attr_mod = v[skill_parent[s] + "_mod"] ? parseInt(v[skill_parent[s] + "_mod"], 10) : 0;
                    var prof = v[s + "_prof"] != 0 && !isNaN(v["pb"]) ? parseInt(v["pb"], 10) : 0;
                    var flat = v[s + "_flat"] && !isNaN(parseInt(v[s + "_flat"], 10)) ? parseInt(v[s + "_flat"], 10) : 0;
                    var type = v[s + "_type"] && !isNaN(parseInt(v[s + "_type"], 10)) ? parseInt(v[s + "_type"], 10) : 1;
                    var jack = v["jack_of_all_trades"] && v["jack_of_all_trades"] != 0 && v["jack"] ? v["jack"] : 0;
                    var item_bonus = 0;

                    _.each(idarray, function(currentID) {
                        if(v["repeating_inventory_" + currentID + "_equipped"] && v["repeating_inventory_" + currentID + "_equipped"] === "1" && v["repeating_inventory_" + currentID + "_itemmodifiers"] && v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().indexOf(s) > -1) {
                            var mods = v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().split(",");
                            _.each(mods, function(mod) {
                                if(mod.indexOf(s) > -1) {
                                    if(mod.indexOf("-") > -1) {
                                        var new_mod = !isNaN(parseInt(mod.replace(/[^0-9]/g, ""), 10)) ? parseInt(mod.replace(/[^0-9]/g, ""), 10) : false;
                                        item_bonus = new_mod ? item_bonus - new_mod : item_bonus;
                                    }
                                    else {
                                        var new_mod = !isNaN(parseInt(mod.replace(/[^0-9]/g, ""), 10)) ? parseInt(mod.replace(/[^0-9]/g, ""), 10) : false;
                                        item_bonus = new_mod ? item_bonus + new_mod : item_bonus;
                                    }
                                };
                            });
                        };
                    });

                    var total = attr_mod + flat + item_bonus;

                    if(v["pb_type"] && v["pb_type"] === "die") {
                        if(v[s + "_prof"] != 0) {
                            type === 1 ? "" : "2"
                            total = total + "+" + type + v["pb"];
                        }
                        else if(v[s + "_prof"] == 0 && jack != 0) {
                            total = total + "+" + jack;
                        };
                    }
                    else {
                        if(v[s + "_prof"] != 0) {
                            total = total + (prof * type);
                        }
                        else if(v[s + "_prof"] == 0 && jack != 0) {
                            total = total + parseInt(jack, 10);
                        };

                    };
                    update[s + "_bonus"] = total;
                });

                setAttrs(update, {silent: true}, function() {callbacks.forEach(function(callback) {callback(); })} );
            });
        });
    };

    var update_tool = function(tool_id) {
        if(tool_id.substring(0,1) === "-" && tool_id.length === 20) {
            do_update_tool([tool_id]);
        }
        else if(tool_id === "all") {
            getSectionIDs("repeating_tool", function(idarray) {
                do_update_tool(idarray);
            });
        }
        else {
            getSectionIDs("repeating_tool", function(idarray) {
                var tool_attribs = [];
                _.each(idarray, function(id) {
                    tool_attribs.push("repeating_tool_" + id + "_toolattr_base");
                });
                getAttrs(tool_attribs, function(v) {
                    var attr_tool_ids = [];
                    _.each(idarray, function(id) {
                        if(v["repeating_tool_" + id + "_toolattr_base"] && v["repeating_tool_" + id + "_toolattr_base"].indexOf(tool_id) > -1) {
                            attr_tool_ids.push(id);
                        }
                    });
                    if(attr_tool_ids.length > 0) {
                        do_update_tool(attr_tool_ids);
                    }
                });
            });
        };
    };

    var do_update_tool = function(tool_array) {
        var tool_attribs = ["pb","pb_type","jack","strength_mod","dexterity_mod","constitution_mod","intelligence_mod","wisdom_mod","charisma_mod"];
        var update = {};
        _.each(tool_array, function(tool_id) {
            tool_attribs.push("repeating_tool_" + tool_id + "_toolbonus_base");
            tool_attribs.push("repeating_tool_" + tool_id + "_tool_mod");
            tool_attribs.push("repeating_tool_" + tool_id + "_toolattr_base");
        });

        getAttrs(tool_attribs, function(v) {
            _.each(tool_array, function(tool_id) {
                console.log("UPDATING TOOL: " + tool_id);
                if(v["repeating_tool_" + tool_id + "_toolattr_base"] && v["repeating_tool_" + tool_id + "_toolattr_base"].substring(0,2) === "?{") {
                    update["repeating_tool_" + tool_id + "_toolattr"] = "QUERY";
                    var mod = "?{Attribute?|Strength,@{strength_mod}|Dexterity,@{dexterity_mod}|Constitution,@{constitution_mod}|Intelligence,@{intelligence_mod}|Wisdom,@{wisdom_mod}|Charisma,@{charisma_mod}}";
                    if(v["repeating_tool_" + tool_id + "_tool_mod"]) {
                        mod = mod + "+" + v["repeating_tool_" + tool_id + "_tool_mod"];
                    }
                }
                else {
                    var attr = v["repeating_tool_" + tool_id + "_toolattr_base"].substring(0, v["repeating_tool_" + tool_id + "_toolattr_base"].length - 5).substr(2);
                    var attr_mod = v[attr + "_mod"] ? parseInt(v[attr + "_mod"], 10) : 0;
                    var tool_mod = v["repeating_tool_" + tool_id + "_tool_mod"] && !isNaN(parseInt(v["repeating_tool_" + tool_id + "_tool_mod"], 10)) ? parseInt(v["repeating_tool_" + tool_id + "_tool_mod"], 10) : 0;
                    var mod = attr_mod + tool_mod;
                    update["repeating_tool_" + tool_id + "_toolattr"] = attr.toUpperCase();
                    if(v["repeating_tool_" + tool_id + "_tool_mod"] && v["repeating_tool_" + tool_id + "_tool_mod"].indexOf("@{") > -1) {
                        update["repeating_tool_" + tool_id + "_toolbonus"] = update["repeating_tool_" + tool_id + "_toolbonus"] + "+" + v["repeating_tool_" + tool_id + "_tool_mod"];
                    }
                    if(!v["repeating_tool_" + tool_id + "_tool_mod"]) {
                        update["repeating_tool_" + tool_id + "_tool_mod"] = 0;
                    }
                };

                if(v["pb_type"] && v["pb_type"] === "die" ) {
                    if(v["repeating_tool_" + tool_id + "_toolbonus_base"] === "(@{pb})") {update["repeating_tool_" + tool_id + "_toolbonus"] = mod + "+" + v.pb}
                    else if(v["repeating_tool_" + tool_id + "_toolbonus_base"] === "(@{pb}*2)") {update["repeating_tool_" + tool_id + "_toolbonus"] = mod + "+2" + v.pb}
                    else if(v["repeating_tool_" + tool_id + "_toolbonus_base"] === "(floor(@{pb}/2))") {update["repeating_tool_" + tool_id + "_toolbonus"] = mod + "+" + v.jack};
                }
                else if(v["repeating_tool_" + tool_id + "_toolattr_base"] && v["repeating_tool_" + tool_id + "_toolattr_base"].substring(0,2) === "?{") {
                    if(v["repeating_tool_" + tool_id + "_toolbonus_base"] === "(@{pb})") {update["repeating_tool_" + tool_id + "_toolbonus"] = mod + "+" + parseInt(v.pb, 10)}
                    else if(v["repeating_tool_" + tool_id + "_toolbonus_base"] === "(@{pb}*2)") {update["repeating_tool_" + tool_id + "_toolbonus"] = mod + "+" + (parseInt(v.pb, 10)*2)}
                    else if(v["repeating_tool_" + tool_id + "_toolbonus_base"] === "(floor(@{pb}/2))") {update["repeating_tool_" + tool_id + "_toolbonus"] = mod + "+" + parseInt(v.jack, 10)};
                }
                else {
                    if(v["repeating_tool_" + tool_id + "_toolbonus_base"] === "(@{pb})") {update["repeating_tool_" + tool_id + "_toolbonus"] = mod + parseInt(v.pb, 10)}
                    else if(v["repeating_tool_" + tool_id + "_toolbonus_base"] === "(@{pb}*2)") {update["repeating_tool_" + tool_id + "_toolbonus"] = mod + (parseInt(v.pb, 10)*2)}
                    else if(v["repeating_tool_" + tool_id + "_toolbonus_base"] === "(floor(@{pb}/2))") {update["repeating_tool_" + tool_id + "_toolbonus"] = mod + parseInt(v.jack, 10)};
                };
            });

            setAttrs(update, {silent: true});
        });
    };

    var handle_drop = function(category, eventinfo) {
        var callbacks = [];
        var update = {};
        var id = generateRowID();

        getAttrs(["drop_name","drop_weight","drop_properties","drop_modifiers","drop_content","drop_itemtype","drop_damage","drop_damagetype","drop_damage2","drop_damagetype2","drop_range","drop_ac","drop_spellritualflag", "drop_spellschool", "drop_spellcastingtime", "drop_spelltarget", "drop_spellcomp", "drop_spellcomp_materials", "drop_spellconcentrationflag", "drop_spellduration", "drop_spellhealing", "drop_spelldmgmod", "drop_spellsave", "drop_spellsavesuccess", "drop_spellhldie", "drop_spellhldietype", "drop_spellhlbonus", "drop_spelllevel", "drop_spell_damage_progression", "drop_attack_type", "drop_speed", "drop_str", "drop_dex", "drop_con", "drop_int", "drop_wis", "drop_cha", "drop_vulnerabilities", "drop_resistances", "drop_immunities", "drop_condition_immunities", "drop_languages", "drop_challenge_rating", "drop_size", "drop_type", "drop_alignment", "drop_hp", "drop_saving_throws", "drop_senses", "drop_passive_perception", "drop_skills", "drop_token_size", "character_id"], function(v) {
            if(category === "Items") {
                update["tab"] = "core";
                if(v.drop_name) {update["repeating_inventory_" + id + "_itemname"] = v.drop_name};
                if(v.drop_weight) {update["repeating_inventory_" + id + "_itemweight"] = v.drop_weight};
                if(v.drop_properties) {update["repeating_inventory_" + id + "_itemproperties"] = v.drop_properties};
                if(v.drop_content) {update["repeating_inventory_" + id + "_itemcontent"] = v.drop_content};
                if(!v.drop_itemtype || v.drop_itemtype == "") {v.drop_itemtype = category};
                var mods = "Item Type: " + v.drop_itemtype;
                if(v.drop_ac && v.drop_ac != "") {
                    mods += ", AC: " + v.drop_ac;
                    callbacks.push( function() {update_ac();} )
                };
                if(v.drop_damage && v.drop_damage != "") {mods += ", Damage: " + v.drop_damage};
                if(v.drop_damagetype && v.drop_damagetype != "") {mods += ", Damage Type: " + v.drop_damagetype};
                if(v.drop_damage2 && v.drop_damage2 != "") {mods += ", Secondary Damage: " + v.drop_damage2};
                if(v.drop_damagetype2 && v.drop_damagetype2 != "") {mods += ", Secondary Damage Type: " + v.drop_damagetype2};
                if(v.drop_range && v.drop_range != "") {mods += ", Range: " + v.drop_range};
                if(v.drop_modifiers && v.drop_modifiers != "") {mods += ", " + v.drop_modifiers};
                update["repeating_inventory_" + id + "_itemmodifiers"] = mods;
                if(v.drop_itemtype.indexOf("Weapon") > -1) {
                    update["repeating_inventory_" + id + "_hasattack"] = 1;
                    callbacks.push( function() {create_attack_from_item(id);} );
                }
                else if(v.drop_itemtype.indexOf("Ammunition") > -1) {
                    update["repeating_inventory_" + id + "_useasresource"] = 1;
                    callbacks.push( function() {create_resource_from_item(id);} );
                };
                if(v["drop_modifiers"]) {
                    callbacks.push( function() {check_itemmodifiers(v["drop_modifiers"]);} );
                };
                callbacks.push( function() {update_weight();} );
            };
            if(category === "Spells") {
                var lvl = v.drop_spelllevel && v.drop_spelllevel > 0 ? v.drop_spelllevel : "cantrip";
                update["repeating_spell-" + lvl + "_" + id + "_spelllevel"] = lvl;
                if(v.drop_name) {update["repeating_spell-" + lvl + "_" + id + "_spellname"] = v.drop_name};
                if(v.drop_spellritualflag) {update["repeating_spell-" + lvl + "_" + id + "_spellritual"] = "{{ritual=1}}"};
                if(v.drop_spellschool) {update["repeating_spell-" + lvl + "_" + id + "_spellschool"] = v.drop_spellschool.toLowerCase()};
                console.log(update);
                if(v.drop_spellcastingtime) {update["repeating_spell-" + lvl + "_" + id + "_spellcastingtime"] = v.drop_spellcastingtime};
                if(v.drop_range) {update["repeating_spell-" + lvl + "_" + id + "_spellrange"] = v.drop_range};
                if(v.drop_spelltarget) {update["repeating_spell-" + lvl + "_" + id + "_spelltarget"] = v.drop_spelltarget};
                if(v.drop_spellcomp) {
                    if(v.drop_spellcomp.toLowerCase().indexOf("v") === -1) {update["repeating_spell-" + lvl + "_" + id + "_spellcomp_v"] = "0"};
                    if(v.drop_spellcomp.toLowerCase().indexOf("s") === -1) {update["repeating_spell-" + lvl + "_" + id + "_spellcomp_s"] = "0"};
                    if(v.drop_spellcomp.toLowerCase().indexOf("m") === -1) {update["repeating_spell-" + lvl + "_" + id + "_spellcomp_m"] = "0"};
                };
                if(v.drop_spellcomp_materials) {update["repeating_spell-" + lvl + "_" + id + "_spellcomp_materials"] = v.drop_spellcomp_materials};
                if(v.drop_spellconcentrationflag) {update["repeating_spell-" + lvl + "_" + id + "_spellconcentration"] = "{{concentration=1}}"};
                if(v.drop_spellduration) {update["repeating_spell-" + lvl + "_" + id + "_spellduration"] = v.drop_spellduration};
                if(v.drop_damage || v.drop_spellhealing) {
                    update["repeating_spell-" + lvl + "_" + id + "_spelloutput"] = "ATTACK";
                    callbacks.push( function() {create_attack_from_spell(lvl, id, v["character_id"]);} );
                }
                else if(v.drop_content && v.drop_content.indexOf("At Higher Levels:") > -1) {
                    var spelllevel = "?{Cast at what level?";
                    for(i = 0; i < 10-lvl; i++) {
                        spelllevel = spelllevel + "|Level " + (parseInt(i, 10) + parseInt(lvl, 10)) + "," + (parseInt(i, 10) + parseInt(lvl, 10));
                    }
                    spelllevel = spelllevel + "}";
                    update["repeating_spell-" + lvl + "_" + id + "_rollcontent"] = "@{wtype}&{template:spell} {{level=@{spellschool} " + spelllevel + "}} {{name=@{spellname}}} {{castingtime=@{spellcastingtime}}} {{range=@{spellrange}}} {{target=@{spelltarget}}} @{spellcomp_v} @{spellcomp_s} @{spellcomp_m} {{material=@{spellcomp_materials}}} {{duration=@{spellduration}}} {{description=@{spelldescription}}} {{athigherlevels=@{spellathigherlevels}}} @{spellritual} {{innate=@{innate}}} @{spellconcentration} @{charname_output}";
                };
                if(v.drop_attack_type) {update["repeating_spell-" + lvl + "_" + id + "_spellattack"] = v.drop_attack_type};
                if(v.drop_damage) {update["repeating_spell-" + lvl + "_" + id + "_spelldamage"] = v.drop_damage};
                if(v.drop_damagetype) {update["repeating_spell-" + lvl + "_" + id + "_spelldamagetype"] = v.drop_damagetype};
                if(v.drop_damage2) {update["repeating_spell-" + lvl + "_" + id + "_spelldamage2"] = v.drop_damage2};
                if(v.drop_damagetype2) {update["repeating_spell-" + lvl + "_" + id + "_spelldamagetype2"] = v.drop_damagetype2};
                if(v.drop_spellhealing) {update["repeating_spell-" + lvl + "_" + id + "_spellhealing"] = v.drop_spellhealing;};
                if(v.drop_spelldmgmod) {update["repeating_spell-" + lvl + "_" + id + "_spelldmgmod"] = v.drop_spelldmgmod};
                if(v.drop_spellsave) {update["repeating_spell-" + lvl + "_" + id + "_spellsave"] = v.drop_spellsave};
                if(v.drop_spellsavesuccess) {update["repeating_spell-" + lvl + "_" + id + "_spellsavesuccess"] = v.drop_spellsavesuccess};
                if(v.drop_spellhldie) {update["repeating_spell-" + lvl + "_" + id + "_spellhldie"] = v.drop_spellhldie};
                if(v.drop_spellhldietype) {update["repeating_spell-" + lvl + "_" + id + "_spellhldietype"] = v.drop_spellhldietype};
                if(v.drop_spellhlbonus) {update["repeating_spell-" + lvl + "_" + id + "_spellhlbonus"] = v.drop_spellhlbonus};
                if(v.drop_spell_damage_progression && lvl == "cantrip") {update["repeating_spell-" + lvl + "_" + id + "_spell_damage_progression"] = v.drop_spell_damage_progression};
                if(v.drop_content && v.drop_content != "") {
                    var content = v.drop_content.split("At Higher Levels:");
                    if(content.length > 1) {
                        update["repeating_spell-" + lvl + "_" + id + "_spelldescription"] = content[0].trim();
                        update["repeating_spell-" + lvl + "_" + id + "_spellathigherlevels"] = content[1].trim();
                    }
                    else {
                        update["repeating_spell-" + lvl + "_" + id + "_spelldescription"] = v.drop_content.trim();
                    }
                };
                update["repeating_spell-" + lvl + "_" + id + "_options-flag"] = "0";
            };
            if(category === "Monsters") {
                update["npc"] = "1";
                update["npc_options-flag"] = "0";
                if(v["drop_name"] && v["drop_name"] != "") {update["npc_name"] = v["drop_name"]};
                update["npc_speed"] = v["drop_speed"] ? v["drop_speed"] : "";
                update["strength_base"] = v["drop_str"] ?  v["drop_str"] : "";
                update["dexterity_base"] = v["drop_dex"] ? v["drop_dex"] : "";
                update["constitution_base"] = v["drop_con"] ? v["drop_con"] : "";
                update["intelligence_base"] = v["drop_int"] ? v["drop_int"] : "";
                update["wisdom_base"] = v["drop_wis"] ? v["drop_wis"] : "";
                update["charisma_base"] = v["drop_cha"] ? v["drop_cha"] : "";
                callbacks.push( function() {update_attr("strength");} );
                callbacks.push( function() {update_attr("dexterity");} );
                callbacks.push( function() {update_attr("constitution");} );
                callbacks.push( function() {update_attr("intelligence");} );
                callbacks.push( function() {update_attr("wisdom");} );
                callbacks.push( function() {update_attr("charisma");} );
                update["npc_vulnerabilities"] = v["drop_vulnerabilities"] ? v["drop_vulnerabilities"] : "";
                update["npc_resistances"] = v["drop_resistances"] ? v["drop_resistances"] : "";
                update["npc_immunities"] = v["drop_immunities"] ? v["drop_immunities"] : "";
                update["npc_condition_immunities"] = v["drop_condition_immunities"] ? v["drop_condition_immunities"] : "";
                update["npc_languages"] = v["drop_languages"] ? v["drop_languages"] : "";
                update["token_size"] = v["drop_token_size"] ? v["drop_token_size"] : "";
                if(v["drop_challenge_rating"] && v["drop_challenge_rating"] != "") {
                    callbacks.push( function() {update_challenge();} );
                    update["npc_challenge"] = v["drop_challenge_rating"];
                }
                else {
                    update["npc_challenge"] = "";
                }

                var type = "";
                if(v["drop_size"]) {type = v["drop_size"]};
                if(v["drop_type"]) {
                    if(type.length > 0) {
                        type = type + " " + v["drop_type"].toLowerCase();
                    }
                    else {
                        type = v["drop_type"].toLowerCase();
                    }
                };
                if(v["drop_alignment"]) {
                    if(type.length > 0) {
                        type = type + ", " + v["drop_alignment"];
                    }
                    else {
                        type = v["drop_alignment"];
                    }
                };
                update["npc_type"] = type;

                if(v["drop_hp"]) {
                    if(v["drop_hp"].indexOf("(") > -1) {
                        update["hp_max"] = v["drop_hp"].split(" (")[0];
                        update["npc_hpformula"] = v["drop_hp"].split(" (")[1].slice(0, -1);
                    }
                    else {
                        update["hp_max"] = v["drop_hp"]
                        update["npc_hpformula"] = ""
                    };
                }
                else {
                    update["hp_max"] = ""
                    update["npc_hpformula"] = ""
                };

                if(v["drop_ac"]) {
                    if(v["drop_ac"].indexOf("(") > -1) {
                        update["npc_ac"] = v["drop_ac"].split(" (")[0];
                        update["npc_actype"] = v["drop_ac"].split(" (")[1].slice(0, -1);
                    }
                    else {
                        update["npc_ac"] = v["drop_ac"];
                        update["npc_actype"] = "";
                    };
                }
                else {
                    update["npc_ac"] = "";
                    update["npc_actype"] = "";
                };

                if(v["drop_hp"]) {
                    if(v["drop_hp"].indexOf("(") > -1) {
                        update["hp_max"] = v["drop_hp"].split(" (")[0];
                        update["npc_hpformula"] = v["drop_hp"].split(" (")[1].slice(0, -1);
                    }
                    else {
                        update["hp_max"] = v["drop_hp"];
                        update["npc_hpformula"] = "";
                    }
                }
                else {
                    update["hp_max"] = "";
                    update["npc_hpformula"] = "";
                };

                var senses = v["drop_senses"] ? v["drop_senses"] : "";
                if(v["drop_passive_perception"]) {
                    if(senses.length > 0) {
                        senses = senses + ", passive Perception " + v["drop_passive_perception"];
                    }
                    else {
                        senses = v["drop_passive_perception"];
                    }
                }
                update["npc_senses"] = senses;

                update["npc_str_save_base"] = "";
                update["npc_dex_save_base"] = "";
                update["npc_con_save_base"] = "";
                update["npc_int_save_base"] = "";
                update["npc_wis_save_base"] = "";
                update["npc_cha_save_base"] = "";
                if(v["drop_saving_throws"] && v["drop_saving_throws"] != "") {
                    var savearray = v["drop_saving_throws"].split(", ");
                    _.each(savearray, function(save) {
                        kv = save.indexOf("-") > -1 ? save.split(" ") : save.split(" +");
                        update["npc_" + kv[0].toLowerCase() + "_save_base"] = parseInt(kv[1], 10);
                    });
                    callbacks.push( function() {update_npc_saves();} );
                };

                update["npc_acrobatics_base"] = "";
                update["npc_animal_handling_base"] = "";
                update["npc_arcana_base"] = "";
                update["npc_athletics_base"] = "";
                update["npc_deception_base"] = "";
                update["npc_history_base"] = "";
                update["npc_insight_base"] = "";
                update["npc_intimidation_base"] = "";
                update["npc_investigation_base"] = "";
                update["npc_medicine_base"] = "";
                update["npc_nature_base"] = "";
                update["npc_perception_base"] = "";
                update["npc_performance_base"] = "";
                update["npc_persuasion_base"] = "";
                update["npc_religion_base"] = "";
                update["npc_sleight_of_hand_base"] = "";
                update["npc_stealth_base"] = "";
                update["npc_survival_base"] = "";
                if(v["drop_skills"] && v["drop_skills"] != "") {
                    skillarray = v["drop_skills"].split(", ");
                    _.each(skillarray, function(skill) {
                        kv = skill.indexOf("-") > -1 ? skill.split(" ") : skill.split(" +");
                        update["npc_" + kv[0].toLowerCase().replace(/ /g, '_') + "_base"] = parseInt(kv[1], 10);
                    });
                    callbacks.push( function() {update_npc_skills();} );
                }

                getSectionIDs("repeating_npcaction-l", function(idarray) {
                    _.each(idarray, function(currentID, i) {
                        removeRepeatingRow("repeating_npcaction-l_" + currentID);
                    });
                });
                getSectionIDs("repeating_npcreaction", function(idarray) {
                    _.each(idarray, function(currentID, i) {
                        removeRepeatingRow("repeating_npcreaction_" + currentID);
                    });
                });
                getSectionIDs("repeating_npcaction", function(idarray) {
                    _.each(idarray, function(currentID, i) {
                        removeRepeatingRow("repeating_npcaction_" + currentID);
                    });
                });
                getSectionIDs("repeating_npctrait", function(idarray) {
                    _.each(idarray, function(currentID, i) {
                        removeRepeatingRow("repeating_npctrait_" + currentID);
                    });
                });

                var contentarray = v["drop_content"];
                if(contentarray && contentarray.indexOf("Legendary Actions") > -1) {
                    if(contentarray.indexOf(/\n Legendary Actions\n/) > -1) {
                        temp = contentarray.split(/\n Legendary Actions\n/)
                    }
                    else {
                        temp = contentarray.split(/Legendary Actions\n/)
                    }
                    var legendaryactionsarray = temp[1];
                    contentarray = temp[0];
                }
                if(contentarray && contentarray.indexOf("Reactions") > -1) {
                    if(contentarray.indexOf(/\n Reactions\n/) > -1) {
                        temp = contentarray.split(/\n Reactions\n/)
                    }
                    else {
                        temp = contentarray.split(/Reactions\n/)
                    }
                    var reactionsarray = temp[1];
                    contentarray = temp[0];
                }
                if(contentarray && contentarray.indexOf("Actions") > -1) {
                    if(contentarray.indexOf("Lair Actions") > -1) {
                        contentarray = contentarray.replace("Lair Actions","Lair Action");
                    }
                    if(contentarray.indexOf(/\n Actions\n/) > -1) {
                        temp = contentarray.split(/\n Actions\n/)
                    }
                    else {
                        temp = contentarray.split(/Actions\n/)
                    }
                    var actionsarray = temp[1];
                    contentarray = temp[0];
                }
                if(contentarray && contentarray.indexOf("Traits") > -1) {
                    if(contentarray.indexOf("Lair Traits") > -1) {
                        contentarray = contentarray.replace("Lair Traits","Lair Trait");
                    }
                    if(contentarray.indexOf(/\n Traits\n/) > -1) {
                        temp = contentarray.split(/\n Traits\n/)
                    }
                    else {
                        temp = contentarray.split(/Traits\n/)
                    }
                    var traitsarray = temp[1];
                    contentarray = temp[0];
                }

                if(traitsarray) {
                    traitsarray = traitsarray.split("**");
                    traitsarray.shift();
                    var traitsobj = {};
                    traitsarray.forEach(function(val, i) {
                        if (i % 2 === 1) return;
                        traitsobj[val] = traitsarray[i + 1];
                    });
                    _.each(traitsobj, function(desc, name) {
                        newrowid = generateRowID();
                        update["repeating_npctrait_" + newrowid + "_name"] = name + ".";
                        if(desc.substring(0,2) === ": " || encodeURI(desc.substring(0,2)) === ":%C2%A0") {
                            desc = desc.substring(2);
                        }
                        update["repeating_npctrait_" + newrowid + "_desc"] = desc.trim();
                        // SPELLCASTING NPCS
                        if(name === "Spellcasting") {
                            var lvl = parseInt(desc.substring(desc.indexOf("-level")-4, desc.indexOf("-level")-2).trim(), 10);
                            lvl = !isNaN(lvl) ? lvl : 1;
                            var ability = desc.match(/casting ability is (.*?) /);
                            ability = ability && ability.length > 1 ? ability[1] : false;
                            ability = ability ? "@{" + ability.toLowerCase() + "_mod}+" : "0*";
                            update["npcspellcastingflag"] = 1;
                            update["spellcasting_ability"] = ability;
                            update["caster_level"] = lvl;
                            update["class"] = "Wizard";
                            update["base_level"] = lvl;
                            update["level"] = lvl;
                            callbacks.push( function() {update_pb();} );
                            callbacks.push( function() {update_spell_slots();} );
                        }
                    });
                }
                if(actionsarray) {
                    actionsarray = actionsarray.split("**");
                    actionsarray.shift();
                    var actionsobj = {};
                    actionsarray.forEach(function(val, i) {
                        if (i % 2 === 1) return;
                        actionsobj[val] = actionsarray[i + 1];
                    });
                    _.each(actionsobj, function(desc, name) {
                        newrowid = generateRowID();
                        update["repeating_npcaction_" + newrowid + "_npc_options-flag"] = "0";
                        update["repeating_npcaction_" + newrowid + "_name"] = name;
                        if(desc.substring(0,2) === ": " || encodeURI(desc.substring(0,2)) === ":%C2%A0") {
                            desc = desc.substring(2);
                        }
                        if(desc.indexOf(" Attack:") > -1) {
                            update["repeating_npcaction_" + newrowid + "_attack_flag"] = "on";
                            update["repeating_npcaction_" + newrowid + "_attack_display_flag"] = "{{attack=1}}";
                            update["repeating_npcaction_" + newrowid + "_attack_options"] = "{{attack=1}}";
                            if(desc.indexOf(" Weapon Attack:") > -1) {
                                attacktype = desc.split(" Weapon Attack:")[0];
                            }
                            else if(desc.indexOf(" Spell Attack:") > -1) {
                                attacktype = desc.split(" Spell Attack:")[0];
                            }
                            else {
                                console.log("FAILED TO IMPORT ATTACK - NO ATTACK TYPE FOUND (Weapon Attack/Spell Attack)");
                                return;
                            }

                            update["repeating_npcaction_" + newrowid + "_attack_type"] = attacktype;
                            if(attacktype === "Melee") {
                                update["repeating_npcaction_" + newrowid + "_attack_range"] = (desc.match(/reach (.*?),/) || ["",""])[1];
                            }
                            else {
                                update["repeating_npcaction_" + newrowid + "_attack_range"] = (desc.match(/range (.*?),/) || ["",""])[1];
                            }
                            update["repeating_npcaction_" + newrowid + "_attack_tohit"] = (desc.match(/\+(.*) to hit/) || ["",""])[1];
                            update["repeating_npcaction_" + newrowid + "_attack_target"] = (desc.match(/\.,(?!.*\.,)(.*)\. Hit:/) || ["",""])[1];
                            if(desc.toLowerCase().indexOf("damage") > -1) {
                                update["repeating_npcaction_" + newrowid + "_attack_damage"] = (desc.match(/\(([^)]+)\)/) || ["",""])[1];
                                update["repeating_npcaction_" + newrowid + "_attack_damagetype"] = (desc.match(/\) (.*?) damage/) || ["",""])[1];
                                if((desc.match(/\(/g) || []).length > 1 && desc.match(/\((?!.*\()([^)]+)\)/)) {
                                    var second_match = desc.match(/\((?!.*\()([^)]+)\)/);
                                    if(second_match[1] && second_match[1].indexOf(" DC") === -1) {
                                        update["repeating_npcaction_" + newrowid + "_attack_damage2"] = (desc.match(/\((?!.*\()([^)]+)\)/) || ["",""])[1];
                                        update["repeating_npcaction_" + newrowid + "_attack_damagetype2"] = (desc.match(/\)(?!.*\)) (.*?) damage/) || ["",""])[1];
                                    };
                                };
                                ctest1 = desc.split("damage.")[1];
                                ctest2 = desc.split("damage, ")[1];
                                if(ctest1 && ctest1.length > 0) {
                                    update["repeating_npcaction_" + newrowid + "_description"] = ctest1.trim();
                                }
                                else if(ctest2 && ctest2.length > 0) {
                                    update["repeating_npcaction_" + newrowid + "_description"] = ctest2.trim();
                                }
                            }
                            else {
                                update["repeating_npcaction_" + newrowid + "_description"] = desc.split("Hit:")[1].trim();
                            }
                        }
                        else {
                            update["repeating_npcaction_" + newrowid + "_description"] = desc;
                        }

                    });
                    callbacks.push( function() {update_npc_action("all");} );
                }
                if(reactionsarray) {
                    update["npcreactionsflag"] = 1;
                    reactionsarray = reactionsarray.split("**");
                    reactionsarray.shift();
                    var reactionsobj = {};
                    reactionsarray.forEach(function(val, i) {
                        if (i % 2 === 1) return;
                        reactionsobj[val] = reactionsarray[i + 1];
                    });
                    _.each(reactionsobj, function(desc, name) {
                        newrowid = generateRowID();
                        update["repeating_npcreaction_" + newrowid + "_name"] = name + ".";
                        if(desc.substring(0,2) === ": " || encodeURI(desc.substring(0,2)) === ":%C2%A0") {
                            desc = desc.substring(2);
                        }
                        update["repeating_npcreaction_" + newrowid + "_desc"] = desc.trim();
                    });
                }
                if(legendaryactionsarray) {
                    update["npc_legendary_actions"] = (legendaryactionsarray.match(/\d+/) || [""])[0];
                    legendaryactionsarray = legendaryactionsarray.split("**");
                    legendaryactionsarray.shift();
                    var actionsobj = {};
                    legendaryactionsarray.forEach(function(val, i) {
                        if (i % 2 === 1) return;
                        actionsobj[val] = legendaryactionsarray[i + 1];
                    });
                    _.each(actionsobj, function(desc, name) {
                        newrowid = generateRowID();
                        update["repeating_npcaction-l_" + newrowid + "_npc_options-flag"] = "0";
                        update["repeating_npcaction-l_" + newrowid + "_name"] = name;
                        if(desc.substring(0,2) === ": " || encodeURI(desc.substring(0,2)) === ":%C2%A0") {
                            desc = desc.substring(2);
                        }
                        if(desc.indexOf(" Attack:") > -1) {
                            update["repeating_npcaction-l_" + newrowid + "_attack_flag"] = "on";
                            update["repeating_npcaction-l_" + newrowid + "_attack_display_flag"] = "{{attack=1}}";
                            update["repeating_npcaction-l_" + newrowid + "_attack_options"] = "{{attack=1}}";
                            if(desc.indexOf(" Weapon Attack:") > -1) {
                                attacktype = desc.split(" Weapon Attack:")[0];
                            }
                            else if(desc.indexOf(" Spell Attack:") > -1) {
                                attacktype = desc.split(" Spell Attack:")[0];
                            }
                            else {
                                console.log("FAILED TO IMPORT ATTACK - NO ATTACK TYPE FOUND (Weapon Attack/Spell Attack)");
                                return;
                            }
                            update["repeating_npcaction-l_" + newrowid + "_attack_type"] = attacktype;
                            if(attacktype === "Melee") {
                                update["repeating_npcaction-l_" + newrowid + "_attack_range"] = (desc.match(/reach (.*?),/) || ["",""])[1];
                            }
                            else {
                                update["repeating_npcaction-l_" + newrowid + "_attack_range"] = (desc.match(/range (.*?),/) || ["",""])[1];
                            }
                            update["repeating_npcaction-l_" + newrowid + "_attack_tohit"] = (desc.match(/\+(.*) to hit/) || ["",""])[1];
                            update["repeating_npcaction-l_" + newrowid + "_attack_target"] = (desc.match(/\.,(?!.*\.,)(.*)\. Hit:/) || ["",""])[1];
                            update["repeating_npcaction-l_" + newrowid + "_attack_damage"] = (desc.match(/\(([^)]+)\)/) || ["",""])[1];
                            update["repeating_npcaction-l_" + newrowid + "_attack_damagetype"] = (desc.match(/\) (.*?) damage/) || ["",""])[1];
                            if((desc.match(/\(/g) || []).length > 1 && (!desc.match(/\((?!.*\()([^)]+)\)/).indexOf(" DC")[1] || desc.match(/\((?!.*\()([^)]+)\)/).indexOf(" DC")[1] === -1)) {
                                update["repeating_npcaction-l_" + newrowid + "_attack_damage2"] = (desc.match(/\((?!.*\()([^)]+)\)/) || ["",""])[1];
                                update["repeating_npcaction-l_" + newrowid + "_attack_damagetype2"] = (desc.match(/\)(?!.*\)) (.*?) damage/) || ["",""])[1];
                            }
                        }
                        else {
                            update["repeating_npcaction-l_" + newrowid + "_description"] = desc;
                        }
                    });
                }
            };

            callbacks.push( function() {cleanup_drop_fields();} );
            setAttrs(update, {silent: true}, function() {callbacks.forEach(function(callback) {callback(); })} );
        });


    };

    var cleanup_drop_fields = function() {
        var update = {};
        update["drop_name"] = "";
        update["drop_weight"] = "";
        update["drop_properties"] = "";
        update["drop_modifiers"] = "";
        update["drop_content"] = "";
        update["drop_itemtype"] = "";
        update["drop_damage"] = "";
        update["drop_damagetype"] = "";
        update["drop_range"] = "";
        update["drop_ac"] = "";
        update["drop_attack_type"] = "";
        update["drop_damage2"] = "";
        update["drop_damagetype2"] = "";
        update["drop_spellritualflag"] = "";
        update["drop_spellschool"] = "";
        update["drop_spellcastingtime"] = "";
        update["drop_spelltarget"] = "";
        update["drop_spellcomp"] = "";
        update["drop_spellcomp_materials"] = "";
        update["drop_spellconcentrationflag"] = "";
        update["drop_spellduration"] = "";
        update["drop_spellhealing"] = "";
        update["drop_spelldmgmod"] = "";
        update["drop_spellsave"] = "";
        update["drop_spellsavesuccess"] = "";
        update["drop_spellhldie"] = "";
        update["drop_spellhldietype"] = "";
        update["drop_spellhlbonus"] = "";
        update["drop_spelllevel"] = "";
        update["drop_spell_damage_progression"] = "";
        update["drop_category"] = "";
        update["drop_speed"] = "";
        update["drop_str"] = "";
        update["drop_dex"] = "";
        update["drop_con"] = "";
        update["drop_int"] = "";
        update["drop_wis"] = "";
        update["drop_cha"] = "";
        update["drop_vulnerabilities"] = "";
        update["drop_resistances"] = "";
        update["drop_immunities"] = "";
        update["drop_condition_immunities"] = "";
        update["drop_languages"] = "";
        update["drop_challenge_rating"] = "";
        update["drop_size"] = "";
        update["drop_type"] = "";
        update["drop_alignment"] = "";
        update["drop_hp"] = "";
        update["drop_saving_throws"] = "";
        update["drop_senses"] = "";
        update["drop_passive_perception"] = "";
        update["drop_skills"] = "";
        update["drop_token_size"] = "";
        update["monster_confirm_flag"] = 0;
        setAttrs(update, {silent: true});
    };

    var check_itemmodifiers = function(modifiers, previousValue) {
        var mods = modifiers.toLowerCase().split(",");
        if(previousValue) {
            prevmods = previousValue.toLowerCase().split(",");
            mods = _.union(mods, prevmods);
        };
        _.each(mods, function(mod) {
            if(mod.indexOf("ac:") > -1 || mod.indexOf("ac +") > -1 || mod.indexOf("ac -") > -1) {update_ac();};
            if(mod.indexOf("spell") > -1) {update_spell_info();};
            if(mod.indexOf("saving throws") > -1) {update_all_saves();};
            if(mod.indexOf("strength save") > -1) {update_save("strength");} else if(mod.indexOf("strength") > -1) {update_attr("strength");};
            if(mod.indexOf("dexterity save") > -1) {update_save("dexterity");} else if(mod.indexOf("dexterity") > -1) {update_attr("dexterity");};
            if(mod.indexOf("constitution save") > -1) {update_save("constitution");} else if(mod.indexOf("constitution") > -1) {update_attr("constitution");};
            if(mod.indexOf("intelligence save") > -1) {update_save("intelligence");} else if(mod.indexOf("intelligence") > -1) {update_attr("intelligence");};
            if(mod.indexOf("wisdom save") > -1) {update_save("wisdom");} else if(mod.indexOf("wisdom") > -1) {update_attr("wisdom");};
            if(mod.indexOf("charisma save") > -1) {update_save("charisma");} else if(mod.indexOf("charisma") > -1) {update_attr("charisma");};
            if(mod.indexOf("acrobatics") > -1) {update_skills(["acrobatics"]);};
            if(mod.indexOf("animal handling") > -1) {update_skills(["animal_handling"]);};
            if(mod.indexOf("arcana") > -1) {update_skills(["arcana"]);};
            if(mod.indexOf("athletics") > -1) {update_skills(["athletics"]);};
            if(mod.indexOf("deception") > -1) {update_skills(["deception"]);};
            if(mod.indexOf("history") > -1) {update_skills(["history"]);};
            if(mod.indexOf("insight") > -1) {update_skills(["insight"]);};
            if(mod.indexOf("intimidation") > -1) {update_skills(["intimidation"]);};
            if(mod.indexOf("investigation") > -1) {update_skills(["investigation"]);};
            if(mod.indexOf("medicine") > -1) {update_skills(["medicine"]);};
            if(mod.indexOf("nature") > -1) {update_skills(["nature"]);};
            if(mod.indexOf("perception") > -1) {update_skills(["perception"]);};
            if(mod.indexOf("performance") > -1) {update_skills(["performance"]);};
            if(mod.indexOf("persuasion") > -1) {update_skills(["persuasion"]);};
            if(mod.indexOf("religion") > -1) {update_skills(["religion"]);};
            if(mod.indexOf("sleight of hand") > -1) {update_skills(["sleight_of_hand"]);};
            if(mod.indexOf("stealth") > -1) {update_skills(["stealth"]);};
            if(mod.indexOf("survival") > -1) {update_skills(["survival"]);};
        });
    };

    var create_attack_from_item = function(itemid) {
        var update = {};
        var newrowid = generateRowID();
        update["repeating_inventory_" + itemid + "_itemattackid"] = newrowid;
        setAttrs(update, {}, update_attack_from_item(itemid, newrowid, true));
    };

    var update_attack_from_item = function(itemid, attackid, newattack) {
        getAttrs(["repeating_inventory_" + itemid + "_itemname","repeating_inventory_" + itemid + "_itemproperties","repeating_inventory_" + itemid + "_itemmodifiers"], function(v) {
            var update = {}; var itemtype; var damage; var damagetype; var damage2; var damagetype2; var attackmod; var damagemod; var range;

            if(newattack) {
                update["repeating_attack_" + attackid + "_options-flag"] = "0";
                update["repeating_attack_" + attackid + "_itemid"] = itemid;
            }

            if(v["repeating_inventory_" + itemid + "_itemmodifiers"] && v["repeating_inventory_" + itemid + "_itemmodifiers"] != "") {
                var mods = v["repeating_inventory_" + itemid + "_itemmodifiers"].split(",");
                _.each(mods, function(mod) {
                    if(mod.indexOf("Item Type:") > -1) {itemtype = mod.split(":")[1].trim()}
                    else if(mod.indexOf("Secondary Damage Type:") > -1) {damagetype2 = mod.split(":")[1].trim()}
                    else if(mod.indexOf("Secondary Damage:") > -1) {damage2 = mod.split(":")[1].trim()}
                    else if(mod.indexOf("Damage Type:") > -1) {damagetype = mod.split(":")[1].trim()}
                    else if(mod.indexOf("Damage:") > -1) {damage = mod.split(":")[1].trim()}
                    else if(mod.indexOf("Range:") > -1) {range = mod.split(":")[1].trim()}
                    else if(mod.indexOf(" Attacks ") > -1) {attackmod = mod.split(" Attacks ")[1].trim()}
                    else if(mod.indexOf(" Damage ") > -1) {damagemod = mod.split(" Damage ")[1].trim()}
                });
            }

            if(v["repeating_inventory_" + itemid + "_itemname"] && v["repeating_inventory_" + itemid + "_itemname"] != "") {
                update["repeating_attack_" + attackid + "_atkname"] = v["repeating_inventory_" + itemid + "_itemname"];
            }
            if(damage) {
                update["repeating_attack_" + attackid + "_dmgbase"] = damage;
            }
            if(damagetype) {
                update["repeating_attack_" + attackid + "_dmgtype"] = damagetype;
            }
            if(damage2) {
                update["repeating_attack_" + attackid + "_dmg2base"] = damage2;
                update["repeating_attack_" + attackid + "_dmg2attr"] = 0;
                update["repeating_attack_" + attackid + "_dmg2flag"] = "{{damage=1}} {{dmg2flag=1}}";
            }
            if(damagetype2) {
                update["repeating_attack_" + attackid + "_dmg2type"] = damagetype2;
            }
            if(range) {
                update["repeating_attack_" + attackid + "_atkrange"] = range;
            }
            if( (itemtype && itemtype.indexOf("Ranged") > -1) || (v["repeating_inventory_" + itemid + "_itemproperties"] && v["repeating_inventory_" + itemid + "_itemproperties"].toLowerCase().indexOf("finesse") > -1) ) {
                update["repeating_attack_" + attackid + "_atkattr_base"] = "@{dexterity_mod}";
                update["repeating_attack_" + attackid + "_dmgattr"] = "@{dexterity_mod}";
            }
            else {
                update["repeating_attack_" + attackid + "_atkattr_base"] = "@{strength_mod}";
                update["repeating_attack_" + attackid + "_dmgattr"] = "@{strength_mod}";
            }
            if(attackmod && damagemod && attackmod == damagemod) {
                update["repeating_attack_" + attackid + "_atkmagic"] = parseInt(attackmod, 10);
            }
            else {
                if(attackmod) {
                    update["repeating_attack_" + attackid + "_atkmod"] = parseInt(attackmod, 10);
                }
                if(damagemod) {
                    update["repeating_attack_" + attackid + "_dmgmod"] = parseInt(attackmod, 10);
                }
            }
            var callback = function() {update_attacks(attackid, "item")};
            setAttrs(update, {silent: true}, callback);
        });
    };

    var create_resource_from_item = function(itemid) {
        var update = {};
        var newrowid = generateRowID();

        getAttrs(["other_resource_name"], function(x) {
            if(!x.other_resource_name || x.other_resource_name == "") {
                update["repeating_inventory_" + itemid + "_itemresourceid"] = "other_resource";
                setAttrs(update, {}, update_resource_from_item(itemid, "other_resource", true));
            }
            else {
                getSectionIDs("repeating_resource", function(idarray) {
                    if(idarray.length == 0) {
                        update["repeating_inventory_" + itemid + "_itemresourceid"] = newrowid + "_resource_left";
                        setAttrs(update, {}, update_resource_from_item(itemid, newrowid + "_resource_left", true));
                    }
                    else {
                        var resource_names = [];
                        _.each(idarray, function(currentID, i) {
                            resource_names.push("repeating_resource_" + currentID + "_resource_left_name");
                            resource_names.push("repeating_resource_" + currentID + "_resource_right_name");
                        });

                        getAttrs(resource_names, function(y) {
                            var existing = false;
                            _.each(idarray, function(currentID, i) {
                                if((!y["repeating_resource_" + currentID + "_resource_left_name"] || y["repeating_resource_" + currentID + "_resource_left_name"] === "") && existing == false) {
                                    update["repeating_inventory_" + itemid + "_itemresourceid"] = currentID + "_resource_left";
                                    setAttrs(update, {}, update_resource_from_item(itemid, currentID + "_resource_left", true));
                                    existing = true;
                                }
                                else if((!y["repeating_resource_" + currentID + "_resource_right_name"] || y["repeating_resource_" + currentID + "_resource_right_name"] === "") && existing == false) {
                                    update["repeating_inventory_" + itemid + "_itemresourceid"] = currentID + "_resource_right";
                                    setAttrs(update, {}, update_resource_from_item(itemid, currentID + "_resource_right", true));
                                    existing = true;
                                };
                            });
                            if(!existing) {
                                update["repeating_inventory_" + itemid + "_itemresourceid"] = newrowid + "_resource_left";
                                setAttrs(update, {}, update_resource_from_item(itemid, newrowid + "_resource_left", true));
                            }
                        });

                    };
                });
            };
        });

    };

    var update_resource_from_item = function(itemid, resourceid, newresource) {
        getAttrs(["repeating_inventory_" + itemid + "_itemname","repeating_inventory_" + itemid + "_itemcount"], function(v) {
            var update = {}; var id;

            if(resourceid && resourceid == "other_resource") {
                id = resourceid;
            }
            else {
                id = "repeating_resource_" + resourceid;
            };

            if(newresource) {
                update[id + "_itemid"] = itemid;
            } ;

            if(!v["repeating_inventory_" + itemid + "_itemname"]) {
                update["repeating_inventory_" + itemid + "_useasresource"] = 0;
                update["repeating_inventory_" + itemid + "_itemresourceid"] = "";
                remove_resource(resourceid);
            };
            if(v["repeating_inventory_" + itemid + "_itemname"] && v["repeating_inventory_" + itemid + "_itemname"] != "") {
                update[id + "_name"] = v["repeating_inventory_" + itemid + "_itemname"];
            };
            if(v["repeating_inventory_" + itemid + "_itemcount"] && v["repeating_inventory_" + itemid + "_itemcount"] != "") {
                update[id] = v["repeating_inventory_" + itemid + "_itemcount"];
            };

            setAttrs(update, {silent: true});

        });
    };

    var update_item_from_resource = function(resourceid, itemid) {
        var update = {};
        getAttrs([resourceid, resourceid + "_name"], function(v) {
            update["repeating_inventory_" + itemid + "_itemcount"] = v[resourceid];
            update["repeating_inventory_" + itemid + "_itemname"] = v[resourceid + "_name"];
            setAttrs(update, {silent: true}, function() {update_weight()});
        });
    };

    var create_attack_from_spell = function(lvl, spellid, character_id) {
        var update = {};
        var newrowid = generateRowID();
        update["repeating_spell-" + lvl + "_" + spellid + "_spellattackid"] = newrowid;
        update["repeating_spell-" + lvl + "_" + spellid + "_rollcontent"] = "%{" + character_id + "|repeating_attack_" + newrowid + "_attack}";
        setAttrs(update, {}, update_attack_from_spell(lvl, spellid, newrowid, true));
    }

    var update_attack_from_spell = function(lvl, spellid, attackid, newattack) {
        getAttrs(["repeating_spell-" + lvl + "_" + spellid + "_spellname", "repeating_spell-" + lvl + "_" + spellid + "_spellrange", "repeating_spell-" + lvl + "_" + spellid + "_spelltarget", "repeating_spell-" + lvl + "_" + spellid + "_spellattack", "repeating_spell-" + lvl + "_" + spellid + "_spelldamage", "repeating_spell-" + lvl + "_" + spellid + "_spelldamage2", "repeating_spell-" + lvl + "_" + spellid + "_spelldamagetype", "repeating_spell-" + lvl + "_" + spellid + "_spelldamagetype2", "repeating_spell-" + lvl + "_" + spellid + "_spellhealing", "repeating_spell-" + lvl + "_" + spellid + "_spelldmgmod", "repeating_spell-" + lvl + "_" + spellid + "_spellsave", "repeating_spell-" + lvl + "_" + spellid + "_spellsavesuccess", "repeating_spell-" + lvl + "_" + spellid + "_spellhldie", "repeating_spell-" + lvl + "_" + spellid + "_spellhldietype", "repeating_spell-" + lvl + "_" + spellid + "_spellhlbonus", "repeating_spell-" + lvl + "_" + spellid + "_spelllevel", "repeating_spell-" + lvl + "_" + spellid + "_includedesc", "repeating_spell-" + lvl + "_" + spellid + "_spelldescription", "repeating_spell-" + lvl + "_" + spellid + "_spellathigherlevels", "repeating_spell-" + lvl + "_" + spellid + "_spell_damage_progression", "repeating_spell-" + lvl + "_" + spellid + "_innate", "spellcasting_ability"], function(v) {
            var update = {};
            var description = "";

            if(newattack) {
                update["repeating_attack_" + attackid + "_options-flag"] = "0";
                update["repeating_attack_" + attackid + "_spellid"] = spellid;
                update["repeating_attack_" + attackid + "_spelllevel"] = lvl;
            }

            if(v["repeating_spell-" + lvl + "_" + spellid + "_spellname"] && v["repeating_spell-" + lvl + "_" + spellid + "_spellname"] != "") {
                update["repeating_attack_" + attackid + "_atkname"] = v["repeating_spell-" + lvl + "_" + spellid + "_spellname"];
            }
            if(!v["repeating_spell-" + lvl + "_" + spellid + "_spellattack"] || v["repeating_spell-" + lvl + "_" + spellid + "_spellattack"] === "None") {
                update["repeating_attack_" + attackid + "_atkflag"] = "0";
            }
            else {
                update["repeating_attack_" + attackid + "_atkattr_base"] = v.spellcasting_ability.slice(0, -1);
                update["repeating_attack_" + attackid + "_atkflag"] = "{{attack=1}}";
                description = description + v["repeating_spell-" + lvl + "_" + spellid + "_spellattack"] + " Spell Attack. ";
            }
            if(v["repeating_spell-" + lvl + "_" + spellid + "_spelldamage"] && v["repeating_spell-" + lvl + "_" + spellid + "_spelldamage"] != "") {
                update["repeating_attack_" + attackid + "_dmgflag"] = "{{damage=1}} {{dmg1flag=1}}";
                if(v["repeating_spell-" + lvl + "_" + spellid + "_spell_damage_progression"] && v["repeating_spell-" + lvl + "_" + spellid + "_spell_damage_progression"] === "Cantrip Dice") {
                    update["repeating_attack_" + attackid + "_dmgbase"] = "[[round((@{level} + 1) / 6 + 0.5)]]" + v["repeating_spell-" + lvl + "_" + spellid + "_spelldamage"].substring(1);
                }
                else {
                    update["repeating_attack_" + attackid + "_dmgbase"] = v["repeating_spell-" + lvl + "_" + spellid + "_spelldamage"];
                }
            }
            else {
                update["repeating_attack_" + attackid + "_dmgflag"] = "0"
            }
            if(v["repeating_spell-" + lvl + "_" + spellid + "_spelldmgmod"] && v["repeating_spell-" + lvl + "_" + spellid + "_spelldmgmod"] === "Yes") {
                update["repeating_attack_" + attackid + "_dmgattr"] = v.spellcasting_ability.slice(0, -1);
            }
            else {
                update["repeating_attack_" + attackid + "_dmgattr"] = "0";
            }
            if(v["repeating_spell-" + lvl + "_" + spellid + "_spelldamagetype"]) {
                update["repeating_attack_" + attackid + "_dmgtype"] = v["repeating_spell-" + lvl + "_" + spellid + "_spelldamagetype"];
            }
            else {
                update["repeating_attack_" + attackid + "_dmgtype"] = "";
            }
            if(v["repeating_spell-" + lvl + "_" + spellid + "_spelldamage2"]) {
                update["repeating_attack_" + attackid + "_dmg2base"] = v["repeating_spell-" + lvl + "_" + spellid + "_spelldamage2"];
                update["repeating_attack_" + attackid + "_dmg2attr"] = 0;
                update["repeating_attack_" + attackid + "_dmg2flag"] = "{{damage=1}} {{dmg2flag=1}}";
            }
            else {
                update["repeating_attack_" + attackid + "_dmg2base"] = "";
                update["repeating_attack_" + attackid + "_dmg2attr"] = 0;
                update["repeating_attack_" + attackid + "_dmg2flag"] = "0";
            }
            if(v["repeating_spell-" + lvl + "_" + spellid + "_spelldamagetype2"]) {
                update["repeating_attack_" + attackid + "_dmg2type"] = v["repeating_spell-" + lvl + "_" + spellid + "_spelldamagetype2"];
            }
            else {
                update["repeating_attack_" + attackid + "_dmg2type"] = "";
            }
            if(v["repeating_spell-" + lvl + "_" + spellid + "_spellrange"]) {
                update["repeating_attack_" + attackid + "_atkrange"] = v["repeating_spell-" + lvl + "_" + spellid + "_spellrange"];
            }
            else {
                update["repeating_attack_" + attackid + "_atkrange"] = "";
            }
            if(v["repeating_spell-" + lvl + "_" + spellid + "_spellrange"]) {
                update["repeating_attack_" + attackid + "_atkrange"] = v["repeating_spell-" + lvl + "_" + spellid + "_spellrange"];
            }
            else {
                update["repeating_attack_" + attackid + "_atkrange"] = "";
            }
            if(v["repeating_spell-" + lvl + "_" + spellid + "_spellsave"]) {
                update["repeating_attack_" + attackid + "_saveflag"] = "{{save=1}} {{saveattr=@{saveattr}}} {{savedesc=@{saveeffect}}} {{savedc=[[[[@{savedc}]][SAVE]]]}}";
                update["repeating_attack_" + attackid + "_saveattr"] = v["repeating_spell-" + lvl + "_" + spellid + "_spellsave"];
            }
            else {
                update["repeating_attack_" + attackid + "_saveflag"] = "0";
            }
            if(v["repeating_spell-" + lvl + "_" + spellid + "_spellsavesuccess"]) {
                update["repeating_attack_" + attackid + "_saveeffect"] = v["repeating_spell-" + lvl + "_" + spellid + "_spellsavesuccess"];
            }
            else {
                update["repeating_attack_" + attackid + "_saveeffect"] = "";
            }
            if(v["repeating_spell-" + lvl + "_" + spellid + "_spellhldie"] && v["repeating_spell-" + lvl + "_" + spellid + "_spellhldie"] != "" && v["repeating_spell-" + lvl + "_" + spellid + "_spellhldietype"] && v["repeating_spell-" + lvl + "_" + spellid + "_spellhldietype"] != "") {
                var bonus = "";
                var spelllevel = v["repeating_spell-" + lvl + "_" + spellid + "_spelllevel"];
                var query = "?{Cast at what level?";
                for(i = 0; i < 10-spelllevel; i++) {
                    query = query + "|Level " + (parseInt(i, 10) + parseInt(spelllevel, 10)) + "," + i;
                }
                query = query + "}";
                if(v["repeating_spell-" + lvl + "_" + spellid + "_spellhlbonus"] && v["repeating_spell-" + lvl + "_" + spellid + "_spellhlbonus"] != "") {
                    bonus = "+(" + v["repeating_spell-" + lvl + "_" + spellid + "_spellhlbonus"] + "*" + query + ")";
                }
                update["repeating_attack_" + attackid + "_hldmg"] = "{{hldmg=[[(" + v["repeating_spell-" + lvl + "_" + spellid + "_spellhldie"] + "*" + query + ")" + v["repeating_spell-" + lvl + "_" + spellid + "_spellhldietype"] + bonus + "]]}}";
            }
            else {
                update["repeating_attack_" + attackid + "_hldmg"] = "";
            }
            if(v["repeating_spell-" + lvl + "_" + spellid + "_spellhealing"] && v["repeating_spell-" + lvl + "_" + spellid + "_spellhealing"] != "") {
                if(!v["repeating_spell-" + lvl + "_" + spellid + "_spelldamage"] || v["repeating_spell-" + lvl + "_" + spellid + "_spelldamage"] === "") {
                    update["repeating_attack_" + attackid + "_dmgbase"] = v["repeating_spell-" + lvl + "_" + spellid + "_spellhealing"];
                    update["repeating_attack_" + attackid + "_dmgflag"] = "{{damage=1}} {{dmg1flag=1}}";
                    update["repeating_attack_" + attackid + "_dmgtype"] = "Healing";
                }
                else if(!v["repeating_spell-" + lvl + "_" + spellid + "_spelldamage2"] || v["repeating_spell-" + lvl + "_" + spellid + "_spelldamage2"] === "") {
                    update["repeating_attack_" + attackid + "_dmg2base"] = v["repeating_spell-" + lvl + "_" + spellid + "_spellhealing"];
                    update["repeating_attack_" + attackid + "_dmg2flag"] = "{{damage=1}} {{dmg2flag=1}}";
                    update["repeating_attack_" + attackid + "_dmg2type"] = "Healing";
                }
            }
            if(v["repeating_spell-" + lvl + "_" + spellid + "_innate"]) {
                update["repeating_attack_" + attackid + "_spell_innate"] = v["repeating_spell-" + lvl + "_" + spellid + "_innate"];
            }
            else {
                update["repeating_attack_" + attackid + "_spell_innate"] = "";
            }
            if(v["repeating_spell-" + lvl + "_" + spellid + "_spelltarget"]) {
                description = description + v["repeating_spell-" + lvl + "_" + spellid + "_spelltarget"] + ". ";
            }
            if(v["repeating_spell-" + lvl + "_" + spellid + "_includedesc"] && v["repeating_spell-" + lvl + "_" + spellid + "_includedesc"] === "on") {
                description = v["repeating_spell-" + lvl + "_" + spellid + "_spelldescription"];
                if(v["repeating_spell-" + lvl + "_" + spellid + "_spellathigherlevels"] && v["repeating_spell-" + lvl + "_" + spellid + "_spellathigherlevels"] != "") {
                    description = description + "\n\nAt Higher Levels: " + v["repeating_spell-" + lvl + "_" + spellid + "_spellathigherlevels"];
                }
            }
            else if(v["repeating_spell-" + lvl + "_" + spellid + "_includedesc"] && v["repeating_spell-" + lvl + "_" + spellid + "_includedesc"] === "off") {
                description = "";
            };
            update["repeating_attack_" + attackid + "_atk_desc"] = description;

            var callback = function() {update_attacks(attackid, "spell")};
            setAttrs(update, {silent: true}, callback);
        });
    };

    var update_attacks = function(update_id, source) {
        console.log("DOING UPDATE_ATTACKS: " + update_id);
        if(update_id.substring(0,1) === "-" && update_id.length === 20) {
            do_update_attack([update_id], source);
        }
        else if(["strength","dexterity","constitution","intelligence","wisdom","charisma","spells","all"].indexOf(update_id) > -1) {
            getSectionIDs("repeating_attack", function(idarray) {
                if(update_id === "all") {
                    do_update_attack(idarray);
                }
                else if(update_id === "spells") {
                    var attack_attribs = [];
                    _.each(idarray, function(id) {
                        attack_attribs.push("repeating_attack_" + id + "_spellid");
                    });
                    getAttrs(attack_attribs, function(v) {
                        var attr_attack_ids = [];
                        _.each(idarray, function(id) {
                            if(v["repeating_attack_" + id + "_spellid"] && v["repeating_attack_" + id + "_spellid"] != "") {
                                attr_attack_ids.push(id);
                            }
                        });
                        if(attr_attack_ids.length > 0) {
                            do_update_attack(attr_attack_ids);
                        }
                    });

                }
                else {
                    var attack_attribs = ["spellcasting_ability"];
                    _.each(idarray, function(id) {
                        attack_attribs.push("repeating_attack_" + id + "_atkattr_base");
                        attack_attribs.push("repeating_attack_" + id + "_dmgattr");
                        attack_attribs.push("repeating_attack_" + id + "_dmg2attr");
                        attack_attribs.push("repeating_attack_" + id + "_savedc");
                    });
                    getAttrs(attack_attribs, function(v) {
                        var attr_attack_ids = [];
                        _.each(idarray, function(id) {
                            if((v["repeating_attack_" + id + "_atkattr_base"] && v["repeating_attack_" + id + "_atkattr_base"].indexOf(update_id) > -1) || (v["repeating_attack_" + id + "_dmgattr"] && v["repeating_attack_" + id + "_dmgattr"].indexOf(update_id) > -1) || (v["repeating_attack_" + id + "_dmg2attr"] && v["repeating_attack_" + id + "_dmg2attr"].indexOf(update_id) > -1) || (v["repeating_attack_" + id + "_savedc"] && v["repeating_attack_" + id + "_savedc"].indexOf(update_id) > -1) || (v["repeating_attack_" + id + "_savedc"] && v["repeating_attack_" + id + "_savedc"] === "(@{spell_save_dc})" && v["spellcasting_ability"] && v["spellcasting_ability"].indexOf(update_id) > -1)) {
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
        var attack_attribs = ["level","d20","pb","pb_type","pbd_safe","dtype","globalmagicmod","strength_mod","dexterity_mod","constitution_mod","intelligence_mod","wisdom_mod","charisma_mod","spellcasting_ability","spell_save_dc","spell_attack_mod"];
        _.each(attack_array, function(attackid) {
            attack_attribs.push("repeating_attack_" + attackid + "_atkflag");
            attack_attribs.push("repeating_attack_" + attackid + "_atkname");
            attack_attribs.push("repeating_attack_" + attackid + "_atkattr_base");
            attack_attribs.push("repeating_attack_" + attackid + "_atkmod");
            attack_attribs.push("repeating_attack_" + attackid + "_atkprofflag");
            attack_attribs.push("repeating_attack_" + attackid + "_atkmagic");
            attack_attribs.push("repeating_attack_" + attackid + "_dmgflag");
            attack_attribs.push("repeating_attack_" + attackid + "_dmgbase");
            attack_attribs.push("repeating_attack_" + attackid + "_dmgattr");
            attack_attribs.push("repeating_attack_" + attackid + "_dmgmod");
            attack_attribs.push("repeating_attack_" + attackid + "_dmgtype");
            attack_attribs.push("repeating_attack_" + attackid + "_dmg2flag");
            attack_attribs.push("repeating_attack_" + attackid + "_dmg2base");
            attack_attribs.push("repeating_attack_" + attackid + "_dmg2attr");
            attack_attribs.push("repeating_attack_" + attackid + "_dmg2mod");
            attack_attribs.push("repeating_attack_" + attackid + "_dmg2type");
            attack_attribs.push("repeating_attack_" + attackid + "_dmgcustcrit");
            attack_attribs.push("repeating_attack_" + attackid + "_dmg2custcrit");
            attack_attribs.push("repeating_attack_" + attackid + "_saveflag");
            attack_attribs.push("repeating_attack_" + attackid + "_savedc");
            attack_attribs.push("repeating_attack_" + attackid + "_saveeffect");
            attack_attribs.push("repeating_attack_" + attackid + "_saveflat");
            attack_attribs.push("repeating_attack_" + attackid + "_hldmg");
            attack_attribs.push("repeating_attack_" + attackid + "_spellid");
            attack_attribs.push("repeating_attack_" + attackid + "_spelllevel");
            attack_attribs.push("repeating_attack_" + attackid + "_atkrange");
            attack_attribs.push("repeating_attack_" + attackid + "_itemid");
            attack_attribs.push("repeating_attack_" + attackid + "_ammo");
            attack_attribs.push("repeating_attack_" + attackid + "_global_damage_mod_field");
        });

        getAttrs(attack_attribs, function(v) {
            _.each(attack_array, function(attackid) {
                console.log("UPDATING ATTACK: " + attackid);
                var callbacks = [];
                var update = {};
                var hbonus = "";
                var hdmg1 = "";
                var hdmg2 = "";
                var dmg = "";
                var dmg2 = "";
                var rollbase = "";
                var spellattack = false;
                var magicattackmod = 0;
                var pbd_safe = v["pbd_safe"] ? v["pbd_safe"] : "";
                var global_crit = v["repeating_attack_" + attackid + "_global_damage_mod_field"] && v["repeating_attack_" + attackid + "_global_damage_mod_field"] != "" ? "@{global_damage_mod_crit}" : "";
                var hldmgcrit = v["repeating_attack_" + attackid + "_hldmg"] && v["repeating_attack_" + attackid + "_hldmg"] != "" ? v["repeating_attack_" + attackid + "_hldmg"].slice(0, 7) + "crit" + v["repeating_attack_" + attackid + "_hldmg"].slice(7) : "";
                if(v["repeating_attack_" + attackid + "_spellid"] && v["repeating_attack_" + attackid + "_spellid"] != "") {
                    spellattack = true;
                    magicattackmod = v["spell_attack_mod"] && !isNaN(parseInt(v["spell_attack_mod"],10)) ? parseInt(v["spell_attack_mod"],10) : 0;
                };
                if(!v["repeating_attack_" + attackid + "_atkattr_base"] || v["repeating_attack_" + attackid + "_atkattr_base"] === "0") {atkattr_base = 0} else {atkattr_base = parseInt(v[v["repeating_attack_" + attackid + "_atkattr_base"].substring(2, v["repeating_attack_" + attackid + "_atkattr_base"].length - 1)], 10)};

                if(!v["repeating_attack_" + attackid + "_dmgattr"] || v["repeating_attack_" + attackid + "_dmgattr"] === "0") {dmgattr = 0} else {dmgattr = parseInt(v[v["repeating_attack_" + attackid + "_dmgattr"].substring(2, v["repeating_attack_" + attackid + "_dmgattr"].length - 1)], 10)};
                if(!v["repeating_attack_" + attackid + "_dmg2attr"] || v["repeating_attack_" + attackid + "_dmg2attr"] === "0") {dmg2attr = 0} else {dmg2attr = parseInt(v[v["repeating_attack_" + attackid + "_dmg2attr"].substring(2, v["repeating_attack_" + attackid + "_dmg2attr"].length - 1)], 10)};
                var dmgbase = v["repeating_attack_" + attackid + "_dmgbase"] && v["repeating_attack_" + attackid + "_dmgbase"] != "" ? v["repeating_attack_" + attackid + "_dmgbase"] : 0;
                var dmg2base = v["repeating_attack_" + attackid + "_dmg2base"] && v["repeating_attack_" + attackid + "_dmg2base"] != "" ? v["repeating_attack_" + attackid + "_dmg2base"] : 0;
                var dmgmod = v["repeating_attack_" + attackid + "_dmgmod"] && isNaN(parseInt(v["repeating_attack_" + attackid + "_dmgmod"],10)) === false ? parseInt(v["repeating_attack_" + attackid + "_dmgmod"],10) : 0;
                var dmg2mod = v["repeating_attack_" + attackid + "_dmg2mod"] && isNaN(parseInt(v["repeating_attack_" + attackid + "_dmg2mod"],10)) === false ? parseInt(v["repeating_attack_" + attackid + "_dmg2mod"],10) : 0;
                var dmgtype = v["repeating_attack_" + attackid + "_dmgtype"] ? v["repeating_attack_" + attackid + "_dmgtype"] + " " : "";
                var dmg2type = v["repeating_attack_" + attackid + "_dmg2type"] ? v["repeating_attack_" + attackid + "_dmg2type"] + " " : "";
                var pb = v["repeating_attack_" + attackid + "_atkprofflag"] && v["repeating_attack_" + attackid + "_atkprofflag"] != 0 && v.pb ? v.pb : 0;
                var atkmod = v["repeating_attack_" + attackid + "_atkmod"] && v["repeating_attack_" + attackid + "_atkmod"] != "" ? parseInt(v["repeating_attack_" + attackid + "_atkmod"],10) : 0;
                var atkmag = v["repeating_attack_" + attackid + "_atkmagic"] && v["repeating_attack_" + attackid + "_atkmagic"] != "" ? parseInt(v["repeating_attack_" + attackid + "_atkmagic"],10) : 0;
                var dmgmag = isNaN(atkmag) === false && atkmag != 0 && ((v["repeating_attack_" + attackid + "_dmgflag"] && v["repeating_attack_" + attackid + "_dmgflag"] != 0) || (v["repeating_attack_" + attackid + "_dmg2flag"] && v["repeating_attack_" + attackid + "_dmg2flag"] != 0)) ? "+ " + atkmag + " Magic Bonus" : "";
                if(v["repeating_attack_" + attackid + "_atkflag"] && v["repeating_attack_" + attackid + "_atkflag"] != 0) {
                    bonus_mod = atkattr_base + atkmod + atkmag + magicattackmod;
                    if(v["pb_type"] && v["pb_type"] === "die") {
                        plus_minus = bonus_mod > -1 ? "+" : "";
                        bonus = bonus_mod + "+" + pb;
                    }
                    else {
                        bonus_mod = bonus_mod + parseInt(pb, 10);
                        plus_minus = bonus_mod > -1 ? "+" : "";
                        bonus = plus_minus + bonus_mod;
                    };
                }
                else if(v["repeating_attack_" + attackid + "_saveflag"] && v["repeating_attack_" + attackid + "_saveflag"] != 0) {
                    if(!v["repeating_attack_" + attackid + "_savedc"] || (v["repeating_attack_" + attackid + "_savedc"] && v["repeating_attack_" + attackid + "_savedc"] === "(@{spell_save_dc})")) {
                        var tempdc = v["spell_save_dc"];
                    }
                    else if(v["repeating_attack_" + attackid + "_savedc"] && v["repeating_attack_" + attackid + "_savedc"] === "(@{saveflat})") {
                        var tempdc = isNaN(parseInt(v["repeating_attack_" + attackid + "_saveflat"])) === false ? parseInt(v["repeating_attack_" + attackid + "_saveflat"]) : "0";
                    }
                    else {
                        var savedcattr = v["repeating_attack_" + attackid + "_savedc"].replace(/^[^{]*{/,"").replace(/\_.*$/,"");
                        var safe_pb = v["pb_type"] && v["pb_type"] === "die" ? parseInt(pb.substring(1), 10) / 2 : parseInt(pb,10);
                        var safe_attr = v[savedcattr + "_mod"] ? parseInt(v[savedcattr + "_mod"],10) : 0;
                        var tempdc = 8 + safe_attr + safe_pb;
                    };
                    bonus = "DC" + tempdc;
                }
                else {
                    bonus = "-";
                }
                if(v["repeating_attack_" + attackid + "_dmgflag"] && v["repeating_attack_" + attackid + "_dmgflag"] != 0) {
                    if(spellattack === true && dmgbase.indexOf("[[round((@{level} + 1) / 6 + 0.5)]]") > -1) {
                        // SPECIAL CANTRIP DAMAGE
                        dmgdiestring = Math.round(((parseInt(v["level"], 10) + 1) / 6) + 0.5).toString()
                        dmg = dmgdiestring + dmgbase.substring(dmgbase.lastIndexOf("d"));
                        if(dmgattr + dmgmod != 0) {
                            dmg = dmg + "+" + (dmgattr + dmgmod);
                        }
                        dmg = dmg + " " + dmgtype;
                    }
                    else {
                        if(dmgbase === 0 && (dmgattr + dmgmod === 0)){
                            dmg = 0;
                        }
                        if(dmgbase != 0) {
                            dmg = dmgbase;
                        }
                        if(dmgbase != 0 && (dmgattr + dmgmod != 0)){
                            dmg = dmgattr + dmgmod > 0 ? dmg + "+" : dmg;
                        }
                        if(dmgattr + dmgmod != 0) {
                            dmg = dmg + (dmgattr + dmgmod);
                        }
                        dmg = dmg + " " + dmgtype;
                    }
                }
                else {
                    dmg = "";
                };
                if(v["repeating_attack_" + attackid + "_dmg2flag"] && v["repeating_attack_" + attackid + "_dmg2flag"] != 0) {
                    if(dmg2base === 0 && (dmg2attr + dmg2mod === 0)){
                        dmg2 = 0;
                    }
                    if(dmg2base != 0) {
                        dmg2 = dmg2base;
                    }
                    if(dmg2base != 0 && (dmg2attr + dmg2mod != 0)){
                        dmg2 = dmg2attr + dmg2mod > 0 ? dmg2 + "+" : dmg2;
                    }
                    if(dmg2attr + dmg2mod != 0) {
                        dmg2 = dmg2 + (dmg2attr + dmg2mod);
                    }
                    dmg2 = dmg2 + " " + dmg2type;
                }
                else {
                    dmg2 = "";
                };
                dmgspacer = v["repeating_attack_" + attackid + "_dmgflag"] && v["repeating_attack_" + attackid + "_dmgflag"] != 0 && v["repeating_attack_" + attackid + "_dmg2flag"] && v["repeating_attack_" + attackid + "_dmg2flag"] != 0 ? "+ " : "";
                crit1 = v["repeating_attack_" + attackid + "_dmgcustcrit"] && v["repeating_attack_" + attackid + "_dmgcustcrit"] != "" ? v["repeating_attack_" + attackid + "_dmgcustcrit"] : dmgbase;
                crit2 = v["repeating_attack_" + attackid + "_dmg2custcrit"] && v["repeating_attack_" + attackid + "_dmg2custcrit"] != "" ? v["repeating_attack_" + attackid + "_dmg2custcrit"] : dmg2base;
                r1 = v["repeating_attack_" + attackid + "_atkflag"] && v["repeating_attack_" + attackid + "_atkflag"] != 0 ? "@{d20}" : "0d20";
                r2 = v["repeating_attack_" + attackid + "_atkflag"] && v["repeating_attack_" + attackid + "_atkflag"] != 0 ? "@{rtype}" : "{{r2=[[0d20";
                if(v["repeating_attack_" + attackid + "_atkflag"] && v["repeating_attack_" + attackid + "_atkflag"] != 0) {
                    if(magicattackmod != 0) {hbonus = " + " + magicattackmod + "[SPELLATK]" + hbonus};
                    if(atkmag != 0) {hbonus = " + " + atkmag + "[MAGIC]" + hbonus};
                    if(pb != 0) {hbonus = " + " + pb + pbd_safe + "[PROF]" + hbonus};
                    if(atkmod != 0) {hbonus = " + " + atkmod + "[MOD]" + hbonus};
                    if(atkattr_base != 0) {hbonus = " + " + atkattr_base + "[" + v["repeating_attack_" + attackid + "_atkattr_base"].substring(2, 5).toUpperCase() + "]" + hbonus};
                }
                else {
                    hbonus = "";
                }
                if(v["repeating_attack_" + attackid + "_dmgflag"] && v["repeating_attack_" + attackid + "_dmgflag"] != 0) {
                    if(atkmag != 0) {hdmg1 = " + " + atkmag + "[MAGIC]" + hdmg1};
                    if(dmgmod != 0) {hdmg1 = " + " + dmgmod + "[MOD]" + hdmg1};
                    if(dmgattr != 0) {hdmg1 = " + " + dmgattr + "[" + v["repeating_attack_" + attackid + "_dmgattr"].substring(2, 5).toUpperCase() + "]" + hdmg1};
                    hdmg1 = dmgbase + hdmg1;
                }
                else {
                    hdmg1 = "0";
                }
                if(v["repeating_attack_" + attackid + "_dmg2flag"] && v["repeating_attack_" + attackid + "_dmg2flag"] != 0) {
                    if(dmg2mod != 0) {hdmg2 = " + " + dmg2mod + "[MOD]" + hdmg2};
                    if(dmg2attr != 0) {hdmg2 = " + " + dmg2attr + "[" + v["repeating_attack_" + attackid + "_dmg2attr"].substring(2, 5).toUpperCase() + "]" + hdmg2};
                    hdmg2 = dmg2base + hdmg2;
                }
                else {
                    hdmg2 = "0";
                }
                if(v.dtype === "full") {
                    pickbase = "full";
                    rollbase = "@{wtype}&{template:atkdmg} {{mod=@{atkbonus}}} {{rname=@{atkname}}} {{r1=[[" + r1 + "cs>@{atkcritrange}" + hbonus + "]]}} " + r2 + "cs>@{atkcritrange}" + hbonus + "]]}} @{atkflag} {{range=@{atkrange}}} @{dmgflag} {{dmg1=[[" + hdmg1 + "]]}} {{dmg1type=" + dmgtype + "}} @{dmg2flag} {{dmg2=[[" + hdmg2 + "]]}} {{dmg2type=" + dmg2type + "}} {{crit1=[[" + crit1 + "[CRIT]]]}} {{crit2=[[" + crit2 + "[CRIT]]]}} @{saveflag} {{desc=@{atk_desc}}} @{hldmg} " + hldmgcrit + " {{spelllevel=@{spelllevel}}} {{innate=@{spell_innate}}} @{global_attack_mod} @{global_damage_mod} @{global_damage_mod_crit} {{globaldamagetype=@{global_damage_type}}} ammo=@{ammo} @{charname_output}";
                }
                else if(v["repeating_attack_" + attackid + "_atkflag"] && v["repeating_attack_" + attackid + "_atkflag"] != 0) {
                    pickbase = "pick";
                    rollbase = "@{wtype}&{template:atk} {{mod=@{atkbonus}}} {{rname=[@{atkname}](~repeating_attack_attack_dmg)}} {{rnamec=[@{atkname}](~repeating_attack_attack_crit)}} {{r1=[[" + r1 + "cs>@{atkcritrange}" + hbonus + "]]}} " + r2 + "cs>@{atkcritrange}" + hbonus + "]]}} {{range=@{atkrange}}} {{desc=@{atk_desc}}} {{spelllevel=@{spelllevel}}} {{innate=@{spell_innate}}} @{global_attack_mod} ammo=@{ammo} @{charname_output}";
                }
                else if(v["repeating_attack_" + attackid + "_dmgflag"] && v["repeating_attack_" + attackid + "_dmgflag"] != 0) {
                    pickbase = "dmg";
                    rollbase = "@{wtype}&{template:dmg} {{rname=@{atkname}}} @{atkflag} {{range=@{atkrange}}} @{dmgflag} {{dmg1=[[" + hdmg1 + "]]}} {{dmg1type=" + dmgtype + "}} @{dmg2flag} {{dmg2=[[" + hdmg2 + "]]}} {{dmg2type=" + dmg2type + "}} @{saveflag} {{desc=@{atk_desc}}} @{hldmg} {{spelllevel=@{spelllevel}}} {{innate=@{spell_innate}}} @{global_damage_mod} {{globaldamagetype=@{global_damage_type}}} ammo=@{ammo} @{charname_output}"
                }
                else {
                    pickbase = "empty";
                    rollbase = "@{wtype}&{template:dmg} {{rname=@{atkname}}} @{atkflag} {{range=@{atkrange}}} @{saveflag} {{desc=@{atk_desc}}} {{spelllevel=@{spelllevel}}} {{innate=@{spell_innate}}} ammo=@{ammo} @{charname_output}"
                }
                update["repeating_attack_" + attackid + "_rollbase_dmg"] = "@{wtype}&{template:dmg} {{rname=@{atkname}}} @{atkflag} {{range=@{atkrange}}} @{dmgflag} {{dmg1=[[" + hdmg1 + "]]}} {{dmg1type=" + dmgtype + "}} @{dmg2flag} {{dmg2=[[" + hdmg2 + "]]}} {{dmg2type=" + dmg2type + "}} @{saveflag} {{desc=@{atk_desc}}} @{hldmg} {{spelllevel=@{spelllevel}}} {{innate=@{spell_innate}}} @{global_damage_mod} {{globaldamagetype=@{global_damage_type}}} @{charname_output}";
                update["repeating_attack_" + attackid + "_rollbase_crit"] = "@{wtype}&{template:dmg} {{crit=1}} {{rname=@{atkname}}} @{atkflag} {{range=@{atkrange}}} @{dmgflag} {{dmg1=[[" + hdmg1 + "]]}} {{dmg1type=" + dmgtype + "}} @{dmg2flag} {{dmg2=[[" + hdmg2 + "]]}} {{dmg2type=" + dmg2type + "}} {{crit1=[[" + crit1 + "]]}} {{crit2=[[" + crit2 + "]]}} @{saveflag} {{desc=@{atk_desc}}} @{hldmg} " + hldmgcrit + " {{spelllevel=@{spelllevel}}} {{innate=@{spell_innate}}} @{global_damage_mod} @{global_damage_mod_crit} {{globaldamagetype=@{global_damage_type}}} @{charname_output}"
                update["repeating_attack_" + attackid + "_atkbonus"] = bonus;
                update["repeating_attack_" + attackid + "_atkdmgtype"] = dmg + dmgspacer + dmg2 + dmgmag + " ";
                update["repeating_attack_" + attackid + "_rollbase"] = rollbase;
                if(v["repeating_attack_" + attackid + "_spellid"] && v["repeating_attack_" + attackid + "_spellid"] != "" && (!source || source && source != "spell") && v["repeating_attack_" + attackid + "_spellid"].length == 20) {
                    var spellid = v["repeating_attack_" + attackid + "_spellid"];
                    var lvl = v["repeating_attack_" + attackid + "_spelllevel"];
                    callbacks.push( function() {update_spell_from_attack(lvl, spellid, attackid);} );
                }
                if(v["repeating_attack_" + attackid + "_itemid"] && v["repeating_attack_" + attackid + "_itemid"] != "" && (!source || source && source != "item")) {
                    var itemid = v["repeating_attack_" + attackid + "_itemid"];
                    callbacks.push( function() {update_item_from_attack(itemid, attackid);} );
                }

                setAttrs(update, {silent: true}, function() {callbacks.forEach(function(callback) {callback(); })} );
            });
        });
    };

    var update_spell_from_attack = function(lvl, spellid, attackid) {
        var update = {};
        getAttrs(["repeating_attack_" + attackid + "_atkname", "repeating_attack_" + attackid + "_atkrange", "repeating_attack_" + attackid + "_dmgbase", "repeating_attack_" + attackid + "_dmgtype", "repeating_attack_" + attackid + "_dmg2base", "repeating_attack_" + attackid + "_dmg2type", "repeating_attack_" + attackid + "_saveflag", "repeating_attack_" + attackid + "_saveattr", "repeating_attack_" + attackid + "_saveeffect"], function(v) {
            update["repeating_spell-" + lvl + "_" + spellid + "_spellname"] = v["repeating_attack_" + attackid + "_atkname"];
            if(v["repeating_attack_" + attackid + "_atkrange"] && v["repeating_attack_" + attackid + "_atkrange"] != "") {
                update["repeating_spell-" + lvl + "_" + spellid + "_spellrange"] = v["repeating_attack_" + attackid + "_atkrange"];
            }
            else {
                update["repeating_spell-" + lvl + "_" + spellid + "_spellrange"] = "";
            };

            if(v["repeating_attack_" + attackid + "_dmgtype"] && v["repeating_attack_" + attackid + "_dmgtype"].toLowerCase() == "healing") {
                if(v["repeating_attack_" + attackid + "_dmgbase"] && v["repeating_attack_" + attackid + "_dmgbase"] != "") {
                    update["repeating_spell-" + lvl + "_" + spellid + "_spellhealing"] = v["repeating_attack_" + attackid + "_dmgbase"];
                }
            }
            else {
                if(v["repeating_attack_" + attackid + "_dmgbase"] && v["repeating_attack_" + attackid + "_dmgbase"] != "" && v["repeating_attack_" + attackid + "_dmgbase"].indexOf("[[round((@{level} + 1) / 6 + 0.5)]]") === -1) {
                    update["repeating_spell-" + lvl + "_" + spellid + "_spelldamage"] = v["repeating_attack_" + attackid + "_dmgbase"];
                }
                else if(!v["repeating_attack_" + attackid + "_dmgbase"] || v["repeating_attack_" + attackid + "_dmgbase"] === "") {
                    update["repeating_spell-" + lvl + "_" + spellid + "_spelldamage"] = "";
                }
                if(v["repeating_attack_" + attackid + "_dmgtype"] && v["repeating_attack_" + attackid + "_dmgtype"] != "") {
                    update["repeating_spell-" + lvl + "_" + spellid + "_spelldamagetype"] = v["repeating_attack_" + attackid + "_dmgtype"];
                }
                else {
                    update["repeating_spell-" + lvl + "_" + spellid + "_spelldamagetype"] = "";
                }
            };
            if(v["repeating_attack_" + attackid + "_dmg2type"] && v["repeating_attack_" + attackid + "_dmg2type"].toLowerCase() == "healing") {
                if(v["repeating_attack_" + attackid + "_dmgbase"] && v["repeating_attack_" + attackid + "_dmgbase"] != "") {
                    update["repeating_spell-" + lvl + "_" + spellid + "_spellhealing"] = v["repeating_attack_" + attackid + "_dmgbase"];
                }
            }
            else {
                if(v["repeating_attack_" + attackid + "_dmg2base"] && v["repeating_attack_" + attackid + "_dmg2base"] != "") {
                    update["repeating_spell-" + lvl + "_" + spellid + "_spelldamage2"] = v["repeating_attack_" + attackid + "_dmg2base"];
                }
                else {
                    update["repeating_spell-" + lvl + "_" + spellid + "_spelldamage2"] = "";
                }
                if(v["repeating_attack_" + attackid + "_dmg2type"] && v["repeating_attack_" + attackid + "_dmg2type"] != "") {
                    update["repeating_spell-" + lvl + "_" + spellid + "_spelldamagetype2"] = v["repeating_attack_" + attackid + "_dmg2type"];
                }
                else {
                    update["repeating_spell-" + lvl + "_" + spellid + "_spelldamagetype2"] = "";
                }
            };

            if(v["repeating_attack_" + attackid + "_saveflag"] && v["repeating_attack_" + attackid + "_saveflag"] != "0") {
                update["repeating_spell-" + lvl + "_" + spellid + "_spellsave"] = v["repeating_attack_" + attackid + "_saveflag"];
            }
            else {
                update["repeating_spell-" + lvl + "_" + spellid + "_spellsave"] = "";
            };
            if(v["repeating_attack_" + attackid + "_saveeffect"] && v["repeating_attack_" + attackid + "_saveeffect"] != "") {
                update["repeating_spell-" + lvl + "_" + spellid + "_spellsavesuccess"] = v["repeating_attack_" + attackid + "_saveeffect"];
            }
            else {
                update["repeating_spell-" + lvl + "_" + spellid + "_spellsavesuccess"] = "";
            };
            setAttrs(update, {silent: true});
        });
    };

    var update_item_from_attack = function(itemid, attackid) {
        getAttrs(["repeating_attack_" + attackid + "_atkname", "repeating_attack_" + attackid + "_dmgbase", "repeating_attack_" + attackid + "_dmg2base", "repeating_attack_" + attackid + "_dmgtype", "repeating_attack_" + attackid + "_dmg2type", "repeating_attack_" + attackid + "_atkrange", "repeating_attack_" + attackid + "_atkmod", "repeating_attack_" + attackid + "_dmgmod", "repeating_inventory_" + itemid + "_itemmodifiers"], function(v) {
            var update = {};
            var mods = [];
            var damage = v["repeating_attack_" + attackid + "_dmgbase"] ? v["repeating_attack_" + attackid + "_dmgbase"] : 0;
            var damage2 = v["repeating_attack_" + attackid + "_dmg2base"] ? v["repeating_attack_" + attackid + "_dmg2base"] : 0;
            var damagetype = v["repeating_attack_" + attackid + "_dmgtype"] ? v["repeating_attack_" + attackid + "_dmgtype"] : 0;
            var damagetype2 = v["repeating_attack_" + attackid + "_dmg2type"] ? v["repeating_attack_" + attackid + "_dmg2type"] : 0;
            var range = v["repeating_attack_" + attackid + "_atkrange"] ? v["repeating_attack_" + attackid + "_atkrange"] : 0;
            var attackmod = v["repeating_attack_" + attackid + "_atkmod"] ? v["repeating_attack_" + attackid + "_atkmod"] : 0;
            var damagemod = v["repeating_attack_" + attackid + "_dmgmod"] ? v["repeating_attack_" + attackid + "_dmgmod"] : 0;
            var atktype = "";

            update["repeating_inventory_" + itemid + "_itemname"] = v["repeating_attack_" + attackid + "_atkname"];

            if(v["repeating_inventory_" + itemid + "_itemmodifiers"] && v["repeating_inventory_" + itemid + "_itemmodifiers"] != "") {
                var mods = _.uniq(v["repeating_inventory_" + itemid + "_itemmodifiers"].split(",").map((item) => item.trim()));
                if(mods.indexOf("Item Type: Ranged Weapon") > -1) {atktype = "Ranged";} else if(mods.indexOf("Item Type: Melee Weapon") > -1) {atktype = "Melee";} else if(v["repeating_attack_" + attackid + "_atkrange"]) {atktype = "Ranged";} else {atktype = "Melee";};
                var to_be_removed = [];
                _.each(mods, function(mod, i) {
                    if(mod.indexOf("Secondary Damage Type:") > -1) {
                        if(damagetype2 != 0) {
                            mods[i] = mod.substring(0, mod.lastIndexOf(":") + 1) + " " + damagetype2;
                            damagetype2 = 0;
                        }
                        else {
                            to_be_removed.push(i);
                        }
                    }
                    else if(mod.indexOf("Secondary Damage:") > -1) {
                        if(damage2 != 0) {
                            mods[i] = mod.substring(0, mod.lastIndexOf(":") + 1) + " " + damage2;
                            damage2 = 0;
                        }
                        else {
                            to_be_removed.push(i);
                        }
                    }
                    else if(mod.indexOf("Damage Type:") > -1) {
                        if(damagetype != 0) {
                            mods[i] = mod.substring(0, mod.lastIndexOf(":") + 1) + " " + damagetype;
                            damagetype = 0;
                        }
                        else {
                            to_be_removed.push(i);
                        }
                    }
                    else if(mod.indexOf("Damage:") > -1) {
                        if(damage != 0) {
                            mods[i] = mod.substring(0, mod.lastIndexOf(":") + 1) + " " + damage;
                            damage = 0;
                        }
                        else {
                            to_be_removed.push(i);
                        }
                    }
                    else if(mod.indexOf("Range:") > -1) {
                        if(range != 0) {
                            mods[i] = mod.substring(0, mod.lastIndexOf(":") + 1) + " " + range;
                            range = 0;
                        }
                        else {
                            to_be_removed.push(i);
                        }
                    }
                    else if(mod.indexOf(" Attacks ") > -1) {
                        if(attackmod != 0) {
                            mods[i] = mod.substring(0, mod.lastIndexOf(" Attacks ") + 1) + " " + attackmod;
                            attackmod = 0;
                        }
                        else {
                            to_be_removed.push(i);
                        }
                    }
                    else if(mod.indexOf(" Damage ") > -1) {
                        if(damagemod != 0) {
                            mods[i] = mod.substring(0, mod.lastIndexOf(" Damage ") + 1) + " " + damagemod;
                            damagemod = 0;
                        }
                        else {
                            to_be_removed.push(i);
                        }
                    };
                });

                mods = _(mods).filter(function(mod) {return to_be_removed.indexOf(mods.indexOf(mod)) === -1 });
            }

            if(damage != 0) {
                mods.push("Damage: " + damage);
            }
            if(damagetype != 0) {
                mods.push("Damage Type: " + damagetype);
            }
            if(damage2 != 0) {
                mods.push("Secondary Damage: " + damage2);
            }
            if(damagetype != 0) {
                mods.push("Secondary Damage Type: " + damagetype2);
            }
            if(range != 0) {
                mods.push("Range: " + range);
            }
            if(attackmod != 0) {
                mods.push(atktype + " Attacks +" + attackmod);
            }
            if(damagemod != 0) {
                mods.push(atktype + " Damage +" + damagemod);
            }

            mods = mods.join(", ");
            if(mods.length > 0) {
                update["repeating_inventory_" + itemid + "_itemmodifiers"] = mods;
            }

            setAttrs(update, {silent: true});
        });
    };

    var remove_attack = function(attackid) {
        removeRepeatingRow("repeating_attack_" + attackid);
    };

    var remove_resource = function(id) {
        var update = {};
        getAttrs([id + "_itemid"], function(v) {
            var itemid = v[id + "_itemid"];
            if(itemid) {
                update["repeating_inventory_" + itemid + "_useasresource"] = 0;
                update["repeating_inventory_" + itemid + "_itemresourceid"] = "";
            };
            if(id == "other_resource") {
                update["other_resource"] = "";
                update["other_resource_name"] = "";
                update["other_resource_itemid"] = "";
                setAttrs(update, {silent: true});
            }
            else {
                var baseid = id.replace("repeating_resource_", "").substring(0,20);
                var resource_names = ["repeating_resource_" + baseid + "_resource_left_name", "repeating_resource_" + baseid + "_resource_right_name"];
                getAttrs(resource_names, function(v) {
                    if((id.indexOf("left") > -1 && !v["repeating_resource_" + baseid + "_resource_right_name"]) || (id.indexOf("right") > -1 && !v["repeating_resource_" + baseid + "_resource_left_name"])) {
                        removeRepeatingRow("repeating_resource_" + baseid);
                    }
                    else {
                        update["repeating_resource_" + id.replace("repeating_resource_", "")] = "";
                        update["repeating_resource_" + id.replace("repeating_resource_", "") + "_name"] = "";
                    };
                    setAttrs(update, {silent: true});
                });

            };
        });
    };

    var update_weight = function() {
        var update = {};
        var wtotal = 0;
        var weight_attrs = ["cp","sp","ep","gp","pp","encumberance_setting","strength","size","carrying_capacity_mod"];
        getSectionIDs("repeating_inventory", function(idarray) {
            _.each(idarray, function(currentID, i) {
                weight_attrs.push("repeating_inventory_" + currentID + "_itemweight");
                weight_attrs.push("repeating_inventory_" + currentID + "_itemcount");
            });
            getAttrs(weight_attrs, function(v) {
                cp = isNaN(parseInt(v.cp, 10)) === false ? parseInt(v.cp, 10) : 0;
                sp = isNaN(parseInt(v.sp, 10)) === false ? parseInt(v.sp, 10) : 0;
                ep = isNaN(parseInt(v.ep, 10)) === false ? parseInt(v.ep, 10) : 0;
                gp = isNaN(parseInt(v.gp, 10)) === false ? parseInt(v.gp, 10) : 0;
                pp = isNaN(parseInt(v.pp, 10)) === false ? parseInt(v.pp, 10) : 0;
                wtotal = wtotal + ((cp + sp + ep + gp + pp) / 50);

                _.each(idarray, function(currentID, i) {
                    if(v["repeating_inventory_" + currentID + "_itemweight"] && isNaN(parseInt(v["repeating_inventory_" + currentID + "_itemweight"], 10)) === false) {
                        count = v["repeating_inventory_" + currentID + "_itemcount"] && isNaN(parseFloat(v["repeating_inventory_" + currentID + "_itemcount"])) === false ? parseFloat(v["repeating_inventory_" + currentID + "_itemcount"]) : 1;
                        wtotal = wtotal + (parseFloat(v["repeating_inventory_" + currentID + "_itemweight"]) * count);
                    }
                });

                update["weighttotal"] = wtotal;

                var str_base = parseInt(v.strength, 10);
                var size_multiplier = 1;
                if(v["size"] && v["size"] != "") {
                    if(v["size"].toLowerCase().trim() == "tiny") {size_multiplier = .5}
                    else if(v["size"].toLowerCase().trim() == "large") {size_multiplier = 2}
                    else if(v["size"].toLowerCase().trim() == "huge") {size_multiplier = 4}
                    else if(v["size"].toLowerCase().trim() == "gargantuan") {size_multiplier = 8}
                }
                var str = str_base*size_multiplier;
                if(v.carrying_capacity_mod) {
                    var operator = v.carrying_capacity_mod.substring(0,1);
                    var value = v.carrying_capacity_mod.substring(1);
                    if(["*","x","+","-"].indexOf(operator) > -1 && isNaN(parseInt(value,10)) === false) {
                        if(operator == "*" || operator == "x") {str = str*parseInt(value,10);}
                        else if(operator == "+") {str = str+parseInt(value,10);}
                        else if(operator == "-") {str = str-parseInt(value,10);}
                    }
                }

                if(!v.encumberance_setting || v.encumberance_setting === "off") {
                    if(wtotal > str*15) {
                        update["encumberance"] = "OVER CARRYING CAPACITY";
                    }
                    else {
                        update["encumberance"] = " ";
                    }
                }
                else if(v.encumberance_setting === "on") {
                    if(wtotal > str*15) {
                        update["encumberance"] = "IMMOBILE";
                    }
                    else if(wtotal > str*10) {
                        update["encumberance"] = "HEAVILY ENCUMBERED";
                    }
                    else if(wtotal > str*5) {
                        update["encumberance"] = "ENCUMBERED";
                    }
                    else {
                        update["encumberance"] = " ";
                    }
                }
                else {
                    update["encumberance"] = " ";
                }

                setAttrs(update, {silent: true});

            });
        });
    };

    var update_ac = function() {
        getAttrs(["custom_ac_flag"], function(v) {
            if(v.custom_ac_flag === "2") {
                return;
            }
            else if(v.custom_ac_flag === "1") {
                getAttrs(["custom_ac_base","custom_ac_part1","custom_ac_part2","strength_mod","dexterity_mod","constitution_mod","intelligence_mod","wisdom_mod","charisma_mod"], function(b) {
                    var base = isNaN(parseInt(b.custom_ac_base, 10)) === false ? parseInt(b.custom_ac_base, 10) : 10;
                    var part1attr = b.custom_ac_part1.toLowerCase();
                    var part2attr = b.custom_ac_part2.toLowerCase();
                    var part1 = part1attr === "none" ? 0 : b[part1attr + "_mod"];
                    var part2 = part2attr === "none" ? 0 : b[part2attr + "_mod"];
                    var total = base + part1 + part2;
                    setAttrs({ac: total});
                });
            }
            else {
                var update = {};
                var ac_attrs = ["simpleinventory","dexterity_mod","globalacmod"];
                getSectionIDs("repeating_inventory", function(idarray) {
                    _.each(idarray, function(currentID, i) {
                        ac_attrs.push("repeating_inventory_" + currentID + "_equipped");
                        ac_attrs.push("repeating_inventory_" + currentID + "_itemmodifiers");
                    });
                    getAttrs(ac_attrs, function(b) {
                        var globalacmod = isNaN(parseInt(b.globalacmod, 10)) === false ? parseInt(b.globalacmod, 10) : 0;
                        var dexmod = b["dexterity_mod"];
                        var total = 10 + dexmod;
                        var armorcount = 0;
                        var shieldcount = 0;
                        var armoritems = [];
                        if(b.simpleinventory === "complex") {
                            _.each(idarray, function(currentID, i) {
                                if(b["repeating_inventory_" + currentID + "_equipped"] && b["repeating_inventory_" + currentID + "_equipped"] === "1" && b["repeating_inventory_" + currentID + "_itemmodifiers"] && b["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().indexOf("ac") > -1) {
                                    var mods = b["repeating_inventory_" + currentID + "_itemmodifiers"].split(",");
                                    var ac = 0;
                                    var type = "mod";
                                    _.each(mods, function(mod) {
                                        if(mod.substring(0,10) === "Item Type:") {
                                            type = mod.substring(11, mod.length).trim().toLowerCase();
                                        }
                                        if(mod.toLowerCase().indexOf("ac:") > -1 || mod.toLowerCase().indexOf("ac +") > -1 || mod.toLowerCase().indexOf("ac+") > -1) {
                                            var regex = mod.replace(/[^0-9]/g, "");
                                            var bonus = regex && regex.length > 0 && isNaN(parseInt(regex,10)) === false ? parseInt(regex,10) : 0;
                                            ac = ac + bonus;
                                        }
                                        if(mod.toLowerCase().indexOf("ac -") > -1 || mod.toLowerCase().indexOf("ac-") > -1) {
                                            var regex = mod.replace(/[^0-9]/g, "");
                                            var bonus = regex && regex.length > 0 && isNaN(parseInt(regex,10)) === false ? parseInt(regex,10) : 0;
                                            ac = ac - bonus;
                                        }
                                    });
                                    armoritems.push({type: type, ac: ac});
                                }
                            });
                            armorcount = armoritems.filter(function(item){ return item["type"].indexOf("armor") > -1 }).length;
                            shieldcount = armoritems.filter(function(item){ return item["type"].indexOf("shield") > -1 }).length;
                            var base = dexmod;
                            var armorac = 10;
                            var shieldac = 0;
                            var modac = 0;

                            _.each(armoritems, function(item) {
                                if(item["type"].indexOf("light armor") > -1) {
                                    armorac = item["ac"];
                                    base = dexmod;
                                }
                                else if(item["type"].indexOf("medium armor") > -1) {
                                    armorac = item["ac"];
                                    base = Math.min(dexmod, 2);
                                }
                                else if(item["type"].indexOf("heavy armor") > -1) {
                                    armorac = item["ac"];
                                    base = 0;
                                }
                                else if(item["type"].indexOf("shield") > -1) {
                                    shieldac = item["ac"];
                                }
                                else {
                                    modac = modac + item["ac"]
                                }
                            })

                            total = base + armorac + shieldac + modac;

                        };
                        if(armorcount > 1 || shieldcount > 1) {
                            update["armorwarningflag"] = "show";
                            update["armorwarning"] = "0";
                        }
                        else {
                            update["armorwarningflag"] = "hide";
                            update["armorwarning"] = "0";
                        }
                        update["ac"] = total + globalacmod;
                        setAttrs(update, {silent: true});
                    });
                });
            };
        });
    };

    var check_customac = function(attr) {
        getAttrs(["custom_ac_flag","custom_ac_part1","custom_ac_part2"], function(v) {
            if(v["custom_ac_flag"] && v["custom_ac_flag"] === "1" && ((v["custom_ac_part1"] && v["custom_ac_part1"] === attr) || (v["custom_ac_part2"] && v["custom_ac_part2"] === attr))) {
                update_ac();
            }
        });
    };

    var update_initiative = function() {
        getAttrs(["dexterity","dexterity_mod","initmod","jack_of_all_trades","jack","init_tiebreaker","pb_type"], function(v) {
            var update = {};
            var final_init = parseInt(v["dexterity_mod"], 10);
            if(v["initmod"] && !isNaN(parseInt(v["initmod"], 10))) {
                final_init = final_init + parseInt(v["initmod"], 10);
            }
            if(v["init_tiebreaker"] && v["init_tiebreaker"] != 0) {
                final_init = final_init + (parseInt(v["dexterity"], 10)/100);
            }
            if(v["jack_of_all_trades"] && v["jack_of_all_trades"] != 0) {
                if(v["pb_type"] && v["pb_type"] === "die" && v["jack"]) {
                    // final_init = final_init + Math.floor(parseInt(v["jack"].substring(1),10)/2);
                    final_init = final_init + "+" + v["jack"];
                }
                else if(v["jack"] && !isNaN(parseInt(v["jack"], 10))) {
                    final_init = final_init + parseInt(v["jack"], 10);
                }
            }
            if(final_init % 1 != 0) {
                final_init = parseFloat(final_init.toPrecision(12)); // ROUNDING ERROR BUGFIX
            }
            update["initiative_bonus"] = final_init;
            setAttrs(update, {silent: true});
        });
    };

    var update_class = function() {
        getAttrs(["class","base_level","custom_class","cust_classname","cust_hitdietype","cust_spellcasting_ability","cust_strength_save_prof","cust_dexterity_save_prof","cust_constitution_save_prof","cust_intelligence_save_prof","cust_wisdom_save_prof","cust_charisma_save_prof","strength_save_prof","dexterity_save_prof","constitution_save_prof","intelligence_save_prof","wisdom_save_prof","charisma_save_prof"], function(v) {
            if(v.custom_class && v.custom_class != "0") {
                setAttrs({
                    hitdietype: v.cust_hitdietype,
                    spellcasting_ability: v.cust_spellcasting_ability,
                    strength_save_prof: v.cust_strength_save_prof,
                    dexterity_save_prof: v.cust_dexterity_save_prof,
                    constitution_save_prof: v.cust_constitution_save_prof,
                    intelligence_save_prof: v.cust_intelligence_save_prof,
                    wisdom_save_prof: v.cust_wisdom_save_prof,
                    charisma_save_prof: v.cust_charisma_save_prof
                });
            }
            else {
                update = {};
                switch(v.class) {
                    case "":
                        update["hitdietype"] = 6;
                        update["spellcasting_ability"] = "0*";
                        update["strength_save_prof"] = 0;
                        update["dexterity_save_prof"] = 0;
                        update["constitution_save_prof"] = 0;
                        update["intelligence_save_prof"] = 0;
                        update["wisdom_save_prof"] = 0;
                        update["charisma_save_prof"] = 0;
                        update["class_resource_name"] = "";
                        break;
                    case "Barbarian":
                        update["hitdietype"] = 12;
                        update["spellcasting_ability"] = "0*";
                        if(!v.strength_save_prof || v.strength_save_prof != "(@{pb})" || !v.constitution_save_prof || v.constitution_save_prof != "(@{pb})") {
                            update["strength_save_prof"] = "(@{pb})";
                            update["dexterity_save_prof"] = 0;
                            update["constitution_save_prof"] = "(@{pb})";
                            update["intelligence_save_prof"] = 0;
                            update["wisdom_save_prof"] = 0;
                            update["charisma_save_prof"] = 0;
                            update["class_resource_name"] = "Rage";
                        }
                        break;
                    case "Bard":
                        update["hitdietype"] = 8;
                        update["spellcasting_ability"] = "@{charisma_mod}+";
                        if(!v.dexterity_save_prof || v.dexterity_save_prof != "(@{pb})" || !v.charisma_save_prof || v.charisma_save_prof != "(@{pb})") {
                            update["strength_save_prof"] = 0;
                            update["dexterity_save_prof"] = "(@{pb})";
                            update["constitution_save_prof"] = 0;
                            update["intelligence_save_prof"] = 0;
                            update["wisdom_save_prof"] = 0;
                            update["charisma_save_prof"] = "(@{pb})";
                            update["class_resource_name"] = "Bardic Inspiration";
                        }
                        break;
                    case "Cleric":
                        update["hitdietype"] = 8;
                        update["spellcasting_ability"] = "@{wisdom_mod}+";
                        if(!v.wisdom_save_prof || v.wisdom_save_prof != "(@{pb})" || !v.charisma_save_prof || v.charisma_save_prof != "(@{pb})") {
                            update["strength_save_prof"] = 0;
                            update["dexterity_save_prof"] = 0;
                            update["constitution_save_prof"] = 0;
                            update["intelligence_save_prof"] = 0;
                            update["wisdom_save_prof"] = "(@{pb})";
                            update["charisma_save_prof"] = "(@{pb})";
                            update["class_resource_name"] = "Channel Divinity";
                        }
                        break;
                    case "Druid":
                        update["hitdietype"] = 8;
                        update["spellcasting_ability"] = "@{wisdom_mod}+";
                        if(!v.wisdom_save_prof || v.wisdom_save_prof != "(@{pb})" || !v.intelligence_save_prof || v.intelligence_save_prof != "(@{pb})") {
                            update["strength_save_prof"] = 0;
                            update["dexterity_save_prof"] = 0;
                            update["constitution_save_prof"] = 0;
                            update["intelligence_save_prof"] = "(@{pb})";
                            update["wisdom_save_prof"] = "(@{pb})";
                            update["charisma_save_prof"] = 0;
                            update["class_resource_name"] = "Wild Shape";
                        }
                        break;
                    case "Fighter":
                        update["hitdietype"] = 10;
                        update["spellcasting_ability"] = "0*";
                        if(!v.strength_save_prof || v.strength_save_prof != "(@{pb})" || !v.constitution_save_prof || v.constitution_save_prof != "(@{pb})") {
                            update["strength_save_prof"] = "(@{pb})";
                            update["dexterity_save_prof"] = 0;
                            update["constitution_save_prof"] = "(@{pb})";
                            update["intelligence_save_prof"] = 0;
                            update["wisdom_save_prof"] = 0;
                            update["charisma_save_prof"] = 0;
                            update["class_resource_name"] = "Second Wind";
                        }
                        break;
                    case "Monk":
                        update["hitdietype"] = 8;
                        update["spellcasting_ability"] = "0*";
                        if(!v.strength_save_prof || v.strength_save_prof != "(@{pb})" || !v.dexterity_save_prof || v.dexterity_save_prof != "(@{pb})") {
                            update["strength_save_prof"] = "(@{pb})";
                            update["dexterity_save_prof"] = "(@{pb})";
                            update["constitution_save_prof"] = 0;
                            update["intelligence_save_prof"] = 0;
                            update["wisdom_save_prof"] = 0;
                            update["charisma_save_prof"] = 0;
                            update["class_resource_name"] = "Ki";
                        }
                        break;
                    case "Paladin":
                        update["hitdietype"] = 10;
                        update["spellcasting_ability"] = "@{charisma_mod}+";
                        if(!v.wisdom_save_prof || v.wisdom_save_prof != "(@{pb})" || !v.charisma_save_prof || v.charisma_save_prof != "(@{pb})") {
                            update["strength_save_prof"] = 0;
                            update["dexterity_save_prof"] = 0;
                            update["constitution_save_prof"] = 0;
                            update["intelligence_save_prof"] = 0;
                            update["wisdom_save_prof"] = "(@{pb})";
                            update["charisma_save_prof"] = "(@{pb})";
                            update["class_resource_name"] = "Channel Divinity";
                        }
                        break;
                    case "Ranger":
                        update["hitdietype"] = 10;
                        update["spellcasting_ability"] = "@{wisdom_mod}+";
                        if(!v.strength_save_prof || v.strength_save_prof != "(@{pb})" || !v.dexterity_save_prof || v.dexterity_save_prof != "(@{pb})") {
                            update["strength_save_prof"] = "(@{pb})";
                            update["dexterity_save_prof"] = "(@{pb})";
                            update["constitution_save_prof"] = 0;
                            update["intelligence_save_prof"] = 0;
                            update["wisdom_save_prof"] = 0;
                            update["charisma_save_prof"] = 0;
                        }
                        break;
                    case "Rogue":
                        update["hitdietype"] = 8;
                        update["spellcasting_ability"] = "0*";
                        if(!v.intelligence_save_prof || v.intelligence_save_prof != "(@{pb})" || !v.dexterity_save_prof || v.dexterity_save_prof != "(@{pb})") {
                            update["strength_save_prof"] = 0;
                            update["dexterity_save_prof"] = "(@{pb})";
                            update["constitution_save_prof"] = 0;
                            update["intelligence_save_prof"] = "(@{pb})";
                            update["wisdom_save_prof"] = 0;
                            update["charisma_save_prof"] = 0;
                        }
                        break;
                    case "Sorcerer":
                        update["hitdietype"] = 6;
                        update["spellcasting_ability"] = "@{charisma_mod}+";
                        if(!v.constitution_save_prof || v.constitution_save_prof != "(@{pb})" || !v.charisma_save_prof || v.charisma_save_prof != "(@{pb})") {
                            update["strength_save_prof"] = 0;
                            update["dexterity_save_prof"] = 0;
                            update["constitution_save_prof"] = "(@{pb})";
                            update["intelligence_save_prof"] = 0;
                            update["wisdom_save_prof"] = 0;
                            update["charisma_save_prof"] = "(@{pb})";
                            update["class_resource_name"] = "Sorcery Points";
                        }
                        break;
                    case "Warlock":
                        update["hitdietype"] = 8;
                        update["spellcasting_ability"] = "@{charisma_mod}+";
                        if(!v.wisdom_save_prof || v.wisdom_save_prof != "(@{pb})" || !v.charisma_save_prof || v.charisma_save_prof != "(@{pb})") {
                            update["strength_save_prof"] = 0;
                            update["dexterity_save_prof"] = 0;
                            update["constitution_save_prof"] = 0;
                            update["intelligence_save_prof"] = 0;
                            update["wisdom_save_prof"] = "(@{pb})";
                            update["charisma_save_prof"] = "(@{pb})";
                            update["class_resource_name"] = "Spell Slots";
                        }
                        break;
                    case "Wizard":
                        update["hitdietype"] = 6;
                        update["spellcasting_ability"] = "@{intelligence_mod}+";
                        if(!v.wisdom_save_prof || v.wisdom_save_prof != "(@{pb})" || !v.intelligence_save_prof || v.intelligence_save_prof != "(@{pb})") {
                            update["strength_save_prof"] = 0;
                            update["dexterity_save_prof"] = 0;
                            update["constitution_save_prof"] = 0;
                            update["intelligence_save_prof"] = "(@{pb})";
                            update["wisdom_save_prof"] = "(@{pb})";
                            update["charisma_save_prof"] = 0;
                        }
                        break;
                }
                setAttrs(update, {silent: true});
            };
        });
        set_level();
    };

    var set_level = function() {
        getAttrs(["base_level","multiclass1_flag","multiclass2_flag","multiclass3_flag","multiclass1_lvl","multiclass2_lvl","multiclass3_lvl","class","multiclass1","multiclass2","multiclass3", "arcane_fighter", "arcane_rogue", "custom_class", "cust_spellslots", "cust_classname","level_calculations"], function(v) {
            var update = {};
            var callbacks = [];
            var multiclass = (v.multiclass1_flag && v.multiclass1_flag === "1") || (v.multiclass2_flag && v.multiclass2_flag === "1") || (v.multiclass3_flag && v.multiclass3_flag === "1") ? true : false;
            var finalclass = v["custom_class"] && v["custom_class"] != "0" ? v["cust_spellslots"] : v["class"];
            var casterlevel = checkCasterLevel(finalclass.toLowerCase(), v["base_level"], v["arcane_fighter"], v["arcane_rogue"]);
            var finallevel = (v.base_level && v.base_level > 0) ? parseInt(v.base_level,10) : 1;
            var charclass = v.custom_class && v.custom_class != "0" ? v["cust_classname"] : v["class"];
            var hitdie_final = multiclass ? "?{Hit Die Class|" + charclass + ",@{hitdietype}" : "@{hitdietype}";

            if(v.multiclass1_flag && v.multiclass1_flag === "1") {
                var multiclasslevel = (v["multiclass1_lvl"] && v["multiclass1_lvl"] > 0) ? parseInt(v["multiclass1_lvl"], 10) : 1;
                finallevel = finallevel + multiclasslevel;
                casterlevel = casterlevel + checkCasterLevel(v["multiclass1"], v["multiclass1_lvl"], v["arcane_fighter"], v["arcane_rogue"]);
                hitdie_final = hitdie_final + "|" + v["multiclass1"].charAt(0).toUpperCase() + v["multiclass1"].slice(1) + "," + checkHitDie(v["multiclass1"]);
            };
            if(v.multiclass2_flag && v.multiclass2_flag === "1") {
                var multiclasslevel = (v["multiclass2_lvl"] && v["multiclass2_lvl"] > 0) ? parseInt(v["multiclass2_lvl"], 10) : 1;
                finallevel = finallevel + multiclasslevel;
                casterlevel = casterlevel + checkCasterLevel(v["multiclass2"], v["multiclass2_lvl"], v["arcane_fighter"], v["arcane_rogue"]);
                hitdie_final = hitdie_final + "|" + v["multiclass2"].charAt(0).toUpperCase() + v["multiclass2"].slice(1) + "," + checkHitDie(v["multiclass2"]);
            };
            if(v.multiclass3_flag && v.multiclass3_flag === "1") {
                var multiclasslevel = (v["multiclass3_lvl"] && v["multiclass3_lvl"] > 0) ? parseInt(v["multiclass3_lvl"], 10) : 1;
                finallevel = finallevel + multiclasslevel;
                casterlevel = casterlevel + checkCasterLevel(v["multiclass3"], v["multiclass3_lvl"], v["arcane_fighter"], v["arcane_rogue"]);
                hitdie_final = hitdie_final + "|" + v["multiclass3"].charAt(0).toUpperCase() + v["multiclass3"].slice(1) + "," + checkHitDie(v["multiclass3"]);
            };

            update["hitdie_final"] = multiclass ? hitdie_final + "}" : hitdie_final;
            update["level"] = finallevel;
            update["caster_level"] = casterlevel;

            if(!v["level_calculations"] || v["level_calculations"] == "on") {
                update["hit_dice_max"] = finallevel;
                callbacks.push( function() {update_spell_slots();} );
            }
            callbacks.push( function() {update_pb();} );
            setAttrs(update, {silent: true}, function() {callbacks.forEach(function(callback) {callback(); })} );
        });
    };

    var checkCasterLevel = function(class_string, levels, arcane_fighter, arcane_rogue) {
        var full = ["bard","cleric","druid","sorcerer","wizard","full"];
        var half = ["paladin","ranger","half"];
        if(full.indexOf(class_string) != -1) {
            return parseInt(levels, 10);
        }
        else if(half.indexOf(class_string) != -1) {
            if(levels == 1) {
                return 0;
            }
            else {
                return Math.ceil(parseInt(levels, 10) / 2);
            }
        }
        else if(class_string === "third" || (class_string === "fighter" && arcane_fighter === "1") || (class_string === "rogue" && arcane_rogue === "1")) {
            if(levels == 1 || levels == 2) {
                return 0;
            }
            else {
                return Math.ceil(parseInt(levels, 10) / 3);
            }
        }
        else {
            return 0;
        }
    };

    var checkHitDie = function(class_string) {
        var d10class = ["fighter","paladin","ranger"];
        var d8class = ["bard","cleric","druid","monk","rogue","warlock"];
        var d6class = ["sorcerer","wizard"];
        if(class_string === "barbarian") {return "12"}
        else if (d10class.indexOf(class_string) != -1) {return "10"}
        else if (d8class.indexOf(class_string) != -1) {return "8"}
        else if (d6class.indexOf(class_string) != -1) {return "6"}
        else {return "0"};
    };

    var update_spell_slots = function() {
        getAttrs(["lvl1_slots_mod","lvl2_slots_mod","lvl3_slots_mod","lvl4_slots_mod","lvl5_slots_mod","lvl6_slots_mod","lvl7_slots_mod","lvl8_slots_mod","lvl9_slots_mod","caster_level"], function(v) {
            var update = {};
            var lvl = v["caster_level"] && !isNaN(parseInt(v["caster_level"], 10)) ? parseInt(v["caster_level"], 10) : 0;
            var l1 = v["lvl1_slots_mod"] && !isNaN(parseInt(v["lvl1_slots_mod"], 10)) ? parseInt(v["lvl1_slots_mod"], 10) : 0;
            var l2 = v["lvl2_slots_mod"] && !isNaN(parseInt(v["lvl2_slots_mod"], 10)) ? parseInt(v["lvl2_slots_mod"], 10) : 0;
            var l3 = v["lvl3_slots_mod"] && !isNaN(parseInt(v["lvl3_slots_mod"], 10)) ? parseInt(v["lvl3_slots_mod"], 10) : 0;
            var l4 = v["lvl4_slots_mod"] && !isNaN(parseInt(v["lvl4_slots_mod"], 10)) ? parseInt(v["lvl4_slots_mod"], 10) : 0;
            var l5 = v["lvl5_slots_mod"] && !isNaN(parseInt(v["lvl5_slots_mod"], 10)) ? parseInt(v["lvl5_slots_mod"], 10) : 0;
            var l6 = v["lvl6_slots_mod"] && !isNaN(parseInt(v["lvl6_slots_mod"], 10)) ? parseInt(v["lvl6_slots_mod"], 10) : 0;
            var l7 = v["lvl7_slots_mod"] && !isNaN(parseInt(v["lvl7_slots_mod"], 10)) ? parseInt(v["lvl7_slots_mod"], 10) : 0;
            var l8 = v["lvl8_slots_mod"] && !isNaN(parseInt(v["lvl8_slots_mod"], 10)) ? parseInt(v["lvl8_slots_mod"], 10) : 0;
            var l9 = v["lvl9_slots_mod"] && !isNaN(parseInt(v["lvl9_slots_mod"], 10)) ? parseInt(v["lvl9_slots_mod"], 10) : 0;

            if(lvl > 0) {
                l1 = l1 + Math.min((lvl + 1),4);
                if(lvl < 3) {l2 = l2 + 0;} else if(lvl === 3) {l2 = l2 + 2;} else {l2 = l2 + 3;};
                if(lvl < 5) {l3 = l3 + 0;} else if(lvl === 5) {l3 = l3 + 2;} else {l3 = l3 + 3;};
                if(lvl < 7) {l4 = l4 + 0;} else if(lvl === 7) {l4 = l4 + 1;} else if(lvl === 8) {l4 = l4 + 2;} else {l4 = l4 + 3;};
                if(lvl < 9) {l5 = l5 + 0;} else if(lvl === 9) {l5 = l5 + 1;} else if(lvl < 18) {l5 = l5 + 2;} else {l5 = l5 + 3;};
                if(lvl < 11) {l6 = l6 + 0;} else if(lvl < 19) {l6 = l6 + 1;} else {l6 = l6 + 2;};
                if(lvl < 13) {l7 = l7 + 0;} else if(lvl < 20) {l7 = l7 + 1;} else {l7 = l7 + 2;};
                if(lvl < 15) {l8 = l8 + 0;} else {l8 = l8 + 1;};
                if(lvl < 17) {l9 = l9 + 0;} else {l9 = l9 + 1;};
            };

            update["lvl1_slots_total"] = l1;
            update["lvl2_slots_total"] = l2;
            update["lvl3_slots_total"] = l3;
            update["lvl4_slots_total"] = l4;
            update["lvl5_slots_total"] = l5;
            update["lvl6_slots_total"] = l6;
            update["lvl7_slots_total"] = l7;
            update["lvl8_slots_total"] = l8;
            update["lvl9_slots_total"] = l9;
            setAttrs(update, {silent: true});
        });
    };

    var update_pb = function() {
        callbacks = [];
        getAttrs(["level","pb_type","pb_custom"], function(v) {
            var update = {};
            var pb = 2;
            var lvl = parseInt(v["level"],10);
            if(lvl < 5) {pb = "2"} else if(lvl < 9) {pb = "3"} else if(lvl < 13) {pb = "4"} else if(lvl < 17) {pb = "5"} else {pb = "6"}
            var jack = Math.floor(pb/2);
            if(v["pb_type"] === "die") {
                update["jack"] = "d" + pb;
                update["pb"] = "d" + pb*2;
                update["pbd_safe"] = "cs0cf0";
            }
            else if(v["pb_type"] === "custom" && v["pb_custom"] && v["pb_custom"] != "") {
                update["pb"] = v["pb_custom"]
                update["jack"] = !isNaN(parseInt(v["pb_custom"],10)) ? Math.floor(parseInt(v["pb_custom"],10)/2) : jack;
                update["pbd_safe"] = "";
            }
            else {
                update["pb"] = pb;
                update["jack"] = jack;
                update["pbd_safe"] = "";
            };
            callbacks.push( function() {update_attacks("all");} );
            callbacks.push( function() {update_spell_info();} );
            callbacks.push( function() {update_jack_attr();} );
            callbacks.push( function() {update_initiative();} );
            callbacks.push( function() {update_tool("all");} );
            callbacks.push( function() {update_all_saves();} );
            callbacks.push( function() {update_skills(["athletics", "acrobatics", "sleight_of_hand", "stealth", "arcana", "history", "investigation", "nature", "religion", "animal_handling", "insight", "medicine", "perception", "survival","deception", "intimidation", "performance", "persuasion"]);} );

            setAttrs(update, {silent: true}, function() {callbacks.forEach(function(callback) {callback(); })} );
        });
    };

    var update_jack_attr = function() {
        var update = {};
        getAttrs(["jack_of_all_trades","jack"], function(v) {
            if(v["jack_of_all_trades"] && v["jack_of_all_trades"] != 0) {
                update["jack_bonus"] = "+" + v["jack"];
                update["jack_attr"] = "+" + v["jack"] + "@{pbd_safe}";
            }
            else {
                update["jack_bonus"] = "";
                update["jack_attr"] = "";
            }
            setAttrs(update, {silent: true});
        });
    };

    var update_spell_info = function(attr) {
        var update = {};
        getAttrs(["spellcasting_ability","spell_dc_mod","globalmagicmod","strength_mod","dexterity_mod","constitution_mod","intelligence_mod","wisdom_mod","charisma_mod"], function(v) {
            if(attr && v["spellcasting_ability"] && v["spellcasting_ability"].indexOf(attr) === -1) {
                return
            };
            if(!v["spellcasting_ability"] || (v["spellcasting_ability"] && v["spellcasting_ability"] === "0*")) {
                update["spell_attack_bonus"] = "0";
                update["spell_save_dc"] = "0";
                var callback = function() {update_attacks("spells")};
                setAttrs(update, {silent: true}, callback);
                return
            };
            var attr = attr ? attr : "";
            console.log("UPDATING SPELL INFO: " + attr);

            var ability = parseInt(v[v["spellcasting_ability"].substring(2,v["spellcasting_ability"].length-2)],10);
            var spell_mod = v["globalmagicmod"] && !isNaN(parseInt(v["globalmagicmod"], 10)) ? parseInt(v["globalmagicmod"], 10) : 0;
            var atk = v["globalmagicmod"] && !isNaN(parseInt(v["globalmagicmod"], 10)) ? ability + parseInt(v["globalmagicmod"], 10) : ability;
            var dc = v["spell_dc_mod"] && !isNaN(parseInt(v["spell_dc_mod"], 10)) ? 8 + ability + parseInt(v["spell_dc_mod"], 10) : 8 + ability;
            var itemfields = ["pb_type","pb"];

            getSectionIDs("repeating_inventory", function(idarray) {
                _.each(idarray, function(currentID, i) {
                    itemfields.push("repeating_inventory_" + currentID + "_equipped");
                    itemfields.push("repeating_inventory_" + currentID + "_itemmodifiers");
                });
                getAttrs(itemfields, function(v) {
                    _.each(idarray, function(currentID) {
                        if((!v["repeating_inventory_" + currentID + "_equipped"] || v["repeating_inventory_" + currentID + "_equipped"] === "1") && v["repeating_inventory_" + currentID + "_itemmodifiers"] && v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().indexOf("spell" > -1)) {
                            var mods = v["repeating_inventory_" + currentID + "_itemmodifiers"].toLowerCase().split(",");
                            _.each(mods, function(mod) {
                                if(mod.indexOf("spell attack") > -1) {
                                    var substr = mod.slice(mod.lastIndexOf("spell attack") + "spell attack".length);
                                    atk = substr && substr.length > 0 && !isNaN(parseInt(substr,10)) ? atk + parseInt(substr,10) : atk;
                                    spell_mod = substr && substr.length > 0 && !isNaN(parseInt(substr,10)) ? spell_mod + parseInt(substr,10) : spell_mod;
                                };
                                if(mod.indexOf("spell dc") > -1) {
                                    var substr = mod.slice(mod.lastIndexOf("spell dc") + "spell dc".length);
                                    dc = substr && substr.length > 0 && !isNaN(parseInt(substr,10)) ? dc + parseInt(substr,10) : dc;
                                };
                            });
                        };
                    });

                    if(v["pb_type"] && v["pb_type"] === "die") {
                        atk = atk + "+" + v["pb"];
                        dc = dc + parseInt(v["pb"].substring(1), 10) / 2;
                    }
                    else {
                        atk = parseInt(atk, 10) + parseInt(v["pb"], 10);
                        dc = parseInt(dc, 10) + parseInt(v["pb"], 10);
                    };
                    update["spell_attack_mod"] = spell_mod;
                    update["spell_attack_bonus"] = atk;
                    update["spell_save_dc"] = dc;
                    var callback = function() {update_attacks("spells")};
                    setAttrs(update, {silent: true}, callback);
                });
            });
        });
    };

    var update_passive_perception = function() {
        getAttrs(["pb_type","passiveperceptionmod","perception_bonus"], function(v) {
            var passive_perception = 10;
            var mod = !isNaN(parseInt(v["passiveperceptionmod"],10)) ? parseInt(v["passiveperceptionmod"],10) : 0;
            var bonus = !isNaN(parseInt(v["perception_bonus"],10)) ? parseInt(v["perception_bonus"],10) : 0;
            if(v["pb_type"] && v["pb_type"] === "die" && v["perception_bonus"] && isNaN(v["perception_bonus"]) && v["perception_bonus"].indexOf("+") > -1) {
                var pieces = v["perception_bonus"].split(/\+|d/);
                var base = !isNaN(parseInt(pieces[0],10)) ? parseInt(pieces[0],10) : 0;
                var num_dice = !isNaN(parseInt(pieces[1],10)) ? parseInt(pieces[1],10) : 1;
                var half_pb_die = !isNaN(parseInt(pieces[2],10)) ? parseInt(pieces[2],10)/2 : 2;
                bonus = base + (num_dice * half_pb_die);
            }
            passive_perception = passive_perception + bonus + mod;
            setAttrs({passive_wisdom: passive_perception})
        });
    }

    var update_challenge = function() {
        getAttrs(["npc_challenge"], function(v) {
            var update = {};
            var xp = 0;
            var pb = 0;
            switch(v.npc_challenge) {
                case "0":
                    xp = "10";
                    pb = 2;
                    break;
                case "1/8":
                    xp = "25";
                    pb = 2;
                    break;
                case "1/4":
                    xp = "50";
                    pb = 2;
                    break;
                case "1/2":
                    xp = "100";
                    pb = 2;
                    break;
                case "1":
                    xp = "200";
                    pb = 2;
                    break;
                case "2":
                    xp = "450";
                    pb = 2;
                    break;
                case "3":
                    xp = "700";
                    pb = 2;
                    break;
                case "4":
                    xp = "1100";
                    pb = 2;
                    break;
                case "5":
                    xp = "1800";
                    pb = 3;
                    break;
                case "6":
                    xp = "2300";
                    pb = 3;
                    break;
                case "7":
                    xp = "2900";
                    pb = 3;
                    break;
                case "8":
                    xp = "3900";
                    pb = 3;
                    break;
                case "9":
                    xp = "5000";
                    pb = 4;
                    break;
                case "10":
                    xp = "5900";
                    pb = 4;
                    break;
                case "11":
                    xp = "7200";
                    pb = 4;
                    break;
                case "12":
                    xp = "8400";
                    pb = 4;
                    break;
                case "13":
                    xp = "10000";
                    pb = 5;
                    break;
                case "14":
                    xp = "11500";
                    pb = 5;
                    break;
                case "15":
                    xp = "13000";
                    pb = 5;
                    break;
                case "16":
                    xp = "15000";
                    pb = 5;
                    break;
                case "17":
                    xp = "18000";
                    pb = 6;
                    break;
                case "18":
                    xp = "20000";
                    pb = 6;
                    break;
                case "19":
                    xp = "22000";
                    pb = 6;
                    break;
                case "20":
                    xp = "25000";
                    pb = 6;
                    break;
                case "21":
                    xp = "33000";
                    pb = 7;
                    break;
                case "22":
                    xp = "41000";
                    pb = 7;
                    break;
                case "23":
                    xp = "50000";
                    pb = 7;
                    break;
                case "24":
                    xp = "62000";
                    pb = 7;
                    break;
                case "25":
                    xp = "75000";
                    pb = 8;
                    break;
                case "26":
                    xp = "90000";
                    pb = 8;
                    break;
                case "27":
                    xp = "105000";
                    pb = 8;
                    break;
                case "28":
                    xp = "120000";
                    pb = 8;
                    break;
                case "29":
                    xp = "";
                    pb = 9;
                    break;
                case "30":
                    xp = "155000";
                    pb = 9;
                    break;
            }
            update["npc_xp"] = xp;
            update["pb_custom"] = pb;
            update["pb_type"] = "custom";
            setAttrs(update, {silent: true}, function() {update_pb()});
        });
    };

    var update_npc_saves = function() {
        getAttrs(["npc_str_save_base","npc_dex_save_base","npc_con_save_base","npc_int_save_base","npc_wis_save_base","npc_cha_save_base"], function(v) {
            var update = {};
            var last_save = 0; var cha_save_flag = 0; var cha_save = ""; var wis_save_flag = 0; var wis_save = ""; var int_save_flag = 0; var int_save = ""; var con_save_flag = 0; var con_save = ""; var dex_save_flag = 0; var dex_save = ""; var str_save_flag = 0; var str_save = "";
            // 1 = Positive, 2 = Last, 3 = Negative, 4 = Last Negative
            if(v.npc_cha_save_base && v.npc_cha_save_base != "@{charisma_mod}") {cha_save = parseInt(v.npc_cha_save_base, 10); if(last_save === 0) {last_save = 1; cha_save_flag = cha_save < 0 ? 4 : 2;} else {cha_save_flag = cha_save < 0 ? 3 : 1;} } else {cha_save_flag = 0; cha_save = "";};
            if(v.npc_wis_save_base && v.npc_wis_save_base != "@{wisdom_mod}") {wis_save = parseInt(v.npc_wis_save_base, 10); if(last_save === 0) {last_save = 1; wis_save_flag = wis_save < 0 ? 4 : 2;} else {wis_save_flag = wis_save < 0 ? 3 : 1;} } else {wis_save_flag = 0; wis_save = "";};
            if(v.npc_int_save_base && v.npc_int_save_base != "@{intelligence_mod}") {int_save = parseInt(v.npc_int_save_base, 10); if(last_save === 0) {last_save = 1; int_save_flag = int_save < 0 ? 4 : 2;} else {int_save_flag = int_save < 0 ? 3 : 1;} } else {int_save_flag = 0; int_save = "";};
            if(v.npc_con_save_base && v.npc_con_save_base != "@{constitution_mod}") {con_save = parseInt(v.npc_con_save_base, 10); if(last_save === 0) {last_save = 1; con_save_flag = con_save < 0 ? 4 : 2;} else {con_save_flag = con_save < 0 ? 3 : 1;} } else {con_save_flag = 0; con_save = "";};
            if(v.npc_dex_save_base && v.npc_dex_save_base != "@{dexterity_mod}") {dex_save = parseInt(v.npc_dex_save_base, 10); if(last_save === 0) {last_save = 1; dex_save_flag = dex_save < 0 ? 4 : 2;} else {dex_save_flag = dex_save < 0 ? 3 : 1;} } else {dex_save_flag = 0; dex_save = "";};
            if(v.npc_str_save_base && v.npc_str_save_base != "@{strength_mod}") {str_save = parseInt(v.npc_str_save_base, 10); if(last_save === 0) {last_save = 1; str_save_flag = str_save < 0 ? 4 : 2;} else {str_save_flag = str_save < 0 ? 3 : 1;} } else {str_save_flag = 0; str_save = "";};

            update["npc_saving_flag"] = "" + cha_save + wis_save + int_save + con_save + dex_save + str_save;
            update["npc_str_save"] = str_save;
            update["npc_str_save_flag"] = str_save_flag;
            update["npc_dex_save"] = dex_save;
            update["npc_dex_save_flag"] = dex_save_flag;
            update["npc_con_save"] = con_save;
            update["npc_con_save_flag"] = con_save_flag;
            update["npc_int_save"] = int_save;
            update["npc_int_save_flag"] = int_save_flag;
            update["npc_wis_save"] = wis_save;
            update["npc_wis_save_flag"] = wis_save_flag;
            update["npc_cha_save"] = cha_save;
            update["npc_cha_save_flag"] = cha_save_flag;
            setAttrs(update, {silent: true});
        });
    };

    var update_npc_skills = function() {
        getAttrs(["npc_acrobatics_base","npc_animal_handling_base","npc_arcana_base","npc_athletics_base","npc_deception_base","npc_history_base","npc_insight_base","npc_intimidation_base","npc_investigation_base","npc_medicine_base","npc_nature_base","npc_perception_base","npc_performance_base","npc_persuasion_base","npc_religion_base","npc_sleight_of_hand_base","npc_stealth_base","npc_survival_base"], function(v) {
            var update = {};
            var last_skill = 0;
            var survival_flag = 0; var survival = ""; var stealth_flag = 0; var stealth = ""; var sleight_of_hand_flag = 0; var sleight_of_hand = ""; var religion_flag = 0; var religion = ""; var persuasion_flag = 0; var persuasion = ""; var performance_flag = 0; var sperformance = ""; var perception_flag = 0; var perception = ""; var perception_flag = 0; var perception = ""; var nature_flag = 0; var nature = ""; var medicine_flag = 0; var medicine = ""; var investigation_flag = 0; var investigation = ""; var intimidation_flag = 0; var intimidation = ""; var insight_flag = 0; var insight = ""; var history_flag = 0; var history = ""; var deception_flag = 0; var deception = ""; var athletics_flag = 0; var athletics = ""; var arcana_flag = 0; var arcana = ""; var animal_handling_flag = 0; var animal_handling = ""; var acrobatics_flag = 0; var acrobatics = "";

            // 1 = Positive, 2 = Last, 3 = Negative, 4 = Last Negative
            if(v.npc_survival_base && v.npc_survival_base != "@{wisdom_mod}") {survival = parseInt(v.npc_survival_base, 10); if(last_skill === 0) {last_skill = 1; survival_flag = survival < 0 ? 4 : 2;} else {survival_flag = survival < 0 ? 3 : 1;} } else {survival_flag = 0; survival = "";};
            if(v.npc_stealth_base && v.npc_stealth_base != "@{dexterity_mod}") {stealth = parseInt(v.npc_stealth_base, 10); if(last_skill === 0) {last_skill = 1; stealth_flag = stealth < 0 ? 4 : 2;} else {stealth_flag = stealth < 0 ? 3 : 1;} } else {stealth_flag = 0; stealth = "";};
            if(v.npc_sleight_of_hand_base && v.npc_sleight_of_hand_base != "@{dexterity_mod}") {sleight_of_hand = parseInt(v.npc_sleight_of_hand_base, 10); if(last_skill === 0) {last_skill = 1; sleight_of_hand_flag = sleight_of_hand < 0 ? 4 : 2;} else {sleight_of_hand_flag = sleight_of_hand < 0 ? 3 : 1;} } else {sleight_of_hand_flag = 0; sleight_of_hand = "";};
            if(v.npc_religion_base && v.npc_religion_base != "@{intelligence_mod}") {religion = parseInt(v.npc_religion_base, 10); if(last_skill === 0) {last_skill = 1; religion_flag = religion < 0 ? 4 : 2;} else {religion_flag = religion < 0 ? 3 : 1;} } else {religion_flag = 0; religion = "";};
            if(v.npc_persuasion_base && v.npc_persuasion_base != "@{charisma_mod}") {persuasion = parseInt(v.npc_persuasion_base, 10); if(last_skill === 0) {last_skill = 1; persuasion_flag = persuasion < 0 ? 4 : 2;} else {persuasion_flag = persuasion < 0 ? 3 : 1;} } else {persuasion_flag = 0; persuasion = "";};
            if(v.npc_performance_base && v.npc_performance_base != "@{charisma_mod}") {sperformance = parseInt(v.npc_performance_base, 10); if(last_skill === 0) {last_skill = 1; performance_flag = sperformance < 0 ? 4 : 2;} else {performance_flag = sperformance < 0 ? 3 : 1;} } else {performance_flag = 0; sperformance = "";};
            if(v.npc_perception_base && v.npc_perception_base != "@{wisdom_mod}") {perception = parseInt(v.npc_perception_base, 10); if(last_skill === 0) {last_skill = 1; perception_flag = perception < 0 ? 4 : 2;} else {perception_flag = perception < 0 ? 3 : 1;} } else {perception_flag = 0; perception = "";};
            if(v.npc_nature_base && v.npc_nature_base != "@{intelligence_mod}") {nature = parseInt(v.npc_nature_base, 10); if(last_skill === 0) {last_skill = 1; nature_flag = nature < 0 ? 4 : 2;} else {nature_flag = nature < 0 ? 3 : 1;} } else {nature_flag = 0; nature = "";};
            if(v.npc_medicine_base && v.npc_medicine_base != "@{wisdom_mod}") {medicine = parseInt(v.npc_medicine_base, 10); if(last_skill === 0) {last_skill = 1; medicine_flag = medicine < 0 ? 4 : 2;} else {medicine_flag = medicine < 0 ? 3 : 1;} } else {medicine_flag = 0; medicine = "";};
            if(v.npc_investigation_base && v.npc_investigation_base != "@{intelligence_mod}") {investigation = parseInt(v.npc_investigation_base, 10); if(last_skill === 0) {last_skill = 1; investigation_flag = investigation < 0 ? 4 : 2;} else {investigation_flag = investigation < 0 ? 3 : 1;} } else {investigation_flag = 0; investigation = "";};
            if(v.npc_intimidation_base && v.npc_intimidation_base != "@{charisma_mod}") {intimidation = parseInt(v.npc_intimidation_base, 10); if(last_skill === 0) {last_skill = 1; intimidation_flag = intimidation < 0 ? 4 : 2;} else {intimidation_flag = intimidation < 0 ? 3 : 1;} } else {intimidation_flag = 0; intimidation = "";};
            if(v.npc_insight_base && v.npc_insight_base != "@{wisdom_mod}") {insight = parseInt(v.npc_insight_base, 10); if(last_skill === 0) {last_skill = 1; insight_flag = insight < 0 ? 4 : 2;} else {insight_flag = insight < 0 ? 3 : 1;} } else {insight_flag = 0; insight = "";};
            if(v.npc_history_base && v.npc_history_base != "@{intelligence_mod}") {history = parseInt(v.npc_history_base, 10); if(last_skill === 0) {last_skill = 1; history_flag = history < 0 ? 4 : 2;} else {history_flag = history < 0 ? 3 : 1;} } else {history_flag = 0; history = "";};
            if(v.npc_deception_base && v.npc_deception_base != "@{charisma_mod}") {deception = parseInt(v.npc_deception_base, 10); if(last_skill === 0) {last_skill = 1; deception_flag = deception < 0 ? 4 : 2;} else {deception_flag = deception < 0 ? 3 : 1;} } else {deception_flag = 0; deception = "";};
            if(v.npc_athletics_base && v.npc_athletics_base != "@{strength_mod}") {athletics = parseInt(v.npc_athletics_base, 10); if(last_skill === 0) {last_skill = 1; athletics_flag = athletics < 0 ? 4 : 2;} else {athletics_flag = athletics < 0 ? 3 : 1;} } else {athletics_flag = 0; athletics = "";};
            if(v.npc_arcana_base && v.npc_arcana_base != "@{intelligence_mod}") {arcana = parseInt(v.npc_arcana_base, 10); if(last_skill === 0) {last_skill = 1; arcana_flag = arcana < 0 ? 4 : 2;} else {arcana_flag = arcana < 0 ? 3 : 1;} } else {arcana_flag = 0; arcana = "";};
            if(v.npc_animal_handling_base && v.npc_animal_handling_base != "@{wisdom_mod}") {animal_handling = parseInt(v.npc_animal_handling_base, 10); if(last_skill === 0) {last_skill = 1; animal_handling_flag = animal_handling < 0 ? 4 : 2;} else {animal_handling_flag = animal_handling < 0 ? 3 : 1;} } else {animal_handling_flag = 0; animal_handling = "";};
            if(v.npc_acrobatics_base && v.npc_acrobatics_base != "@{dexterity_mod}") {acrobatics = parseInt(v.npc_acrobatics_base, 10); if(last_skill === 0) {last_skill = 1; acrobatics_flag = acrobatics < 0 ? 4 : 2;} else {acrobatics_flag = acrobatics < 0 ? 3 : 1;} } else {acrobatics_flag = 0; acrobatics = "";};

            update["npc_skills_flag"] = "" + acrobatics + animal_handling + arcana + athletics + deception + history + insight + intimidation + investigation + medicine + nature + perception + sperformance + persuasion + religion + sleight_of_hand + stealth + survival;
            update["npc_stealth_flag"] = stealth_flag;
            update["npc_survival"] = survival;;
            update["npc_acrobatics"] = acrobatics;
            update["npc_acrobatics_flag"] = acrobatics_flag;
            update["npc_animal_handling"] = animal_handling;
            update["npc_animal_handling_flag"] = animal_handling_flag;
            update["npc_arcana"] = arcana;
            update["npc_arcana_flag"] = arcana_flag;
            update["npc_athletics"] = athletics;
            update["npc_athletics_flag"] = athletics_flag;
            update["npc_deception"] = deception;
            update["npc_deception_flag"] = deception_flag;
            update["npc_history"] = history;
            update["npc_history_flag"] = history_flag;
            update["npc_insight"] = insight;
            update["npc_insight_flag"] = insight_flag;
            update["npc_intimidation"] = intimidation;
            update["npc_intimidation_flag"] = intimidation_flag;
            update["npc_investigation"] = investigation;
            update["npc_investigation_flag"] = investigation_flag;
            update["npc_medicine"] = medicine;
            update["npc_medicine_flag"] = medicine_flag;
            update["npc_nature"] = nature;
            update["npc_nature_flag"] = nature_flag;
            update["npc_perception"] = perception;
            update["npc_perception_flag"] = perception_flag;
            update["npc_performance"] = sperformance;
            update["npc_performance_flag"] = performance_flag;
            update["npc_persuasion"] = persuasion;
            update["npc_persuasion_flag"] = persuasion_flag;
            update["npc_religion"] = religion;
            update["npc_religion_flag"] = religion_flag;
            update["npc_sleight_of_hand"] = sleight_of_hand;
            update["npc_sleight_of_hand_flag"] = sleight_of_hand_flag;
            update["npc_stealth"] = stealth;
            update["npc_stealth_flag"] = stealth_flag;
            update["npc_survival"] = survival;
            update["npc_survival_flag"] = survival_flag;
            setAttrs(update, {silent: true});
        });
    };

    var update_npc_action = function(update_id, legendary) {
        if(update_id.substring(0,1) === "-" && update_id.length === 20) {
            do_update_npc_action([update_id], legendary);
        }
        else if(update_id === "all") {
            var legendary_array = [];
            var actions_array = [];
            getSectionIDs("repeating_npcaction-l", function(idarray) {
                legendary_array = idarray;
                if(legendary_array.length > 0) {
                    do_update_npc_action(legendary_array, true);
                }
                getSectionIDs("repeating_npcaction", function(idarray) {
                    actions_array = idarray.filter(function(i) {return legendary_array.indexOf(i) < 0;});
                    if(actions_array.length > 0) {
                        do_update_npc_action(actions_array, false);
                    };
                });
            });
        };
    };

    var do_update_npc_action = function(action_array, legendary) {
        var repvar = legendary ? "repeating_npcaction-l_" : "repeating_npcaction_";
        var action_attribs = ["dtype"];
        _.each(action_array, function(actionid) {
            action_attribs.push(repvar + actionid + "_attack_flag");
            action_attribs.push(repvar + actionid + "_attack_type");
            action_attribs.push(repvar + actionid + "_attack_range");
            action_attribs.push(repvar + actionid + "_attack_target");
            action_attribs.push(repvar + actionid + "_attack_tohit");
            action_attribs.push(repvar + actionid + "_attack_damage");
            action_attribs.push(repvar + actionid + "_attack_damagetype");
            action_attribs.push(repvar + actionid + "_attack_damage2");
            action_attribs.push(repvar + actionid + "_attack_damagetype2");
        });

        getAttrs(action_attribs, function(v) {
            _.each(action_array, function(actionid) {
                console.log("UPDATING NPC ACTION: " + actionid);
                var callbacks = [];
                var update = {};
                var onhit = "";
                var damage_flag = "";
                var range = "";
                var attack_flag = v[repvar + actionid + "_attack_flag"] && v[repvar + actionid + "_attack_flag"] != "0" ? "{{attack=1}}" : "";
                var tohit = v[repvar + actionid + "_attack_tohit"] && isNaN(parseInt(v[repvar + actionid + "_attack_tohit"], 10)) === false ? parseInt(v[repvar + actionid + "_attack_tohit"], 10) : 0;
                if(v[repvar + actionid + "_attack_type"] && v[repvar + actionid + "_attack_range"]) {
                    if(v[repvar + actionid + "_attack_type"] === "Melee") {var rangetype = "Reach";} else {var rangetype = "Range";};
                    range = ", " + rangetype + " " + v[repvar + actionid + "_attack_range"];
                }
                var target = v[repvar + actionid + "_attack_target"] && v[repvar + actionid + "_attack_target"] != "" ? ", " + v[repvar + actionid + "_attack_target"] : ""
                var attack_tohitrange = "+" + tohit + range + target;
                var dmg1 = v[repvar + actionid + "_attack_damage"] && v[repvar + actionid + "_attack_damage"] != "" ? v[repvar + actionid + "_attack_damage"] : "";
                var dmg1type = v[repvar + actionid + "_attack_damagetype"] && v[repvar + actionid + "_attack_damagetype"] != "" ? " " + v[repvar + actionid + "_attack_damagetype"] : "";
                var dmg2 = v[repvar + actionid + "_attack_damage2"] && v[repvar + actionid + "_attack_damage2"] != "" ? v[repvar + actionid + "_attack_damage2"] : "";
                var dmg2type = v[repvar + actionid + "_attack_damagetype2"] && v[repvar + actionid + "_attack_damagetype2"] != "" ? " " + v[repvar + actionid + "_attack_damagetype2"] : "";
                var dmgspacer = dmg1 != "" && dmg2 != "" ? " plus " : "";
                if(dmg1 != "") {
                    dmg1t = dmg1.replace(/\s/g, '').split(/d|(?=\+|\-)/g);
                    dmg1t2 = isNaN(eval(dmg1t[1])) === false ? eval(dmg1t[1]) : 0;
                    if(dmg1t.length < 2) {
                        onhit = onhit + dmg1t[0] + " (" + dmg1 + ")" + dmg1type + " damage";
                    }
                    else if(dmg1t.length < 3) {
                        onhit = onhit + Math.floor(dmg1t[0]*((dmg1t2/2)+0.5)) + " (" + dmg1 + ")" + dmg1type + " damage";
                    }
                    else {
                        onhit = onhit + (Math.floor(dmg1t[0]*((dmg1t2/2)+0.5))+parseInt(dmg1t[2],10)) + " (" + dmg1 + ")" + dmg1type + " damage";
                    };
                };
                dmgspacer = dmg1 != "" && dmg2 != "" ? " plus " : "";
                onhit = onhit + dmgspacer;
                if(dmg2 != "") {
                    dmg2t = dmg2.replace(/\s/g, '').split(/[d+]+/);
                    dmg2t2 = isNaN(eval(dmg2t[1])) === false ? eval(dmg2t[1]) : 0;
                    if(dmg2t.length < 2) {
                        onhit = onhit + dmg2t[0] + " (" + dmg2 + ")" + dmg2type + " damage";
                    }
                    else if(dmg2t.length < 3) {
                        onhit = onhit + Math.floor(dmg2t[0]*((dmg2t2/2)+0.5)) + " (" + dmg2 + ")" + dmg2type + " damage";
                    }
                    else {
                        onhit = onhit + (Math.floor(dmg2t[0]*((dmg2t2/2)+0.5))+parseInt(dmg2t[2],10)) + " (" + dmg2 + ")" + dmg2type + " damage";
                    };
                };
                if(dmg1 != "" || dmg2 != "") {damage_flag = damage_flag + "{{damage=1}} "};
                if(dmg1 != "") {damage_flag = damage_flag + "{{dmg1flag=1}} "};
                if(dmg2 != "") {damage_flag = damage_flag + "{{dmg2flag=1}} "};
                var crit1 = dmg1 != "" && dmg1t.length > 1 ? dmg1t[0] + "d" + dmg1t[1] : "";
                var crit2 = dmg2 != "" && dmg2t.length > 1 ? dmg2t[0] + "d" + dmg2t[1] : "";
                var rollbase = "";
                if(v.dtype === "full") {
                    rollbase = "@{wtype}&{template:npcaction} " + attack_flag + " @{damage_flag} @{npc_name_flag} {{rname=@{name}}} {{r1=[[@{d20}+(@{attack_tohit}+0)]]}} @{rtype}+(@{attack_tohit}+0)]]}} {{dmg1=[[@{attack_damage}+0]]}} {{dmg1type=@{attack_damagetype}}} {{dmg2=[[@{attack_damage2}+0]]}} {{dmg2type=@{attack_damagetype2}}} {{crit1=[[@{attack_crit}+0]]}} {{crit2=[[@{attack_crit2}+0]]}} {{description=@{show_desc}}} @{charname_output}";
                }
                else if(v[repvar + actionid + "_attack_flag"] && v[repvar + actionid + "_attack_flag"] != "0") {
                    if(legendary) {
                        rollbase = "@{wtype}&{template:npcatk} " + attack_flag + " @{damage_flag} @{npc_name_flag} {{rname=[@{name}](~repeating_npcaction-l_npc_dmg)}} {{rnamec=[@{name}](~repeating_npcaction-l_npc_crit)}} {{type=[Attack](~repeating_npcaction-l_npc_dmg)}} {{typec=[Attack](~repeating_npcaction-l_npc_crit)}} {{r1=[[@{d20}+(@{attack_tohit}+0)]]}} @{rtype}+(@{attack_tohit}+0)]]}} {{description=@{show_desc}}} @{charname_output}"
                    }
                    else {
                        rollbase = "@{wtype}&{template:npcatk} " + attack_flag + " @{damage_flag} @{npc_name_flag} {{rname=[@{name}](~repeating_npcaction_npc_dmg)}} {{rnamec=[@{name}](~repeating_npcaction_npc_crit)}} {{type=[Attack](~repeating_npcaction_npc_dmg)}} {{typec=[Attack](~repeating_npcaction_npc_crit)}} {{r1=[[@{d20}+(@{attack_tohit}+0)]]}} @{rtype}+(@{attack_tohit}+0)]]}} {{description=@{show_desc}}} @{charname_output}";
                    }
                }
                else if(dmg1 || dmg2) {
                    rollbase = "@{wtype}&{template:npcdmg} @{damage_flag} {{dmg1=[[@{attack_damage}+0]]}} {{dmg1type=@{attack_damagetype}}} {{dmg2=[[@{attack_damage2}+0]]}} {{dmg2type=@{attack_damagetype2}}} {{crit1=[[@{attack_crit}+0]]}} {{crit2=[[@{attack_crit2}+0]]}} @{charname_output}"
                }
                else {
                    rollbase = "@{wtype}&{template:npcaction} @{npc_name_flag} {{rname=@{name}}} {{description=@{show_desc}}} @{charname_output}"
                }

                update[repvar + actionid + "_attack_tohitrange"] = attack_tohitrange;
                update[repvar + actionid + "_attack_onhit"] = onhit;
                update[repvar + actionid + "_damage_flag"] = damage_flag;
                update[repvar + actionid + "_attack_crit"] = crit1;
                update[repvar + actionid + "_attack_crit2"] = crit2;
                update[repvar + actionid + "_rollbase"] = rollbase;
                setAttrs(update, {silent: true});
            });
        });
    };

    var v2_old_values_check = function() {
        // update_attacks("all");
        var update = {};
        var attrs = ["simpletraits","features_and_traits","initiative_bonus","npc","character_id"];
        getSectionIDs("repeating_spell-npc", function(idarray) {
            _.each(idarray, function(id) {
                attrs.push("repeating_spell-npc_" + id + "_rollcontent");
            });
            getAttrs(attrs, function(v) {
                if(v["npc"] && v["npc"] == 1 && (!v["initiative_bonus"] || v["initiative_bonus"] == 0)) {
                    update_initiative();
                }
                var spellflag = idarray && idarray.length > 0 ? 1 : 0;
                var missing = v["features_and_traits"] && v["simpletraits"] === "complex" ? 1 : 0;
                update["npcspell_flag"] = spellflag;
                update["missing_info"] = missing;
                _.each(idarray, function(id) {
                    var content = v["repeating_spell-npc_" + id + "_rollcontent"];
                    if(content.substring(0,3) === "%{-" && content.substring(22,41) === "|repeating_attack_-" && content.substring(60,68) === "_attack}") {
                        var thisid = content.substring(2,21);
                        if(thisid != v["character_id"]) {
                            update["repeating_spell-npc_" + id + "_rollcontent"] = content.substring(0,2) + v["character_id"] + content.substring(22,68);
                        }
                    }
                });
                setAttrs(update);
            });

        });

    };

    var upgrade_to_2_0 = function(doneupdating) {
        getAttrs(["npc","strength","dexterity","constitution","intelligence","wisdom","charisma","strength_base","dexterity_base","constitution_base","intelligence_base","wisdom_base","charisma_base","deathsavemod","death_save_mod","npc_str_save","npc_dex_save","npc_con_save","npc_int_save","npc_wis_save","npc_cha_save","npc_str_save_base","npc_dex_save_base","npc_con_save_base","npc_int_save_base","npc_wis_save_base","npc_cha_save_base","npc_acrobatics_base", "npc_animal_handling_base", "npc_arcana_base", "npc_athletics_base", "npc_deception_base", "npc_history_base", "npc_insight_base", "npc_intimidation_base", "npc_investigation_base", "npc_medicine_base", "npc_nature_base", "npc_perception_base", "npc_performance_base", "npc_persuasion_base", "npc_religion_base", "npc_sleight_of_hand_base", "npc_stealth_base", "npc_survival_base", "npc_acrobatics", "npc_animal_handling", "npc_arcana", "npc_athletics", "npc_deception", "npc_history", "npc_insight", "npc_intimidation", "npc_investigation", "npc_medicine", "npc_nature", "npc_perception", "npc_performance", "npc_persuasion", "npc_religion", "npc_sleight_of_hand", "npc_stealth", "npc_survival"], function(v) {
            var update = {};
            var stats = ["strength","dexterity","constitution","intelligence","wisdom","charisma"];
            var npc_stats = ["npc_str_save","npc_dex_save","npc_con_save","npc_int_save","npc_wis_save","npc_cha_save","npc_acrobatics", "npc_animal_handling", "npc_arcana", "npc_athletics", "npc_deception", "npc_history", "npc_insight", "npc_intimidation", "npc_investigation", "npc_medicine", "npc_nature", "npc_perception", "npc_performance", "npc_persuasion", "npc_religion", "npc_sleight_of_hand", "npc_stealth", "npc_survival"];
            _.each(stats, function(attr) {
                if(v[attr] && v[attr] != "10" && v[attr + "_base"] == "10") {
                    update[attr + "_base"] = v[attr];
                }

            });
            _.each(npc_stats, function(attr) {
                if(v[attr] && !isNaN(v[attr]) && v[attr + "_base"] == "") {
                    update[attr + "_base"] = v[attr];
                }

            });
            if(v["deathsavemod"] && v["deathsavemod"] != "0" && v["death_save_mod"] === "0") {v["death_save_mod"] = v["deathsavemod"];};

            if(v["npc"] && v["npc"] == "1") {
                var callback = function() {
                    update_attr("all");
                    update_mod("strength");
                    update_mod("dexterity");
                    update_mod("constitution");
                    update_mod("intelligence");
                    update_mod("wisdom");
                    update_mod("charisma");
                    update_npc_action("all");
                    update_npc_saves();
                    update_npc_skills();
                    update_initiative();
                }
            }
            else {
                var callback = function() {
                    update_attr("all");
                    update_mod("strength");
                    update_mod("dexterity");
                    update_mod("constitution");
                    update_mod("intelligence");
                    update_mod("wisdom");
                    update_mod("charisma");
                    update_all_saves();
                    update_skills(["athletics", "acrobatics", "sleight_of_hand", "stealth", "arcana", "history", "investigation", "nature", "religion", "animal_handling", "insight", "medicine", "perception", "survival","deception", "intimidation", "performance", "persuasion"]);
                    update_tool("all")
                    update_attacks("all");
                    update_pb();
                    update_jack_attr();
                    update_initiative();
                    update_weight();
                    update_spell_info();
                    update_ac();
                }
            }

            setAttrs(update, {silent: true}, callback);
            doneupdating();
        });
    };

    var upgrade_to_2_1 = function(doneupdating) {
        v2_old_values_check();
        doneupdating();
    };

    var versioning = function() {
        getAttrs(["version"], function(v) {
            if(v["version"] === "2.1") {
                console.log("5th Edition OGL by Roll20 v" + v["version"]);
                return;
            }
            else if(v["version"] === "2.0") {
                console.log("UPGRADING TO v2.1");
                upgrade_to_2_1(function() {
                    setAttrs({version: "2.1"});
                    versioning();
                });
            }
            else {
                console.log("UPGRADING TO v2.0");
                upgrade_to_2_0(function() {
                    setAttrs({version: "2.0"});
                    versioning();
                });
            };
        });
    };