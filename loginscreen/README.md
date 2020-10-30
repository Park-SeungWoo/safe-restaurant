# 안심 식당앱 로그인 화면입니다

## 사용 모듈

> - @react-native-community/geolocation
> - react-native-maps

## 실행 화면

> - 아이폰
>
>   <img src="./screen_img/exe_ios.png" width="auto" height="600">
>
> - 안드로이드
>
>   <img src="./screen_img/exe_and.png" width="auto" height="600">

## set virtual screen range

> ### execution screen
>
> <img src="./screen_img/virtual_screen.png" width="500" height="auto">
>
> 1. central marker means the center of the screen<br>
> 2. inner 4 markers mean the size of current screen<br>
>    (in this picture I adjusted delta values to see all markers, and there are some problems in latdelta value)<br>
> 3. outer 4 markers mean the range (we only wanna retrieve datas in this range)

## ToDo

> 1. 실제 로그인 기능 구현 (백엔드와 연결)
