
/* ---- DWVF ---------------------- */
    var DWVF = DWVF || (function(){
        'use strict';
        var version = '1.1',
        calcMod = function (carac) {
            var car = parseInt(carac) || 0;
            var mod = 0;
            if (car<4) {mod=-3;}
                else if (car>3 && car<6) {mod=-2;}
                else if (car>5 && car<9) {mod=-1;}
                else if (car>12 && car<16) {mod=1;}
                else if (car>15 && car<18) {mod=2;}
                else if (car>17) {mod=3;}
                else {mod=0;}
            return mod;
        };
        return {
            calcMod: calcMod
        };
    }());

// Inventaire
on("change:repeating_items:itemweight remove:repeating_items", function() {
    getSectionIDs("repeating_items", function(idws) {
        var totwght = 0;
        idws.forEach(function(idw,index,arr){
            var uwght = "repeating_items_" + idw + "_itemweight";
            var lng = parseInt(arr.length) || 0;
            getAttrs(['' + uwght], function(val) {
                totwght = totwght + parseInt(val[uwght]) || 0;
                if ( (index+1) == lng ){
                    setAttrs({
                        load: totwght
                    });
                }
            });
        });
    });
});
// ACTIONS
    // Actions Base
    on("change:repeating_actionsbase:actionbasejet", function(eventinfo) {
        var chkjet = parseInt(eventinfo.newValue) || 0;
        var jet="0";
        if (chkjet == 1) {
            jet= "[[2d6 + (@{actionbasemod})[Mod.Carac.] + (@{actionbasebonus})[Bonus] + (@{jetpjbonus})[Bonus circonstanciel] ]]";
        } else {
            jet="0";
        }
        setAttrs({
            repeating_actionsbase_actionbaseroll: jet
        });
    });
    // Actions Spéciales
    on("change:repeating_actionsspe:actionspejet", function(eventinfo) {
        var chkjet = parseInt(eventinfo.newValue) || 0;
        var jet="0";
        if( chkjet == 1) {
            jet="[[2d6 + (@{actionspemod})[Mod.Carac.] + (@{actionspebonus})[Bonus] + (@{jetpjbonus})[Bonus circonstanciel] ]]";
        } else {
            jet="0";
        }
        setAttrs({
            repeating_actionsspe_actionsperoll: jet
        });
    });
    // Départ
    on("change:repeating_actionsdepart:actiondepjet", function(eventinfo) {
        var chkjet = parseInt(eventinfo.newValue) || 0;
        var jet="0";
        if( chkjet == 1) {
            jet="[[2d6 + (@{actiondepmod})[Mod.Carac.] + (@{actiondepbonus})[Bonus] + (@{jetpjbonus})[Bonus circonstanciel] ]]";
        } else {
            jet="0";
        }
        setAttrs({
            repeating_actionsdepart_actiondeproll: jet
        });
    });
    // Avancées
    on("change:repeating_moves:movejet", function(eventinfo) {
        var chkjet = parseInt(eventinfo.newValue) || 0;
        var jet="0";
        if( chkjet == 1) {
            jet="[[2d6 + (@{movemod})[Mod.Carac.] + (@{movebonus})[Bonus] + (@{jetpjbonus})[Bonus circonstanciel] ]]";
        } else {
            jet="0";
        }
        setAttrs({
            repeating_moves_moveroll: jet
        });
    });
    // Sorts
    on("change:repeating_spells:spelljet change:repeating_spells:spelldice", function() {
        getAttrs(["repeating_spells_spelljet","repeating_spells_spelldice"], function(values){
            var chkjet = parseInt(values.repeating_spells_spelljet) || 0;
            var strdice = "" + values.repeating_spells_spelldice;
            var jet="0";
            if( chkjet == 1) {
                if (strdice.length > 0) {
                    jet="[[@{spelldice}]]";
                } else {
                    jet="0";
                }
            } else {
                jet="0";
            }
            setAttrs({
                repeating_spells_spellroll: jet
            });
        });
    });
    on("change:repeating_spells:spellprep change:repeating_spells:spellniveau", function() {
        getSectionIDs("spells", (ids) => {
            let fields = [], tot = 0, update = {}, val  = 0;
            _.each(ids, (id) => {
                fields.push(`repeating_spells_${id}_spellprep`);
                fields.push(`repeating_spells_${id}_spellniveau`);
            });
            getAttrs(fields, (v) => {
                _.each(ids, (id) => {
                    val = (parseInt(v[`repeating_spells_${id}_spellprep`]) || 0) * (parseInt(v[`repeating_spells_${id}_spellniveau`]) || 0);
                    update[`repeating_spells_${id}_spellprep`] = val;
                    tot += val;
                });
                update["spellsnum"] = tot;
                setAttrs(update);
            });
        });
    });
