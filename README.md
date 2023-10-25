# ICT3103/3203 TickyTocky

# Setup

Install Docker Deskop from here: https://www.docker.com/products/docker-desktop/ and run it in the background.

Add .env file containing the DB_USER and DB_PASS parameters inside the /server folder.

Follow this template:

```env
DB_USER = [Your DB Username]
DB_PASS = [Your DB Password]
```

# Running the app locally

Run the following commands in /server:

```bash
npm install
node src/index.js
```

Run the following commands in a separate terminal in /client:

```
npm install
npm start
```

# Running the app in Docker (Locally)

Run the following command in the root directory:

```bash
docker-compose up
```

# Running the app in Docker (AWS)

Using Ubuntu CLI or WSL2 to run the following commands:

Intial setup:

```bash
chmod 400 myapp-engine-student57.pem
ssh -i myapp-engine-student57.pem student57@18.136.211.106
sudo apt-get update
sudo apt-get install docker.io
sudo apt-get install docker-compose
```

Run the following command in the root directory:

```bash
git clone https://github.com/2100711/ICT3103-TickyTocky.git
cd ICT3103-TickyTocky
docker-compose up -d
```
