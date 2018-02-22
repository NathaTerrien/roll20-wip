    on('sheet:opened',function(){
        // **** Gestion transition de version
        getAttrs(["VERSION"], function(values) {
            var verfdp = parseFloat(values.VERSION) || 0.0;
            if (verfdp == 0.0) {
                // Version 1.6 vers 1.7
                getAttrs(["FOR_SUP","DEX_SUP","CON_SUP","INT_SUP","SAG_SUP","CHA_SUP"], function(jets) {
                    var sfor, sdex, scon, sint, ssag, scha = "";
                    if ( jets.FOR_SUP == "2" ){
                        sfor = "@{JETSUP}";
                    } else {
                        sfor = "@{JETNORMAL}";
                    }
                    if ( jets.DEX_SUP == "2" ){
                        sdex = "@{JETSUP}";
                    } else {
                        sdex = "@{JETNORMAL}";
                    }
                    if ( jets.CON_SUP == "2" ){
                        scon = "@{JETSUP}";
                    } else {
                        scon = "@{JETNORMAL}";
                    }
                    if ( jets.INT_SUP == "2" ){
                        sint = "@{JETSUP}";
                    } else {
                        sint = "@{JETNORMAL}";
                    }
                    if ( jets.SAG_SUP == "2" ){
                        ssag = "@{JETSUP}";
                    } else {
                        ssag = "@{JETNORMAL}";
                    }
                    if ( jets.CHA_SUP == "2" ){
                        scha = "@{JETSUP}";
                    } else {
                        scha = "@{JETNORMAL}";
                    }
                    setAttrs({
                        FOR_SUP: sfor,
                        DEX_SUP: sdex,
                        CON_SUP: scon,
                        INT_SUP: sint,
                        SAG_SUP: ssag,
                        CHA_SUP: scha,
                        VERSION: "1.7"
                    });
                });
            }
            if (verfdp < 1.8) {
                getAttrs(["cha"], function(values) {
                    setAttrs({
                        pc_max: 3+(parseInt(values.cha) || 0),
                        VERSION: "1.8"
                    });
                });
            }
        });
    });
    on("change:cha",function(eventinfo){
        if (eventinfo.sourceType == 'player'){
            getAttrs(["pc_max"], function(values) {
                var newpc = (parseInt(values.pc_max) || 0) - (parseInt(eventinfo.previousValue) || 0) + (parseInt(eventinfo.newValue) || 0);
                setAttrs({pc_max: newpc});
            });
        }
    });