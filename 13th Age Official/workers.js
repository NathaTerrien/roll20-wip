    /* === GLOBAL VARIABLES === */
    const i18n_atwill = getTranslationByKey("at-will"),
        i18n_talent = getTranslationByKey("talent"),
        i18n_feature = getTranslationByKey("feature"),
        i18n_power = getTranslationByKey("power"),
        i18n_battlecry = getTranslationByKey("battle-cry"),
        i18n_domain = getTranslationByKey("domain"),
        i18n_encounter = getTranslationByKey("encounter"),
        i18n_recharge = getTranslationByKey("recharge"),
        i18n_daily = getTranslationByKey("daily"),
        i18n_spell = getTranslationByKey("spell"),
        i18n_magicitem = getTranslationByKey("magic-item"),
        i18n_standardaction = getTranslationByKey("standard-action"),
        i18n_moveaction = getTranslationByKey("move-action"),
        i18n_quickaction = getTranslationByKey("quick-action"),
        i18n_freeaction = getTranslationByKey("free-action"),
        i18n_flexibleaction = getTranslationByKey("flexible-action"),
        i18n_engaged = getTranslationByKey("engaged"),
        i18n_nearby = getTranslationByKey("nearby"),
        i18n_faraway = getTranslationByKey("far-away"),
        i18n_intercepting = getTranslationByKey("intercepting"),
        i18n_lineofsight = getTranslationByKey("line-of-sight"),
        i18n_lvlu = getTranslationByKey("lvl-u"),
        i18n_stru = getTranslationByKey("str-u"),
        i18n_conu = getTranslationByKey("con-u"),
        i18n_dexu = getTranslationByKey("dex-u"),
        i18n_intu = getTranslationByKey("int-u"),
        i18n_wisu = getTranslationByKey("wis-u"),
        i18n_chau = getTranslationByKey("cha-u"),
        i18n_weapu = getTranslationByKey("weap-u"),
        i18n_unknownu = getTranslationByKey("unknown-u"),
        i18n_modifiers = getTranslationByKey("modifiers"),
        i18n_modu = getTranslationByKey("mod-u"),
        i18n_acu = getTranslationByKey("ac-u"),
        i18n_pdu = getTranslationByKey("pd-u"),
        i18n_mdu = getTranslationByKey("md-u"),
        i18n_vs = getTranslationByKey("vs"),
        i18n_hit = getTranslationByKey("hit"),
        i18n_miss = getTranslationByKey("miss"),
        i18n_trigger = getTranslationByKey("trigger"),
        i18n_effect = getTranslationByKey("effect"),
        i18n_improved = getTranslationByKey("improved"),
        i18n_sustain = getTranslationByKey("sustain"),
        i18n_special = getTranslationByKey("special"),
        i18n_opening = getTranslationByKey("opening-sustaining-effect"),
        i18n_finalverse = getTranslationByKey("final-verse"),
        i18n_details = getTranslationByKey("details")
        ;

    /* === EVENTS === */

    // === Version handling
    on("sheet:opened", function() {
        versioning();
    });

    // === Abilities
    on("change:str-base", function(e) {
        setAttrs({"STR-mod": Math.floor((parseInt(e.newValue) - 10) / 2)});
    });
    on("change:con-base", function(e) {
        setAttrs({"CON-mod": Math.floor((parseInt(e.newValue) - 10) / 2)});
    });
    on("change:dex-base", function(e) {
        setAttrs({"DEX-mod": Math.floor((parseInt(e.newValue) - 10) / 2)});
    });
    on("change:int-base", function(e) {
        setAttrs({"INT-mod": Math.floor((parseInt(e.newValue) - 10) / 2)});
    });
    on("change:wis-base", function(e) {
        setAttrs({"WIS-mod": Math.floor((parseInt(e.newValue) - 10) / 2)});
    });
    on("change:cha-base", function(e) {
        setAttrs({"CHA-mod": Math.floor((parseInt(e.newValue) - 10) / 2)});
    });

    // === Level / AC / PD / MD / HP / Recovery (mod) / Weapons (mods level) / Powers (mods level)
    on("change:ac-base change:str-mod change:con-mod change:dex-mod change:int-mod change:wis-mod change:cha-mod change:pd-base change:md-base change:hp-base change:hp-mod change:rec-mod change:level change:m-miss change:r-miss",function(e){
        if (["level","m-miss","r-miss"].includes(e.sourceAttribute)) {updateLvl()}
        if (["level","ac-base","con-mod","dex-mod","wis-mod"].includes(e.sourceAttribute)) {updateAc()}
        if (["level","pd-base","str-mod","con-mod","dex-mod"].includes(e.sourceAttribute)) {updatePd()}
        if (["level","md-base","int-mod","wis-mod","cha-mod"].includes(e.sourceAttribute)) {updateMd()}
        if (["level","hp-base","hp-mod","con-mod"].includes(e.sourceAttribute)) {updateHp()}
        if (["level","con-mod","rec-mod"].includes(e.sourceAttribute)) {updateRec()}
        if (["level","str-mod","dex-mod"].includes(e.sourceAttribute)) {
            getAttrs(["MWEAP-sel","RWEAP-sel"], function(v){
                updateMeleeWeapon(parseInt(v["MWEAP-sel"]) || 1);
                updateRangeWeapon(parseInt(v["RWEAP-sel"]) || 1);
            });
        }
        if (["level","str-mod","con-mod","dex-mod","int-mod","wis-mod","cha-mod"].includes(e.sourceAttribute)) {updateAllPowers()}
    });

    // === Background
    on("change:back-sel", function(e){
        updateBckgrd(parseInt(e.newValue) || 1);
    });
    on("change:BACK-name1 change:BACK1 change:BACK-name2 change:BACK2 change:BACK-name3 change:BACK3 change:BACK-name4 change:BACK4 change:BACK-name5 change:BACK5 change:BACK-name6 change:BACK6 change:BACK-name7 change:BACK7 change:BACK-name8 change:BACK8 change:BACK-name9 change:BACK9 change:BACK-name10 change:BACK10", function(e){
        getAttrs(["BACK-sel"], function(v){
            if((e.sourceAttribute == "back-name"+v["BACK-sel"]) || (e.sourceAttribute == "back"+v["BACK-sel"])){updateBckgrd(parseInt(v["BACK-sel"]) || 1);}
        });
    });

    // === Recovery
    on("change:rec_max", function(e) {
        getAttrs(["REC_max"], function(v) {
            setAttrs({
               "rec_flag": v.REC_max
            });
        });
    });

    // === Powers
    on("change:repeating_power:updateflag change:repeating_power:name change:repeating_power:type change:repeating_power:classtype change:repeating_power:type-custom change:repeating_power:rechargerate change:repeating_power:uses change:repeating_power:action change:repeating_power:action-type change:repeating_power:action-custom change:repeating_power:range change:repeating_power:range-type change:repeating_power:range-custom change:repeating_power:target change:repeating_power:target-type change:repeating_power:attack change:repeating_power:attack-type change:repeating_power:attack-custom change:repeating_power:attack-vstype change:repeating_power:attack-vscustom change:repeating_power:cust1 change:repeating_power:cust1-type change:repeating_power:cust1-custom change:repeating_power:cust1-subcust1 change:repeating_power:cust1-subcust2 change:repeating_power:cust1-subcust3 change:repeating_power:cust1-subcust4 change:repeating_power:cust1-subcust1-desc change:repeating_power:cust1-subcust2-desc change:repeating_power:cust1-subcust3-desc change:repeating_power:cust1-subcust4-desc change:repeating_power:cust2 change:repeating_power:cust2-type change:repeating_power:cust2-custom change:repeating_power:cust2-subcust1 change:repeating_power:cust2-subcust2 change:repeating_power:cust2-subcust3 change:repeating_power:cust2-subcust4 change:repeating_power:cust2-subcust1-desc change:repeating_power:cust2-subcust2-desc change:repeating_power:cust2-subcust3-desc change:repeating_power:cust2-subcust4-desc change:repeating_power:cust3 change:repeating_power:cust3-type change:repeating_power:cust3-custom change:repeating_power:cust3-subcust1 change:repeating_power:cust3-subcust2 change:repeating_power:cust3-subcust3 change:repeating_power:cust3-subcust4 change:repeating_power:cust3-subcust1-desc change:repeating_power:cust3-subcust2-desc change:repeating_power:cust3-subcust3-desc change:repeating_power:cust3-subcust4-desc", function(e) {
        updatePower(e);
    });

    // === Weapons
    // Selected Melee Weapon
    on("change:mweap-sel", function(e){
        updateMeleeWeapon(parseInt(e.newValue) || 1);
    });
    on("change:mweap-mod1 change:mweap-mod2 change:mweap-mod3 change:mweap1 change:mweap2 change:mweap3 change:m-bamod", function(e) {
        // Update select melee weapon if necessary
        getAttrs(["MWEAP-sel"], function(v){
            if((e.sourceAttribute == "m-bamod") || (e.sourceAttribute == "mweap-mod"+v["MWEAP-sel"]) || (e.sourceAttribute == "mweap"+v["MWEAP-sel"])){updateMeleeWeapon(parseInt(v["MWEAP-sel"]) || 1);}
        });
        // Update all powers
        if(["mweap-mod1","mweap-mod2","mweap-mod3"].includes(e.sourceAttribute)){updateAllPowers()}
    });
    //Selected Range Weapon
    on("change:rweap-sel", function(e){
        updateRangeWeapon(parseInt(e.newValue) || 1);
    });
    on("change:rweap-mod1 change:rweap-mod2 change:rweap-mod3 change:rweap1 change:rweap2 change:rweap3 change:r-bamod", function(e) {
        // Update select melee weapon if necessary
        getAttrs(["RWEAP-sel"], function(v){
            if((e.sourceAttribute == "r-bamod") || (e.sourceAttribute == "rweap-mod"+v["RWEAP-sel"]) || (e.sourceAttribute == "rweap"+v["RWEAP-sel"])){
                updateRangeWeapon(parseInt(v["RWEAP-sel"]) || 1);
            }
        });
        // Update all powers
        if(["rweap-mod1","rweap-mod2","rweap-mod3"].includes(e.sourceAttribute)){updateAllPowers()}
    });

    // === Icons
    on("change:icon1-5 change:icon2-5 change:icon3-5 change:icon4-5 change:icon5-5 change:icon1-6 change:icon2-6 change:icon3-6 change:icon4-6 change:icon5-6", function() {
        getAttrs(["icon1-5","icon2-5","icon3-5","icon4-5","icon5-5","icon1-6","icon2-6","icon3-6","icon4-6","icon5-6","icon1-5-count","icon2-5-count","icon3-5-count","icon4-5-count","icon5-5-count","icon1-6-count","icon2-6-count","icon3-6-count","icon4-6-count","icon5-6-count"], function(v) {
            var setAttrsObj = {};
            for(var input in v) {
                if(v[input] == "0" && typeof v[input+"-count"] !== "undefined" && (""+v[input+"-count"]).trim() !== "") {
                    setAttrsObj[input+"-count"] = 0;
                }
            }
            setAttrs(setAttrsObj);
        });
    });
    on("change:icon1-5-count change:icon2-5-count change:icon3-5-count change:icon4-5-count change:icon5-5-count change:icon1-6-count change:icon2-6-count change:icon3-6-count change:icon4-6-count change:icon5-6-count", function() {
        getAttrs(["icon1-5-count","icon2-5-count","icon3-5-count","icon4-5-count","icon5-5-count","icon1-6-count","icon2-6-count","icon3-6-count","icon4-6-count","icon5-6-count"], function(v) {
            var setAttrsObj = {},
                inputs = ["icon1-5-count","icon2-5-count","icon3-5-count","icon4-5-count","icon5-5-count","icon1-6-count","icon2-6-count","icon3-6-count","icon4-6-count","icon5-6-count"];
            _.each(inputs, function(input) {
                if(typeof v[input] === "undefined" || (""+v[input]).trim() === "") {
                    setAttrsObj[input.substr(0, input.indexOf("-count"))] = "0";
                }
                else if(v[input] && isNaN(v[input]) === false && (""+v[input]).trim() !== "0") {
                    setAttrsObj[input.substr(0, input.indexOf("-count"))] = "on";
                    setAttrsObj[input] = (typeof v[input] === "String") ? v[input].trim() : v[input];
                }
                else {
                    setAttrsObj[input.substr(0, input.indexOf("-count"))] = "0";
                    setAttrsObj[input] = 0;
                }
            });
            setAttrs(setAttrsObj);
        });
    });

    /* === FUNCTIONS === */
    // === Level
    var updateLvl = function() {
        getAttrs(["level","M-MISS","R-MISS"], function (v) {
            var mlt = 1, mmiss = 0, rmiss = 0, newlvl = parseInt(v["level"]) || 1;
            if (newlvl > 7) {mlt=3;}
            else if (newlvl > 4) {mlt=2;}
            if (v["M-MISS"] != "0") {mmiss = newlvl;}
            if (v["R-MISS"] != "0") {rmiss = newlvl;}
            setAttrs({
                "LVL-multiplier": mlt,
                "MBA-miss": mmiss,
                "RBA-miss": rmiss
            });
        });
    };
    // === AC
    var updateAc = function() {
        getAttrs(["level","AC-base","CON-mod","DEX-mod","WIS-mod"], function(v){
            var modarr = _.sortBy([parseInt(v["CON-mod"]),parseInt(v["DEX-mod"]),parseInt(v["WIS-mod"])], function(num) {return num;});
            setAttrs({"AC": parseInt(v["AC-base"])+parseInt(v["level"])+modarr[1]});
        });
    };
    // === PD
    var updatePd = function() {
        getAttrs(["level","PD-base","STR-mod","CON-mod","DEX-mod"], function(v){
            var modarr = _.sortBy([parseInt(v["STR-mod"]),parseInt(v["CON-mod"]),parseInt(v["DEX-mod"])], function(num) {return num;});
            setAttrs({"PD": parseInt(v["PD-base"])+parseInt(v["level"])+modarr[1]});
        });
    };
    // === MD
    var updateMd = function() {
        getAttrs(["level","MD-base","INT-mod","WIS-mod","CHA-mod"], function(v){
            var modarr = _.sortBy([parseInt(v["INT-mod"]),parseInt(v["WIS-mod"]),parseInt(v["CHA-mod"])], function(num) {return num;});
            setAttrs({"MD": parseInt(v["MD-base"])+parseInt(v["level"])+modarr[1]});
        });
    };
    // === HP
    var updateHp = function() {
        getAttrs(["level","HP-base","HP-mod","CON-mod"], function(v){
            var lvl = 0, mod4 = 0, hpmulti = 0, hpmax = 0;
            lvl = parseInt(v["level"]) || 1;
            mod4 = lvl % 4;
            hpmulti = lvl + 2 + (Math.floor(lvl/4) * mod4) + (Math.floor(lvl/8) * (6 + mod4));
            hpmax = ((parseInt(v["HP-base"])+parseInt(v["CON-mod"])) * hpmulti) + parseInt(v["HP-mod"]);
            setAttrs({
                "HP_max": hpmax,
                "HP-staggered": Math.floor(hpmax/2)
            });
        });
    };
    // === Recovery
    var updateRec = function () {
        getAttrs(["level","CON-mod","REC-bonus","REC-mod"], function(v){
            var mlt = 1, lvl = parseInt(v["level"]) || 1, oldrec = parseInt(v["REC-bonus"]) || 0;
            if (lvl > 7) {mlt=3;}
            else if (lvl > 4) {mlt=2;}
            setAttrs({"REC-bonus": (parseInt(v["CON-mod"]) || 0) * mlt + (parseInt(v["REC-mod"]) || 0)});
        });
    };
    // === Background
    var updateBckgrd = function(bcknb) {
        getAttrs(["BACK"+bcknb,"BACK-name"+bcknb], function (v) {
            var backval = parseInt(v["BACK"+bcknb]) || 0;
            setAttrs({"BACK-final": "[[" + backval + "]][BCK]]]}} {{back=" + v["BACK-name"+bcknb] + "}} {{back_bonus="+ backval + "}}"});
        });
    };

    // === Powers
    // All Powers
    var updateAllPowers = function() {
        console.log("*** DEBUG updateAllPowers");
        // Update a useless attribute (_updateflag) on all powers to trigger an invidual total update (updatePower())
        getSectionIDs("repeating_power", function(idarray) {
            var attrs = [];
            _.each(idarray, function(pid) {
                attrs.push("repeating_power_" + pid + "_updateflag");
            });
            getAttrs(attrs, function (v){
                var setAttrsObj = {};
                _.each(attrs, function(attr) {
                    setAttrsObj[attr] = (parseInt(v[attr]) || 0) + 1;
                });
                console.log("*** DEBUG updateAllPowers setAttrsObj:" + JSON.stringify(setAttrsObj));
                setAttrs(setAttrsObj,{silent: false});
            });
        });
    };
    // Single Power
    var updatePower = function(e) {
        console.log("*** DEBUG updatePower");
        getAttrs(["STR-mod","DEX-mod","CON-mod","INT-mod","CHA-mod","WIS-mod","level","MWEAP-mod1","MWEAP-mod2","MWEAP-mod3","RWEAP-mod1","RWEAP-mod2","RWEAP-mod3","repeating_power_name","repeating_power_type","repeating_power_type-custom","repeating_power_uses","repeating_power_action","repeating_power_action-type","repeating_power_action-custom","repeating_power_range","repeating_power_range-type","repeating_power_range-custom","repeating_power_target","repeating_power_target-type","repeating_power_attack","repeating_power_attack-type","repeating_power_attack-custom","repeating_power_attack-vstype","repeating_power_attack-vscustom","repeating_power_cust1","repeating_power_cust1-type","repeating_power_cust1-custom","repeating_power_cust1-subcust1","repeating_power_cust1-subcust2","repeating_power_cust1-subcust3","repeating_power_cust1-subcust4","repeating_power_cust1-subcust1-desc","repeating_power_cust1-subcust2-desc","repeating_power_cust1-subcust3-desc","repeating_power_cust1-subcust4-desc","repeating_power_cust2","repeating_power_cust2-type","repeating_power_cust2-custom","repeating_power_cust2-subcust1","repeating_power_cust2-subcust2","repeating_power_cust2-subcust3","repeating_power_cust2-subcust4","repeating_power_cust2-subcust1-desc","repeating_power_cust2-subcust2-desc","repeating_power_cust2-subcust3-desc","repeating_power_cust2-subcust4-desc","repeating_power_cust3","repeating_power_cust3-type","repeating_power_cust3-custom","repeating_power_cust3-subcust1","repeating_power_cust3-subcust2","repeating_power_cust3-subcust3","repeating_power_cust3-subcust4","repeating_power_cust3-subcust1-desc","repeating_power_cust3-subcust2-desc","repeating_power_cust3-subcust3-desc","repeating_power_cust3-subcust4-desc","repeating_power_classtype","race","repeating_power_rechargerate"], function(v) {
            var str = parseInt(v["STR-mod"]) || 0
                dex = parseInt(v["DEX-mod"]) || 0,
                con = parseInt(v["CON-mod"]) || 0,
                int = parseInt(v["INT-mod"]) || 0,
                wis = parseInt(v["WIS-mod"]) || 0,
                cha = parseInt(v["CHA-mod"]) || 0,
                mweap1 = parseInt(v["MWEAP-mod1"]) || 0,
                mweap2 = parseInt(v["MWEAP-mod2"]) || 0,
                mweap3 = parseInt(v["MWEAP-mod3"]) || 0,
                rweap1 = parseInt(v["RWEAP-mod1"]) || 0,
                rweap2 = parseInt(v["RWEAP-mod2"]) || 0,
                rweap3 = parseInt(v["RWEAP-mod3"]) || 0,
                level = parseInt(v["level"]) || 1
                type = "",
                action = "",
                range = "",
                attack = 0,
                attackvs = "",
                vs = "",
                cust1type = "",
                cust2type = "",
                cust3type = "",
                roll = "&{template:power} {{name=" + v.repeating_power_name + "}}";
            // === Power Roll & Display
            // TYPE
            switch(v.repeating_power_type) {
                case "atwill":
                    type = i18n_atwill;
                    roll += " {{atwill=1}} {{type=At-Will}}";
                    break;
                case "class":
                    switch(v.repeating_power_classtype) {
                        case "Talent":
                            type = i18n_talent;
                            break;
                        case "Feature":
                            type = i18n_feature;
                            break;
                        case "Power":
                            type = i18n_power;
                            break;
                        case "Battle Cry":
                            type = i18n_battlecry;
                            break;
                        case "Domain":
                            type = i18n_domain;
                            break;
                    }
                    roll += " {{class=1}} {{type=" + type + "}}";
                    break;
                case "racial":
                    type = v.race;
                    roll += " {{racial-encounter=1}} {{type=" + v.race + "}}";
                    break;
                case "encounter":
                    type = i18n_encounter;
                    roll += " {{racial-encounter=1}} {{type=" + type + "}}";
                    break;
                case "recharge":
                    type = i18n_recharge + " +" + v.repeating_power_rechargerate;
                    roll += " {{recharge-daily=1}} {{type=" + v["repeating_power_rechargerate"] + "+}}";
                    break;
                case "daily":
                    type = i18n_daily;
                    roll += " {{recharge-daily=1}} {{type=" + type + "}}";
                    break;
                case "spell":
                    type = i18n_spell;
                    roll += " {{spell=1}} {{type=" + type + "}}";
                    break;
                case "magicitem":
                    type = i18n_magicitem;
                    roll += " {{magicitem=1}} {{type=" + type + "}}";
                    break;
                case "custom":
                    type = v["repeating_power_type-custom"];
                    roll += " {{typecustom=1}} {{type=" + type + "}}";
                    break;
            }
            // Action and/or Range roll template line
            if ((v.repeating_power_action == "1") || (v.repeating_power_range == "1")) {
                roll +=" {{action-range-flag=1}}";
            }
            // ACTION
            if (v.repeating_power_action == "1") {
                switch(v["repeating_power_action-type"]) {
                    case "Standard Action":
                        action = i18n_standardaction;
                        break;
                    case "Move Action":
                        action = i18n_moveaction;
                        break;
                    case "Quick Action":
                        action = i18n_quickaction;
                        break;
                    case "Free Action":
                        action = i18n_freeaction;
                        break;
                    case "Flexible Action":
                        action = i18n_flexibleaction;
                        break;
                    case "Custom":
                        action = v["repeating_power_action-custom"];
                        break;
                }
                roll += " {{action=" + action + "}}";
            }
            // RANGE
            if(v.repeating_power_range == "1") {
                switch(v["repeating_power_range-type"]) {
                    case "Engaged":
                        range = i18n_engaged;
                        break;
                    case "Nearby":
                        range = i18n_nearby;
                        break;
                    case "Far Away":
                        range = i18n_faraway;
                        break;
                    case "Intercepting":
                        range = i18n_intercepting;
                        break;
                    case "Line of Sight":
                        range = i18n_lineofsight;
                        break;
                    case "Custom":
                        range = v["repeating_power_range-custom"];
                        break;
                }
                roll += " {{range=" + range + "}}";
            }
            //TARGET
            if(v.repeating_power_target == "1") {
               roll += " {{target=" + v["repeating_power_target-type"] + "}}";
            }
            // ATTACK
            if(v.repeating_power_attack == "1") {
                roll += " {{attack=1}} {{attbonus=[[1d20+";
                switch(v["repeating_power_attack-type"]) {
                    case "STR":
                        attack = str + level;
                        roll += "" + str + "[" + i18n_stru +"]+" + level + "["+ i18n_lvlu + "]";
                        break;
                    case "CON":
                        attack = con + level;
                        roll += "" + con + "[" + i18n_conu + "]+" + level + "["+ i18n_lvlu + "]";
                        break;
                    case "DEX":
                        attack = dex + level;
                        roll += "" + dex + "[" + i18n_dexu + "]+" + level + "["+ i18n_lvlu + "]";
                        break;
                    case "INT":
                        attack = int + level;
                        roll += "" + int + "[" + i18n_intu + "]+" + level + "["+ i18n_lvlu + "]";
                        break;
                    case "WIS":
                        attack = wis + level
                        roll += "" + wis + "[" + i18n_wisu + "]+" + level + "["+ i18n_lvlu + "]";
                        break;
                    case "CHA":
                        attack = cha + level;
                        roll += "" + cha + "[" + i18n_chau + "]+" + level + "["+ i18n_lvlu + "]";
                        break;
                    case "MWEAP1":
                        attack = str + level + mweap1;
                        roll += "" + str + "[" + i18n_stru +"]+" + level + "["+ i18n_lvlu + "]+" + mweap1 + "[" + i18n_weapu + "]";
                        break;
                    case "MWEAP2":
                        attack = str + level + mweap2;
                        roll += "" + str + "[" + i18n_stru +"]+" + level + "["+ i18n_lvlu + "]+" + mweap2 + "[" + i18n_weapu + "]";
                        break;
                    case "MWPEA3":
                        attack = str + level + mweap3;
                        roll += "" + str + "[" + i18n_stru +"]+" + level + "["+ i18n_lvlu + "]+" + mweap3 + "[" + i18n_weapu + "]";
                        break;
                    case "RWEAP1":
                        attack = dex + level + rweap1;
                        roll += "" + dex + "[" + i18n_dexu + "]+" + level + "["+ i18n_lvlu + "]+" + rweap1 + "[" + i18n_weapu + "]";
                        break;
                    case "RWEAP2":
                        attack = dex + level + rweap2;
                        roll += "" + dex + "[" + i18n_dexu + "]+" + level + "["+ i18n_lvlu + "]+" + rweap2 + "[" + i18n_weapu + "]";
                        break;
                    case "RWEAP3":
                        attack = dex + level + rweap3;
                        roll += "" + dex + "[" + i18n_dexu + "]+" + level + "["+ i18n_lvlu + "]+" + rweap3 + "[" + i18n_weapu + "]";
                        break;
                    case "CUSTOM":
                        attack = parseInt(v["repeating_power_attack-custom"]) || 0;
                        roll += v["repeating_power_attack-custom"];
                        break;
                    default:
                        roll += "0[" + i18n_unknownu + "]";
                        break;
                }
                roll += "+?{" + i18n_modifiers + "|0}[" + i18n_modu + "]+@{E-DIE}]]}}";
                // VS
                switch(v["repeating_power_attack-vstype"]) {
                    case "AC":
                        vs = i18n_acu;
                        break;
                    case "PD":
                        vs = i18n_pdu;
                        break;
                    case "MD":
                        vs = i18n_mdu;
                        break;
                    case "CUSTOM":
                        vs = v["repeating_power_attack-vscustom"];
                        break;
                }
                roll +=" {{vstype=" + vs + "}}";
                attackvs = (attack < 0 ? "" : "+") + attack + " " + i18n_vs + " " + vs;
            }
            // CUSTOM 1
            if(v.repeating_power_cust1 == "1") {
                roll += " {{cust1=1}} {{" + v["repeating_power_cust1-type"] + "-1=1}}";
                switch(v["repeating_power_cust1-type"]) {
                    case "Hit":
                        cust1type = i18n_hit;
                        break;
                    case "Miss":
                        cust1type = i18n_miss;
                        break;
                    case "Trigger":
                        cust1type = i18n_trigger;
                        break;
                    case "Effect":
                        cust1type = i18n_effect;
                        break;
                    case "Improved":
                        cust1type = i18n_improved;
                        break;
                    case "Sustain":
                        cust1type = i18n_sustain;
                        break;
                    case "Special":
                        cust1type = i18n_special;
                        break;
                    case "Opening-Sustaining-Effect":
                        cust1type = i18n_opening;
                        break;
                    case "Final-Verse":
                        cust1type = i18n_finalverse;
                        break;
                    case "Details":
                        cust1type = i18n_details;
                        break;
                    case "typecustom":
                        cust1type = v["repeating_power_cust1-custom"];
                        roll += " {{custype1=" + cust1type + "}}";
                        break;
                }
                cust1type += ":";
                if(v["repeating_power_cust1-subcust1"] == "1") {
                    roll += " {{cust1-subcust1=1}} {{cust1-subcust1-desc=" + v["repeating_power_cust1-subcust1-desc"] + "}}";
                }
                if(v["repeating_power_cust1-subcust2"] == "1") {
                    roll += " {{cust1-subcust2=1}} {{cust1-subcust2-desc=" + v["repeating_power_cust1-subcust2-desc"] + "}}";
                }
                if(v["repeating_power_cust1-subcust3"] == "1") {
                    roll += " {{cust1-subcust3=1}} {{cust1-subcust3-desc=" + v["repeating_power_cust1-subcust3-desc"] + "}}";
                }
                if(v["repeating_power_cust1-subcust4"] == "1") {
                    roll += " {{cust1-subcust4=1}} {{cust1-subcust4-desc=" + v["repeating_power_cust1-subcust4-desc"] + "}}";
                }
            }
            // CUSTOM 2
            if(v.repeating_power_cust2 == "1") {
                roll += " {{cust2=1}} {{" + v["repeating_power_cust2-type"] + "-2=1}}";
                switch(v["repeating_power_cust2-type"]) {
                    case "Hit":
                        cust2type = i18n_hit;
                        break;
                    case "Miss":
                        cust2type = i18n_miss;
                        break;
                    case "Trigger":
                        cust2type = i18n_trigger;
                        break;
                    case "Effect":
                        cust2type = i18n_effect;
                        break;
                    case "Improved":
                        cust2type = i18n_improved;
                        break;
                    case "Sustain":
                        cust2type = i18n_sustain;
                        break;
                    case "Special":
                        cust2type = i18n_special;
                        break;
                    case "Opening-Sustaining-Effect":
                        cust2type = i18n_opening;
                        break;
                    case "Final-Verse":
                        cust2type = i18n_finalverse;
                        break;
                    case "Details":
                        cust2type = i18n_details;
                        break;
                    case "typecustom":
                        cust2type = v["repeating_power_cust2-custom"];
                        roll += " {{custype2=" + cust2type + "}}";
                        break;
                }
                cust2type += ":";
                if(v["repeating_power_cust2-subcust1"] == "1") {
                    roll += " {{cust2-subcust1=1}} {{cust2-subcust1-desc=" + v["repeating_power_cust2-subcust1-desc"] + "}}";
                }
                if(v["repeating_power_cust2-subcust2"] == "1") {
                    roll += " {{cust2-subcust2=1}} {{cust2-subcust2-desc=" + v["repeating_power_cust2-subcust2-desc"] + "}}";
                }
                if(v["repeating_power_cust2-subcust3"] == "1") {
                    roll += " {{cust2-subcust3=1}} {{cust2-subcust3-desc=" + v["repeating_power_cust2-subcust3-desc"] + "}}";
                }
                if(v["repeating_power_cust2-subcust4"] == "1") {
                    roll += " {{cust2-subcust4=1}} {{cust2-subcust4-desc=" + v["repeating_power_cust2-subcust4-desc"] + "}}";
                }
            }
            // CUSTOM 3
            if(v.repeating_power_cust3 == "1") {
                roll += " {{cust3=1}} {{" + v["repeating_power_cust3-type"] + "-3=1}}";
                switch(v["repeating_power_cust3-type"]) {
                    case "Hit":
                        cust3type = i18n_hit;
                        break;
                    case "Miss":
                        cust3type = i18n_miss;
                        break;
                    case "Trigger":
                        cust3type = i18n_trigger;
                        break;
                    case "Effect":
                        cust3type = i18n_effect;
                        break;
                    case "Improved":
                        cust3type = i18n_improved;
                        break;
                    case "Sustain":
                        cust3type = i18n_sustain;
                        break;
                    case "Special":
                        cust3type = i18n_special;
                        break;
                    case "Opening-Sustaining-Effect":
                        cust3type = i18n_opening;
                        break;
                    case "Final-Verse":
                        cust3type = i18n_finalverse;
                        break;
                    case "Details":
                        cust3type = i18n_details;
                        break;
                    case "typecustom":
                        cust3type = v["repeating_power_cust3-custom"];
                        roll += " {{custype3=" + cust3type + "}}";
                        break;
                }
                cust3type += ":";
                if(v["repeating_power_cust3-subcust1"] == "1") {
                    roll += " {{cust3-subcust1=1}} {{cust3-subcust1-desc=" + v["repeating_power_cust3-subcust1-desc"] + "}}";
                }
                if(v["repeating_power_cust3-subcust2"] == "1") {
                    roll += " {{cust3-subcust2=1}} {{cust3-subcust2-desc=" + v["repeating_power_cust3-subcust2-desc"] + "}}";
                }
                if(v["repeating_power_cust3-subcust3"] == "1") {
                    roll += " {{cust3-subcust3=1}} {{cust3-subcust3-desc=" + v["repeating_power_cust3-subcust3-desc"] + "}}";
                }
                if(v["repeating_power_cust3-subcust4"] == "1") {
                    roll += " {{cust3-subcust4=1}} {{cust3-subcust4-desc=" + v["repeating_power_cust3-subcust4-desc"] + "}}";
                }
            }
            // UPDATE
            console.log("*** DEBUG updatePower roll : " + roll);
            setAttrs({
                "repeating_power_power-roll" : roll,
                "repeating_power_powname-display": v["repeating_power_name"],
                "repeating_power_type-display": type,
                "repeating_power_action-display": action,
                "repeating_power_range-display": range,
                "repeating_power_target-display": v["repeating_power_target-type"],
                "repeating_power_attack-display": attackvs,
                "repeating_power_cust1-display": cust1type,
                "repeating_power_cust1-subcust1-display": v["repeating_power_cust1-subcust1-desc"],
                "repeating_power_cust1-subcust2-display": v["repeating_power_cust1-subcust2-desc"],
                "repeating_power_cust1-subcust3-display": v["repeating_power_cust1-subcust3-desc"],
                "repeating_power_cust1-subcust4-display": v["repeating_power_cust1-subcust4-desc"],
                "repeating_power_cust2-display": cust2type,
                "repeating_power_cust2-subcust1-display": v["repeating_power_cust2-subcust1-desc"],
                "repeating_power_cust2-subcust2-display": v["repeating_power_cust2-subcust2-desc"],
                "repeating_power_cust2-subcust3-display": v["repeating_power_cust2-subcust3-desc"],
                "repeating_power_cust2-subcust4-display": v["repeating_power_cust2-subcust4-desc"],
                "repeating_power_cust3-display": cust3type,
                "repeating_power_cust3-subcust1-display": v["repeating_power_cust3-subcust1-desc"],
                "repeating_power_cust3-subcust2-display": v["repeating_power_cust3-subcust2-desc"],
                "repeating_power_cust3-subcust3-display": v["repeating_power_cust3-subcust3-desc"],
                "repeating_power_cust3-subcust4-display": v["repeating_power_cust3-subcust4-desc"]
            });
        });
    };

    // === Weapons
    // Selected Melee weapon
    var updateMeleeWeapon = function(i) {
        var mwsel = parseInt(i) || 1;
        getAttrs(["level","MWEAP-mod"+mwsel,"MWEAP"+mwsel,"M-BAMOD","STR-mod","DEX-mod","LVL-multiplier"], function(v) {
            var str = parseInt(v["STR-mod"]) || 0,
                dex = parseInt(v["DEX-mod"]) || 0,
                mweap = parseInt(v["MWEAP-mod"+mwsel]) || 0,
                level = parseInt(v["level"]) || 1,
                lvlmultiplier = parseInt(v["LVL-multiplier"]) || 1,
                mattmod = v["M-BAMOD"] === "@{STR-mod}" ? str : dex,
                mattackvs = "",
                mhit = "",
                mfinal = "";
            mfinal = "{{wname=@{MWEAP-name"+mwsel+"}}} {{attbonus=[[1d20+[[@{M-BAMOD}]][MMOD]+@{level}[LVL]+@{MWEAP-mod"+mwsel+"}[WEAP]+?{Modifiers|0}[MOD]+@{E-DIE}]]}} {{damage=[[@{level}d[[@{MWEAP"+mwsel+"}]]+@{MWEAP-mod"+mwsel+"}[WEAP]+[[(@{M-BAMOD}*@{LVL-multiplier})]]]]}}";
            mattackvs = (parseInt(level + mattmod + mweap) < 0 ? "" : "+") + (level + mattmod + mweap) + " " + i18n_vs + " " + i18n_acu;
            mhit = level + "d" + v["MWEAP"+mwsel] + (((mattmod*lvlmultiplier)+mweap) < 0 ? "" : "+") + ((mattmod*lvlmultiplier)+mweap);
            setAttrs({
                "MWEAP-final": mfinal,
                "MBA-attackvs": mattackvs,
                "MBA-hit": mhit,
            });
        });
    };
    // Selected Range weapon
    var updateRangeWeapon = function(i) {
        var rwsel = parseInt(i) || 1;
        getAttrs(["level","RWEAP-mod"+rwsel,"RWEAP"+rwsel,"R-BAMOD","STR-mod","DEX-mod","LVL-multiplier"], function(v) {
            var str = parseInt(v["STR-mod"]) || 0,
                dex = parseInt(v["DEX-mod"]) || 0,
                rweap = parseInt(v["RWEAP-mod"+rwsel]) || 0,
                level = parseInt(v["level"]) || 1,
                lvlmultiplier = parseInt(v["LVL-multiplier"]) || 1,
                rattmod = v["R-BAMOD"] === "@{STR-mod}" ? str : dex,
                rattackvs = "",
                rhit = "",
                rfinal = "";
            rfinal = "{{wname=@{RWEAP-name"+rwsel+"}}} {{attbonus=[[1d20+[[@{R-BAMOD}]][RMOD]+@{level}[LVL]+@{RWEAP-mod"+rwsel+"}[WEAP]+?{Modifiers|0}[MOD]+@{E-DIE}]]}} {{damage=[[@{level}d[[@{RWEAP"+rwsel+"}]]+@{RWEAP-mod"+rwsel+"}[WEAP]+[[(@{R-BAMOD}*@{LVL-multiplier})]]]]}}";
            rattackvs = (parseInt(level + rattmod + rweap) < 0 ? "" : "+") + (level + rattmod + rweap) + " " + i18n_vs + " " + i18n_acu;
            rhit = level + "d" + v["RWEAP"+rwsel] + (parseInt((rattmod*lvlmultiplier)+rweap) < 0 ? "" : "+") + ((rattmod*lvlmultiplier)+rweap);
            setAttrs({
                "RWEAP-final": rfinal,
                "RBA-attackvs": rattackvs,
                "RBA-hit": rhit
            });
        });
    };

    // === Version and updating
    var upgrade_to_2_0 = function(doneupdating) {
        console.log("*** DEBUG upgrade_to_2_0");
        getAttrs(["level","REC-bonus","STR-base","CON-base","DEX-base","INT-base","WIS-base","CHA-base"], function(vat) {
            var setAttrsObj = {},
                conmod = Math.floor((parseInt(vat["CON-base"]) - 10) / 2),
                mlt = 1,
                lvl = parseInt(vat["level"]) || 1,
                oldrec = parseInt(vat["REC-bonus"]) || 0;
            if (lvl > 7) {mlt=3;}
            else if (lvl > 4) {mlt=2;}
            setAttrsObj["REC-mod"] = Math.max(oldrec - (conmod * mlt),0);
            setAttrsObj["STR-mod"] = Math.floor((parseInt(vat["STR-base"]) - 10) / 2);
            setAttrsObj["CON-mod"] = conmod;
            setAttrsObj["DEX-mod"] = Math.floor((parseInt(vat["DEX-base"]) - 10) / 2);
            setAttrsObj["INT-mod"] = Math.floor((parseInt(vat["INT-base"]) - 10) / 2);
            setAttrsObj["WIS-mod"] = Math.floor((parseInt(vat["WIS-base"]) - 10) / 2);
            setAttrsObj["CHA-mod"] = Math.floor((parseInt(vat["CHA-base"]) - 10) / 2);
            getSectionIDs("repeating_power", function(idarray) {
                var attrs = [];
                _.each(idarray, function(pid) {
                    attrs.push("repeating_power_" + pid + "_updateflag");
                    attrs.push("repeating_power_" + pid + "_type");
                    attrs.push("repeating_power_" + pid + "_action");
                    attrs.push("repeating_power_" + pid + "_action-type");
                    attrs.push("repeating_power_" + pid + "_range");
                    attrs.push("repeating_power_" + pid + "_range-type");
                    attrs.push("repeating_power_" + pid + "_target");
                    attrs.push("repeating_power_" + pid + "_attack");
                    attrs.push("repeating_power_" + pid + "_attack-type");
                    attrs.push("repeating_power_" + pid + "_attack-vstype");
                    attrs.push("repeating_power_" + pid + "_cust1");
                    attrs.push("repeating_power_" + pid + "_cust1-type");
                    attrs.push("repeating_power_" + pid + "_cust1-subcust1");
                    attrs.push("repeating_power_" + pid + "_cust1-subcust2");
                    attrs.push("repeating_power_" + pid + "_cust1-subcust3");
                    attrs.push("repeating_power_" + pid + "_cust1-subcust4");
                    attrs.push("repeating_power_" + pid + "_cust2");
                    attrs.push("repeating_power_" + pid + "_cust2-type");
                    attrs.push("repeating_power_" + pid + "_cust2-subcust1");
                    attrs.push("repeating_power_" + pid + "_cust2-subcust2");
                    attrs.push("repeating_power_" + pid + "_cust2-subcust3");
                    attrs.push("repeating_power_" + pid + "_cust2-subcust4");
                    attrs.push("repeating_power_" + pid + "_cust3");
                    attrs.push("repeating_power_" + pid + "_cust3-type");
                    attrs.push("repeating_power_" + pid + "_cust3-subcust1");
                    attrs.push("repeating_power_" + pid + "_cust3-subcust2");
                    attrs.push("repeating_power_" + pid + "_cust3-subcust3");
                    attrs.push("repeating_power_" + pid + "_cust3-subcust4");
                });
                getAttrs(attrs, function (v){
                    var endat = "";
                    _.each(attrs, function(attr) {
                        endat = attr.substr(attr.lastIndexOf("_")+1,attr.length-attr.lastIndexOf("_")+1);
                        // console.log("*** DEBUG transformPowers attr : " + attr + " ,endat : " + endat);
                        switch(endat) {
                            case "updateflag":
                                setAttrsObj[attr] = "0";
                                break;
                            case "type":
                                switch(v[attr]){
                                    case "{{atwill=1}} {{type=At-Will}}":
                                        setAttrsObj[attr] = "atwill";
                                        break;
                                    case "{{class=1}} {{type=@{classtype}}}":
                                        setAttrsObj[attr] = "class";
                                        break;
                                    case "{{racial-encounter=1}} {{type=@{race}}}":
                                        setAttrsObj[attr] = "racial";
                                        break;
                                    case "{{racial-encounter=1}} {{type=Encounter}}":
                                        setAttrsObj[attr] = "encounter";
                                        break;
                                    case "{{recharge-daily=1}} {{type=@{rechargerate}+}}":
                                        setAttrsObj[attr] = "recharge";
                                        break;
                                    case "{{recharge-daily=1}} {{type=Daily}}":
                                        setAttrsObj[attr] = "daily";
                                        break;
                                    case "{{spell=1}} {{type=Spell}}":
                                        setAttrsObj[attr] = "spell";
                                        break;
                                    case "{{magicitem=1}} {{type=Magic Item}}":
                                        setAttrsObj[attr] = "magicitem";
                                        break;
                                    case "{{typecustom=1}} {{type=@{type-custom}}}":
                                        setAttrsObj[attr] = "custom";
                                        break;
                                }
                                break;
                            case "action":
                                if(v[attr] == "{{action-range-flag=1}} {{action=@{action-type}}}") {setAttrsObj[attr] = "1"}
                                break;
                            case "action-type":
                                if(v[attr] == "@{action-custom}") {setAttrsObj[attr] = "Custom"}
                                break;
                            case "range":
                                if(v[attr] == "{{action-range-flag=1}} {{range=@{range-type}}}") {setAttrsObj[attr] = "1"}
                                break;
                            case "range-type":
                                if(v[attr] == "@{range-custom}") {setAttrsObj[attr] = "Custom"}
                                break;
                            case "target":
                                if(v[attr] == "{{target=@{target-type}}}") {setAttrsObj[attr] = "1"}
                                break;
                            case "attack":
                                if(v[attr] == "{{attack=1}} {{attbonus=[[1d20+@{attack-type}+?{Modifiers|0}[MOD]+@{E-DIE}]]}} {{vstype=@{attack-vstype}}}") {setAttrsObj[attr] = "1"}
                                break;
                            case "attack-type":
                                switch(v[attr]){
                                    case "[[@{STR-mod}]][STR]+@{level}[LVL]":
                                        setAttrsObj[attr] = "STR";
                                        break;
                                    case "[[@{DEX-mod}]][DEX]+@{level}[LVL]":
                                        setAttrsObj[attr] = "DEX";
                                        break;
                                    case "[[@{INT-mod}]][INT]+@{level}[LVL]":
                                        setAttrsObj[attr] = "INT";
                                        break;
                                    case "[[@{CHA-mod}]][CHA]+@{level}[LVL]":
                                        setAttrsObj[attr] = "CHA";
                                        break;
                                    case "[[@{WIS-mod}]][WIS]+@{level}[LVL]":
                                        setAttrsObj[attr] = "WIS";
                                        break;
                                    case "[[@{CON-mod}]][CON]+@{level}[LVL]":
                                        setAttrsObj[attr] = "CON";
                                        break;
                                    case "[[@{STR-mod}]][STR]+@{level}[LVL]+@{MWEAP-mod1}[WEAP]":
                                        setAttrsObj[attr] = "MWEAP1";
                                        break;
                                    case "[[@{STR-mod}]][STR]+@{level}[LVL]+@{MWEAP-mod2}[WEAP]":
                                        setAttrsObj[attr] = "MWEAP2";
                                        break;
                                    case "[[@{STR-mod}]][STR]+@{level}[LVL]+@{MWEAP-mod3}[WEAP]":
                                        setAttrsObj[attr] = "MWPEA3";
                                        break;
                                    case "[[@{DEX-mod}]][DEX]+@{level}[LVL]+@{RWEAP-mod1}[WEAP]":
                                        setAttrsObj[attr] = "RWEAP1";
                                        break;
                                    case "[[@{DEX-mod}]][DEX]+@{level}[LVL]+@{RWEAP-mod2}[WEAP]":
                                        setAttrsObj[attr] = "RWEAP2";
                                        break;
                                    case "[[@{DEX-mod}]][DEX]+@{level}[LVL]+@{RWEAP-mod3}[WEAP]":
                                        setAttrsObj[attr] = "RWEAP3";
                                        break;
                                    case "@{attack-custom}":
                                        setAttrsObj[attr] = "CUSTOM";
                                        break;
                                }
                                break;
                            case "cust1":
                                if(v[attr] == "{{cust1=1}} {{@{cust1-type}-1=1}} @{cust1-subcust1} @{cust1-subcust2} @{cust1-subcust3} @{cust1-subcust4}") {setAttrsObj[attr] = "1"}
                                break;
                            case "cust1-type":
                                if(v[attr] == "@{cust1-custom}") {setAttrsObj[attr] = "typecustom"}
                                break;
                            case "cust1-subcust1":
                                if(v[attr] == "{{cust1-subcust1=1}} {{cust1-subcust1-desc=@{cust1-subcust1-desc}}}") {setAttrsObj[attr] = "1"}
                                break;
                            case "cust1-subcust2":
                                if(v[attr] == "{{cust1-subcust2=1}} {{cust1-subcust2-desc=@{cust1-subcust2-desc}}}") {setAttrsObj[attr] = "1"}
                                break;
                            case "cust1-subcust3":
                                if(v[attr] == "{{cust1-subcust3=1}} {{cust1-subcust3-desc=@{cust1-subcust3-desc}}}") {setAttrsObj[attr] = "1"}
                                break;
                            case "cust1-subcust4":
                                if(v[attr] == "{{cust1-subcust4=1}} {{cust1-subcust4-desc=@{cust1-subcust4-desc}}}") {setAttrsObj[attr] = "1"}
                                break;
                            case "cust2":
                                if(v[attr] == "{{cust2=1}} {{@{cust2-type}-2=1}} @{cust2-subcust1} @{cust2-subcust2} @{cust2-subcust3} @{cust2-subcust4}") {setAttrsObj[attr] = "1"}
                                break;
                            case "cust2-type":
                                if(v[attr] == "@{cust2-custom}") {setAttrsObj[attr] = "typecustom"}
                                break;
                            case "cust2-subcust1":
                                if(v[attr] == "{{cust2-subcust1=1}} {{cust2-subcust1-desc=@{cust2-subcust1-desc}}}") {setAttrsObj[attr] = "1"}
                                break;
                            case "cust2-subcust2":
                                if(v[attr] == "{{cust2-subcust2=1}} {{cust2-subcust2-desc=@{cust2-subcust2-desc}}}") {setAttrsObj[attr] = "1"}
                                break;
                            case "cust2-subcust3":
                                if(v[attr] == "{{cust2-subcust3=1}} {{cust2-subcust3-desc=@{cust2-subcust3-desc}}}") {setAttrsObj[attr] = "1"}
                                break;
                            case "cust2-subcust4":
                                if(v[attr] == "{{cust2-subcust4=1}} {{cust2-subcust4-desc=@{cust2-subcust4-desc}}}") {setAttrsObj[attr] = "1"}
                                break;
                            case "cust3":
                                if(v[attr] == "{{cust3=1}} {{@{cust3-type}-3=1}} @{cust3-subcust1} @{cust3-subcust2} @{cust3-subcust3} @{cust3-subcust4}") {setAttrsObj[attr] = "1"}
                                break;
                            case "cust3-type":
                                if(v[attr] == "@{cust3-custom}") {setAttrsObj[attr] = "typecustom"}
                                break;
                            case "cust3-subcust1":
                                if(v[attr] == "{{cust3-subcust1=1}} {{cust3-subcust1-desc=@{cust3-subcust1-desc}}}") {setAttrsObj[attr] = "1"}
                                break;
                            case "cust3-subcust2":
                                if(v[attr] == "{{cust3-subcust2=1}} {{cust3-subcust2-desc=@{cust3-subcust2-desc}}}") {setAttrsObj[attr] = "1"}
                                break;
                            case "cust3-subcust3":
                                if(v[attr] == "{{cust3-subcust3=1}} {{cust3-subcust3-desc=@{cust3-subcust3-desc}}}") {setAttrsObj[attr] = "1"}
                                break;
                            case "cust3-subcust4":
                                if(v[attr] == "{{cust3-subcust4=1}} {{cust3-subcust4-desc=@{cust3-subcust4-desc}}}") {setAttrsObj[attr] = "1"}
                                break;
                        }
                    });
                    console.log("*** DEBUG transformPowers setAttrsObj : " + JSON.stringify(setAttrsObj));
                    setAttrs(setAttrsObj,{silent: true},function() {
                        console.log("*** DEBUG upgrade callback");
                        updateLvl();
                        updateAc();
                        updatePd();
                        updateMd();
                        updateHp();
                        updateBckgrd(1);
                        updateRec();
                        updateMeleeWeapon(1);
                        updateRangeWeapon(1);
                        updateAllPowers();
                        doneupdating();
                    });
                });
            });
        });
    };
    var versioning = function() {
        getAttrs(["version"], function(v) {
            var vrs = parseFloat(v["version"]) || 1.0;
            if (vrs == 2.0) {
                console.log("13th Age by Roll20 v" + vrs);
                return;
            } else if (vrs < 2.0) {
                console.log("UPGRADING TO v2.0");
                upgrade_to_2_0(function() {
                    setAttrs({"version": "2.0"});
                    versioning();
                });
            }
        });
    };