// Caractéristiques et modificateurs
    on("change:strength change:weak", function() {
        getAttrs(["strength","weak"], function(values) {
            var mod=parseInt(DWVF.calcMod(values.strength)) || 0;
            var mal=parseInt(values.weak) || 0;
            setAttrs({
                strmod:mod-mal
            });
        });
    });
    on("change:dexterity change:shaky", function() {
        getAttrs(["dexterity","shaky"], function(values) {
            var mod=parseInt(DWVF.calcMod(values.dexterity)) || 0;
            var mal=parseInt(values.shaky) || 0;
            setAttrs({
                dexmod:mod-mal
            });
        });
    });
    on("change:constitution change:sick", function() {
        getAttrs(["constitution","sick"], function(values) {
            var mod=parseInt(DWVF.calcMod(values.constitution)) || 0;
            var mal=parseInt(values.sick) || 0;
            setAttrs({
                conmod:mod-mal
            });
        });
    });
    on("change:intelligence change:stunned", function() {
        getAttrs(["intelligence","stunned"], function(values) {
            var mod=parseInt(DWVF.calcMod(values.intelligence)) || 0;
            var mal=parseInt(values.stunned) || 0;
            setAttrs({
                intmod:mod-mal
            });
        });
    });
    on("change:wisdom change:confused", function() {
        getAttrs(["wisdom","confused"], function(values) {
            var mod=parseInt(DWVF.calcMod(values.wisdom)) || 0;
            var mal=parseInt(values.confused) || 0;
            setAttrs({
                wismod:mod-mal
            });
        });
    });
    on("change:charisma change:scarred", function() {
        getAttrs(["charisma","scarred"], function(values) {
            var mod=parseInt(DWVF.calcMod(values.charisma)) || 0;
            var mal=parseInt(values.scarred) || 0;
            setAttrs({
                chamod:mod-mal
            });
        });
    });
// CLASSES
    on("change:laclasse", function(eventinfo) {
        var classe = eventinfo.newValue;
        var nom = "";
        var pv = 0;
        var charge = 0;
        var sorts = 0;
        var degats = "";
        switch(classe) {
            case "barbare":
                nom = "Le Barbare";
                pv = 8;
                charge = 9;
                sorts = 0;
                degats = "d10";
                break;
            case "barde":
                nom = "Le Barde";
                pv = 6;
                charge = 9;
                sorts = 0;
                degats = "d6";
                break;
            case "cambrioleur":
                nom = "Le Cambrioleur";
                pv = 6;
                charge = 9;
                sorts = 0;
                degats = "d8";
                break;
            case "chaman":
                nom = "Le Chaman";
                pv = 6;
                charge = 8;
                sorts = 0;
                degats = "d6";
                break;
            case "clerc":
                nom = "Le Clerc";
                pv = 8;
                charge = 10;
                sorts = 1;
                degats = "d6";
                break;
            case "druide":
                nom = "Le Druide";
                pv = 6;
                charge = 6;
                sorts = 0;
                degats = "d6";
                break;
            case "ranger":
                nom = "L'Éclaireur";
                pv = 8;
                charge = 11;
                sorts = 0;
                degats = "d8";
                break;
            case "guerrier":
                nom = "Le Guerrier";
                pv = 10;
                charge = 12;
                sorts = 0;
                degats = "d10";
                break;
            case "immolateur":
                nom = "L'Immolateur";
                pv = 4;
                charge = 9;
                sorts = 0;
                degats = "d8";
                break;
            case "magicien":
                nom = "Le Magicien";
                pv = 4;
                charge = 7;
                sorts = 1;
                degats = "d4";
                break;
            case "paladin":
                nom = "Le Paladin";
                pv = 10;
                charge = 12;
                sorts = 0;
                degats = "d10";
                break;
            case "voleur":
                nom = "Le Voleur";
                pv = 6;
                charge = 9;
                sorts = 0;
                degats = "d8";
                break;
            default:
                nom = "";
                pv = 0;
                charge = 0;
                sorts = 0;
                degats = "";
                break;
        }
        setAttrs({
            class: nom,
            basehp: pv,
            baseload : charge,
            spellsmax : sorts,
            dtype: degats
        });
    });
