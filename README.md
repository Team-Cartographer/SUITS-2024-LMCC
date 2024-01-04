# NASA SUITS 2024 LMCC Console :computer:

Team Cartographer's LMCC (Local Mission Control Console) code for the NASA SUITS (Spacesuit User Interface Technologies for Students) Challenge 2023/24. <br>

This project is bundled with [NextJS](https://nextjs.org/) and styled with [TailwindCSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/) and [Material UI](https://mui.com/).

Contents:

- [About the App](#rocket-about-the-app)
- [Usage](#earth_americas-usage)
  - [Getting Started](#getting-started-keyboard)
  - [Development](#development-technologist)
  - [Building & Packaging](#building-and-packaging-hammer-package)

Questions? Send an email to `teamcartographer@gmail.com` and we will get back to you as soon as possible.

Thank you for reading!

## :rocket: About the App

- You can try the LMCC App at [cartographer-lmcc.vercel.app](https://cartographer-lmcc.vercel.app)
- Documentation can be found at [Team Cartographer SUITS24 LMCC App Documentation](https://drive.google.com/drive/folders/1yhpCCvDxDdY3s0cky-qRmtXiPUFmtyzn?usp=sharing)
- more coming soon!<br><br>

## :earth_americas: Usage

### Getting Started :keyboard:

To get started, make sure you are running`Node 21.5.0+` and `npm/npx 10.2.4+`.

Once you have configured your runtime environments, you can begin the steps below to set up this project on your machine:

```bash
git clone https://github.com/Team-Cartographer/SUITS-2024-LMCC.git
```

`cd` into the newly cloned repository before running the commands below:

```bash
npm install -g typescript
# and
npm install
```

This will install all necessary packages and configurations for the development environment.<br><br>

### Development :technologist:

To begin the development server, simply use:

```bash
npm run dev
```

This will open either [https://localhost:3000](https://localhost:3000) or the first available port on your machine.

At any time, the server can be stopped with `Ctrl+C` in the terminal.<br><br>

### Building and Packaging :hammer: :package:

The app will get automatically built by [Vercel](https://vercel.com/) in the event of a push to the `main` branch. To do a build yourself, you can use the command:

```bash
npm run build
```
