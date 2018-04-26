# react-visualization-tool-CBIR
---
This project is a tool that allows to visualize the results of a image retrieval
engine system. The main function is to compute the ranking of similar images for a
query given and visualize the results.

It has three different modes implemented:

    1. Explorer mode

        The user can explore the dataset through `clickable` images which become new
        queries in order to display its ranking.

    2. Annotation mode

        The user can annotate the images which are similar and the ones which are
        not, so that a complete feedback is given to the system. After some computations
        in the current image retrieval engine system, the new and updated ranking
        can be resent and updated.

    3. Query expansion mode

        The user can use this mode to experiment with different queries and see how
        the accuracy of the system and of each singular image improves or not
        depending on which images are selected to compute the `multi query`.


---
## Requirements

* Nodejs v6.11.3
* npm v5.4.2

To install them, find your operating system to download in [here](https://nodejs.org/en/blog/release/v6.11.3/).

    * Linux (tested in Ubuntu 16.04)

      1. Download the .tar.gz file from the previous link.

      2. Unpack the provided archive to /opt/nodejs:
          > mkdir -p /opt/nodejs
          > tar #name_of_the_downloaded_file -C /opt/nodejs
          > mv #name_of_the_UNCOMPRESSED_downloaded_file 6.11.3

      3. Create link to current node version

          > cd /opt/nodejs
          > ln -s 6.11.3 current

      4. Create link to current node binary

          > ln -s /opt/nodejs/current/bin/node /bin/node

      5. Verify node version

          > node -v

      6. Update the npm version

         > npm install -g npm@5.4.2

      7. Verify the npm version

         > npm -v

    * MacOS

       1. Download the .tar.gz file from the previous link.

       2. Run the installer

       3. Verify node version

          > node -v

       4. Update the npm version

          > npm install -g npm@5.4.2

       5. Verify the npm version

          > npm -v


> In case of `error` with the `node-gyp` in rebuild, execute the next commands:
>
> sudo add-apt-repository ppa:chris-lea/zeromq
> sudo add-apt-repository ppa:chris-lea/libpgm
> sudo apt-get update
> sudo apt-get install libzmq3-dev


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


Install apidoc for the documentation of the project
```
npm install -g apidoc

```

Run documentation generation script:
```
npm run doc

```

> Open the file 'index.html' stored in the folder 'documentation' to see how to customize the system.

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
