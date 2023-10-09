# ICT3103 TickyTockky

# Setup

Install Docker Deskop from here: https://www.docker.com/products/docker-desktop/ and run it in the background.

Add .env file containing the DB_USER and DB_PASS parameters inside the /server folder.

Follow this template:

```env
DB_USER = [Your DB Username]
DB_PASS = [Your DB Password]
```

# Running the app

Run the following commands in /server:

`docker compose up --build`

Run the following commands in /client:

```
npm install
npm start
```
