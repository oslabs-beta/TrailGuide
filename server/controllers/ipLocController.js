import { query } from '../models/ipsModel.js';

export default {
  injectLocs: async (req, res, next) => {
    if (!req.query.includeLocation) return next();
    try {
      for (let event of res.locals.events) {
        // try to get the data from the database's ips table
        let result = await query(
          `
        SELECT country, region, city, lat, long FROM ips
        WHERE ip = $1;
        `,
          [event.source_ip]
        );

        // if we aren't storing a location for this ip, query the ip api
        if (!result.rows || result.rows.length === 0) {
          const response = await fetch(
            'https://ipapi.co/' + event.source_ip + '/json'
          );
          const location = await response.json();
          console.log(
            'ipLocController.injectLocs: location from ipapi: ',
            location
          );
          event = { ...event, ...location };

          //overwrite the result with the returned row from the insert
          result = await query(
            `
              INSERT INTO ips
              (ip, country, region, city, lat, long)
              VALUES(
                $1,
                $2,
                $3,
                $4,
                $5,
                $6
              )
              ON CONFLICT (ip) DO NOTHING
              RETURNING country, region, city, lat, long;
            `,
            [
              event.source_ip,
              location.country,
              location.region,
              location.city,
              location.latitude,
              location.longitude,
            ]
          );
        }
        const { country, region, city, lat, long } = result.rows[0];

        // update the event, then continue the loop
        event.country = country;
        event.region = region;
        event.city = city;
        event.lat = Number(lat);
        event.long = Number(long);
      }
      return next();
    } catch (error) {
      return next({
        log: 'ipLocController.injectLocs: Error: ' + error,
        status: 500,
        message: {
          err: 'A server error occured',
        },
      });
    }
  },
};
