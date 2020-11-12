

export default class App extends Component {
  render() {
    return (
        <SafeAreaProvider>
          <View>
            <StatusBar barStyle="dark-content" />
            <HeaderClassicSearchBar onChangeText={text => console.log(text)}/>
          </View>
          <Button title="OPEN BOTTOM SHEET" onPress={() => this.RBSheet.open()} />
          <RBSheet
            ref={ref => { this.RBSheet = ref; }}
            height={300}
            openDuration={250}
            customStyles={{
              container: {
                justifyContent: "center",
                alignItems: "center"
              }
            }}
          >
            <Button title=""/>
          </RBSheet>
        </SafeAreaProvider>
    );
  }
}