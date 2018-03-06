
const options_NavBar = [{
    name: 'OXFORD',
    link: '/images/oxford',
  }, {
    name: 'PARIS',
    link: '/images/paris',
  },{
    name: 'INSTRE',
    link: '/images/instre',
  }];

// DEFINE DATASETS AND EXPORT THEM

const oxford = {
  url_imgs: 'http://localhost:5000/getImageOxfordById/'
};

const paris = {
  url_imgs: 'http://localhost:5000/getImageParisById/'
};

const instre = {
  url_imgs: 'http://localhost:5000/getImageInstreById/'
};

export {  options_NavBar, oxford, paris, instre };
