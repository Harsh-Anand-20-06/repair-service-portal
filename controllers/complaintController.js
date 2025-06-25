const Complaint = require('../models/complaints');
const technician = require('../models/technician');


exports.getComplaints = (req,res,next)=>{
     const isLoggedIn = req.session.isLoggedIn;
     console.log(isLoggedIn);
    if(isLoggedIn){
    res.render('user/add-complaint',{ pageTitle: "Lodge a Complaint - Water Repair Service",isLoggedIn: req.session.isLoggedIn})
    }
    else{
        res.redirect('/user/login');
    }
}

exports.postComplaints = (req,res,next)=>{

    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const address = req.body.address;
    const machineModel = req.body.machineModel;
    const issue = req.body.issue;
    const status = req.body.status;
    const preferredDate = req.body.preferredDate;

    const complaint = new Complaint({
       name,
       phone,
       email,
       address,
       machineModel,
       issue,
       status,
       preferredDate,
    });

    complaint.save()
        .then(result => {
            console.log('Complaint lodged successfully:', result);
            res.redirect('/complaints',{isLoggedIn: req.session.isLoggedIn});
        })
        .catch(err => {
            console.error('Error lodging complaint:', err);
            res.status(500).send('Internal Server Error');
        });
}

exports.getTrackComplaint = async(req,res,next)=>{
    if(!req.session.isLoggedIn){
        return res.redirect('/user/login');
    }
    const isLoggedIn = req.session.isLoggedIn;
    const user = req.session.user;
    const phone = user.phone;

     const complaints = await Complaint.find({ phone: phone });

     console.log(isLoggedIn);

     
    
    
    if(isLoggedIn){
        res.render('user/persional-page',{ user: user,isLoggedIn: req.session.isLoggedIn,complaints: complaints})
    }
    else{
        res.redirect('/user/login');
    }
    
}
