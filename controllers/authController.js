const User = require('../models/user');
const Complaint = require('../models/complaints');

exports.login = (req, res,next) => {
    // Render the login page
    res.render("user/login",{isLoggedIn: false});
}

exports.signIn = (req, res,next) => {
    // Render the login page
    res.render("user/signIn",{isLoggedIn: false});
}

exports.registerUser = (req, res,next) => {
   
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const address = req.body.address;

    // Create a new user instance
    const user = new User({
        name,
        email,
        password,
        phone,
        address
    });

    // Save the user to the database
    user.save()
        .then(result => {
            console.log('User registered successfully:', result);
            res.redirect('/user/login',{isLoggedIn: false});
        })
        .catch(err => {
            console.error('Error registering user:', err);
            res.status(500).send('Internal Server Error');
        });
}

exports.postLogin = async (req, res, next) => {
    const phone = req.body.phone;
    const password = req.body.password;

    try {
        // 1. Find user
        const user = await User.findOne({ phone: phone });

        if (!user || user.password !== password) {
            req.session.isLoggedIn = false;
            return res.status(401).send('Invalid phone number or password');
        }

        // 2. Save session data
        req.session.user = user;
        req.session.isLoggedIn = true;

        // 3. Fetch complaints related to the user's phone
        const complaints = await Complaint.find({ phone: phone });
        console.log(complaints);

        // 4. Render personal page with complaints
        res.render('user/persional-page', {
            isLoggedIn: req.session.isLoggedIn,
            user: req.session.user,
            complaints: complaints
        });

    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Internal Server Error');
    }
};

