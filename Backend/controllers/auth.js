const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const User = require('../models/user');

// User signup
exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()[0].msg
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: 'NOT ABLE TO SAVE USER IN DB'
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id
    });
  });
};

// User signin
exports.signin = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()[0].msg
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User email does not exist'
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Email and Password do not match'
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    res.cookie('token', token, { expire: new Date() + 9999 });

    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

// User signout
exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({
    message: 'User signout'
  });
};

// Protected routes
const secret = process.env.SECRET;
exports.isSignedIn = expressJwt({
  secret,
  algorithms: ['HS256'],
  userProperty: 'auth'
});

// Custom Middleware
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!checker) {
    return res.status(403).json({
      error: 'ACCESS_DENIED'
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: 'YOU ARE NOT AN ADMIN ACCESS_DENIED'
    });
  }
  next();
};

