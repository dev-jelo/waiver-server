const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const basicAuth = require('express-basic-auth');
const sqlite3 = require('sqlite3');

const app = express();

app.use(express.urlencoded({ extended:true }));

const PORT = process.env.PORT || 5000;

// Connect to sqlite db
let db = new sqlite3.Database('./waivers.db', (err) => {
    if (err) throw err;
});

// Use favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// No cache middleware
function noCache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
};

// Routes
app.get('/waiver-age-check', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'waiver-age-check.html'));
});

app.get('/waiver', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'waiver.html'));
});

app.get('/waiver-minor', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'waiver-minor.html'));
});

app.get('/already-signed', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'already-signed.html'));
});

app.post('/submit', (req, res) => {
    // Check if already signed
    db.get('SELECT "First Name" FROM waivers WHERE "First Name" = ? AND "Last Name" = ? AND "Birth Date" = ?', req.body["First Name"], req.body["Last Name"], req.body["Birth Date"], (err, rows) => {
        if (err) {
            throw(err);
        } else {
            if (rows) {
                res.redirect('/already-signed');
            } else {
                let dataArray = [];
                let columnNames = '';

                Object.entries(req.body).forEach(([key, value]) => {
                    dataArray.push(`${value}`);
                    columnNames += `"${key}", `;
                });
                // Add current signing datetime
                columnNames += '"Sign Date"';
                let currentDateTime = new Date();
                dataArray.push(currentDateTime.toLocaleString('en-ca', { hour12: false }).toString().replace(',', ''));

                let numberQMarks = '';
                for (let i = 0; i < dataArray.length; i++) {
                    numberQMarks += '?,'
                };
                numberQMarks = numberQMarks.slice(0, -1);

                db.run(`INSERT INTO waivers (${columnNames}) VALUES (${numberQMarks})`, dataArray, (err) => {
                    if (err) {
                        throw err;
                    } else {
                        res.redirect(`/success?name=${req.body['First Name']}`);
                    };
                });
            };
        };
    });
});

app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'success.html'));
});

// ***** Username and password for admin page ***** //
const userPass = { admin: '1234' };
// ************************************************ //

app.get('/admin', basicAuth({ users: userPass, challenge: true }), noCache, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'admin.html'));
});

app.get('/admin/:id', basicAuth({ users: userPass, challenge: true }), noCache, (req, res) => {
    db.get('SELECT Minor FROM waivers WHERE id = ?', req.params.id, (err, rows) => {
        if (rows != undefined) {
            if (err) {
                throw err;
            } else {
                if (rows.Minor) {
                    res.sendFile(path.join(__dirname, 'public', 'html', 'waiver-minor-signed.html'));
                } else {
                    res.sendFile(path.join(__dirname, 'public', 'html', 'waiver-signed.html'));
                };
            };
        } else {
            res.end();
        };
    });
});

app.get('/api', basicAuth({ users: userPass, challenge: true }), noCache, (req, res) => {
    // Function to check if a search is being performed (via url query strings) or just want to load the latest 50
    function isEmpty(obj) {
        for (let i in obj) return false;
        return true;
    };

    if (isEmpty(req.query)) {
        db.all('SELECT id, "First Name", "Last Name", "Birth Date", "Sign Date", Minor FROM waivers ORDER BY "Sign Date" DESC LIMIT 50', (err, rows) => {
            if (err) {
                throw err;
            } else {
                res.send(rows);
            };
        });
    } else if (req.query.id) {
        db.get('SELECT "First Name", "Last Name", "Birth Date", "Signature 1", "Signature 2", "Signature 3", "Optional Medical", "Optional Other", "Parent First Name", "Parent Last Name", "Relation", "Parent Signature" FROM waivers WHERE "id" = ?', req.query.id, (err, rows) => {
            if (err) {
                throw err;
            } else {
                res.send(rows);
            };
        });
    } else {
        let sql = 'SELECT id, "First Name", "Last Name", "Birth Date", "Sign Date", Minor FROM waivers WHERE ';
        if (req.query.firstName) sql += `"First Name" LIKE "${req.query.firstName}%" AND `;
        if (req.query.lastName) {
            sql += `"Last Name" LIKE "${req.query.lastName}%" AND `;
        };
        if (req.query.birthDate) {
            sql += `"Birth Date" = "${req.query.birthDate}"`;
        };

        if (sql.slice(-4) == 'AND ') sql = sql.slice(0, -4);
        sql += ' ORDER BY "Sign Date" DESC';

        db.all(sql, (err, rows) => {
            if (err) {
                throw err;
            } else {
                res.send(rows);
            };
        });
    };
});

app.get('/logout', (req, res) => {
    res.send('You are logged out.');
});

app.listen(PORT);