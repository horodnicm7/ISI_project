const mongoose = require('mongoose')

const judetSchema = new mongoose.Schema({
  id: {
      type: Number,
      required: true
  },
  judet: {
    type: String,
    required: true
  },
  culturaPredominanta: {
    type: String,
    required: true
  },
  umiditate: {
    type: Number,
    required: true
  },
  humus: {
      type: Number,
      required: true
  },
  culturi: {
      type: Object,
      required: true
  },
  coordonate: {
      lat: {
          type: Number,
          required: true
      },
      long: {
          type: Number,
          required: true
      }
  }
});

const Judet = mongoose.model('Judet', judetSchema);

module.exports = Judet;