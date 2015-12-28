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
    charRoll = function (playerId,paramArray) {
        //méthode de détermination des caractéristiques
        var tirage = parseInt(paramArray[0]) || 0;
        var carFOR = 0;
        var carDEX = 0;
        var carCON = 0;
        var carINT  = 0;
        var carSAG = 0;
        var carCHA  = 0;
        var tabcars=[0,0,0,0];
        //Lancer les jets de caractéristiques
        switch(tirage) {
            case 0: //Tirage 3d6 dans l'ordre
                carFOR = randomInteger(6) + randomInteger(6) + randomInteger(6);
                carDEX = randomInteger(6) + randomInteger(6) + randomInteger(6);
                carCON = randomInteger(6) + randomInteger(6) + randomInteger(6);
                carINT  = randomInteger(6) + randomInteger(6) + randomInteger(6);
                carSAG = randomInteger(6) + randomInteger(6) + randomInteger(6);
                carCHA  = randomInteger(6) + randomInteger(6) + randomInteger(6);
                break;
            case 1: //Tirage 4d6 dans l'ordre, on garde les 3 meilleurs
                //Force
                tabcars[0]=randomInteger(6);
                tabcars[1]=randomInteger(6);
                tabcars[2]=randomInteger(6);
                tabcars[3]=randomInteger(6);
                tabcars.sort(function(a, b){return b-a});
                carFOR=tabcars[0]+tabcars[1]+tabcars[2];
                //Dextérité
                tabcars[0]=randomInteger(6);
                tabcars[1]=randomInteger(6);
                tabcars[2]=randomInteger(6);
                tabcars[3]=randomInteger(6);
                tabcars.sort(function(a, b){return b-a});
                carDEX=tabcars[0]+tabcars[1]+tabcars[2];
                //Constitution
                tabcars[0]=randomInteger(6);
                tabcars[1]=randomInteger(6);
                tabcars[2]=randomInteger(6);
                tabcars[3]=randomInteger(6);
                tabcars.sort(function(a, b){return b-a});
                carCON=tabcars[0]+tabcars[1]+tabcars[2];
                //Intelligence
                tabcars[0]=randomInteger(6);
                tabcars[1]=randomInteger(6);
                tabcars[2]=randomInteger(6);
                tabcars[3]=randomInteger(6);
                tabcars.sort(function(a, b){return b-a});
                carINT=tabcars[0]+tabcars[1]+tabcars[2];
                //Sagesse
                tabcars[0]=randomInteger(6);
                tabcars[1]=randomInteger(6);
                tabcars[2]=randomInteger(6);
                tabcars[3]=randomInteger(6);
                tabcars.sort(function(a, b){return b-a});
                carSAG=tabcars[0]+tabcars[1]+tabcars[2];
                //Charisme
                tabcars[0]=randomInteger(6);
                tabcars[1]=randomInteger(6);
                tabcars[2]=randomInteger(6);
                tabcars[3]=randomInteger(6);
                tabcars.sort(function(a, b){return b-a});
                carCHA=tabcars[0]+tabcars[1]+tabcars[2];
                break;
        }
        //Commencer à construire le template de chat
        var msg = "&{template:pmtchar} {{name=Tirage de caractéristiques}}";
        msg = msg + "{{for="+carFOR+"}}";
        msg = msg + "{{dex="+carDEX+"}}";
        msg = msg + "{{con="+carCON+"}}";
        msg = msg + "{{int="+carINT+"}}";
        msg = msg + "{{sag="+carSAG+"}}";
        msg = msg + "{{cha="+carCHA+"}}";
        msg = msg + "{{tabcar="+carFOR+","+carDEX+","+carCON+","+carINT+","+carSAG+","+carCHA+"}}";
        //Classes avec prérequis
        if(carINT>8){msg = msg + "{{elfe=1}}"};
        if(carDEX>8 && carCON>8){msg = msg + "{{halfelin=1}}"};
        if(carCON>8){msg = msg + "{{nain=1}}"};
        //Fin
        sendChat("player|"+playerId, msg);
        return;
    },
    charNew = function (playerId,paramArray) {
        sendChat("player|"+playerId, "" + paramArray[0] + " " + paramArray[1] + " " + paramArray[2]);
        return;
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
                    //more than 1 parameter (supposedly character_id as first parameter)
                    paramArray = paramArray[0].split("|");
                };
            };
        };
        switch(functionCalled) {
            case '!pmt-rollchar':
                // Initier une création de perso, et proposer des choix
                //sendChat("GM", "&{template:pmt} {{chatmessage=cypher-checkpcstate}} {{noCharacter="+msg.content+"}}");
                charRoll(msg.playerid,paramArray);
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
