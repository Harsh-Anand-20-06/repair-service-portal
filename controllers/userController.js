const technician = require("../models/technician");

exports.gethome = (req, res, next) => {
res.render('user/home-page',{ pageTitle: "AquaFix Services - Water Machine Repair",isLoggedIn: req.session.isLoggedIn})
}



exports.getlogout = (req, res, next) => {
    // Destroy the session and redirect to the login page
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/user/login');
    });
}

exports.getAssignedTechnicianDetails = async(req,res,next)=>{
    const technicianId = req.params.id;

    const Technician = await technician.findOne({id:technicianId});
    console.log(Technician);
    if(!Technician){
        return res.status(404).send('Technician not found');
    }

    res.render('user/assigned-technician-details', {
        isLoggedIn: req.session.isLoggedIn,
        Technician: Technician 
    });
}

