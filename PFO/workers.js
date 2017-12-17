    /* === GLOBAL VARIABLES === */

    /* === EVENTS === */

    // === Version handling
    on("sheet:opened", function() {
        versioning();
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

    // === Mods
    on("change:dexterity_mod change:initiative_misc change:initiative_bonus", function() {
        update_initiative();
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
    var update_mod = function (attr) {
        getAttrs([attr], function(v) {
            var mod = Math.floor(((parseInt(v[attr]) || 10) - 10) / 2);
            var update = {};
            update[attr + "_mod"] = mod;
            setAttrs(update);
        });
    };
    // === INITIATIVE
    var update_initiative = function () {
        getAttrs(["dexterity_mod","initiative_misc","initiative_bonus"], function(v) {
            setAttrs({"initiative_mod": (parseInt(v["dexterity_mod"]) || 0) + (parseInt(v["initiative_misc"]) || 0) + (parseInt(v["initiative_bonus"]) || 0)});
        });
    };

    // === Version and updating
    var versioning = function() {
        getAttrs(["version"], function(v) {
            var vrs = parseFloat(v["version"]) || 0.0;
            if (vrs == 1.0) {
                console.log("Pathfinder by Roll20 v" + vrs);
                return;
            } else if (vrs < 1.0) {
                setAttrs({"version": "1.0"});
                versioning();
            }
        });
    };
