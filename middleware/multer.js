const multer = require('multer')
const moment = require('moment')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

     if(file.fieldname === 'productimg'){
   
      if(req.files.length > 5){
        cb(null, './public/dump')
      }else{
        cb(null, './public/products-img')
      }
     }
     else if(file.fieldname === 'categoryimg'){
      cb(null, './public/category-image')
     }
     else if(file.fieldname === 'bannerimg'){
      cb(null, './public/banner-image')
     }

    },
    filename:(req, file, cb) => {
      const currentDate = moment().format('DD-MM-HH-mm-ss')
      cb(null, currentDate + '-' + file.originalname)
    }
  })


const upload = multer({ storage: storage })

module.exports = upload

