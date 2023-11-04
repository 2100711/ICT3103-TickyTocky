<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]


<!-- PROJECT LOGO -->
<div align="center">
<img src="" width="300" height="300">
<h1> ICT3103/3203 TickyTocky </>
</div>
<br />

<!-- GETTING STARTED -->
# Getting Started

<div align="Left">
Install Docker Deskop from here: https://www.docker.com/products/docker-desktop/ and run it in the background.

Add .env file containing the DB_USER and DB_PASS parameters inside the /server folder.

Follow this template:
</div>

```env
DB_USER = [Your DB Username]
DB_PASS = [Your DB Password]
```

## Built With

* [![JavaScript][JavaScript-logo]][JavaScript-url]
* [![Node.js][Node-logo]][Node-url]
* [![npm][npm-logo]][npm-url]
* [![ExpressJS][Express.js]][Expressjs-url]
* [![React][React]][React-url]
* [![MongoDB][MongoDB]][MongoDB-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Running the app locally

Run the following commands in /server:

```bash
cd server
npm install
node src/index.js
```

Run the following commands in a separate terminal in /client:

```bash
cd client
npm install
npm start
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Running the app in Docker (Locally)

Run the following command in the root directory:

```bash
docker compose up -d
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Running the app in Docker (AWS)

Using Ubuntu CLI or WSL2 to run the following commands:

Intial setup of docker and compose:

```bash
sudo apt-get install docker-compose-plugin
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
# Add the repository to Apt sources:
echo   "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" |   sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Run the following command in the root directory:

```bash
git clone https://github.com/2100711/ICT3103-TickyTocky.git
cd ICT3103-TickyTocky
docker compose up -d
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributors

The involvement of these individuals was crucial for the creation of this project.

-   [@Terence2389](https://github.com/Terence2389) - [2102389](2102389@sit.singaporetech.edu.sg) 
-   [@Elsonnnn](https://github.com/Elsonnnn) - [2101234](2101234@sit.singaporetech.edu.sg)
-   [@joash2808](https://github.com/joash2808) - [2101177](2101177@sit.singaporetech.edu.sg)
-   [@tay-en](https://github.com/tay-en) - [2100928](2100928@sit.singaporetech.edu.sg)
-   [@irfaan96](https://github.com/irfaan96) - [2100701](2100701@sit.singaporetech.edu.sg)
-   [@ZafrullaKamil](https://github.com/ZafrullaKamil) - [2100764](2100764@sit.singaporetech.edu.sg)
-   [@2100711](https://github.com/2100711) - [2100711](2100711@sit.singaporetech.edu.sg)



<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.md` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/2100711/ICT3103-TickyTocky.svg?style=for-the-badge
[contributors-url]: https://github.com/2100711/ICT3103-TickyTocky/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/2100711/ICT3103-TickyTocky.svg?style=for-the-badge
[forks-url]: https://github.com/2100711/ICT3103-TickyTocky/network/members
[stars-shield]: https://img.shields.io/github/stars/2100711/ICT3103-TickyTocky.svg?style=for-the-badge
[stars-url]: https://github.com/2100711/ICT3103-TickyTocky/stargazers
[issues-shield]: https://img.shields.io/github/issues/2100711/ICT3103-TickyTocky.svg?style=for-the-badge
[issues-url]: https://github.com/2100711/ICT3103-TickyTocky/issues
[license-shield]: https://img.shields.io/github/license/2100711/ICT3103-TickyTocky.svg?style=for-the-badge
[license-url]: https://github.com/2100711/ICT3103-TickyTocky/blob/master/LICENSE.md
[Node-logo]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/
[npm-logo]: https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white
[npm-url]: https://www.npmjs.com/
[JavaScript-logo]: https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E
[JavaScript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[Express.js]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[ExpressJS-url]: https://expressjs.com/
[React]: https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[React-url]: https://react.dev/
[MongoDB]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
