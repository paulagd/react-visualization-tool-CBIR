
export let getIdFromPath = (path, imlist) => {
  // IDEA:  It is looked up into the list of ALl the queries. So in IMLIST
  // IDEA: VERY IMPORTANT TO LOOK FOR THE MAPPING ID-PATH IN IMLIST AND NOT QIMLIST
    let id = null;
    imlist.map((obj,i)=>{

      if(path.indexOf('.jpg')==-1){
        path = path +'.jpg';
      }
      if(obj.image == path){
        id = obj.id;
      }
    })
    return id;
}

export const getPathfromId = (id, imlist) => {
// IDEA: VERY IMPORTANT TO LOOK FOR THE MAPPING ID-PATH IN IMLIST AND NOT QIMLIST
  let path = null;
  imlist.map((obj,i)=>{
    if(obj.id == id){
      path = obj.image;
    }
  })
  return path;
};
