const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema({
    domain: String,
    registered: Boolean,
    registrationDate: Date,
    queryDate: { type: Date, default: Date.now },
    whoisInfo: String
  });
  

const Domain = mongoose.model('Domain', domainSchema);

module.exports = Domain;