const User = require('../models').User
const Sequelize = require('sequelize');
const JWT = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
// const { generateOTP } = require('./mail');
const nodemailer = require('nodemailer');

require('dotenv').config();

exports.getSignup = async (req, res) => {
    try {
        res.render('auth/signup', {
            path: '/signup'
        })
    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
}

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.postSignup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        // if (!firstName || !lastName || !email || !password) {
        //     return res.status(400).send('All Fields are required')
        // }

        const existingUser = await User.findOne({ where: { email }})
        if (existingUser) {
            return res.status(409).send('Email already in use')
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log('HASH PWD----------------------', hashedPassword);
        const OTP = generateOTP();
        const OTPExpiration = new Date(new Date().getTime() + 10 * 60000)

        const user = await User.create(
            { firstName, lastName, email, password: hashedPassword, otp: OTP, otpExpiration: OTPExpiration, role }
        ); 

        // if (user.isModified("password")) {
        //   user.password = await bcrypt.hash(user.password, 10);
        // }

        const token = JWT.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '8h' })
        if(!token) {
            throw new Error('Token not found!')
        }
        user.tokens = user.tokens.concat([{token}])
        
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 8 * 3600 * 1000),
            httpOnly: true
        })
        
        await user.save()
        const transport = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          // port: 2525,
          secure: false,
          auth: {
            user: process.env.EMAIL_TEST,
            pass: process.env.EMAIL_PWD,
          },
        });

        transport.sendMail({
        //   from: "testusere@mailinator.com",
          from: process.env.EMAIL_TEST,
          to: user.email,
          subject: "Verify your email using OTP",
          html: `<h1>Mail From SALESMATE Your OTP CODE ${OTP} </h1><p> This code will expires in 10 minutes.</p>`,
        });
        // res.status(200).send(user);
        res.redirect('/verifyEmail');

    } catch (e) {
        res.status(500).send(`Signup ERROR:----------------${e}`)
        console.log(e);
    }   
}

exports.getVerifyEmail = async (req, res) => {
    try {
        const {id } = req.params;
        // const userId = await User.findByPk(id);

        res.render('auth/verifyEmail', {
            path: '/verifyEmail',
            id
        })
    } catch (e) {
        res.status(500).send(e);
        console.log(e);        
    }
}

exports.postVerifyEmail = async (req, res) => {
    try {
        console.log('USER ID------------------', req.user);
        const userId = req.user.id;
        const { otp } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send('User not found')
        }

        const currentTime = new Date();
        if (user.otp !== otp || currentTime > user.otpExpiration) {
            return res.status(400).send('Invalid or Expired OTP')
        }

        user.otp = null;
        user.otpExpiration = null

        await user.save();
        // res.status(200).send('OTP Verified Successfully')
        res.redirect('/login')
    } catch (e) {
        res.status(500).send(e)
        console.log(`VERIFY EMAIL ERROR: ${e}`);
    }
}

exports.getLogin = async (req, res) => {
    try {
        res.render('auth/login', {
            path: '/login'
        })
    } catch (e) {
        res.status(500).send(e)
        console.log(e);
    }
}

exports.postLogin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      res.status(400).send("No such user exists");
    }

    if (user.otp && user.otpExpiration > new Date()) {
      return res.status(401).send("Email not Verified");
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(404).send("Password not matched");
    }
    // create a token
    const token = JWT.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 108000000),
      httpOnly: true,
    });

    user.tokens = user.tokens.concat({ token });
    await user.save();
    console.log(`USER---------------${user}`);

    // res.status(200).send({ message: "Login successfully", token });
    if (user.role === "user") {
      res.status(200).redirect("/dashboard");
    } else if (user.role === "admin") {
      res.status(200).redirect("/admin/dashboard");
    } else if (user.role === "supplier") {
        res.status(200).redirect("/supplier/dashboard");
    } else {
        res.status(400).send('Invalid Role')
    }

  } catch (error) {
    res.status(500).send("error while logging in");
    console.log("ERROR-----------------------------", error);
  }
};

exports.logout = async (req, res) => {
  try {
    console.log('USER------------------------',req.user);
    req.user.tokens = req.user.tokens.filter((t) => {
      return t.token != req.token;
    });

    res.clearCookie("jwt")
    await req.user.save();

    // res.send("Log out successfully");
    res.render('users/home', {
        path: '/'
    })
  } catch (error) {
    res.status(500).send("error while logging out");
    console.log(error);
  }
};