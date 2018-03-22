# react-visualization-tool-CBIR
---
A tool to visualize the results of a image retrieval engine system.
---

## Getting started

Install repo
```
git clone https://github.com/paulagd/react-visualization-tool-CBIR.git
```
Set up the dependences
---
```
npm install
npm install --dev
```
Usage
---

1. `npm start`

2. Open [http://localhost:3000/](http://localhost:3000/).


## Project Structure

```
|---node_modules # Contains all the dependences of the project
|---documentation # Contains the documentation of the project
|-------actions
|-----------index.js
|-----------types.js
|-------components
|-----------Home.js
|-----------Images
|---------------DatasetPage.js
|---------------ImageWithRelateds.js
|-----------common
|---------------App.js
|---------------NotFound.js
|---------------PopUpLoader.js
|-------reducers
|-----------index.js
|-----------reducer-error-message.js
|-----------reducer-images.js
|-----------reducer-related-images.js
|-------styles
|-------index.js # Build entry
|-------routes.js # Build routes
|-------customize.js # File to customize the system
|-------store.js # File containing the store
|---.babelrc # Babel config file
|---.gitignore # Files to ignore
|---index.html
|---package.json  #Dependences installed
|---webpack.config.js # Webpack config gile

```

## Documentation of the project

Install apidoc
```
npm install -g apidoc

```

Run documentation generation script:
```
npm run doc

```

> Open the file 'index.html' stored in the folder 'documentation' to see how to customize the system.
