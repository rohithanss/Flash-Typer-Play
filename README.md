# Flash-Typer-Play
Flash Typer Play is an online typing game that allows players to compete with each other based on their typing speed. Players can compete against others in real-time or race against their own best times.

## Languages and Tools Used

<p align="left"><a href="https://vuejs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original-wordmark.svg" alt="vuejs" width="40" height="40"/> </a> <a href="https://www.w3schools.com/css/" target="_blank" rel="noreferrer"> <a href="https://expressjs.com" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/express/express.png" style="width:40px; height:40px" alt="HTML icon"/> </a>  <a href="https://www.mongodb.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" alt="mongodb" width="40" height="40"/> </a> <a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a> <a href="https://redis.io" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original-wordmark.svg" alt="redis" width="40" height="40"/> </a> 
<img src="https://rohithanss.github.io/skills/socket.png" alt="redis" width="40px"/> </p>

## Packages used

- "bcrypt": "^5.1.0",
- "cookie-parser": "^1.4.6",
- "cors": "^2.8.5",
- "dotenv": "^16.0.3",
- "express": "^4.18.2",
- "ioredis": "^5.2.5",
- "jsonwebtoken": "^9.0.0",
- "mongoose": "^6.8.4",
- "nodemailer": "^6.9.0",
- "nodemon": "^2.0.20",
- "socket.io": "^4.5.4",
- "uid": "^2.0.1"

## Short Demo Video

https://user-images.githubusercontent.com/77886226/222884594-aff33c8c-4be6-4647-bce2-11a1eb186516.mp4


## Features

### E-mail Validation

- Sends an OTP to user's email address, when a new User/Player is creating account.
- Sends an OTP to user's email when users forget his password and want to reset it.

### Typing Race with other Players

- Click on **Start Race** button on the home screen to start a race 
  - If a player is not Logged, his name will be shown as *Guest*
<img src="https://i.imgur.com/QbnUj6H.png"/>

> If there is only one player in the race, the race will not start until the another players join the race

  - If a player is logged in his Name will be shown
<img src="https://i.imgur.com/kd5KYxA.png"/>

> - As soon as other player will joins the race, 10 seconds timer will start
> - More players can join only in these 10 seconds
> - After the 10 seconds end the room will be closed for new players and the race will start
> - If player type wrong spelling after typing few words the input will stop and player will not be able to type, and red background appear.

### LeaderBoard

- Top Ten Players name, typing speed and Total races will appear on the leaderboard
<img src="https://i.imgur.com/1aJFeZr.png"/>

### Role Based Access
- Type of Users
  - Admin 
  - User/Player
- There is Same Login Page for Both the users.
<img src="https://i.imgur.com/983oPte.png"/>

> Both the input fields should be filled to proceed, else user will get message to fill all fields.

- Admin has two extra features in the Navbar
  - Players
  - Race Texts
<img src="https://i.imgur.com/fiYVweT.png"/>

> Players Page (Admin)
> - View all Players' Details, and also sort and search any field.
> - Edit Players Details, such as name, email
> - Delete the Player
<img src="https://i.imgur.com/YT0oBQ5.png"/>

> Race Texts Page (Admin)
> - View all Existing Texts/Sentences, and also sort and search any field.
> - Admin can add new Texts/Sentences.
> - Edit existing Texts' Details, such as title, text/sentences
> - Delete the text
<img src="https://i.imgur.com/OIjpJiN.png"/>
