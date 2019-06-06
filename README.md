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
    id: int (PK, AI)
    data: longtext

    Table: items
    id: int (PK, AI)
    data: longtext

    Table: patch
    id: int (PK, AI)
    patch: varchar(45)
    
    Table: runes
    id: int (PK, AI)
    data: longtext
    version: varchar(45)
    
    Table: summonerspells
    id: int (PK, AI)
    data: longtext

```

You will also need to create the following environment variables that correspond to the DB you create.

```
DB_USER=your database user
DB_PASSWORD=your database password
DB_NAME=you database name
NODE_ENV=local

```

### Author

Connor Potebnya
[Connor The Dev](connorthedev.com)

### Version

1.0.0

