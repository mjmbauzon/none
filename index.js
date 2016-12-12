console.log('running 1st line');
var firebase = require("firebase");
var express = require("express");
var gcloud = require("google-cloud");
var app = express();
var multer = require("multer");
var uploader = multer({ storage: multer.memoryStorage({}) });
var bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

//app.set('view engine', 'ejs');
//app.get('/', function(request, response) {
  
//});

firebase.initializeApp({
    serviceAccount: "privkey.json",
    databaseURL: "https://bookrecycle-5b8d1.firebaseio.com/"
});
/**
 * Google cloud storage part
 */
var CLOUD_BUCKET="bookrecycle-5b8d1.appspot.com"; //From storage console, list of buckets
var gcs = gcloud.storage({
    projectId: '12019208667', //from storage console, then click settings, then "x-goog-project-id"
    keyFilename: 'privkey.json' //the key we already set up
});


function getPublicUrl (filename) {
    return 'https://storage.googleapis.com/' + CLOUD_BUCKET + '/' + filename;
}

var bucket = gcs.bucket(CLOUD_BUCKET);

//From https://cloud.google.com/nodejs/getting-started/using-cloud-storage
function sendUploadToGCS (req, res, next) {
    if (!req.file) {
        return next();
    }

    var gcsname = Date.now() + req.file.originalname;
    var file = bucket.file(gcsname);


    var stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        }
    });

    stream.on('error', function (err) {
        req.file.cloudStorageError = err;
        next(err);
    });

    stream.on('finish', function () {
        req.file.cloudStorageObject = gcsname;
        req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
        var options = {
            entity: 'allUsers',
            role: gcs.acl.READER_ROLE
        };
        file.acl.add(options, function(a,e){next();});//Make file world-readable; this is async so need to wait to return OK until its done
    });

    stream.end(req.file.buffer);
}


var port = process.env.PORT || 3000;
console.log('running fine');
//app.listen(3000, function () {
//  console.log('Example app listening on port 3000!');
//});
app.post('/postTextbook', function (req, res) {
    console.log("User wants to create posting: '" + req.body.titlep + "'");
	
	var idToken = req.body.token;
    firebase.auth().verifyIdToken(idToken).then(function (decodedToken) {
        var uid = decodedToken.uid;
		
		firebase.database().ref('school/' + req.body.schoolp + '/' + req.body.coursep).push({
			sellerID: req.body.userIDp,
			title: req.body.titlep,
			author: req.body.authorp,
			price: req.body.pricep,
			isbn: req.body.isbnp,
			note: req.body.notep
		});
    }).catch(function(error) {
	  // Handle error
	  console.log("error in verifying token in creating a post");
	});
	
	console.log("done post textbook");
		
});

app.post('/createUserInfo', function (req, res){
	console.log("Create info of user "+ req.body.firstnamep + " " + req.body.lastnamep);

	var idToken = req.body.token;
    firebase.auth().verifyIdToken(idToken).then(function (decodedToken) {
        var uid = decodedToken.uid;
		console.log("in create user info: uid is "+ uid);
		firebase.database().ref('users/' + req.body.userIDp).set({
			firstName: req.body.firstnamep,
			lastName: req.body.lastnamep,
			school: req.body.schoolp,
			email: req.body.emailp,
			phone: req.body.phonep
		});
	}).catch(function(error) {
	  // Handle error
	  console.log("error in verifying token in creating user");
	});
	console.log("done create user in index js");
});

var fireRef = firebase.database().ref('uploads');
//Make a new one
app.post('/upload', uploader.single("img"), sendUploadToGCS, function (req, res, next) {
    //var data = {"text" : req.body.todoText};
	console.log("User "+ req.body.userIn + " uploading file on "+ getPublicUrl(req.file.cloudStorageObject));
    if(req.file)
        firebase.database().ref('uploads/' + req.body.userIn).set({	//put link in uploads folder
			img: getPublicUrl(req.file.cloudStorageObject)
		});
	
});

app.use(express.static('public'));

app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});