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
|---src # Components live here
|-------actions
|-----------index.js
|-----------types.js
|-------components
|-----------Welcome.js
|-----------
|-------common
|-----------App.js
|-----------NotFound.js
|-------reducers
|-----------index.js
|-----------reducer-error-message.js
|-----------reducer-images.js
|-----------reducer-related-images.js
|-------styles
|-------index.js # Build entry
|-------routes.js # Build routes
|-------customize.js # File to customize the system
|---.babelrc # Babel config file
|---.gitignore # Files to ignore
|---index.html
|---package.json  #Dependences installed
|---webpack.config.js # Webpack config gile

```


## CUSTOMIZATION

### Datasets

* In the 'customize.js' file, it is specified how to introduce different dataset.
* The navegation bar will be modified following the datasets specified.
