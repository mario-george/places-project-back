const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "openstreetmap",
};

const geocoder = NodeGeocoder(options);

async function getGeocodingData(address) {
  try {
    const res = await geocoder.geocode(address);
    return res[0];
  } catch (error) {
    console.log(error);
  }
}

module.exports = getGeocodingData;
