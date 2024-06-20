# NodeJS and ReactJS Application Boilerplate

**FullStack App Starter** is a boilerplate for building applications using **NodeJS** and **ReactJS**. It features a custom **MVC framework** for the server-side and a React application for the client-side. This boilerplate is designed to streamline the development process, providing a solid foundation for your application.

## Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Docker Setup](#docker-setup)
- [Scripts](#scripts)

## Project Structure

The project is organized into two main parts:

- **server**: Contains the server application built with a custom MVC framework.
- **client**: Contains the React application.

### Folder Structure

```
.
├── client
│   ├── public
│   ├── src
│   ├── package.json
│   └── ...
├── server
│   ├── app
│   ├── core
│   ├── routes
│   ├── scripts
│   ├── index.js
│   ├── bootstrap.js
│   └── ...
├── docker
│   ├── data
│   ├── docker-compose.yml
│   └── ...
├── .env.example
├── package.json
└── ...
```

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/en/download/)
- [Docker](https://www.docker.com/get-started)

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

Install dependencies for both server and client:

```bash
npm install
cd client
npm install
cd ..
```

## Configuration

1. Duplicate `.env.example` and rename it to `.env`.

```bash
cp .env.example .env
```

2. Modify the `.env` file with your configuration.

```
SERVER_PORT=5000

DB_HOST="127.0.0.1"
DB_NAME="docker"
DB_USER="root"
DB_PASS="root"
DB_PORT="3307"
```

## Usage

Start the application using the following command:

```bash
npm start
```

This will concurrently start both the server and the client.

## Docker Setup

To set up the database using Docker, navigate to the `docker` folder and run:

```bash
cd docker
docker-compose up
```

This will start a MariaDB container with the configuration specified in `docker-compose.yml`.

## Scripts

### Server Scripts

- `start:server`: Starts the server with nodemon.
- `db:migrate`: Runs database migrations.

### Client Scripts

- `start`: Starts the React development server.
- `build`: Builds the React application.
- `test`: Runs tests for the React application.
- `eject`: Ejects the configuration of the React application.

### Main Scripts

- `start`: Concurrently starts both the server and the client.
