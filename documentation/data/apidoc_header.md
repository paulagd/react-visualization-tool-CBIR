
**Datasets setup**

* The project has a file called `customize.js` where the desired datasets can be setup.
This can be done by modifying the following code:

```javascript
  options_NavBar = [{
      name: 'OXFORD',
      link: '/images/oxford',
    }, {
      name: 'PARIS',
      link: '/images/paris',
    },{
      name: 'INSTRE',
      link: '/images/instre',
    }];
```
> options_NavBar is an array of objects where each object will correspond to one desired dataset.
This attribute will be imported in `src/routes.js` and in `src/components/Home.js` in order to customize
the entire application with the desired datasets.

---

#### **To modify the options_NavBar...**

  1. Built as many objects as datasets you would like to have.
  2. Each object will have 2 attributes:
      - _**name**_ :  Name of the dataset to be displayed in the navigation bar.
      - _**link**_ : Path that will be used for the router of the project in `routes.js`
      to navigate throw the application.

      >It should contain '/images/'+ the name of the dataset, as shown in the example above.
