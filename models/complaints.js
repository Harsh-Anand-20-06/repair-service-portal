   const mongoose = require('mongoose');

   const ComplaintSchema = new mongoose.Schema({
     name: { type: String, required: true },
     phone: { type: String, required: true },
     email: { type: String },
     address: { type: String, required: true },
     machineModel: { type: String },
     issue: { type: String, required: true },
     status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
     preferredDate: { type: Date },
     createdAt: { type: Date, default: Date.now },

      technicianId: { type: String },
      serviceDate: { type: Date },
   });

   
   module.exports = mongoose.model('Complaint', ComplaintSchema);