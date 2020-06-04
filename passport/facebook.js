const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('./../models/userModel');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_CLIENTID,
      clientSecret: process.env.FB_CLIENTSECRET,
      profileFields: ['email', 'displayName', 'photos'],
      callbackURL: 'http://localhost:3000/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ facebook: profile.id }, (err, user) => {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, user);
        } else {
            const newUser = new User();
            newUser.facebook = profile.id;
            newUser.firstname = profile.displayName;
            newUser.email = profile._json.email;
            newUser.photo = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
            newUser.fbToken.push({token: accessToken});
           
            newUser.save((err)=> {
                if(err){
                    console.log(err);
                }else
                {
                    console.log(newUser)
                    return done(null, newUser);
                }
            });
        }
    })
}));