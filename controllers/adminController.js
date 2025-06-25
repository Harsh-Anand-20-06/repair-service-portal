const Complaint = require('../models/complaints');
const technician = require('../models/technician');
const moment = require('moment');


exports.getlogin = (req, res, next) => {
    // Render the login view for the admin
    res.render('admin/login');
}

exports.getdashboard = async(req, res, next) => {

   const today = moment().startOf('day'); // Get the start of the current day
   const weekStart = moment().startOf('isoweek'); // Get the start of the current week
   const monthStart = moment().startOf('month'); // Get the start of the current month

   const [todayCount, weekCount, monthCount] = await Promise.all([
       Complaint.countDocuments({ createdAt: { $gte: today } }), // Count complaints created today
       Complaint.countDocuments({ createdAt: { $gte: weekStart } }), // Count complaints created this week
       Complaint.countDocuments({ createdAt: { $gte: monthStart } }) // Count complaints created this month
   ]);

   const statusBreakdown = await Complaint.aggregate([
         { $group: {
             _id: "$status",
             count: { $sum: 1 } // Count complaints by status
         } }
   ])



    // Fetch all complaints from the database
    Complaint.find().then((complaints)=>{
        // Render the dashboard view and pass the complaints data
        res.render('admin/dashboard', {
            complaints: complaints,
            todayCount: todayCount,
            weekCount: weekCount,
            monthCount: monthCount,
            statusBreakdown: statusBreakdown
        });
    })
}

exports.postlogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log(username, password);

    // Check if the admin credentials are valid
    if (username === 'username' && password === 'admin') {
        // If valid, redirect to the dashboard
        res.redirect('/admin/dashboard');
    } else {
        // If invalid, render the login view with an error message
        res.render('admin/login', {
            error: 'Invalid phone number or password'
        });
    }
}

exports.postUpdateStatus = (req, res, next) => {
    const complaintId = req.params.id;
    const status = req.body.status;

    // Update the status of the complaint in the database
    Complaint.findByIdAndUpdate(complaintId, { status: status })
        .then(() => {
            // Redirect back to the dashboard after updating
            res.redirect('/admin/dashboard');
        })
        .catch(err => {
            console.error('Error updating complaint status:', err);
            res.status(500).send('Internal Server Error');
        });
}

exports.getDetails = (req, res, next) => {
    const complaintId = req.params.id;

    // Fetch the details of the specific complaint from the database
    Complaint.findById(complaintId)
        .then(complaint => {
            if (!complaint) {
                return res.status(404).send('Complaint not found');
            }
            // Render the details view and pass the complaint data
            res.render('admin/complaint-details', {
                complaint: complaint
            });
        })
        .catch(err => {
            console.error('Error fetching complaint details:', err);
            res.status(500).send('Internal Server Error');
        });
}

exports.postAssignTechnician = (req, res, next) => {
    const complaintId = req.params.id;
    const technicianId = req.body.technicianId;
    const serviceDate = req.body.serviceDate;

    // Update the complaint with the assigned technician and service date
    Complaint.findByIdAndUpdate(complaintId, { technicianId: technicianId, serviceDate: serviceDate, status: 'In Progress'  })
        .then(() => {
            // Redirect back to the dashboard after assigning
            res.redirect('/admin/dashboard');
        })
        .catch(err => {
            console.error('Error assigning technician:', err);

            res.status(500).send('Internal Server Error');
        });
}

exports.addTechnician = (req,res,next) =>{
    res.render("admin/add-technician-page");
}

exports.postAddTechnician = (req,res,next) =>{
    const id  = req.body.id;
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;

    const Technician = new technician ({
        id,
        name,
        phone,
        email,
    }
    )

    Technician.save().then(() => {
        res.redirect('/admin/dashboard');
    }).catch(err => {
        console.error('Error adding technician:', err);
        res.status(500).send('Internal Server Error');
    });

}
