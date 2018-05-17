# react-visualization-tool-CBIR
---
This project is a tool that allows to visualize the results of a image retrieval
engine system. The main function is to compute the ranking of similar images for a
query given and visualize the results.

It has three different modes implemented:

    1. Explorer mode

        The user can explore the dataset through  `clickable` images which become new
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
* Python 2.7
* Zmq

* Linux (tested in Ubuntu 16.04)

  1. Create a virtualenv using python2.7

     > virtualenv paula --python=python2.7
     >
     > source paula/bin/activate

  2. update the repository sources list and install dependencies

  > apt-get update
  > apt-get install -y curl
  > apt-get -y autoclean

  3. Set nvm environment variables and install nvm

  > export NVM_DIR=/usr/local/nvm
  > export NODE_VERSION=6.11.3
  >
  > curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash

  4. install node and npm

  > source $NVM_DIR/nvm.sh
  > nvm install $NODE_VERSION
  > nvm alias default $NODE_VERSION
  > nvm use default

  5. Add node and npm to path so the commands are available
  > export NODE_PATH=$NVM_DIR/v$NODE_VERSION/lib/node_modules
  > export PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

  6. Install npm

  > npm install -g yarnpkg
  > yarn global add npm@5.4.2

  7. Confirm installation
  > node -v
  > npm -v

  8. Install ZMQ

  > apt-get install wget
  > wget https://github.com/zeromq/libzmq/releases/download/v4.2.2/zeromq-4.2.2.tar.gz
  > tar xvzf zeromq-4.2.2.tar.gz
  > apt-get update
  > apt-get install -y libtool pkg-config build-essential autoconf automake uuid-dev
  > cd zeromq-4.2.2
  > ./configure
  > make install
  > ldconfig

  > apt-get update && apt-get install -y procps
  > npm install -g node-gyp
  > npm install bindings

  * In case of `error` with the `node-gyp` in rebuild...
  >
  >   sudo add-apt-repository ppa:chris-lea/zeromq
  >   sudo add-apt-repository ppa:chris-lea/libpgm
  >   sudo apt-get update
  >   sudo apt-get install libzmq3-dev
  >
  > You should be using Python 2.7. No other versions as Python 3.X allowed.

* MacOS

   1. Create a virtualenv using python2.7

      > virtualenv paula --python=python2.7
      >
      > source paula/bin/activate

   2. Download the .tar.gz file from [here](https://nodejs.org/en/blog/release/v6.11.3/) and
   run the installer.

   3. Verify node version (should be v6.11.3)

      > node -v

   4. Update the npm version

      > npm install -g npm@5.4.2

   5. Verify the npm version (should be v5.4.2)

      > npm -v

   6. Install zmq
      > brew install zmq
      > brew reinstall zeromq

   * In case of `error` with the `node-gyp` in rebuild...
      >
      > npm install -g node-gyp
      > npm install bindings
      > brew install pkg-config
      >
      > You should be using Python 2.7. No other versions as Python 3.X allowed.

---
### Repositories related:
>
> * [Nodejs server](https://github.com/paulagd/node-server)
> * [python-server-salbow](https://bitbucket.org/emohe/python-server-salbow/src/master/)
> * [python-server-dummy](https://bitbucket.org/emohe/python-server-dummy/src/master/)
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
|---node_modules      # Contains all the dependences of the project.
|---documentation     # Contains the documentation of the project.
|-------actions       # Contains the main actions computing the API calls.
|-------components
|-------reducers
|-------styles
|-------index.js      # Build entry
|-------routes.js     # Build routes
|-------customize.js  # File to customize the system
|-------store.js      # File containing the store
|---.babelrc          # Babel config file
|---.gitignore        # Files to ignore
|---apidoc.json       # contains the configuration to run the documentation
|---index.html
|---package.json      #Dependences installed
|---webpack.config.js # Webpack config gile

```
