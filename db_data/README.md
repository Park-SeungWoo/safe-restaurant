# Auto detect safe restaurant data changes and save

## Used modules

> - fs
> - sync-request

## Execution screen

> - First procedure
>   <img src="./images/firstprocedure.png">
>
> - Add modified datas
>   <img src="./images/additionaldata.png">
>
> - Nothing changed
>   <img src="./images/nothing.png">

## Description

> 1. Find data.json and errdata.json files.
>
> - Exist
>   1. Detect if there is a additional datas in api.
>      - Changed
>        1. Get only additional datas.
>        2. Geocode them and save.
>      - Nothing changed
>        1. Notice user there isn't any additional datas.
> - Not exist
>   1. Get all safe restaurant datas.
>   2. Geocode them and save.

## To do

> 1. Find out how to geocode datas in errdata.json.
> 2. Find out how to handle excluded datas.
