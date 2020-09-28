const fetch = require('node-fetch');
const NodeGeocoder = require('node-geocoder');

const API_KEY = 'AIzaSyCdin2XMBSzicI8YcG6DwZciZT7xYhgFF8';
const DATALEN = 100; // get 100 datas
const options = {
  provider: 'google',
  apiKey: API_KEY,
};

_geocoding = async (locinfo) => {
  // geocoding safe restaurant address data
  try {
    // console.log(locinfo);
    let coordsinfo = [];
    const geocoder = NodeGeocoder(options);
    for (var i = 0; i < locinfo.length; i++) {
      var res = await geocoder.geocode(locinfo[i].addr);
      //   console.log(res[0]);
      coordsinfo.push({
        id: locinfo[i].id,
        lat: res[0].latitude,
        long: res[0].longitude,
        kraddr: locinfo[i].addr,
        enaddr: res[0].formattedAddress,
      });
    }
    console.log(coordsinfo); // final information variable
  } catch (err) {
    console.log(err);
  }
};

//////////////////geocoding/////////////////////

_getSafeRestaurant = async () => {
  // get safe restaurant data
  let locinfo = [];
  await fetch(
    `http://211.237.50.150:7080/openapi/2532cb13adf711228d1059388c96ca0020080e57dc386ebd4e2280d494aaba48/json/Grid_20200713000000000605_1/1/${DATALEN}?`
  )
    .then((res) => res.json())
    .then(function (json) {
      for (let idx = 0; idx < DATALEN; idx++) {
        locinfo.push({
          id: idx,
          name: `${json.Grid_20200713000000000605_1.row[idx].RELAX_RSTRNT_NM}`,
          coordsaddr: `${json.Grid_20200713000000000605_1.row[idx].RELAX_ADD1}`,
          addr: `${json.Grid_20200713000000000605_1.row[idx].RELAX_ADD1} ${json.Grid_20200713000000000605_1.row[idx].RELAX_ADD2}`,
        });
      }
      console.log('Get Safe restaurant data complete!!!');
      console.log('wait for geocoding');
      _geocoding(locinfo);
    });
};

//////////////////saferestaurant/////////////////////

_getSafeRestaurant();
