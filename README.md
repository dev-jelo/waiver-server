# Waiver Server
Just a simple NodeJs + Express server with a SQLite database that stores signed waivers. There is also an HTML + CSS frontend which is where clients can read and sign the actual waiver.

# Features
- The frontend includes a digital signing pad library (https://github.com/szimek/signature_pad). The client signatures are stored in base64 format into the SQLite database.
- There is an admin dashboard that can be used to view signed waivers and search for names of clients.

# Notes
- This is actually used by a local business and as such, all identifying information has been removed.
