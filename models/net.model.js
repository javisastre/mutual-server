const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const netSchema = new Schema({
  netname: { type: String, required: true },
  netcode: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, default: [], ref: "User" }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});


const Net = mongoose.model('Net', netSchema);

module.exports = Net;