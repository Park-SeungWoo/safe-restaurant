const request = require('sync-request');
const fs = require('fs');

const NAVER_CLIENT_ID = 'ID'; // these are for _NaverGeocoding
const NAVER_CLIENT_SECRET = 'KEY';
const NAVER_API_HEADER = {
  'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
  'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
};

// get all safe restaurant datas
_getAllSafeRestaurant = async (totalamount) => {
  let locinfo = [];
  for (let sidx = 1; sidx <= totalamount + 1; sidx += 1000) {
    let eidx = sidx + 999;
    let url =
      'http://211.237.50.150:7080/openapi/2532cb13adf711228d1059388c96ca0020080e57dc386ebd4e2280d494aaba48/json/Grid_20200713000000000605_1/' +
      `${sidx}/` +
      `${eidx}`;
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

// get modified safe restaurant datas
_getModifiedSafeRestaurant = async (newamount, safelidx, errlidx) => {
  let locinfo = [];
  let prevamount = safelidx < errlidx ? errlidx + 1 : safelidx + 1; // get bigger one
  for (let sidx = prevamount; sidx < newamount + 1; sidx += 1000) {
    let eidx = sidx + 999;
    let url =
      'http://211.237.50.150:7080/openapi/2532cb13adf711228d1059388c96ca0020080e57dc386ebd4e2280d494aaba48/json/Grid_20200713000000000605_1/' +
      `${sidx}/` + // right next data
      `${eidx}`;
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
  console.log('All modified datas are ready');
  console.log('Start geocoding');
  _NaverGeocoding(locinfo);
};

// geocoding address using naver api
_NaverGeocoding = async (locinfo) => {
  try {
    let safedataarr = fs.readFileSync('data.json', 'utf-8');
    let errdataarr = fs.readFileSync('errdata.json', 'utf-8');
    safedataarr = JSON.parse(safedataarr);
    errdataarr = JSON.parse(errdataarr);
    if (safedataarr.length == 1) {
      safedataarr.pop();
    }
    if (errdataarr.length == 1) {
      errdataarr.pop();
    }
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
        let sucdata = {
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
        safedataarr.push(sucdata);
        console.log(idx + 1, 'Data push success');
      } catch (err) {
        let errdata = {
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
        errdataarr.push(errdata);
        console.log(idx + 1, 'Data push failed');
      }
    }
    _SaveData(safedataarr, errdataarr);
  } catch (err) {
    console.log('In _NaverGeocoding ', err);
  }
};

// save succeed datas in a json files
_SaveData = (data, errdata) => {
  let strdata = JSON.stringify(data, null, 4);
  let strerrdata = JSON.stringify(errdata, null, 4);
  fs.writeFileSync('data.json', strdata);
  fs.writeFileSync('errdata.json', strerrdata);
  console.log('Successfully data saved'); // end process
};

// main process
console.log('init request start\n');
// to get total data amount
let initres = request(
  'GET',
  'http://211.237.50.150:7080/openapi/2532cb13adf711228d1059388c96ca0020080e57dc386ebd4e2280d494aaba48/json/Grid_20200713000000000605_1/1/2'
);
let initjson = JSON.parse(initres.body);
let newamount = initjson.Grid_20200713000000000605_1.totalCnt;

if (fs.existsSync('data.json') && fs.existsSync('errdata.json')) {
  console.log('Data file exists');
  console.log('Check for changes\n');

  let safedata = fs.readFileSync('data.json', 'utf-8');
  let errdata = fs.readFileSync('errdata.json', 'utf-8');
  safedata = JSON.parse(safedata);
  errdata = JSON.parse(errdata);

  if (safedata.length + errdata.length == newamount) {
    console.log('Nothing changed');
    console.log(`Previous data amount : ${safedata.length + errdata.length}`);
    console.log(`New data amount : ${newamount}`);
  } else {
    console.log('Something changed');
    console.log(`Previous data amount : ${safedata.length + errdata.length}`);
    console.log(`New data amount : ${newamount}`);
    console.log(`${newamount - safedata.length - errdata.length} datas added`);
    console.log('Start processing\n');
    _getModifiedSafeRestaurant(
      newamount,
      safedata[safedata.length - 1].restaurantid,
      errdata[errdata.length - 1].restaurantid
    ); // get prevdata amount ~ newamount (add modified datas)
  }
} else {
  console.log('File not exists');
  let initmes = [
    {
      new: 'init',
    },
  ];
  fs.writeFileSync('data.json', JSON.stringify(initmes, null, 4)); // file init
  fs.writeFileSync('errdata.json', JSON.stringify(initmes, null, 4)); //file init
  console.log('Init files added');
  console.log('Start processing\n');
  _getAllSafeRestaurant(newamount); // get 0 ~ newamount data (add all datas)
}
