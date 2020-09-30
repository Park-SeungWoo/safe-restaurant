const request = require('sync-request');
const fs = require('fs');

const NAVER_CLIENT_ID = 'ID'; // these are for _NaverGeocoding
const NAVER_CLIENT_SECRET = 'KEY';
const NAVER_API_HEADER = {
  'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
  'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
};

// get safe restaurant data
_getSafeRestaurant = async (totalamount) => {
  let locinfo = [];
  let rowincre = 999; // to get i ~ i + rowincre data from api

  for (let i = 0; i < totalamount; i += 1 + rowincre) {
    let url =
      'http://211.237.50.150:7080/openapi/2532cb13adf711228d1059388c96ca0020080e57dc386ebd4e2280d494aaba48/json/Grid_20200713000000000605_1/' +
      `${i + 1}/` +
      `${i + rowincre}`;
    let res = await request('GET', url);
    let json = JSON.parse(res.body);
    for (let idx = 0; idx < json.Grid_20200713000000000605_1.row.length; idx++) {
      locinfo.push({
        id: json.Grid_20200713000000000605_1.row[idx].ROW_NUM,
        name: `${json.Grid_20200713000000000605_1.row[idx].RELAX_RSTRNT_NM}`,
        addr: `${json.Grid_20200713000000000605_1.row[idx].RELAX_ADD1} ${json.Grid_20200713000000000605_1.row[idx].RELAX_ADD2}`,
        resGubun: json.Grid_20200713000000000605_1.row[idx].RELAX_GUBUN,
        resGubunDetail: json.Grid_20200713000000000605_1.row[idx].RELAX_GUBUN_DETAIL,
        resTEL: json.Grid_20200713000000000605_1.row[idx].RELAX_RSTRNT_TEL,
      });
    }
  }
  console.log('All datas are ready');
  console.log('Start geocoding');
  _NaverGeocoding(locinfo);
};

// geocoding address using naver api
_NaverGeocoding = async (locinfo) => {
  try {
    let coordsinfo = [];
    for (let idx = 0; idx < locinfo.length; idx++) {
      let NAVER_API_OPTIONS = {
        query: locinfo[idx].addr,
      };
      let res = await request(
        'GET',
        'https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode',
        {
          qs: NAVER_API_OPTIONS,
          headers: NAVER_API_HEADER,
        }
      );
      let json = JSON.parse(res.body);
      try {
        var sucdata = {
          restaurantid: locinfo[idx].id,
          restaurantname: locinfo[idx].name,
          latitude: json.addresses[0].x,
          longitude: json.addresses[0].y,
          kraddr: locinfo[idx].addr,
          enaddr: json.addresses[0].englishAddress,
          resGubun: locinfo[idx].resGubun,
          resGubunDetail: locinfo[idx].resGubunDetail,
          resTEL: locinfo[idx].resTEL,
        };
        coordsinfo.push(sucdata);
        console.log(idx + 1, 'Data push success');
      } catch (err) {
        var errdata = {
          restaurantid: locinfo[idx].id,
          restaurantname: locinfo[idx].name,
          kraddr: locinfo[idx].addr,
          resGubun: locinfo[idx].resGubun,
          resGubunDetail: locinfo[idx].resGubunDetail,
          resTEL: locinfo[idx].resTEL,
          enaddr: 'Error occured',
          latitude: 'Error occured',
          longitude: 'Error occured',
        };
        coordsinfo.push(errdata);
        console.log(idx + 1, 'Data push failed');
        errdata = JSON.stringify(errdata, null, 4);
        errdata += ',';
        fs.appendFileSync('errdata.json', errdata);
      }
    }
    _SaveData(coordsinfo);
  } catch (err) {
    console.log('In _NaverGeocoding ', err);
  }
};

// save succeed datas in a json file
_SaveData = (data) => {
  let strdata = JSON.stringify(data, null, 4);
  fs.writeFileSync('data.json', strdata);
  fs.appendFileSync('errdata.json', ']'); // finally add ']' in errdata.json to make it as an object array
  console.log('Successfully data saved'); // end process
};

// main process
console.log('init request start');
let initres = request(
  // to get total data amount
  'GET',
  'http://211.237.50.150:7080/openapi/2532cb13adf711228d1059388c96ca0020080e57dc386ebd4e2280d494aaba48/json/Grid_20200713000000000605_1/1/2'
);
let initjson = JSON.parse(initres.body);
let newamount = initjson.Grid_20200713000000000605_1.totalCnt;

var initmes = {
  new: 'init',
};
fs.writeFileSync('data.json', JSON.stringify(initmes)); // file init
fs.writeFileSync('errdata.json', '['); //file init
console.log('init files added');

fs.readFile('data.json', (err, data) => {
  // to change updates (must be modified)
  console.log('Read file success');
  if (data.length == newamount) {
    console.log('nothing changed');
  } else if (err) {
    throw err;
  } else {
    // have to modify these codes for only appending additional datas instead of initializing files
    console.log('there is something to change');
    _getSafeRestaurant(newamount);
  }
});
