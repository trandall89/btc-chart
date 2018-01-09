import React, {Component} from "react"
import './InfoBox.css'
class InfoBox extends Component {
    totalDiff(cPrice){
        const { brown } = this.props
        const tDiff = cPrice-brown
        return '$' + tDiff.toFixed(2)
    }
    percentDiff(cPrice){
        const { brown } = this.props
        const pDiff = (cPrice-brown)/brown * 100
     return pDiff.toFixed(2) + '%'
    }
    
 
    constructor(props) {
        super(props)
        
        this.state = {
            price: null,
            date: null,
        }
    }
    componentWillMount() {
        const endpoint = 'https://api.coindesk.com/v1/bpi/currentprice.json'
        fetch(endpoint).then((response) => {
            return response.json()
        }).then((convertedBody) => {
            this.setState({
                price: convertedBody.bpi.USD.rate_float.toFixed(2)
            })
        }).catch((e) => {
            console.log(`you dun goofed: ${e}`)
        })
    }
    
    render() {

        return(
        <div>
            <div className='info-box'>
                <h3>Current Price</h3>
                <div>{ this.state.price ? `$${this.state.price}` : null}</div>
            </div>
            <div className='info-box'>
                <h3>Difference<br />(Past 31 Days)</h3>
                <div className='diff-box'>
                    <h3>Price</h3>
                    <div>{ this.totalDiff(this.state.price) }</div>
                </div>
            </div>
            <div className='info-box'>
                <div className='diff-box'>
                    <h3>Percent</h3>
                    <div>{ this.percentDiff(this.state.price) }</div>
                </div>
            </div>
        </div>
        )
    }
}

export default InfoBox

/*function myFunction() {
    this.myVariable = 333
    
    console.log(this.myVariable)

    const function2 = () => {
        this.myVariable = 777
        console.log(this.myVariable)
        
    }

    function2()
    
    return this.myVariable

} */


/*

resp = {"time":{"updated":"Sep 18, 2013 17:27:00 UTC","updatedISO":"2013-09-18T17:27:00+00:00"},
"disclaimer":"This data was produced from the CoinDesk Bitcoin Price Index. Non-USD currency data converted using hourly conversion rate from openexchangerates.org",
"bpi":{"USD":{"code":"USD","rate":"126.5235","description":"United States Dollar","rate_float":126.5235},
"CNY":{"code":"CNY","rate":"775.0665","description":"Chinese Yuan","rate_float":"775.0665"}}}

resp.bpi.USD.rate_float

*/