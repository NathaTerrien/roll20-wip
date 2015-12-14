var PmT = PmT || (function () {
    'use strict';
    var version = 1.0,
    releasedate= "2015-12-01",
    schemaversion = 1.0,
    author="Natha (roll20userid:75857)",
    warning = "This script is meant to be used with the Portes-Monstres-Trésors sheet",
    //-----------------------------------------------------------------------------
    checkInstall = function() {
        log(""+author+"'s Portes-Monstres-Trésors script version "+version+" ("+releasedate+") installed.");
        log(warning);
        log("https://github.com/Roll20/roll20-character-sheets/tree/master/PortesMonstresTresors");
        log("Enjoy!");
    },
    //-----------------------------------------------------------------------------
    charRoll = function (playerId) {
        //Lancer les jets de caractéristiques
        var carFOR = randomInteger(6) + randomInteger(6) + randomInteger(6);
        var carDEX = randomInteger(6) + randomInteger(6) + randomInteger(6);
        var carCON = randomInteger(6) + randomInteger(6) + randomInteger(6);
        var carINT  = randomInteger(6) + randomInteger(6) + randomInteger(6);
        var carSAG = randomInteger(6) + randomInteger(6) + randomInteger(6);
        var carCHA  = randomInteger(6) + randomInteger(6) + randomInteger(6);
        var msg = "&{template:default} {{name=Tirage de caractéristiques}}";
        msg = msg + "{{Force="+carFOR+"}}";
        msg = msg + "{{Dextérité="+carDEX+"}}";
        msg = msg + "{{Constitution="+carCON+"}}";
        msg = msg + "{{Intelligence="+carINT+"}}";
        msg = msg + "{{Sagesse="+carSAG+"}}";
        msg = msg + "{{Charisme="+carCHA+"}}";
        sendChat("player|"+playerId, msg);
    },
    charNew = function (paramArray) {
        //TODO
    },
    //-----------------------------------------------------------------------------
    handleAttributeEvent = function(obj, prev) {
        /*
            Check and set character states according to stats pools attributes
                and special damage, when their current values are manually
                changed on the sheet or directly in the character window.
            Note that this event isn't fired when attributes are modified by API functions,
                that's why some functions here call checkCharStates() too.
        */
        var attrName = obj.get("name");
        if ( attrName=="might" || attrName=="speed" || attrName=="intellect" || attrName=="SpecialDamage") {
            checkCharStates(getObj("character", obj.get("_characterid")));
        };
        return;
    },
    //-----------------------------------------------------------------------------
    handleInput = function(msg) {
        if (msg.type !== "api") {
            return;
        };
        if (msg.content.indexOf("!pmt-") !== 0) {
            return;
        } else {
            var paramArray= new Array(1);
            var functionCalled;
            if (parseInt(msg.content.indexOf(" ")) ==-1) {
                functionCalled = msg.content;
            } else {
                functionCalled = msg.content.split(" ")[0];
                paramArray[0] = msg.content.split(" ")[1];
                //log("Function called:"+functionCalled+" Parameters:"+paramArray[0]); //DEBUG
                if (parseInt(paramArray[0].indexOf("|")) !=-1) {
                    //more than 1 parameter (supposedly character_id as first paramater)
                    paramArray = paramArray[0].split("|");
                };
            };
        };
        switch(functionCalled) {
            case '!pmt-rollchar':
                // Initier une création de perso, et proposer des choix
                //sendChat("GM", "&{template:pmt} {{chatmessage=cypher-checkpcstate}} {{noCharacter="+msg.content+"}}");
                charRoll(msg.playerid);
                break;
            case '!pmt-newchar':
                // Créer un personnage à partir des choix et carac générés par rollchar/charRoll
                charNew(msg.playerid, paramArray);
                break;
        }
        return;
    },
    //-----------------------------------------------------------------------------
    registerEventHandlers = function() {
        on('chat:message', handleInput);
        //on('change:attribute:current', handleAttributeEvent);
    };
    //-----------------------------------------------------------------------------
    return {
        CheckInstall: checkInstall,
        RegisterEventHandlers: registerEventHandlers
    };
}());
//-----------------------------------------------------------------------------
on('ready',function() {
    'use strict';
    PmT.CheckInstall();
    PmT.RegisterEventHandlers();
});
