if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
 
  const express = require('express')
  const forceHttps = require('express-force-https')
  const app = express()
  const bcrypt = require('bcrypt')
  const passport = require('passport')
  const flash = require('express-flash')
  const session = require('express-session')
  const methodOverride = require('method-override')
  const path = require('path');



const { createClient } = require('@supabase/supabase-js')
const supabaseUrl = 'https://ricwdzklyjqqjprpjner.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

  
  const initializePassport = require('./passport-config')
  initializePassport(
    passport,
    supabase,
    async email => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single()
        if (error) throw error
        return data
    },
    async id => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single()
        if (error) throw error
        return data
    }
)
  
  const users = []

  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
      res.redirect(`https://${req.header('host')}${req.url}`)
    } else {
      next()
    }
  })   // Check HTTPS
  
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));  
  app.use(express.urlencoded({ extended: false }))
  app.use(flash())
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(methodOverride('_method'))
  app.use(express.static(__dirname));


  app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name, active: 'index' })
  })
  
  app.get('/index', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name, active: 'index' })
  })
  
  
  app.get('/max-calc', checkAuthenticated, (req, res) => {
    res.render('max-calc.ejs', { name: req.user.name, active: 'max-calc' })
  })
  
  app.get('/workouts', checkAuthenticated, (req, res) => {
    res.render('workouts.ejs', { name: req.user.name, active: 'workouts' })
  })
  
  app.get('/public-workouts', checkAuthenticated, (req, res) => {
    res.render('public-workouts.ejs', { name: req.user.name, active: 'public-workouts' })
  })
  
  app.post('/public-workouts', checkAuthenticated, async (req, res) => {
    const { content } = req.body;
    await supabase
      .from('posts')
      .insert([
        {
          postid: Date.now(),
          created_at: new Date(),
          userid: req.user.id,
          content: content
        },
      ])
      .then(data => {
        res.redirect('/public-workouts')
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('An error occurred while creating the post');
      });
  })
  
  
  
  app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs', { active: 'login' })
  })
  
  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))


  app.get('/register', (req, res) => {
    res.render('register', { messages: req.flash(), active: 'register' });
  });
  

  app.post('/register', async (req, res) => {
    try {
      // Check if a user with the same email or name already exists
      const { data: existingUsers, error: existingUserError } = await supabase
          .from('users')
          .select('*')
          .or(`email.eq.${req.body.email},name.eq.${req.body.name}`);
  
      if (existingUserError) {
          console.error(existingUserError);
          req.flash('error', 'An error occurred');
          return res.redirect('/register');
      }
  
      if (existingUsers.length > 0) {
          const existingUser = existingUsers[0];
          if (existingUser.email === req.body.email) {
              req.flash('error', 'A user with that email already exists');
          } else if (existingUser.name === req.body.name) {
              req.flash('error', 'A user with that name already exists');
          }
          return res.redirect('/register');
      }
  
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const { data, error } = await supabase
          .from('users')
          .insert([
              {
                  id: Date.now().toString(),
                  name: req.body.name,
                  email: req.body.email,
                  password: hashedPassword
              },
          ])
      if (error) throw error
      res.redirect('/login')
    } catch (error) {
      console.error(error)
      req.flash('error', 'An error occurred');
      res.redirect('/register')
    }
  });
  

  

  
  app.delete('/logout', (req, res, next) => {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/login');
    })
  })
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }
  
  app.listen(process.env.PORT || 3000)