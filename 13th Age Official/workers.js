    /* === EVENTS === */
    // Version handling
    on("sheet:opened", function(eventinfo) {
        versioning();
    });

    // Abilities
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

    // Level / AC / PD / MD / HP / Weapons (mods level) / Powers (mods level)
    on("change:ac-base change:str-mod change:con-mod change:dex-mod change:int-mod change:wis-mod change:cha-mod change:pd-base change:md-base change:hp-base change:hp-mod change:level change:m-miss change:r-miss",function(e){
        if (["level","m-miss","r-miss"].includes(e.sourceAttribute)) {updateLvl();}
        if (["level","ac-base","con-mod","dex-mod","wis-mod"].includes(e.sourceAttribute)) {updateAc();}
        if (["level","pd-base","str-mod","con-mod","dex-mod"].includes(e.sourceAttribute)) {updatePd();}
        if (["level","md-base","int-mod","wis-mod","cha-mod"].includes(e.sourceAttribute)) {updateMd();}
        if (["level","hp-base","hp-mod","con-mod"].includes(e.sourceAttribute)) {updateHp();}
        if (["level","con-mod"].includes(e.sourceAttribute)) {updateRec()};
        if (["level","str-mod","dex-mod"].includes(e.sourceAttribute)) {
            getAttrs(["MWEAP-sel","RWEAP-sel"], function(v){
                updateMeleeWeapon(parseInt(v["MWEAP-sel"]) || 1);
                updateRangeWeapon(parseInt(v["RWEAP-sel"]) || 1);
            });
        }
    });

    // Background
    on("change:back-sel", function(e){
        updateBckgrd(parseInt(e.newValue) || 1);
    });
    on("change:BACK-name1 change:BACK1 change:BACK-name2 change:BACK2 change:BACK-name3 change:BACK3 change:BACK-name4 change:BACK4 change:BACK-name5 change:BACK5 change:BACK-name6 change:BACK6 change:BACK-name7 change:BACK7 change:BACK-name8 change:BACK8 change:BACK-name9 change:BACK9 change:BACK-name10 change:BACK10", function(e){
        getAttrs(["BACK-sel"], function(v){
            if((e.sourceAttribute == "back-name"+v["BACK-sel"]) || (e.sourceAttribute == "back"+v["BACK-sel"])){updateBckgrd(parseInt(v["BACK-sel"]) || 1);}
        });
    });

    // Recovery
    on("change:rec_max", function(e) {
        getAttrs(["REC_max"], function(v) {
            setAttrs({
               "rec_flag": v.REC_max
            });
        });
    });

    // Powers
    on("change:repeating_power:name change:repeating_power:type change:repeating_power:type-custom change:repeating_power:uses change:repeating_power:action change:repeating_power:action-type change:repeating_power:action-custom change:repeating_power:range change:repeating_power:range-type change:repeating_power:range-custom change:repeating_power:target change:repeating_power:target-type change:repeating_power:attack change:repeating_power:attack-type change:repeating_power:attack-custom change:repeating_power:attack-vstype change:repeating_power:attack-vscustom change:repeating_power:cust1 change:repeating_power:cust1-type change:repeating_power:cust1-custom change:repeating_power:cust1-subcust1 change:repeating_power:cust1-subcust2 change:repeating_power:cust1-subcust3 change:repeating_power:cust1-subcust4 change:repeating_power:cust1-subcust1-desc change:repeating_power:cust1-subcust2-desc change:repeating_power:cust1-subcust3-desc change:repeating_power:cust1-subcust4-desc change:repeating_power:cust2 change:repeating_power:cust2-type change:repeating_power:cust2-custom change:repeating_power:cust2-subcust1 change:repeating_power:cust2-subcust2 change:repeating_power:cust2-subcust3 change:repeating_power:cust2-subcust4 change:repeating_power:cust2-subcust1-desc change:repeating_power:cust2-subcust2-desc change:repeating_power:cust2-subcust3-desc change:repeating_power:cust2-subcust4-desc change:repeating_power:cust3 change:repeating_power:cust3-type change:repeating_power:cust3-custom change:repeating_power:cust3-subcust1 change:repeating_power:cust3-subcust2 change:repeating_power:cust3-subcust3 change:repeating_power:cust3-subcust4 change:repeating_power:cust3-subcust1-desc change:repeating_power:cust3-subcust2-desc change:repeating_power:cust3-subcust3-desc change:repeating_power:cust3-subcust4-desc", function(e) {
        updatePower(e);
    });

    // Selected Melee Weapon
    on("change:mweap-sel", function(e){
        updateMeleeWeapon(parseInt(e.newValue) || 1);
    });
    on("change:mweap-mod1 change:mweap-mod2 change:mweap-mod3 change:mweap1 change:mweap2 change:mweap3 change:m-bamod", function(e) {
        getAttrs(["MWEAP-sel"], function(v){
            if((e.sourceAttribute == "m-bamod") || (e.sourceAttribute == "mweap-mod"+v["MWEAP-sel"]) || (e.sourceAttribute == "mweap"+v["MWEAP-sel"])){updateMeleeWeapon(parseInt(v["MWEAP-sel"]) || 1);}
        });
    });
    //Selected Range Weapon
    on("change:rweap-sel", function(e){
        updateRangeWeapon(parseInt(e.newValue) || 1);
    });
    on("change:rweap-mod1 change:rweap-mod2 change:rweap-mod3 change:rweap1 change:rweap2 change:rweap3 change:r-bamod", function(e) {
        getAttrs(["RWEAP-sel"], function(v){
            if((e.sourceAttribute == "r-bamod") || (e.sourceAttribute == "rweap-mod"+v["RWEAP-sel"]) || (e.sourceAttribute == "rweap"+v["RWEAP-sel"])){updateRangeWeapon(parseInt(v["RWEAP-sel"]) || 1);}
        });
    });

    // Icons
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
    // Level
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
    // AC
    var updateAc = function() {
        getAttrs(["level","AC-base","CON-mod","DEX-mod","WIS-mod"], function(v){
            var modarr = _.sortBy([parseInt(v["CON-mod"]),parseInt(v["DEX-mod"]),parseInt(v["WIS-mod"])], function(num) {return num;});
            setAttrs({"AC": parseInt(v["AC-base"])+parseInt(v["level"])+modarr[1]});
        });
    };
    // PD
    var updatePd = function() {
        getAttrs(["level","PD-base","STR-mod","CON-mod","DEX-mod"], function(v){
            var modarr = _.sortBy([parseInt(v["STR-mod"]),parseInt(v["CON-mod"]),parseInt(v["DEX-mod"])], function(num) {return num;});
            setAttrs({"PD": parseInt(v["PD-base"])+parseInt(v["level"])+modarr[1]});
        });
    };
    // MD
    var updateMd = function() {
        getAttrs(["level","MD-base","INT-mod","WIS-mod","CHA-mod"], function(v){
            var modarr = _.sortBy([parseInt(v["INT-mod"]),parseInt(v["WIS-mod"]),parseInt(v["CHA-mod"])], function(num) {return num;});
            setAttrs({"MD": parseInt(v["MD-base"])+parseInt(v["level"])+modarr[1]});
        });
    };
    // HP
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
    // Recovery
    var updateRec = function () {
        getAttrs(["level","CON-mod","REC-bonus"], function(v){
            var newrec = 0, mlt = 1, lvl = parseInt(v["level"]) || 1, oldrec = parseInt(v["REC-bonus"]) || 0;
            if (lvl > 7) {mlt=3;}
            else if (lvl > 4) {mlt=2;}
            newrec = (parseInt(v["CON-mod"]) || 0) * mlt;
            if (Math.abs(newrec) > Math.abs(oldrec)) {setAttrs({"REC-bonus": newrec});}
        });
    };
    // Background
    var updateBckgrd = function(bcknb) {
        getAttrs(["BACK"+bcknb,"BACK-name"+bcknb], function (v) {
            var backval = parseInt(v["BACK"+bcknb]) || 0;
            setAttrs({"BACK-final": "[[" + backval + "]][BCK]]]}} {{back=" + v["BACK-name"+bcknb] + "}} {{back_bonus="+ backval + "}}"});
        });
    };

    // Powers -- how to: multinlingual handling ?
    var updatePower = function(e) {
        /*if (typeof e !== "undefined") {
            console.log("*** DEBUG updatePower " + e.sourceAttribute);
        }*/
        getAttrs(["STR-mod","DEX-mod","CON-mod","INT-mod","CHA-mod","WIS-mod","level","MWEAP-mod1","MWEAP-mod2","MWEAP-mod3","RWEAP-mod1","RWEAP-mod2","RWEAP-mod3","repeating_power_name","repeating_power_type","repeating_power_type-custom","repeating_power_uses","repeating_power_action","repeating_power_action-type","repeating_power_action-custom","repeating_power_range","repeating_power_range-type","repeating_power_range-custom","repeating_power_target","repeating_power_target-type","repeating_power_attack","repeating_power_attack-type","repeating_power_attack-custom","repeating_power_attack-vstype","repeating_power_attack-vscustom","repeating_power_cust1","repeating_power_cust1-type","repeating_power_cust1-custom","repeating_power_cust1-subcust1","repeating_power_cust1-subcust2","repeating_power_cust1-subcust3","repeating_power_cust1-subcust4","repeating_power_cust1-subcust1-desc","repeating_power_cust1-subcust2-desc","repeating_power_cust1-subcust3-desc","repeating_power_cust1-subcust4-desc","repeating_power_cust2","repeating_power_cust2-type","repeating_power_cust2-custom","repeating_power_cust2-subcust1","repeating_power_cust2-subcust2","repeating_power_cust2-subcust3","repeating_power_cust2-subcust4","repeating_power_cust2-subcust1-desc","repeating_power_cust2-subcust2-desc","repeating_power_cust2-subcust3-desc","repeating_power_cust2-subcust4-desc","repeating_power_cust3","repeating_power_cust3-type","repeating_power_cust3-custom","repeating_power_cust3-subcust1","repeating_power_cust3-subcust2","repeating_power_cust3-subcust3","repeating_power_cust3-subcust4","repeating_power_cust3-subcust1-desc","repeating_power_cust3-subcust2-desc","repeating_power_cust3-subcust3-desc","repeating_power_cust3-subcust4-desc","repeating_power_classtype","race","repeating_power_rechargerate"], function(v) {
            str = parseInt(v["STR-mod"]) || 0;
            dex = parseInt(v["DEX-mod"]) || 0;
            con = parseInt(v["CON-mod"]) || 0;
            int = parseInt(v["INT-mod"]) || 0;
            wis = parseInt(v["WIS-mod"]) || 0;
            cha = parseInt(v["CHA-mod"]) || 0;
            mweap1 = parseInt(v["MWEAP-mod1"]) || 0;
            mweap2 = parseInt(v["MWEAP-mod2"]) || 0;
            mweap3 = parseInt(v["MWEAP-mod3"]) || 0;
            rweap1 = parseInt(v["RWEAP-mod1"]) || 0;
            rweap2 = parseInt(v["RWEAP-mod2"]) || 0;
            rweap3 = parseInt(v["RWEAP-mod3"]) || 0;
            level = parseInt(v["level"]) || 1;
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
            else {action = v["repeating_power_action-type"]}
            // RANGE
            if(v["repeating_power_range-type"] === "@{range-custom}") {range = v["repeating_power_range-custom"]}
            else {range = v["repeating_power_range-type"]}
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
            attackvs = (attack < 0 ? "" : "+") + attack + " vs " + vs;
            // CUSTOM 1
            if(v["repeating_power_cust1-type"] === "typecustom") {cust1type = v["repeating_power_cust1-custom"] + ":"}
            else {cust1type = v["repeating_power_cust1-type"] + ":"}
            // CUSTOM 2
            if(v["repeating_power_cust2-type"] === "typecustom") {cust2type = v["repeating_power_cust2-custom"] + ":"}
            else {cust2type = v["repeating_power_cust2-type"] + ":"}
            // CUSTOM 3
            if(v["repeating_power_cust3-type"] === "typecustom") {cust3type = v["repeating_power_cust3-custom"] + ":"}
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

    // Weapons -- how to: multinlingual handling ?
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
            mattackvs = (parseInt(level + mattmod + mweap) < 0 ? "" : "+") + (level + mattmod + mweap) + " vs AC";
            mhit = level + "d" + v["MWEAP"+mwsel] + (((mattmod*lvlmultiplier)+mweap) < 0 ? "" : "+") + ((mattmod*lvlmultiplier)+mweap);
            setAttrs({
                "MWEAP-final": mfinal,
                "MBA-attackvs": mattackvs,
                "MBA-hit": mhit,
            });
        });
    };
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
            rattackvs = (parseInt(level + rattmod + rweap) < 0 ? "" : "+") + (level + rattmod + rweap) + " vs AC";
            rhit = level + "d" + v["RWEAP"+rwsel] + (parseInt((rattmod*lvlmultiplier)+rweap) < 0 ? "" : "+") + ((rattmod*lvlmultiplier)+rweap);
            setAttrs({
                "RWEAP-final": rfinal,
                "RBA-attackvs": rattackvs,
                "RBA-hit": rhit
            });
        });
    };


    //Version and updating
    var upgrade_to_2_0 = function(doneupdating) {
        // Ability mods to sheet-worker
        getAttrs(["STR-base","CON-base","DEX-base","INT-base","WIS-base","CHA-base","REC-bonus"], function(v) {
            var callback = function() {
                updateLvl();
                updateAc();
                updatePd();
                updateMd();
                updateHp();
                updateBckgrd(1);
                updateRec();
                updateMeleeWeapon(1);
                updateRangeWeapon(1);
            };
            var conmod = Math.floor((parseInt(v["CON-base"]) - 10) / 2);
            setAttrs({
               "STR-mod": Math.floor((parseInt(v["STR-base"]) - 10) / 2),
               "CON-mod": conmod,
               "REC-bonus": Math.max(conmod, parseInt(v["REC-bonus"]) || 0),
               "DEX-mod": Math.floor((parseInt(v["DEX-base"]) - 10) / 2),
               "INT-mod": Math.floor((parseInt(v["INT-base"]) - 10) / 2),
               "WIS-mod": Math.floor((parseInt(v["WIS-base"]) - 10) / 2),
               "CHA-mod": Math.floor((parseInt(v["CHA-base"]) - 10) / 2),
                },{silent: true},callback);
            doneupdating();
        });
    };

    var versioning = function() {
        getAttrs(["version"], function(v) {
            var vrs = parseFloat(v["version"]) || 1.0;
            if (vrs == 2.0) {
                console.log("13th Age by Roll20 v" + vrs);
                return;
            }
            else if (vrs < 2.0) {
                console.log("UPGRADING TO v2.0");
                upgrade_to_2_0(function() {
                    setAttrs({"version": "2.0"});
                    versioning();
                });
            }
        });
    };
