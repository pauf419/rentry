const {SuperfaceClient} = require("@superfaceai/one-sdk")
const geoip = require('geoip-lite');

class GeoService {
    async getGeoStats(ip) {

        const geo = geoip.lookup(ip);
      
        return geo
    }
}

module.exports = new GeoService()