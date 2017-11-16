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

    var upgrade_to_2_0 = function(doneupdating) {
        getAttrs(["STR-base","CON-base","DEX-base","INT-base","WIS-base","CHA-base"], function(v) {
            var transformPowers = function () {
                console.log('*** DEBUG transformPowers');
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
                        var setAttrsObj = {}, endat = "";
                        _.each(attrs, function(attr) {
                            endat = attr.substr(attr.lastIndexOf("_")+1,attr.length-attr.lastIndexOf("_")+1);
                            console.log('*** DEBUG transformPowers attr : ' + attr + ' ,endat : ' + endat);
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
                        console.log('*** DEBUG transformPowers setAttrsObj : ' + JSON.stringify(setAttrsObj));
                        setAttrs(setAttrsObj,{silent: true},updateAllPowers());
                    });
                });
            };
            var callback = function(doneupdating) {
                updateLvl();
                updateAc();
                updatePd();
                updateMd();
                updateHp();
                updateBckgrd(1);
                updateRec();
                updateMeleeWeapon(1);
                updateRangeWeapon(1);
                doneupdating();
            };
            setAttrs({
               "STR-mod": Math.floor((parseInt(v["STR-base"]) - 10) / 2),
               "CON-mod": Math.floor((parseInt(v["CON-base"]) - 10) / 2),
               "DEX-mod": Math.floor((parseInt(v["DEX-base"]) - 10) / 2),
               "INT-mod": Math.floor((parseInt(v["INT-base"]) - 10) / 2),
               "WIS-mod": Math.floor((parseInt(v["WIS-base"]) - 10) / 2),
               "CHA-mod": Math.floor((parseInt(v["CHA-base"]) - 10) / 2),
                },{silent: true},callback(doneupdating));
        });
    };