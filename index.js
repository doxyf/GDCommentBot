const request = require('request');
const config = require('./config.json');
const b64 = require('nodejs-base64-encode');
const crypto = require('./crypto.js');

setInterval(function(){fetchRecents();}, config.timing);

request.get(`https://gdbrowser.com/api/profile/${config.username}`, function(err, res, body) {
    acid = body
});

var defaults = {
    "gameVersion":"21",
    "binaryVersion":"35",
    "gjp": crypto.encrypt(config.password, 37526),
    "userName": config.username,
    "comment": b64.encode(config.comment, 'base64'),
    "secret":"Wmfd2893gb7",
    "percent": config.percent,
    "accountID": config.accountID
}

fetchRecents()

function fetchRecents(){
request.post({
    url: 'http://www.boomlings.com/database/getGJLevels21.php',

    form:{
        "gameVersion": defaults.gameVersion,
        "binaryVersion": defaults.binaryVersion,
        "gdw":"0",
        "type":"4",
        "str":"",
        "diff":"-",
        "len":"-",
        "page":"0",
        "total":"0",
        "uncompleted":"0",
        "onlyCompleted":"0",
        "featured":"0",
        "original":"0",
        "twoPlayer":"0",
        "coins":"0",
        "epic":"0",
        "secret": defaults.secret
    }

    }, function (err, httpResponse, body) {
        if(err){
            console.log(err.message);
        }else{
            let args = body.split(':');

            console.log('Got level id: '+args[1]);
            postComment(args[1]); //------------------------------------------------
        }
});
}

function postComment(lvlID){

    request.post({
        url: 'http://www.boomlings.com/database/uploadGJComment21.php',
    
        form:{
            "gameVersion": defaults.gameVersion,
            "binaryVersion": defaults.binaryVersion,
            "gdw": "0",
            "accountID": defaults.accountID,
            "gjp": defaults.gjp,
            "userName": defaults.userName,
            "comment": defaults.comment,
            "secret": defaults.secret,
            "levelID": lvlID,
            "percent": defaults.percent,
            "chk": chk(lvlID)
        }
    
        }, function (err, httpResponse, body) {
            if(err){
                console.log(err.message);
            }else if(httpResponse.statusCode == 500){
                console.log('Got err 500 - server side problem.\n');
            }else{
                console.log('Got final response: '+body+'\n');
            }
        }
    );
}

//Some parts of this function are skidded from GDBrowser
function chk(id){

    let chk = defaults.userName + defaults.comment + id + defaults.percent + "0xPT6iUrtws0J"
    chk = crypto.sha1(chk)
    chk = crypto.encrypt(chk, 29481)
    //console.log('Your unique CHK hash is: '+chk);
    return chk

}

module.exports.defaults = defaults