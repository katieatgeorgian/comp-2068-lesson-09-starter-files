const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

//schema - describe data
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true //have to enter a name
  },
  email: {
    type: String,
    required: true,
    unique: true, //cannot have 2 same email addresses in db - have to be unique
    dropDups: true, //Mongo see it's duplicate and drop entry 
    validate: [
      {
        //deal with non-unique emails
        //value will be the email the user is attempting to store
        validator: async function (value) {
          //going to access the model (all models in app), tell it want to use User
          //count emails/docs stored in db and tell how to find - by using email and whatever user gives
          //returns number
          //needs to be 0 because otherwise not unique email
          const emailCount = await this.model('User').countDocuments({ email: value });
          return emailCount === 0;
        }, 
        message: props => `Please try a different username/password combination.`
      },
      {
        //email formatted correctly
        validator: function (value) {
          // between // is regular expression - checks if email address formatted correctly
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value.toLowerCase());
        },
        message: props => `Please ensure your email address is in the correct format.  The email you entered was ${props.value}`
      },
      {
        //match email with emailConfirmation - both emails must match
        validator: function(value) {
          return this.emailConfirmation === value; //i.e. _emailConfirmation
        },
        message: props => `Your email and email confirmation must match.`
      }
    ]
  }
}, {
  timestamps: true,
});

//name of attribute is emailConfirmation - use _emailConfirmation because can't be same as ('emailConfirmation')
UserSchema.virtual('emailConfirmation')
.get(function () {
  return this._emailConfirmation;
}) //access model and attempt to access emailConfirmation
.set( function (value) {
  this._emailConfirmation = value;
}); //need to define attribute


UserSchema.virtual('password')
.get(function () {
  return this._password;
})
.set(function (value) {
  if (value !==  this.passwordConfirmation) {
    this.invalidate('password', 'Password and password confirmation must match');
  }
  this._password = value
})


UserSchema.virtual('passwordConfirmation')
.get(function () {
  return this._passwordConfirmation;
})
.set(function (value) {
  this._passwordConfirmation = value;
})


//using email instead of username
UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
})

//export data and calling it User
module.exports = mongoose.model('User', UserSchema);