# NASA SUITS 2024 LMCC Console :computer:

Team Cartographer's LMCC (Local Mission Control Console) code for the NASA SUITS (Spacesuit User Interface Technologies for Students) Challenge 2023/24. <br>

This project is bundled with [Electron React Boilerplate](https://electron-react-boilerplate.js.org/) and styled with [TailwindCSS](https://tailwindcss.com/) and [Material UI](https://mui.com/) as a customized overlay.

Contents:

-   [About the App](#🚀-about-the-app)
-   [Usage](#🌎-usage)
    -   [Getting Started](#getting-started-⌨️)
    -   [Development](#development-🧑‍💻)
    -   [Building](#building-🔨)
    -   [Packaging & Production](#packaging-and-production-📦)

Documentation for certain code files can be found in those respective files in the first few lines.

Questions? Send an email to `teamcartographer@gmail.com` and we will get back to you as soon as possible.

Thank you for reading!

## :rocket: About the App

-   Coming soon!<br><br>

## :earth_americas: Usage

### Getting Started :keyboard:

To get started, run the following commands

```
git clone https://github.com/Team-Cartographer/SUITS-2024-LMCC.git
```

`cd` into the newly cloned repository before running the commands below:

```
npm install --global yarn
```

```
npm install
```

This will install all necessary packages and configurations for the development environment.<br><br>

### Development :technologist:

To begin the development server, simply use:

```
npm start
```

This will open the locally hosted chromium-based Electron application.
To begin editing, go into [./src/renderer](./src/renderer) and edit those files. For further configuration of Electron's loading mechanics, go to [./src/main](./src/main)

At any time, the server can be stopped with `Ctrl+C` in the terminal.

To test that the app is rendered as expected, use:

```
npm test
```

Current tests only include a rendering check.<br><br>

### Building :hammer:

To build the app, run the command:

```
npm run build
```

This will create an optimized production build.
To view memory usages, you can also run the command:

```
ANALYZE=true npm run build
```

This will open a new webpage with file size and memory load information. At any time, the analyzer pages can be stopped with `Ctrl+C` in the terminal.<br><br>

### Packaging and Production :package:

As Electron allows builds for cross-platform applications, you can package for whichever operating system you are on with the command:

```
npm run package
```

You can also package for a specific operating system with the command:

```python
npm run package -- --[option]
# Example: npm run package -- --mac
```

Productions can be debugged via

```
npx cross-env DEBUG_PROD=true npm run package
```

More information on all commands can be found at [Electron React Boilerplate Documentation](https://electron-react-boilerplate.js.org/docs/installation)
