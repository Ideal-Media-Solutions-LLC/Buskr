<!-- Add badges here -->
# Client Project Template

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="./GETTING_STARTED.md">Getting Started</a>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## *See [Project Board](https://trello.com/b/K4bikU5V/sprint-board) for current project status.*

## About The Project


### Built With

## Usage


## Contact

# Installation

## Prerequisites

- [Node.js](nodejs.org)
- [PostgreSQL](postgresql.org)
- [PostGIS](postgis.net)
- [Redis](redis.io)

## Setup

1. Install all prerequisites and make sure services are running. **Do not proceed to step 2 until you have installed all four prerequisites.**

If you are using Mac OS X, [brew](https://brew.sh/) can install these dependencies for you. For example, to install and start Redis on a Mac:

```sh
brew install redis
brew services start redis
```

If you are using Windows, things are a little more complicated. You will need to install the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install). Then you can run:

```sh
sudo apt-get install redis-server
sudo service redis-server start
```

If you are using Linux, you already know how to do this.

2. Install NPM modules:
```sh
npm install
```

3. Set up the database:

```sh
RDS_USERNAME=$(whoami) npm run migrate
```

4. Seed the database (optional, slow):

```sh
RDS_USERNAME=$(whoami) npm run seed
```

5. Create a file named `.env.local`. This file overrides `.env` with your private data. Inside it, put:

```sh
RDS_USERNAME=<your-username>
```

5. Add your private credentials to `.env.local`.

## Running

### Development Mode

```sh
npm run dev
```

### Production Mode
```sh
npm run build
npm run start
```
