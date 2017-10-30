    /* === EVENTS === */
    // Version handling
    on("sheet:opened", function() {
        getAttrs(["sheet-version"], function(v) {
            var vrs = parseFloat(v["sheet-version"]) || 1.0;
            if (vrs < 2.0) {
                // Ability mods to sheet-worker
                getAttrs(["STR-base","CON-base","DEX-base","INT-base","WIS-base","CHA-base","REC-bonus"], function(v) {
                    var conmod = Math.floor((parseInt(v["CON-base"]) - 10) / 2);
                    // TODO Level / AC / PD / MD / HP
                    setAttrs({
                       "STR-mod": Math.floor((parseInt(v["STR-base"]) - 10) / 2),
                       "CON-mod": conmod,
                       "REC-bonus": Math.max(conmod, parseInt(v["REC-bonus"]) || 0),
                       "DEX-mod": Math.floor((parseInt(v["DEX-base"]) - 10) / 2),
                       "INT-mod": Math.floor((parseInt(v["INT-base"]) - 10) / 2),
                       "WIS-mod": Math.floor((parseInt(v["WIS-base"]) - 10) / 2),
                       "CHA-mod": Math.floor((parseInt(v["CHA-base"]) - 10) / 2),
                       "sheet-version": 2.0
                    });
                });
            }
        });
    });

    // Abilities
    on("change:str-base", function(e) {
        setAttrs({
            "STR-mod": Math.floor((parseInt(e.newValue) - 10) / 2)
        });
    });
    on("change:con-base", function(e) {
        var mod = Math.floor((parseInt(e.newValue) - 10) / 2);
        setAttrs({
            "CON-mod": mod,
            "REC-bonus": mod
        });
    });
    on("change:dex-base", function(e) {
        setAttrs({
            "DEX-mod": Math.floor((parseInt(e.newValue) - 10) / 2)
        });
    });
    on("change:int-base", function(e) {
        setAttrs({
            "INT-mod": Math.floor((parseInt(e.newValue) - 10) / 2)
        });
    });
    on("change:wis-base", function(e) {
        setAttrs({
            "WIS-mod": Math.floor((parseInt(e.newValue) - 10) / 2)
        });
    });
    on("change:cha-base", function(e) {
        setAttrs({
            "CHA-mod": Math.floor((parseInt(e.newValue) - 10) / 2)
        });
    });

    // Level / AC / PD / MD / HP
    on("change:AC-base change:STR-mod change:CON-mod change:DEX-mod change:INT-mod change:WIS-mod change:CHA-mod change:PD-base change:MD-base change:HP-base change:HP-mod change:level",function(e){
        if (['level'].includes(e.sourceAttribute)) {updateLVL(e);}
        if (['level','ac-base','con-mod','dex-mod','wis-mod'].includes(e.sourceAttribute)) {updateAC(e);}
        if (['level','pd-base','str-mod','con-mod','dex-mod'].includes(e.sourceAttribute)) {updatePD(e);}
        if (['level','md-base','int-mod','wis-mod','cha-mod'].includes(e.sourceAttribute)) {updateMD(e);}
        if (['level','hp-base','hp-mod'].includes(e.sourceAttribute)) {updateHP(e);}
    });

    // Recovery
    on("change:rec_max", function(e) {
        /* BUG: eventInfo.newValue=NaN on rec_max
            console.log("eventInfo new value = " + e.newValue);
            getAttrs(["REC_max"], function(v) {
                console.log("getAttrs value = " + v.REC_max);
            });
            setAttrs({
               "rec_flag": e.newValue
            });
        */
        getAttrs(["REC_max"], function(v) {
            setAttrs({
               "rec_flag": v.REC_max
            });
        });
    });


    // Powers
    on("change:repeating_power:name change:repeating_power:type change:repeating_power:type-custom change:repeating_power:uses change:repeating_power:action change:repeating_power:action-type change:repeating_power:action-custom change:repeating_power:range change:repeating_power:range-type change:repeating_power:range-custom change:repeating_power:target change:repeating_power:target-type change:repeating_power:attack change:repeating_power:attack-type change:repeating_power:attack-custom change:repeating_power:attack-vstype change:repeating_power:attack-vscustom change:repeating_power:cust1 change:repeating_power:cust1-type change:repeating_power:cust1-custom change:repeating_power:cust1-subcust1 change:repeating_power:cust1-subcust2 change:repeating_power:cust1-subcust3 change:repeating_power:cust1-subcust4 change:repeating_power:cust1-subcust1-desc change:repeating_power:cust1-subcust2-desc change:repeating_power:cust1-subcust3-desc change:repeating_power:cust1-subcust4-desc change:repeating_power:cust2 change:repeating_power:cust2-type change:repeating_power:cust2-custom change:repeating_power:cust2-subcust1 change:repeating_power:cust2-subcust2 change:repeating_power:cust2-subcust3 change:repeating_power:cust2-subcust4 change:repeating_power:cust2-subcust1-desc change:repeating_power:cust2-subcust2-desc change:repeating_power:cust2-subcust3-desc change:repeating_power:cust2-subcust4-desc change:repeating_power:cust3 change:repeating_power:cust3-type change:repeating_power:cust3-custom change:repeating_power:cust3-subcust1 change:repeating_power:cust3-subcust2 change:repeating_power:cust3-subcust3 change:repeating_power:cust3-subcust4 change:repeating_power:cust3-subcust1-desc change:repeating_power:cust3-subcust2-desc change:repeating_power:cust3-subcust3-desc change:repeating_power:cust3-subcust4-desc", function() {
        updatePower();
    });

    // Weapons
    on("change:mweap-final change:mweap-mod1 change:mweap-mod2 change:mweap-mod3 change:mweap1 change:mweap2 change:mweap3 change:mweap3 change:rweap-final change:rweap-mod1 change:rweap-mod2 change:rweap-mod3 change:rweap1 change:rweap2 change:rweap3 change:m-bamod change:r-bamod", function() {
        updateWeapons();
    });

    // Icons
    on("change:icon1-5 change:icon2-5 change:icon3-5 change:icon4-5 change:icon5-5 change:icon1-6 change:icon2-6 change:icon3-6 change:icon4-6 change:icon5-6", function() {
        getAttrs(["icon1-5","icon2-5","icon3-5","icon4-5","icon5-5","icon1-6","icon2-6","icon3-6","icon4-6","icon5-6","icon1-5-count","icon2-5-count","icon3-5-count","icon4-5-count","icon5-5-count","icon1-6-count","icon2-6-count","icon3-6-count","icon4-6-count","icon5-6-count"], function(v) {
            var setAttrsObj = {};
            for(var input in v) {
                if(v[input] == "0" && typeof v[input+"-count"] !== 'undefined' && (""+v[input+"-count"]).trim() !== "") {
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
                if(typeof v[input] === 'undefined' || (""+v[input]).trim() === "") {
                    setAttrsObj[input.substr(0, input.indexOf('-count'))] = "0";
                }
                else if(v[input] && isNaN(v[input]) === false && (""+v[input]).trim() !== "0") {
                    setAttrsObj[input.substr(0, input.indexOf('-count'))] = 'on';
                    setAttrsObj[input] = (typeof v[input] === "String") ? v[input].trim() : v[input];
                }
                else {
                    setAttrsObj[input.substr(0, input.indexOf('-count'))] = "0";
                    setAttrsObj[input] = 0;
                }
            });
            setAttrs(setAttrsObj);
        });
    });

    /* === FUNCTIONS === */
    // Level
    var updateLVL = function(e) {
        var mlt = 1;
        if (e.newValue > 7) {mlt=3;}
        else if (e.newValue > 4) {mlt=2;}
        setAttrs({"LVL-multiplier": mlt});
    };
    // AC
    var updateAC = function(e) {
        getAttrs(['level','AC-base','CON-mod','DEX-mod','WIS-mod'], function(v){
            var modarr = _.sortBy([parseInt(v["CON-mod"]),parseInt(v["DEX-mod"]),parseInt(v["WIS-mod"])], function(num) {return num;});
            setAttrs({"AC": parseInt(v["AC-base"])+parseInt(v["level"])+modarr[1]});
        });
    };
    // PD
    var updatePD = function(e) {
        getAttrs(['level','PD-base','STR-mod','CON-mod','DEX-mod'], function(v){
            var modarr = _.sortBy([parseInt(v["STR-mod"]),parseInt(v["CON-mod"]),parseInt(v["DEX-mod"])], function(num) {return num;});
            setAttrs({"PD": parseInt(v["PD-base"])+parseInt(v["level"])+modarr[1]});
        });
    };
    // MD
    var updateMD = function(e) {
        getAttrs(['level','MD-base','INT-mod','WIS-mod','CHA-mod'], function(v){
            var modarr = _.sortBy([parseInt(v["INT-mod"]),parseInt(v["WIS-mod"]),parseInt(v["CHA-mod"])], function(num) {return num;});
            setAttrs({"MD": parseInt(v["MD-base"])+parseInt(v["level"])+modarr[1]});
        });
    };
    // HP
    var updateHP = function(e) {
        getAttrs(['level','HP-base','HP-mod','CON-mod'], function(v){
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

    // Powers
    var updatePower = function() {
        getAttrs(["STR-base","DEX-base","CON-base","INT-base","CHA-base","WIS-base","level","MWEAP-mod1","MWEAP-mod2","MWEAP-mod3","RWEAP-mod1","RWEAP-mod2","RWEAP-mod3","repeating_power_name","repeating_power_type","repeating_power_type-custom","repeating_power_uses","repeating_power_action","repeating_power_action-type","repeating_power_action-custom","repeating_power_range","repeating_power_range-type","repeating_power_range-custom","repeating_power_target","repeating_power_target-type","repeating_power_attack","repeating_power_attack-type","repeating_power_attack-custom","repeating_power_attack-vstype","repeating_power_attack-vscustom","repeating_power_cust1","repeating_power_cust1-type","repeating_power_cust1-custom","repeating_power_cust1-subcust1","repeating_power_cust1-subcust2","repeating_power_cust1-subcust3","repeating_power_cust1-subcust4","repeating_power_cust1-subcust1-desc","repeating_power_cust1-subcust2-desc","repeating_power_cust1-subcust3-desc","repeating_power_cust1-subcust4-desc","repeating_power_cust2","repeating_power_cust2-type","repeating_power_cust2-custom","repeating_power_cust2-subcust1","repeating_power_cust2-subcust2","repeating_power_cust2-subcust3","repeating_power_cust2-subcust4","repeating_power_cust2-subcust1-desc","repeating_power_cust2-subcust2-desc","repeating_power_cust2-subcust3-desc","repeating_power_cust2-subcust4-desc","repeating_power_cust3","repeating_power_cust3-type","repeating_power_cust3-custom","repeating_power_cust3-subcust1","repeating_power_cust3-subcust2","repeating_power_cust3-subcust3","repeating_power_cust3-subcust4","repeating_power_cust3-subcust1-desc","repeating_power_cust3-subcust2-desc","repeating_power_cust3-subcust3-desc","repeating_power_cust3-subcust4-desc","repeating_power_classtype","race","repeating_power_rechargerate"], function(v) {
            str = Math.floor((parseInt(v["STR-base"],10) - 10) / 2);
            dex = Math.floor((parseInt(v["DEX-base"],10) - 10) / 2);
            con = Math.floor((parseInt(v["CON-base"],10) - 10) / 2);
            int = Math.floor((parseInt(v["INT-base"],10) - 10) / 2);
            cha = Math.floor((parseInt(v["CHA-base"],10) - 10) / 2);
            wis = Math.floor((parseInt(v["WIS-base"],10) - 10) / 2);
            mweap1 = v["MWEAP-mod1"] && isNaN(v["MWEAP-mod1"]) === false ? parseInt(v["MWEAP-mod1"], 10) : 0;
            mweap2 = v["MWEAP-mod2"] && isNaN(v["MWEAP-mod2"]) === false ? parseInt(v["MWEAP-mod2"], 10) : 0;
            mweap3 = v["MWEAP-mod3"] && isNaN(v["MWEAP-mod3"]) === false ? parseInt(v["MWEAP-mod3"], 10) : 0;
            rweap1 = v["RWEAP-mod1"] && isNaN(v["RWEAP-mod1"]) === false ? parseInt(v["RWEAP-mod1"], 10) : 0;
            rweap2 = v["RWEAP-mod2"] && isNaN(v["RWEAP-mod2"]) === false ? parseInt(v["RWEAP-mod2"], 10) : 0;
            rweap3 = v["RWEAP-mod3"] && isNaN(v["RWEAP-mod3"]) === false ? parseInt(v["RWEAP-mod3"], 10) : 0;
            level = parseInt(v["level"], 10);
            // TYPE
            if(v.repeating_power_type === "{{typecustom=1}} {{type=@{type-custom}}}") {type = v["repeating_power_type-custom"];}
            else if(v.repeating_power_type === "{{atwill=1}} {{type=At-Will}}") {type = "At-Will";}
            else if(v.repeating_power_type === "{{class=1}} {{type=@{classtype}}}") {type = v["repeating_power_classtype"];}
            else if(v.repeating_power_type === "{{racial-encounter=1}} {{type=@{race}}}") {type = v["race"];}
            else if(v.repeating_power_type === "{{racial-encounter=1}} {{type=Encounter}}") {type = "Encounter";}
            else if(v.repeating_power_type === "{{recharge-daily=1}} {{type=@{rechargerate}+}}") {type = "Recharge+" + v["repeating_power_rechargerate"];}
            else if(v.repeating_power_type === "{{recharge-daily=1}} {{type=Daily}}") {type = "Daily";}
            else if(v.repeating_power_type === "{{spell=1}} {{type=Spell}}") {type = "Spell";}
            else if(v.repeating_power_type === "{{magicitem=1}} {{type=Magic Item}}") {type = "Magic Item";}
            else {type = ""};
            // ACTION
            if(v["repeating_power_action-type"] === "@{action-custom}") {action = v["repeating_power_action-custom"]}
            else{action = v["repeating_power_action-type"]}
            // RANGE
            if(v["repeating_power_range-type"] === "@{range-custom}") {range = v["repeating_power_range-custom"]}
            else{range = v["repeating_power_range-type"]}
            // ATTACK
            if(v["repeating_power_attack-type"] === "[[@{STR-mod}]][STR]+@{level}[LVL]") {attack = str + level}
            else if(v["repeating_power_attack-type"] === "[[@{DEX-mod}]][DEX]+@{level}[LVL]") {attack = dex + level}
            else if(v["repeating_power_attack-type"] === "[[@{CON-mod}]][CON]+@{level}[LVL]") {attack = con + level}
            else if(v["repeating_power_attack-type"] === "[[@{INT-mod}]][INT]+@{level}[LVL]") {attack = int + level}
            else if(v["repeating_power_attack-type"] === "[[@{CHA-mod}]][CHA]+@{level}[LVL]") {attack = cha + level}
            else if(v["repeating_power_attack-type"] === "[[@{WIS-mod}]][WIS]+@{level}[LVL]") {attack = wis + level}
            else if(v["repeating_power_attack-type"] === "[[@{STR-mod}]][STR]+@{level}[LVL]+@{MWEAP-mod1}[WEAP]") {attack = str + level + mweap1}
            else if(v["repeating_power_attack-type"] === "[[@{STR-mod}]][STR]+@{level}[LVL]+@{MWEAP-mod2}[WEAP]") {attack = str + level + mweap2}
            else if(v["repeating_power_attack-type"] === "[[@{STR-mod}]][STR]+@{level}[LVL]+@{MWEAP-mod3}[WEAP]") {attack = str + level + mweap3}
            else if(v["repeating_power_attack-type"] === "[[@{DEX-mod}]][DEX]+@{level}[LVL]+@{RWEAP-mod1}[WEAP]") {attack = dex + level + rweap1}
            else if(v["repeating_power_attack-type"] === "[[@{DEX-mod}]][DEX]+@{level}[LVL]+@{RWEAP-mod2}[WEAP]") {attack = dex + level + rweap2}
            else if(v["repeating_power_attack-type"] === "[[@{DEX-mod}]][DEX]+@{level}[LVL]+@{RWEAP-mod3}[WEAP]") {attack = dex + level + rweap3}
            else if(v["repeating_power_attack-type"] === "@{attack-custom}") {attack = v["repeating_power_attack-custom"]}
            else {attack = ""};
            if(v["repeating_power_attack-vstype"] === "@{attack-vscustom}") {vs = v["repeating_power_attack-vscustom"]}
            else{vs = v["repeating_power_attack-vstype"]};
            attackvs = "+" + attack + " vs " + vs;
            // CUSTOM 1
            if(v["repeating_power_cust1-type"] === "@{cust1-custom}") {cust1type = v["repeating_power_cust1-custom"] + ":"}
            else {cust1type = v["repeating_power_cust1-type"] + ":"}
            // CUSTOM 2
            if(v["repeating_power_cust2-type"] === "@{cust2-custom}") {cust2type = v["repeating_power_cust2-custom"] + ":"}
            else {cust2type = v["repeating_power_cust2-type"] + ":"}
            // CUSTOM 1
            if(v["repeating_power_cust3-type"] === "@{cust3-custom}") {cust3type = v["repeating_power_cust3-custom"] + ":"}
            else {cust3type = v["repeating_power_cust3-type"] + ":"}
            setAttrs({
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
    // Weapons
    var updateWeapons = function() {
        getAttrs(["STR-base","DEX-base","level","MWEAP-final","MWEAP-mod1","MWEAP-mod2","MWEAP-mod3","MWEAP1","MWEAP2","MWEAP3","RWEAP-final","RWEAP-mod1","RWEAP-mod2","RWEAP-mod3","RWEAP1","RWEAP2","RWEAP3","M-BAMOD","R-BAMOD"], function(v) {
            str = Math.floor((parseInt(v["STR-base"],10) - 10) / 2);
            dex = Math.floor((parseInt(v["DEX-base"],10) - 10) / 2);
            mweap1 = v["MWEAP-mod1"] && isNaN(v["MWEAP-mod1"]) === false ? parseInt(v["MWEAP-mod1"], 10) : 0;
            mweap2 = v["MWEAP-mod2"] && isNaN(v["MWEAP-mod2"]) === false ? parseInt(v["MWEAP-mod2"], 10) : 0;
            mweap3 = v["MWEAP-mod3"] && isNaN(v["MWEAP-mod3"]) === false ? parseInt(v["MWEAP-mod3"], 10) : 0;
            rweap1 = v["RWEAP-mod1"] && isNaN(v["RWEAP-mod1"]) === false ? parseInt(v["RWEAP-mod1"], 10) : 0;
            rweap2 = v["RWEAP-mod2"] && isNaN(v["RWEAP-mod2"]) === false ? parseInt(v["RWEAP-mod2"], 10) : 0;
            rweap3 = v["RWEAP-mod3"] && isNaN(v["RWEAP-mod3"]) === false ? parseInt(v["RWEAP-mod3"], 10) : 0;
            level = parseInt(v["level"], 10);
            if(level < 5) {lvlmultiplier = 1} else if(level < 8) {lvlmultiplier = 2} else{lvlmultiplier = 3};
            mattmod = v["M-BAMOD"] === "@{STR-mod}" ? str : dex;
            rattmod = v["R-BAMOD"] === "@{STR-mod}" ? str : dex;
            console.log(v["RWEAP-final"]);
            if(v["MWEAP-final"] === "{{wname=@{MWEAP-name1}}} {{attbonus=[[1d20+[[@{M-BAMOD}]][MMOD]+@{level}[LVL]+@{MWEAP-mod1}[WEAP]+?{Modifiers|0}[MOD]+@{E-DIE}]]}} {{damage=[[@{level}d[[@{MWEAP1}]]+@{MWEAP-mod1}[WEAP]+[[(@{M-BAMOD}*@{LVL-multiplier})]]]]}}") {
                mattackvs = "+" + (level + mattmod + mweap1) + " vs AC";
                mhit = level + "d" + v["MWEAP1"] + "+" + ((mattmod*lvlmultiplier)+mweap1);
            }
            else if(v["MWEAP-final"] === "{{wname=@{MWEAP-name2}}} {{attbonus=[[1d20+[[@{M-BAMOD}]][MMOD]+@{level}[LVL]+@{MWEAP-mod2}[WEAP]+?{Modifiers|0}[MOD]+@{E-DIE}]]}} {{damage=[[@{level}d[[@{MWEAP2}]]+@{MWEAP-mod2}[WEAP]+[[(@{M-BAMOD}*@{LVL-multiplier})]]]]}}") {
                mattackvs = "+" + (level + mattmod + mweap2) + " vs AC";
                mhit = level + "d" + v["MWEAP2"] + "+" + ((mattmod*lvlmultiplier)+mweap2);
            }
            else if(v["MWEAP-final"] === "{{wname=@{MWEAP-name3}}} {{attbonus=[[1d20+[[@{M-BAMOD}]][MMOD]+@{level}[LVL]+@{MWEAP-mod3}[WEAP]+?{Modifiers|0}[MOD]+@{E-DIE}]]}} {{damage=[[@{level}d[[@{MWEAP3}]]+@{MWEAP-mod3}[WEAP]+[[(@{M-BAMOD}*@{LVL-multiplier})]]]]}}") {
                mattackvs = "+" + (level + mattmod + mweap3) + " vs AC";
                mhit = level + "d" + v["MWEAP3"] + "+" + ((mattmod*lvlmultiplier)+mweap3);
            };
            if(v["RWEAP-final"] === "{{wname=@{RWEAP-name1}}} {{attbonus=[[1d20+[[@{R-BAMOD}]][RMOD]+@{level}[LVL]+@{RWEAP-mod1}[WEAP]+?{Modifiers|0}[MOD]+@{E-DIE}]]}} {{damage=[[@{level}d[[@{RWEAP1}]]+@{RWEAP-mod1}[WEAP]+[[(@{R-BAMOD}*@{LVL-multiplier})]]]]}}") {
                rattackvs = "+" + (level + rattmod + rweap1) + " vs AC";
                rhit = level + "d" + v["RWEAP1"] + "+" + ((rattmod*lvlmultiplier)+rweap1);
            }
            else if(v["RWEAP-final"] === "{{wname=@{RWEAP-name2}}} {{attbonus=[[1d20+[[@{R-BAMOD}]][RMOD]+@{level}[LVL]+@{RWEAP-mod2}[WEAP]+?{Modifiers|0}[MOD]+@{E-DIE}]]}} {{damage=[[@{level}d[[@{RWEAP2}]]+@{RWEAP-mod2}[WEAP]+[[(@{R-BAMOD}*@{LVL-multiplier})]]]]}}") {
                rattackvs = "+" + (level + rattmod + rweap2) + " vs AC";
                rhit = level + "d" + v["RWEAP2"] + "+" + ((rattmod*lvlmultiplier)+rweap2);
            }
            else if(v["RWEAP-final"] === "{{wname=@{RWEAP-name3}}} {{attbonus=[[1d20+[[@{R-BAMOD}]][RMOD]+@{level}[LVL]+@{RWEAP-mod3}[WEAP]+?{Modifiers|0}[MOD]+@{E-DIE}]]}} {{damage=[[@{level}d[[@{RWEAP3}]]+@{RWEAP-mod3}[WEAP]+[[(@{R-BAMOD}*@{LVL-multiplier})]]]]}}") {
                rattackvs = "+" + (level + rattmod + rweap3) + " vs AC";
                rhit = level + "d" + v["RWEAP3"] + "+" + ((rattmod*lvlmultiplier)+rweap3);
            };
            setAttrs({
                "MBA-attackvs": mattackvs,
                "MBA-hit": mhit,
                "RBA-attackvs": rattackvs,
                "RBA-hit": rhit
            });
        });
    };