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
