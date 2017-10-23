var mongoose = require('mongoose');

var eleveSchema = mongoose.Schema({
    "nom": String, 
    "prenom": String, 
    "javascript": String, 
    "fav_web": String, 
    "fav_web_why": String, 
    "fav_app": String, 
    "fav_app_why": String, 
    "before_ifa": String, 
    "why_ifa": String, 
    "contact_mail": String, 
});
// je crée un model et j'attache le schema ci dessus
var Eleve = mongoose.model('Eleves', eleveSchema);

module.exports = Eleve;