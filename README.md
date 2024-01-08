# NASA SUITS 2024 LMCC Console :computer:

Team Cartographer's LMCC (Local Mission Control Console) code for the NASA SUITS (Spacesuit User Interface Technologies for Students) Challenge 2023/24. <br>

This project is bundled with [NextJS](https://nextjs.org/) and styled with [TailwindCSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/) and [Material UI](https://mui.com/), with [Flask](https://flask.palletsprojects.com/en/3.0.x/) for a custom Python Backend API.

Contents:

- [About the App](#rocket-about-the-app)
- [Usage](#earth_americas-usage)
  - [Getting Started](#getting-started-keyboard)
  - [Development](#development-technologist)

Questions? Send an email to `teamcartographer@gmail.com` and we will get back to you as soon as possible.

Thank you for reading!

## :rocket: About the App

- You can try the LMCC App by running the development environments found in the [Usage](#earth_americas-usage) section below.
- Documentation can be found at [Team Cartographer SUITS24 LMCC App Documentation](https://drive.google.com/drive/folders/1yhpCCvDxDdY3s0cky-qRmtXiPUFmtyzn?usp=sharing)
- This app runs concurrently with the [SUITS 2024 TSS Server](https://github.com/SUITS-Techteam/TSS_2024). Please set this up to run the app.
- more coming soon!<br><br>

## :earth_americas: Usage

## Getting Started :keyboard:

```bash
git clone https://github.com/Team-Cartographer/SUITS-2024-LMCC.git
```

**`cd` into the newly cloned repository before running the steps below!**

## MacOS & Linux Setup :apple: :penguin:

To set up the entire application and run it on MacOS, you do not need to follow any of the steps below. First, make sure that you are running the [SUITS 2024 TSS Server](https://github.com/SUITS-Techteam/TSS_2024) on your machine, and have the URL ready to go before doing the next steps.

Once that is complete, simply do the commands below in the terminal:

```bash
chmod +x start.sh
# and
./start.sh
```

This will install all dependencies for NodeJS and Python, and start both the LMCC Frontend and Backend Servers.

If you would like to open the 3 pages (SUITS TSS Server, LMCC Frontend, LMCC Backend), do the script with the `--open` argument:

```
./start.sh --open
```

This will automatically open the 3 pages in your default browser after 1-2 seconds, allowing time for the servers to begin.

End the LMCC App by doing `Ctrl+C` in your Terminal. Don't forget to end the SUITS TSS Server as well!

## Windows Setup :window:

Follow the steps below to set the app up on Windows

_Universal scripts (just like Mac/Linux) are coming soon! Until then, please follow these instructions_

- [NextJS Frontend](#nextjs-frontend)
- [Flask Backend](#flask-python-backend)

### NextJS Frontend

To get started with frontend setup, make sure you are running`Node 21.5.0+` and `npm/npx 10.2.4+`.

Once you have configured your runtime environments, you can begin the steps below to set up the front part of the project on your machine:

```bash
cd client
# and
npm install -g typescript
# and
npm install
```

This will install all necessary packages and configurations for the frontend development environment.

### Flask-Python Backend

To set up the `Python` & `Flask` backend, make sure you are running `python 3.11+` on your machine.
Please make sure that you are running the TSS Server (Link found in [About the App](#rocket-about-the-app)), as the startup process requires you to have done this to allow the server to run.

Then, cd into the root directory from your GitHub cloning, and run the commands below:

```bash
cd server
```

To set up on Windows there are two routes to take:

- If you are using Windows PowerShell, double click on `./server/start_pwsh.bat`
- If you are using a different Windows terminal, double click on `./server/start_non_pwsh.bat`

Whichever script you chose _should_ configure the environment for you. Else you can open up the file on an editor and try to piece it together. Contact LMCC dev team or a Co-Lead for assistance if needed.

After running through the setup for either of these scripts, do `Ctrl+C` in the terminal to end the server.

## Development :technologist:

To begin the development server, you have to activate both the Python API Server and the NextJS Application:

### MacOS & Linux :apple: :penguin:

Simply follow the instructions at [Getting Started](#getting-started-keyboard) for MacOS or Linux, as this will run everything for you.

### Windows :window:

For Windows, Universal Scripts are coming soon. Until then, follow these instructions:

### NextJS Web App

First, lets begin the NextJS application. Begin at the root directory of the project and run the following commands:

```bash
cd client
# and
npm run dev
```

This will open either [http://localhost:3000](http://localhost:3000) or the first available port on your machine.

At any time, the server can be stopped with `Ctrl+C` in the terminal.

### Python Server (Must be Concurrently Running)

Please make sure that you are running the TSS Server (Link found in [About the App](#rocket-about-the-app)), as the startup process requires you to have done this to allow the server to run.

Now, simply doubleclick on `start_pwsh.bat` or `start_non_pwsh.bat` (depending on which command prompt you are using on Windows) in the `./server` directory, and this should begin the development server for you.

This will open [http://localhost:3001](http://localhost:3001) on your machine. Please make sure that the `NextJS` server that you activated in [NextJS Web App](#nextjs-web-app) is not running on this port (if port 3000 is busy), otherwise you may run into errors.

## Thank you for reading!

Contact [@abhi-arya1](https://github.com/abhi-arya1) with any questions!
