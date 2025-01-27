if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const forceHttps = require('express-force-https');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const device = require('express-device'); // Add this line

const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ricwdzklyjqqjprpjner.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const initializePassport = require('./passport-config');
initializePassport(
  passport,
  supabase,
  async email => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (error) throw error;
    return data;
  },
  async id => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }
);

const users = [];

app.use(device.capture()); // Add this line

app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
}); // Check HTTPS

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(express.static(__dirname));
app.use('/style', express.static(path.join(__dirname, 'style')));
app.use('/splitco', express.static(path.join(__dirname, 'splitco')));
app.use('/pics', express.static(path.join(__dirname, 'pics')));

function renderPage(req, res, page, data = {}) {
  const view = req.device.type === 'phone' ? `${page}_phone` : page;
  const userName = req.user ? req.user.name : 'Guest'; // Check if req.user is defined
  res.render(view, { name: userName, active: page, ...data });
}

app.get('/', checkAuthenticated, (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  renderPage(req, res, 'index');
});

app.get('/index', checkAuthenticated, (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  renderPage(req, res, 'index');
});

app.get('/max-calc', checkAuthenticated, (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  renderPage(req, res, 'max-calc');
});

app.get('/workouts', checkAuthenticated, (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  renderPage(req, res, 'workouts');
});

app.get('/login', checkNotAuthenticated, (req, res) => {
  renderPage(req, res, 'login');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/register', (req, res) => {
  renderPage(req, res, 'register');
});

app.post('/register', async (req, res) => {
  try {
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

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          id: Date.now().toString(),
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword
        },
      ]);
    if (error) throw error;
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    req.flash('error', 'An error occurred');
    res.redirect('/register');
  }
});

app.delete('/logout', (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

app.listen(process.env.PORT || 3000);

app.post('/create-workout', checkAuthenticated, async (req, res) => {
  const { workoutName, workoutDescription, dayName, exerciseName, sets, reps, exerciseCount } = req.body;

  try {
    console.log('Received form data:', req.body);

    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .insert([
        {
          id: Date.now().toString(),
          user_id: req.user.id,
          name: workoutName,
          description: workoutDescription,
          created_at: new Date()
        },
      ])
      .select()
      .single();

    if (workoutError) throw workoutError;

    const dayNames = Array.isArray(dayName) ? dayName : [dayName];
    const exerciseNames = Array.isArray(exerciseName) ? exerciseName : [exerciseName];
    const setCounts = Array.isArray(sets) ? sets : [sets];
    const repCounts = Array.isArray(reps) ? reps : [reps];
    const exerciseCounts = Array.isArray(exerciseCount) ? exerciseCount : [exerciseCount];

    let exerciseIndex = 0;

    for (let i = 0; i < dayNames.length; i++) {
      const { data: day, error: dayError } = await supabase
        .from('workout_days')
        .insert([
          {
            id: Date.now().toString(),
            workout_id: workout.id,
            name: dayNames[i],
            order: i + 1
          },
        ])
        .select()
        .single();

      if (dayError) throw dayError;

      for (let j = 0; j < parseInt(exerciseCounts[i], 10); j++) {
        const { data: exercise, error: exerciseError } = await supabase
          .from('workout_exercises')
          .insert([
            {
              id: Date.now().toString(),
              day_id: day.id,
              exercise_name: exerciseNames[exerciseIndex],
              sets: parseInt(setCounts[exerciseIndex], 10),
              reps: parseInt(repCounts[exerciseIndex], 10),
              order: j + 1
            },
          ])
          .select()
          .single();

        if (exerciseError) throw exerciseError;

        exerciseIndex++;
      }
    }

    res.redirect('/workouts');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while creating the workout');
  }
});

app.get('/public-workouts', checkAuthenticated, async (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  const { data: workouts, error } = await supabase
    .from('workouts')
    .select('*, users(name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).send('An error occurred while fetching the workouts');
  }

  renderPage(req, res, 'public-workouts', { workouts });
});

app.get('/workout-details/:id', checkAuthenticated, async (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  const { id } = req.params;

  const { data: workout, error: workoutError } = await supabase
    .from('workouts')
    .select('*')
    .eq('id', id)
    .single();

  if (workoutError) {
    console.error(workoutError);
    return res.status(500).send('An error occurred while fetching the workout details');
  }

  const { data: days, error: daysError } = await supabase
    .from('workout_days')
    .select('*')
    .eq('workout_id', id);

  if (daysError) {
    console.error(daysError);
    return res.status(500).send('An error occurred while fetching the days');
  }

  const dayIds = days.map(day => day.id);
  const { data: exercises, error: exercisesError } = await supabase
    .from('workout_exercises')
    .select('*')
    .in('day_id', dayIds);

  if (exercisesError) {
    console.error(exercisesError);
    return res.status(500).send('An error occurred while fetching the exercises');
  }

  // Combine days and exercises
  const daysWithExercises = days.map(day => ({
    ...day,
    exercises: exercises.filter(exercise => exercise.day_id === day.id)
  }));

  res.json({ ...workout, days: daysWithExercises });
});
