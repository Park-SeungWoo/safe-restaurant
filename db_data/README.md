# Auto detect changes in safe restaurant data and save

## Used modules

> - fs
> - sync-request

## Execution screen

> - First procedure (get all datas)
>   <img src="./images/firstprocedure.png">
>
> - Add modified datas (new data)
>   <img src="./images/additionaldata.png">
>
> - Nothing changed
>   <img src="./images/nothing.png">
>
> - Excluded, Re-included data process
>   <img src="./images/ex_rein_cludeddata.png">

## Description

> 1. Find data.json and errdata.json files.
>
> - Exist
>   1. Detect if there are additional, excluded datas in api.
>      - Changed
>        1. Get only additional datas.
>        2. Geocode them and save.
>        3. Find out if there are any excluded or re-included data and process them.
>      - Nothing changed
>        1. Notice user there isn't any additional datas.
>        2. Find out if there are any excluded or re-included data and process them.
> - Not exist
>   1. Get all safe restaurant datas.
>   2. Geocode them and save.

## How to use it

> - Change NAVER_CLIENT_ID and NAVER_CLIENT_SECRET with your own things.
> - import getdatas.js file. And use it!
>
> ```javascript
>   const getdatas = require('./getdatas');
>   ...
>   getdatas.MainProcess();
>   ...
> ```

## To do

> 1. Find out how to geocode all datas in errdata.json. <br>When the data can not be geocoded with addr1 + addr2, I tried geocode them only with addr1.<br> So I could get 13 more geocoded datas.
