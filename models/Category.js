const mongoose = require('mongoose');
const {Schema} = mongoose;

const categorySchema = new Schema({ 
    label: {type: String, required: true, unique: true},
    value:  {type: String, required: true, unique: true},
});

// This will tell that server need to return _id as id 
// virtuals is use to set fields in document
const virtual = categorySchema.virtual('id');
virtual.get(function(){
    return this._id;
})
categorySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id
    }
});

exports.Category = mongoose.model("Category", categorySchema);

