# NASA SUITS 2024 LMCC Console :computer:

Team Cartographer's LMCC (Local Mission Control Console) code for the NASA SUITS (Spacesuit User Interface Technologies for Students) Challenge 2023/24. <br>

This project is bundled with [NextJS](https://nextjs.org/) and styled with [TailwindCSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/) and [Material UI](https://mui.com/), with [Flask](https://flask.palletsprojects.com/en/3.0.x/) for a custom Python Backend API.

Contents:

- [About the App](#rocket-about-the-app)
- [Running the App](#keyboard-running-the-app)

Software Dependencies

- `NodeJS 21.5.0+`
- `npm 10.2.4`
- `Python 3.12.1`
- `git 2.43.0`

Questions? Send an email to `teamcartographer@gmail.com` and we will get back to you as soon as possible.

Thank you for reading!

## :rocket: About the App

- Docs can be found at: https://tclmcc.gitbook.io/docs/
- You can try the LMCC App by running the development environments found in the [Usage](#earth_americas-usage) section below.
- This app runs concurrently with the [SUITS 2024 TSS Server](https://github.com/SUITS-Techteam/TSS_2024). Please set this up to run the app, or make sure you have another computer available with a server to use that (learn more [here](#local-and-external-server-information))
- more coming soon!<br><br>

## :keyboard: Running the App

First, clone the repository:

```bash
git clone https://github.com/Team-Cartographer/SUITS-2024-LMCC.git
# and
cd SUITS-2024-LMCC
```

**`cd` into the newly cloned repository before running any further steps**

### Local and External Server Information

When you run the application, your console of choice (regardless of platform) will ask you this question:

```
do you want to run the app (frontend, server, TSS) on your machine? (Y/n):
```

If you answer with `Y`, the application will be launched on your computer. This requires the TSS Server found in [About the App](#rocket-about-the-app) to be running concurrently.

If you answer with `N`, your setup is complete. You can simply open the external URLs provided by another user which will be printed to their shell once they run either `start.sh` or `./Setup.ps1`. After that, your app will be running on their servers, mantaining a consistent environment across all testing platforms.

For most testing cases, please answer `Y`, unless you have another computer on the same network with the LMCC server ready to use.

### Platform-Specific Instructions

Since the App is built for Mac, Linux, and Windows, you can follow your platform specific instructions below:

- [MacOS/Linux](#macos--linux-apple-penguin)
- [Windows](#windows-window)

## MacOS & Linux :apple: :penguin:

To set up the entire application and run it on MacOS, you do not need to follow any of the steps below. Simply do the commands below in the terminal.

```bash
chmod +x start.sh
# and
./start.sh
# type Ctrl+C to end the program
```

This will install all dependencies for NodeJS and Python, and start both the LMCC Frontend and Backend Servers on network-public URLs. You can use these for testing or for development.

If you would like to open the 3 pages (SUITS TSS Server, LMCC Frontend, LMCC Backend), do the script with the `--open` argument:

```
./start.sh --open
```

This will automatically open the 3 pages in your default browser after 1-2 seconds, allowing time for the servers to begin.

End the LMCC App by doing `Ctrl+C` in your Terminal. Don't forget to end the SUITS TSS Server as well!

## Windows :window:

**This app strictly runs in Windows Powershell. Please make sure you have that up-to-date before following the rest of these instructions**

For Windows Setup, there is a couple extra steps as Windows scripting isn't as easy as MacOS. However, we have tried to simplify it as much as possible.

**If you answered with `n` to the question from [Local and External Servers](#local-and-external-server-information), then these next steps are not required as you are loading an external URL.**

If you are running locally, follow these commands:

```bash
# this will run app setup
# you can re-run this any time you update dependencies
./Setup.ps1
# answer with *Y* to the local app prompt
```

Once you finish setup, do these commands in _seperate terminal windows_:

```bash
cd client
# and
npm run dev
# type Ctrl+C to end frontend user interface
```

```bash
cd server
# and
. .\venv\Scripts\Activate.ps1
# and
python server.py
# type Ctrl+C to end backend server
deactivate # to end venv
```

Let us know with any issues or questions!

## Thank you for reading!

Contact [@abhi-arya1](https://github.com/abhi-arya1) with any questions!
