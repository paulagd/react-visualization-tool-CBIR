
/**
*
* @api  Options_NavBar
* @apiName options_NavBar
* @apiGroup CUSTOMIZATION
*
* @apiDescription "options_NavBar" is a customizable array of objects where each object belongs
* to a dataset. The name and the link should be in the object.
*
* It is imported in './routes.js' and in './components/Home.js' in order to customize the navigation bar.
*
* @apiParam {String} name of the dataset to be shown in the navigation bar.
* @apiParam {String} link Path that will be used for the router to navigate throw
* the app. It should contain '/images/'+ the name of the dataset.
*
*@apiExample options_NavBar
* options_NavBar = [{
*     name: 'OXFORD',
*     link: '/images/oxford',
*   }, {
*     name: 'PARIS',
*     link: '/images/paris',
*   },{
*     name: 'INSTRE',
*     link: '/images/instre',
*   }];
*/

const options_NavBar = [{
    name: 'OXFORD',
    link: '/images/oxford',
  },{
    name: 'PARIS',
    link: '/images/paris',
  },{
    name: 'INSTRE',
    link: '/images/instre',
  }];

export {  options_NavBar };
