const request = require('sync-request');
const fs = require('fs');
const { ifError } = require('assert');

const NAVER_CLIENT_ID = 'ID'; // these are for _NaverGeocoding
const NAVER_CLIENT_SECRET = 'KEY';
const NAVER_API_HEADER = {
  'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
  'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
};

// get all safe restaurant datas
_getAllSafeRestaurant = async (totalamount) => {
  let locinfo = [];
  for (let sidx = 1; sidx < totalamount + 1; sidx += 1000) {
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
        isSaferes: json.Grid_20200713000000000605_1.row[idx].RELAX_USE_YN,
      });
    }
  }
  console.log('All datas are ready');
  console.log('Start geocoding');
  _NaverGeocoding(locinfo);
};

// get modified safe restaurant datas
_getAddedSafeRestaurant = async (newamount, prevamount) => {
  let locinfo = [];
  prevamount++; // get bigger one
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
        isSaferes: json.Grid_20200713000000000605_1.row[idx].RELAX_USE_YN,
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
    let exdataarr = fs.readFileSync('excludeddata.json', 'utf-8');
    safedataarr = JSON.parse(safedataarr);
    errdataarr = JSON.parse(errdataarr);
    exdataarr = JSON.parse(exdataarr);
    if (safedataarr.length == 1) {
      safedataarr.pop();
    }
    if (errdataarr.length == 1) {
      errdataarr.pop();
    }
    if (exdataarr.length == 1) {
      exdataarr.pop();
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
        if (locinfo[idx].isSaferes == 'Y') {
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
            isSaferes: locinfo[idx].isSaferes,
          };
          safedataarr.push(sucdata);
          console.log(idx + 1, 'Data push success');
        } else {
          let exdata = {
            restaurantid: locinfo[idx].id,
            restaurantname: locinfo[idx].name,
            latitude: json.addresses[0].x,
            longitude: json.addresses[0].y,
            kraddr: locinfo[idx].addr,
            enaddr: json.addresses[0].englishAddress,
            resGubun: locinfo[idx].resGubun,
            resGubunDetail: locinfo[idx].resGubunDetail,
            resTEL: locinfo[idx].resTEL,
            isSaferes: locinfo[idx].isSaferes,
          };
          exdataarr.push(exdata);
          console.log(idx + 1, 'Excluded data push success');
        }
      } catch (err) {
        if (locinfo[idx].isSaferes == 'Y') {
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
            isSaferes: locinfo[idx].isSaferes,
          };
          errdataarr.push(errdata);
          console.log(idx + 1, 'Data push failed');
        } else {
          let exdata = {
            restaurantid: locinfo[idx].id,
            restaurantname: locinfo[idx].name,
            kraddr: locinfo[idx].addr,
            resGubun: locinfo[idx].resGubun,
            resGubunDetail: locinfo[idx].resGubunDetail,
            resTEL: locinfo[idx].resTEL,
            enaddr: 'Error occured',
            latitude: 'Error occured',
            longitude: 'Error occured',
            isSaferes: locinfo[idx].isSaferes,
          };
          exdataarr.push(exdata);
          console.log(idx + 1, 'Excluded data push success');
        }
      }
    }
    _SaveData(safedataarr, errdataarr, exdataarr);
  } catch (err) {
    console.log('In _NaverGeocoding ', err);
  }
};

// process excluded datas
_excludedDataProcess = (exdatas, prevdatas, preverrdatas, prevexdatas) => {
  let exidxs = [];
  let exerridxs = [];
  let re_included = [];
  for (let i = 0; i < exdatas.length; i++) {
    for (let idx = 0; idx < preverrdatas.length; idx++) {
      if (exdatas[i].restaurantid == preverrdatas[idx].restaurantid) {
        preverrdatas[idx].isSaferes = 'N';
        prevexdatas.push(preverrdatas[idx]);
        exerridxs.push(idx);
      }
    }
    for (let idx = 0; idx < prevdatas.length; idx++) {
      if (exdatas[i].restaurantid == prevdatas[idx].restaurantid) {
        prevdatas[idx].isSaferes = 'N';
        prevexdatas.push(prevdatas[idx]);
        exidxs.push(idx);
      }
    }
  }
  for (let idx = 0; idx < prevexdatas.length; idx++) {
    if (exdatas.findIndex((data) => prevexdatas[idx].restaurantid == data.restaurantid) == -1) {
      prevexdatas[idx].isSaferes = 'Y';
      if (prevexdatas[idx].enaddr == 'Error occured') {
        preverrdatas.push(prevexdatas[idx]);
        re_included.push(idx);
      } else {
        prevdatas.push(prevexdatas[idx]);
        re_included.push(idx);
      }
    }
  }

  for (let i = 0; i < exidxs.length; i++) {
    // reverse sort to remove objects from behind
    exidxs.sort((a, b) => {
      return b - a;
    });
    prevdatas.splice(exidxs[i], 1);
  }
  for (let i = 0; i < exerridxs.length; i++) {
    // reverse sort to remove objects from behind
    exerridxs.sort((a, b) => {
      return b - a;
    });
    preverrdatas.splice(exerridxs[i], 1);
  }
  for (let i = 0; i < re_included.length; i++) {
    // reverse sort to remove objects from behind
    re_included.sort((a, b) => {
      return b - a;
    });
    prevexdatas.splice(re_included[i], 1);
  }
  console.log(`${exidxs.length} datas were excluded in data.json`);
  console.log(`${exerridxs.length} datas were excluded in errdata.json`);
  console.log(`${re_included.length} datas were re-included in safe restaurant data`);
  console.log(
    `Total ${exidxs.length + exerridxs.length + re_included.length} datas were changed\n`
  );
  prevdatas.sort((a, b) => {
    return a.restaurantid - b.restaurantid;
  });
  preverrdatas.sort((a, b) => {
    return a.restaurantid - b.restaurantid;
  });
  prevexdatas.sort((a, b) => {
    return a.restaurantid - b.restaurantid;
  });
  _SaveData(prevdatas, preverrdatas, prevexdatas);
};

