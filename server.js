const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'gagan',
    password: '1234',
    database: 'loginsys'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the MySQL database');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/', (req, res) => {
    const { username, password } = req.body;
    const action = req.body.action;

    if (action === 'login') {
        const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

        connection.query(query, [username, password], (err, result) => {
            if (err) throw err;

            if (result.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/dashboard');
            } else {
                res.send('Incorrect username or password');
            }
        });
    } else if (action === 'register') {
        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';

        connection.query(query, [username, password], (err, result) => {
            if (err) throw err;
            res.redirect('/');
        });
    } else {
        res.status(400).send('Invalid action');
    }
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
