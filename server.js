var Particle = require('particle-api-js');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Eleve = require('./models/eleve.js');
var Devices = require('./models/device.js');
var EventsObj = require('./models/eventObj.js');
var app = express();
//socket.io
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var particle = new Particle();
var token;

var myDevice = 'ENTREZ VOTRE NUMERO DE DEVICE';


// j'instance la connection mongo 
var promise = mongoose.connect('mongodb://localhost:27017/ifa', {
    useMongoClient: true,
});
// quand la connection est réussie
promise.then(
    () => {
        console.log('db.connected');
        // je démarre mon serveur node sur le port 3000
        server.listen(3000, function() {
            console.log('listening on 3000 and database is connected');
        });
    },
    err => {
        console.log('MONGO ERROR');
        console.log(err);
    }

);

// ecouter les evenements
io.sockets.on('connection', function (socket) {
    console.log("un client est connecté");

    socket.emit('monsocket', { hello: "world" });
});


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// je déclare mon dossier qui contient mes vues
app.set('views', './views');
// je déclare mon type de moteur de rendu
app.set('view engine', 'jade');

// je déclare mes fichiers statiques
app.use('/app', express.static('./app/'));

// je renvoie l'index.html
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});


// API : 
// renvoyer toute la liste des eleves
app.get('/api/liste', function(req, res) {
    Eleve.find({}, function(err, collection) {
        if (err) {
            console.log(err);
            return res.send(500);
        } else {
            return res.send(collection);
        }
    });

});

// renvoie un seul eleve avec son id en param 
app.get('/api/liste/:id', function(req, res) {
    console.log(req.params);
    console.log(req.params.id);
    Eleve.findOne({
        "_id": req.params.id
    }, function(err, monobject) {
        if (err) {
            console.log(err);
            return res.send(err);
        } else {

            res.send(monobject);
        }
    });


});

// gère les requetes post
app.post('/api/liste', function(req, res) {
    // console.log(req);
    console.log(req.body);
    console.log("my name is " + req.body.nom);
    // console.log("my name is " + req.body.nom);
    // var newUser = {
    //     nom: req.body.nom,
    //     prenom: req.body.prenom
    // };
    var eleveToSave = new Eleve(req.body);

    eleveToSave.save(function(err, success){
            if(err){
                return console.log(err);
            }
            else{
                console.log(success);
                res.send(success);

            }
        });
    
});
// gère la suppression
app.delete('/api/liste/:id', function(req, res) {
    console.log(req.body);
    Eleve.findByIdAndRemove(req.params.id,function(err, response){
        if(err){
            console.log(err);
        }
        else{
            console.log(response);
            console.log("deleted");
            res.send(200);

        }
    });
    // console.log("my name is " + req.body.nom);
    // var newUser = {
    //     nom: req.body.nom,
    //     prenom: req.body.prenom
    // };

    
});

// exemple de rendu html / jade
app.put('/api/liste/:id', function(req, res) {
    console.log(req.params);
    console.log(req.body);
    console.log(req.params.id);
    // solution 1 

    // Eleve.update({
    //     "_id": req.params.id
    // },req.body,function(err, response){
    //     if(err){
    //         console.log(err);
    //     }
    //     if(response){
    //         console.log(response);
    //         res.send(200);
    //     }
    // });

    Eleve.findByIdAndUpdate(req.params.id,req.body, { new: true }, function (err, updatedEleve) {
      if (err) return handleError(err);
      console.log(updatedEleve);
      res.status(200).send(updatedEleve);
    });

    // Eleve.findOne({
    //     "_id": req.params.id
    // }, function(err, monobject) {
    //     if (err) {
    //         console.log(err);
    //         return res.send(err);
    //     } else {
    //         return res.render('profil', {
    //             title: 'Hey',
    //             nom: monobject.nom,
    //             prenom: monobject.prenom
    //         });

    //     }
    // });
    // res.send(200);

});

app.get('/event',function(req,res){
    EventsObj.find({},null,function(err,collection){
        if(err){
            console.log(err);
            return res.send(500);
        }else{
            // console.log(collection);
            res.send(collection);
        }
    });
});

app.get('/liste',function(req,res){
    Devices.find({},null,function(err,collection){
        if(err){
            console.log(err);
            return res.send(500);
        }else{
            // console.log(collection);
            res.send(JSON.stringify(collection));
        }
    });
});

app.get('/liste/:id', function(req,res){
    Devices.findOne({'_id':req.params.id},function(err,objet){
        if(err){
            console.log('Find Error' + err);
        }else {
            return res.send(objet);
        }
    });
});

particle.login({username:'ENTREZ VOTRE EMAIL',password:'ENTREZ VOTRE MOT DE PASSE'}).then(
    function(data){
        token = data.body.access_token;
        console.log('Access Granted !');
        var devicesPr = particle.listDevices({ auth: token });
        devicesPr.then(
            function(devices){
              //console.log('Devices: ', devices);
              devices.body.forEach(function(device){
                // console.log(device.id);
                Devices.findOne({"id":device.id}, function(err,objet){
                    if(objet)
                    {
                        // si je trouve objet je update
                        console.log('device Update in progress');
                        var dateActu = new Date();
                        var toUpdate = new Devices(objet);
                        toUpdate.last_heard = dateActu.toISOString();
                        Devices.findByIdAndUpdate(objet._id,toUpdate,{new:true}, function(err,objet){
                            if(err){
                                console.log('Update Error ' + err);
                            }else{
                                console.log('Device updated ');
                            }
                        });

                    }
                    else if(err)
                    {
                        console.log('Error '+ err);
                    }
                    else
                    { 
                        // Si je trouve pas un objet avec le même id objet je l'ajoute
                        console.log('device Add in progress');
                        var toSave = new Devices(device);
                        toSave.save(function(err,success){
                            if(err){
                                console.log('Add Error '+ err);
                            }else{
                                console.log('Device added');
                            }
                        });
                    }
                })
                
              });
            },
            function(err) {
              console.log('List devices call failed: ', err);
            }
        );
        particle.getEventStream({ deviceId: myDevice,name: 'beamStatus', auth: token }).then(function(stream) {
            stream.on('event', function(data) {
                var toSave = new EventsObj(data);
                toSave.save(function(err,success){
                    if(err){
                        console.log('Add event Error ' + err);
                    }else{
                        console.log('Event added');
                        io.emit('newEvent',success);
                    }
                });
              // console.log("Event: " + JSON.stringify(data));
            });
        });
        particle.getEventStream({ deviceId: myDevice,name: 'Intensity', auth: token }).then(function(stream) {
            stream.on('event', function(data) {
                var toSave = new EventsObj(data);
                toSave.save(function(err,success){
                    if(err){
                        console.log('Add event Error ' + err);
                    }else{
                        console.log('Intensity Chart Value added');
                        io.emit('Intensity',success);
                    }
                });
              // console.log("Event: " + JSON.stringify(data));
            });
        });

    },
    function(err){
        console.log('Could not login '+ err);
    }
);
