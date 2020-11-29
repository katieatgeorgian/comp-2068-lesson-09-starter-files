const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.index = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.show = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  console.log(req.body);
  try {
    const {
      name,
      email,
      emailConfirmation,
      password,
      passwordConfirmation
    } = req.body;

    //attempt to register user
    const user = await User.register({
      name,
      email,
      emailConfirmation,
      passwordConfirmation,
      password
    }, password);

    res.status(200).json(user);//send back user information
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  console.log(req.user, req.body);
  try {
    const { name, email, emailConfirmation, password, passwordConfirmation } = req.body;
    const { _id, email: userEmail } = req.user; //from authenticate path - grab user based on token

    //find user that's logged in
    const user = await User.findById(_id);
    user.name = name;

    //if email address doesn't match existing, update
    if (userEmail !== email) {
      console.log(userEmail, email);
      user.email = email;
      user.emailConfirmation = emailConfirmation;
    }
 
    if (password && passwordConfirmation) {
      user.passwordConfirmation = passwordConfirmation;
      user.password = password;
    }
    //validate
    await user.validate();

    //if password set password - pass raw password and generate salt and hash key and store in db
    if (password) await user.setPassword(password);
    await user.save({ validateBeforeSave: false }); //don't want to validate before saving b.c will blow up

    //good idea to change the token
    const body = { _id: user._id, email: user.email };
    const token = jwt.sign({ user: body }, 'any salty secret here');
    
    res.status(200).json({ token });

  } catch (error) {
    next(error);
  }
};

exports.destroy = async (req, res, next) => {
  console.log(req.user);
  try {
    const { email } = req.user;
    const user = await User.findOneAndDelete({ email });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};