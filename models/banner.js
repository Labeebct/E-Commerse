const mongoose = require('mongoose')
const Schema = mongoose.Schema


const bannerShema = new Schema({

    bannerimg:{
      type:String,
      required:true
    },
    bannername:{
        type:String,
        required:true
    },
    bannerhead:{
        type:String,
        required:true
    },
    banneramount:{
        type:Number,
        required:true
    },
    startdate:{
        type:Date,
        required:true
    },
    enddate:{
        type:Date,
        required:true
    }
},{ timestamps: true })


bannerShema.index({ enddate: 1 }, { expireAfterSeconds: 0 });

module.exports = new mongoose.model('banner',bannerShema)