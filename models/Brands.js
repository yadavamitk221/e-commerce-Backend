const mongoose = require('mongoose');
const {Schema} = mongoose;


const brandSchema = new Schema({ 
    label: {type: String, required: true, unique: true},
    value:  {type: String, required: true, unique: true},
});

// This will tell that server need to return _id as id 
// virtual is use to set fields in document
const virtual = brandSchema.virtual('id');
virtual.get(function(){
    return this._id;
})
brandSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id
    }
})

exports.Brand = mongoose.model("Brand", brandSchema);

