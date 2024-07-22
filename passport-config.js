const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, supabase, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await getUserByEmail(email);
      if (user == null) {
        return done(null, false, { message: 'No user with that email' });
      }
  
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (e) {
      console.error(e);
      return done(null, false, { message: 'No Account with this email exists' });
    }
  };
  
  

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async (id, done) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return done(error)
    done(null, data)
  })
  
}

module.exports = initialize