// save succeed datas in a json files
_SaveData = (data, errdata, exdata) => {
  let strdata = JSON.stringify(data, null, 4);
  let strerrdata = JSON.stringify(errdata, null, 4);
  let strexdata = JSON.stringify(exdata, null, 4);
  fs.writeFileSync('data.json', strdata);
  fs.writeFileSync('errdata.json', strerrdata);
  fs.writeFileSync('excludeddata.json', strexdata);
  console.log('Successfully data saved'); // end process
};

// main process
console.log('init request start\n');

// to get total data amount, excluded datas, reincluded datas
let newamount = 1; // init value
let exdatas = [];
for (let idx = 1; idx < newamount + 1; idx += 1000) {
  eidx = idx + 999;
  let url =
    'http://211.237.50.150:7080/openapi/2532cb13adf711228d1059388c96ca0020080e57dc386ebd4e2280d494aaba48/json/Grid_20200713000000000605_1/' +
    `${idx}/` +
    `${eidx}`;
  let initres = request('GET', url);
  let initjson = JSON.parse(initres.body);
  newamount = initjson.Grid_20200713000000000605_1.totalCnt; // change condition
  for (let i = 0; i < initjson.Grid_20200713000000000605_1.row.length; i++) {
    if (initjson.Grid_20200713000000000605_1.row[i].RELAX_USE_YN == 'N') {
      let exdata = {
        restaurantid: initjson.Grid_20200713000000000605_1.row[i].ROW_NUM,
        restaurantname: initjson.Grid_20200713000000000605_1.row[i].RELAX_RSTRNT_NM,
        kraddr: `${initjson.Grid_20200713000000000605_1.row[i].RELAX_ADD1} ${initjson.Grid_20200713000000000605_1.row[i].RELAX_ADD2}`,
        resTEL: initjson.Grid_20200713000000000605_1.row[i].RELAX_RSTRNT_TEL,
        isSaferes: initjson.Grid_20200713000000000605_1.row[i].RELAX_USE_YN,
      };
      exdatas.push(exdata);
    }
  }
}
// console.log(exdatas.length);

if (
  fs.existsSync('data.json') &&
  fs.existsSync('errdata.json') &&
  fs.existsSync('excludeddata.json')
) {
  console.log('Data file exists');
  console.log('Check for changes\n');

  let safedata = fs.readFileSync('data.json', 'utf-8');
  let errdata = fs.readFileSync('errdata.json', 'utf-8');
  let exdata = fs.readFileSync('excludeddata.json', 'utf-8');
  safedata = JSON.parse(safedata);
  errdata = JSON.parse(errdata);
  exdata = JSON.parse(exdata);
  let prevamount =
    safedata[safedata.length - 1].restaurantid < errdata[errdata.length - 1].restaurantid
      ? errdata[errdata.length - 1].restaurantid
      : safedata[safedata.length - 1].restaurantid; // get last index to check amount
  try {
    prevamount =
      prevamount < exdata[exdata.length - 1].restaurantid
        ? exdata[exdata.length - 1].restaurantid
        : prevamount;
  } catch (err) {
    prevamount = prevamount;
  }

  if (prevamount == newamount) {
    console.log('Nothing added');
    console.log(`Previous data amount : ${safedata.length + errdata.length + exdata.length}`);
    console.log(`New data amount : ${newamount}\n`);
    if (exdatas.length != exdata.length) {
      console.log('Some datas were excluded');
      console.log('Start excluded datas processing\n');
      _excludedDataProcess(exdatas, safedata, errdata, exdata);
    }
  } else {
    console.log('Something changed');
    console.log(`Previous data amount : ${safedata.length + errdata.length + exdata.length}`);
    console.log(`New data amount : ${newamount}`);
    console.log(`${newamount - safedata.length - errdata.length - exdata.length} datas added`);
    console.log('Start processing\n');
    _getAddedSafeRestaurant(newamount, prevamount); // get prevdata amount ~ newamount (add modified datas)
    if (exdatas.length != exdata.length) {
      console.log('Some datas were excluded');
      console.log('Start excluded datas processing\n');
      _excludedDataProcess(exdatas, safedata, errdata, exdata);
    }
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
  fs.writeFileSync('excludeddata.json', JSON.stringify(initmes, null, 4)); // file init
  console.log('Init files added');
  console.log('Start processing\n');
  _getAllSafeRestaurant(newamount); // get 0 ~ newamount data (add all datas)
}
