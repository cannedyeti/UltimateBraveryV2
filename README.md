# Ultimate Bravery React w/Express and MYSQL

> Create full stack apps with React and Express. Run your client and server with a single command. 

## Quick Start

``` bash
# Install dependencies for server
npm install

# Install dependencies for client
npm run client-install

# Run the client & server with concurrently
npm run dev

# Run the Express server only
npm run server

# Run the React client only
npm run client

# Server runs on http://localhost:5000 and client on http://localhost:3000
```

## App Info

You will need to setup a MYSQL server for this app to work.

```
    Table: champions
    id: int
    data: longtext

    Table: items
    id: int
    data: longtext

    Table: patch
    id: int
    patch: varchar(45)

```

You will also need to create secrets.js in the root directory with the following info.

```
module.exports = {
    secrets: function() {
        var secrets = {
            'LEAGUE_API_KEY': 'YOUR API KEY GOES HERE',
            'DB_PASSWORD': 'YOUR DB PASSWORD GOES HERE'
        }
        return secrets;
    }
 }

```

### Author

Connor Potebnya
[Connor The Dev](connorthedev.com)

### Version

1.0.0

