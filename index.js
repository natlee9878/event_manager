var express = require('express');
var app = express();
const cors = require('cors');
const db = require('./database');
var bodyParser = require('body-parser')
const session = require('express-session');
const path = require('path');

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(cors({
    credentials: true,
    preflightContinue: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH' , 'DELETE', 'OPTIONS'],
    origin: true
}));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.all('*', function (req, res,next) {
    console.log(req.path);
    next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.all('*', function (req, res,next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
    next();
});
app.get('/login', function(req, res) {
    // Render login template
    res.sendFile(path.join(__dirname + '/static/index.html'));
});
app.get('/calendar', function(req, res) {
    if (req.session.loggedin)
        res.render(path.join(__dirname + '/static/calendar.html'),{email:req.session.email});
    else
        res.redirect("/login");
});
app.get('/signup', function(req, res) {
    // Render login template
    res.sendFile(path.join(__dirname + '/static/signup.html'));
});
app.get('/logout', function(req, res) {
    req.session.loggedin = false;
    req.session.email = null;
    res.redirect("/login");
});
app.get('/myprofile', function(req, res) {
    if (req.session.loggedin)
        res.render(path.join(__dirname + '/static/myprofile.html'),{email:req.session.email});
    else
        res.redirect("/login");
});
app.post('/signup', function(req, res){
   const firstName = req.body.firstName;
   const lastName = req.body.lastName;
   const email = req.body.email;
   const password = req.body.password;
   const phone = req.body.phone;
   const address=req.body.address;
   console.log('firstName:',firstName);
   console.log('lastName:',lastName);
   console.log('email:',email);
   console.log('password:',password);
   console.log('phone:',phone);
   console.log('address:',address);
   const command = "INSERT user (first_name,last_name,email,phone,address,password,is_admin) VALUES ('"+firstName+"','"+lastName+"','"+email+"','"+phone+"','"+address+"','"+password+"',0)";
   db.query(command);
   res.redirect("/login");
});
app.post('/createEvent', function(req, res){
   const name = req.body.name;
   const location = req.body.location;
   const start_time = req.body.start_time;
   const end_time = req.body.end_time;
   const host_email=req.session.email;
   console.log('name',name);
   console.log('location:',location);
   console.log('start_time:',start_time);
   console.log('end_time:',end_time);
   console.log('host_email:',host_email);
   const command = "INSERT event (name,location,start_time,end_time,host_email) VALUES ('"+name+"','"+location+"','"+start_time+"','"+end_time+"','"+host_email+"')";
   db.query(command);
   res.send("Event Created Successful");
});
app.post('/login', async function(req, res){
    const email = req.body.email;
    const password = req.body.password;
    console.log('email:',email);
    console.log('password:',password);
    const query = "SELECT id FROM user WHERE email='"+email+"' AND password='"+password+"'";
    let rows =  await db.query(query);
    if (rows.length==0)
        res.send("Incorrect login details");
    else{
        req.session.loggedin = true;
        req.session.email = email;
        res.redirect("/calendar");
    }
    res.end();
});
app.post('/loadEventByDate',async function(req, res){
    const year = req.body.year;
    const month = req.body.month;
    const date = req.body.date;
    const event_date= year+'-'+month+'-'+date;
    console.log('year:',year);
    console.log('month:',month);
    console.log('date:',date);
    const query = "SELECT * FROM event WHERE start_time<='"+event_date+" 23:59:59"+"' AND end_time>='"+event_date+" 00:00:00"+"'";
    let rows =  await db.query(query);
    console.log('rows:',rows);
    res.json(rows);
});
app.post('/loadEventByIdAndEmail',async function(req, res){
    const eventId = req.body.id;
    const email = req.session.email;
    const query = "SELECT * FROM event WHERE id="+eventId;
    const secondQuery = "SELECT count(*) AS joined FROM user_event WHERE event_id="+eventId+" AND email='"+email+"'";
    let secondRows = await db.query(secondQuery);
    let rows =  await db.query(query);
    rows[0].joined = secondRows[0].joined;
    console.log('rows:',rows);
    console.log('second rows:',secondRows);
    res.json(rows);
});
app.post('/join',async function(req, res){
    const eventId = req.body.id;
    const query = "SELECT start_time,end_time FROM event WHERE id="+eventId;
    let rows =  await db.query(query);
    const email = req.session.email;
    const secondQuery = "SELECT start_time,end_time FROM event INNER JOIN user_event ON event.id=user_event.event_id WHERE email='"+email+"'";
    let secondRows =  await db.query(secondQuery);
    var available = true;
    for(var i=0;i<secondRows.length;++i){
        if((rows[0].start_time>=secondRows[i].start_time && rows[0].start_time<secondRows[i].end_time)||(rows[0].end_time>secondRows[i].start_time && rows[0].end_time<=secondRows[i].end_time)){
            available = false;
        }
    }
    if(available){
        const thirdQuery = "INSERT user_event (event_id,email) VALUES ("+eventId+",'"+email+"')";
        db.query(thirdQuery);
        console.log(thirdQuery);
        res.send('Event has been joined successfully');
    } else {
        res.send('Cannot join due to user being unavailable');
    }
});
app.post('/withdraw',async function(req, res){
    const eventId = req.body.id;
    const email = req.session.email;
    const query = "DELETE FROM user_event WHERE event_id="+eventId+" AND email='"+email+"'";
    db.query(query);
    console.log(query);
    res.send('Event has been withdrawn successfully');
});
app.post('/loadUserEvent',async function(req, res){
    const eventId = req.body.id;
    const query = "SELECT user.email,first_name,last_name,phone FROM user_event INNER JOIN user ON user_event.email=user.email WHERE event_id="+eventId;
    let rows =  await db.query(query);
    console.log('rows:',rows);
    res.json(rows);
});
app.post('/loadProfile',async function(req, res){
    const email = req.session.email;
    const query = "SELECT * FROM user WHERE email='"+email+"'";
    let rows =  await db.query(query);
    console.log('rows:',rows);
    res.json(rows);
});
app.post('/updateMyProfile',async function(req, res){
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const email = req.session.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const address = req.body.address;
    const query = "UPDATE user SET first_name='"+firstName+"',last_name='"+lastName+"',password='"+password+"',phone='"+phone+"',address='"+address+"' WHERE email='"+email+"'";
    db.query(query);
    res.redirect("/myprofile");
});
var GoogleAuth; // Google Auth object.
function initClient() {
  gapi.client.init({
      'apiKey': 'AIzaSyCMwIBNMyikHDgbylX6HGVB2cEvODd_ZRY',
      'clientId': '1084522273174-gqg5aiju7ll5o6df6gmgb61uv6f36ljk',
      'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
  }).then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);
  });
}
app.listen(3000);