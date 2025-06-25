const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    status: { type: String, required: true },
})

module.exports = mongoose.model('technician', technicianSchema);