    // Powers -- how to: multinlingual handling ?
    var updatePower = function(e) {
        /*if (typeof e !== "undefined") {
            console.log("*** DEBUG updatePower " + e.sourceAttribute);
        }*/
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
                attack = 0
                attackvs = "",
                cust1type = "",
                cust2type = "",
                cust3type = "";
            // === Power Roll

            // === Power display
            // TYPE
            console.log("*** DEBUG updatePower Type " + v.repeating_power_type + " " + v.repeating_power_classtype);
            if(v.repeating_power_type === "{{typecustom=1}} {{type=@{type-custom}}}") {type = v["repeating_power_type-custom"];}
            else if(v.repeating_power_type === "{{atwill=1}} {{type=At-Will}}") {type = "At-Will";}
            else if(v.repeating_power_type === "{{class=1}} {{type=@{classtype}}}") {
                type = v["repeating_power_classtype"];
            }
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

    var updateWeapons = function(e) {
        var
        if (typeof e !== 'undefined') {
            console.log("*** DEBUG updateWeapons " + e.sourceAttribute);
        }
        getAttrs(["level","MWEAP-sel","MWEAP-mod1","MWEAP-mod2","MWEAP-mod3","MWEAP1","MWEAP2","MWEAP3","RWEAP-sel","RWEAP-mod1","RWEAP-mod2","RWEAP-mod3","RWEAP1","RWEAP2","RWEAP3","M-BAMOD","R-BAMOD","STR-mod","DEX-mod","LVL-multiplier"], function(v) {
            var mwsel = parseInt(v["MWEAP-sel"]) || 1,
            rwsel = parseInt(v["RWEAP-sel"]) || 1,
            str = parseInt(v["STR-mod"]) || 0,
            dex = parseInt(v["DEX-mod"]) || 0,
            mweap1 = parseInt(v["MWEAP-mod1"]) || 0,
            mweap2 = parseInt(v["MWEAP-mod2"]) || 0,
            mweap3 = parseInt(v["MWEAP-mod3"]) || 0,
            rweap1 = parseInt(v["RWEAP-mod1"]) || 0,
            rweap2 = parseInt(v["RWEAP-mod2"]) || 0,
            rweap3 = parseInt(v["RWEAP-mod3"]) || 0,
            level = parseInt(v["level"]) || 1,
            lvlmultiplier = parseInt(v["LVL-multiplier"]) || 1,
            mattmod = v["M-BAMOD"] === "@{STR-mod}" ? str : dex,
            rattmod = v["R-BAMOD"] === "@{STR-mod}" ? str : dex,
            mattackvs = "",
            mhit = "",
            rattackvs = "",
            rhit = "",
            mfinal = "",
            rfinal = "";
            mfinal = "{{wname=@{MWEAP-name"+mwsel+"}}} {{attbonus=[[1d20+[[@{M-BAMOD}]][MMOD]+@{level}[LVL]+@{MWEAP-mod"+mwsel+"}[WEAP]+?{Modifiers|0}[MOD]+@{E-DIE}]]}} {{damage=[[@{level}d[[@{MWEAP"+mwsel+"}]]+@{MWEAP-mod"+mwsel+"}[WEAP]+[[(@{M-BAMOD}*@{LVL-multiplier})]]]]}}";
            rfinal = "{{wname=@{RWEAP-name"+rwsel+"}}} {{attbonus=[[1d20+[[@{R-BAMOD}]][RMOD]+@{level}[LVL]+@{RWEAP-mod"+rwsel+"}[WEAP]+?{Modifiers|0}[MOD]+@{E-DIE}]]}} {{damage=[[@{level}d[[@{RWEAP"+rwsel+"}]]+@{RWEAP-mod"+rwsel+"}[WEAP]+[[(@{R-BAMOD}*@{LVL-multiplier})]]]]}}";
            if(mwsel == 1) {
                mattackvs = (parseInt(level + mattmod + mweap1) < 0 ? "" : "+") + (level + mattmod + mweap1) + " vs AC";
                mhit = level + "d" + v["MWEAP1"] + (((mattmod*lvlmultiplier)+mweap1) < 0 ? "" : "+") + ((mattmod*lvlmultiplier)+mweap1);
            }
            else if(mwsel == 2) {
                mattackvs = (parseInt(level + mattmod + mweap2) < 0 ? "" : "+") + (level + mattmod + mweap2) + " vs AC";
                mhit = level + "d" + v["MWEAP2"] + (parseInt((mattmod*lvlmultiplier)+mweap2) < 0 ? "" : "+") + ((mattmod*lvlmultiplier)+mweap2);
            }
            else if(mwsel == 3) {
                mattackvs = (parseInt(level + mattmod + mweap3) < 0 ? "" : "+") + (level + mattmod + mweap3) + " vs AC";
                mhit = level + "d" + v["MWEAP3"] + (parseInt((mattmod*lvlmultiplier)+mweap3) < 0 ? "" : "+") + ((mattmod*lvlmultiplier)+mweap3);
            };
            if(rwsel == 1) {
                rattackvs = (parseInt(level + rattmod + rweap1) < 0 ? "" : "+") + (level + rattmod + rweap1) + " vs AC";
                rhit = level + "d" + v["RWEAP1"] + (parseInt((rattmod*lvlmultiplier)+rweap1) < 0 ? "" : "+") + ((rattmod*lvlmultiplier)+rweap1);
            }
            else if(rwsel == 2) {
                rattackvs = (parseInt(level + rattmod + rweap2) < 0 ? "" : "+") + (level + rattmod + rweap2) + " vs AC";
                rhit = level + "d" + v["RWEAP2"] + (parseInt((rattmod*lvlmultiplier)+rweap2) < 0 ? "" : "+") + ((rattmod*lvlmultiplier)+rweap2);
            }
            else if(rwsel == 3) {
                rattackvs = (parseInt(level + rattmod + rweap3) < 0 ? "" : "+") + (level + rattmod + rweap3) + " vs AC";
                rhit = level + "d" + v["RWEAP3"] + (parseInt((rattmod*lvlmultiplier)+rweap3) < 0 ? "" : "+") + ((rattmod*lvlmultiplier)+rweap3);
            };
            console.log("*** DEBUG updateWeapons MWEAP-final " + mfinal);
            console.log("*** DEBUG updateWeapons MBA-attackvs " + mattackvs);
            console.log("*** DEBUG updateWeapons MBA-hit " + mhit);
            console.log("*** DEBUG updateWeapons RWEAP-final " + rfinal);
            console.log("*** DEBUG updateWeapons RBA-attackvs " + rattackvs);
            console.log("*** DEBUG updateWeapons RBA-hit " + rhit);
            setAttrs({
                "MWEAP-final": mfinal,
                "MBA-attackvs": mattackvs,
                "MBA-hit": mhit,
                "RWEAP-final": rfinal,
                "RBA-attackvs": rattackvs,
                "RBA-hit": rhit
            });
        });
    };
