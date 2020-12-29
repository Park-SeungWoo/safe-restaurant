# have to change

> - header classic search bar component => icon => filter to bars
> - add this code in easy-toast/index.js => show, close method

```javascript
this.state.opacityValue,
  {
    toValue: 0.0,
    duration: this.props.fadeOutDuration,
    useNativeDriver: true, // this line
  };
```
