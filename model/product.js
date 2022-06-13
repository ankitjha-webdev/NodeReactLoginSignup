const mongoose = require('mongoose');
var Schema = mongoose.Schema;


productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    date : {
        type: Date,
        default: Date.now
    },
}
),

product  = mongoose.model('product', productSchema);

module.exports = product;