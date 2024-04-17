const {SuperfaceClient} = require("@superfaceai/one-sdk")

class GeoService {
    async getGeoStats(ip) {
        const sdk = new SuperfaceClient()
        const profile = await sdk.getProfile("address/ip-geolocation@1.0.1")
        const result = await profile.getUseCase("IpGeolocation").perform(
            {ipAddress: ip},
            {
                provider: "ipdata",
                security: {
                    apikey: {
                        apikey: process.env.GEOIP_KEY
                    }
                }
            }
        ) 
      
        try {
          return result.unwrap()
        } catch (error) {
            return "Undefined"
        }
    }
}

module.exports = new GeoService()