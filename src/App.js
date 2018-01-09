import React, { Component } from 'react'
import Linechart from './LineChart'
import InfoBox from './InfoBox'
import './App.css'
class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      totalResponse: null,
      hData: null,
    }
  }
  componentWillMount() {
    const endpoint = "https://api.coindesk.com/v1/bpi/historical/close.json"
    fetch(endpoint).then((response) => {
      return response.json()
    }).then((convertedBody) => {
      const hData = []
      
      for (let date in convertedBody.bpi) {
        hData.push(convertedBody.bpi[date])
      }
      this.setState({
            totalResponse: convertedBody,
            hData
      })
    })
  }
  //Creates points from call
  
  createPoints(){
    const hData = this.state.hData ? this.state.hData : null
    const gData=[]
    
    if (this.state.hData){
      for (let x=0; x<=30; x++){
        const y=hData[x]
        
        gData.push({x,y})
      }
      
    }
    
    return gData
  }
  
  createFakeData(){
    // This function creates data that doesn't look entirely random
    const data = []
    for (let x = 0; x <= 30; x++) {
      const random = Math.random()
      const temp = data.length > 0 ? data[data.length-1].y : 50
      const y = random >= .45 ? temp + Math.floor(random * 20) : temp - Math.floor(random * 20)
      data.push({x,y})
    } 
    return data
  }
  

render() {
  const monthAgoValue = this.state.hData ? this.state.hData[0] : null
  //const graphData = this.state.hData ? this.state.hData : null
  console.log(this.state.hData)
    return this.state.hData ? (
      <div className="App">
        <InfoBox brown={monthAgoValue} />
        <br></br>
        <Linechart data={ this.createPoints() }
                   color='green'/>
      </div>
    ) :
    <div className="App"></div>
  }
}
export default App

// booleans = true or false
// truthy and falsy values
// 0, null, undefined, and false are all falsy

// api call
// call finishes so hdata is set in state
// now conditionally render linechart depending on whether api call is finished