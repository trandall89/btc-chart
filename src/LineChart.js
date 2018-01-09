import React, {Component} from "react"
import "./LineChart.css"
class LineChart extends Component {

  constructor(props){
  super(props)
  
  this.state = {
    xPoint: null
  }
  }
  
  
  getLowestY() {
    const gData  = this.props.data
    const lowestY = gData.reduce((accumulator, currentVal) => {
     
      return accumulator < currentVal.y ? accumulator : currentVal.y
    }, gData[0].y)
    
     return lowestY
  }  
  getSvgX(x) {
    const {svgWidth} = this.props;
    return (x / this.getMaxX() * svgWidth);
  }
  getSvgY(y) {
    const {svgHeight} = this.props
    const lowest = this.getLowestY()

    const max = this.getMaxY() - lowest
    
    y = y-lowest
    return svgHeight - (y / max * svgHeight)
  }
  // GET MAX & MIN X
  getMinX() {
    const {data} = this.props
    return data[0].x
  }
  getMaxX() {
    const {data} = this.props
    return data[data.length - 1].x
  }
  // GET MAX & MIN Y
  getMinY() {
    const {data} = this.props
    return data.reduce((min, p) => p.y < min ? p.y : min, data[0].y)
  }
  getMaxY() {
    const {data} = this.props

    return  data.reduce((max, p) => p.y > max ? p.y : max, data[0].y)
  }
  makePath() {
    const {data, color} = this.props
    let pathD = "M " + this.getSvgX(data[0].x) + " " + this.getSvgY(data[0].y) + " "

    pathD += data.map((point) => {
      return "L " + this.getSvgX(point.x) + " " + this.getSvgY(point.y) + " "
    })
    
    const x = {
      min: this.getMinX(),
      max: this.getMaxX()
    }
    const y = {
      min: this.getMinY(),
      max: this.getMaxY()
    }
    pathD += "L " + this.getSvgX(x.max) + " " + this.getSvgY(y.min) + " L " + this.getSvgX(x.min) + " " + this.getSvgY(y.min)

    
    return (
      <path className="linechart_path" d={pathD} style={{stroke: color}} />
        )
  }
  makeAxis() {
  const minX = this.getMinX(), maxX = this.getMaxX()
  const minY = this.getMinY(), maxY = this.getMaxY()
  
  return (
      <g className="linechart_axis">
        <line
          strokeDasharray="10,5"
          x1={this.getSvgX(minX)} y1={this.getSvgY(minY)}
          x2={this.getSvgX(maxX)} y2={this.getSvgY(minY)} />
        <line
          strokeDasharray="10, 5"
          x1={this.getSvgX(minX)} y1={this.getSvgY(maxY)}
          x2={this.getSvgX(maxX)} y2={this.getSvgY(maxY)} />
      </g>
      )
  }
  
  mouseMoveHandler(e) {
    this.setState({
      xPoint: e.clientX,
      yPoint: e.clientY
    })
  }

  makeXLine(){
   const minY = this.getSvgY(this.getMinY())
   const maxY = this.getSvgY(this.getMaxY())
   const currX = this.state.xPoint - this.normXLine()
   return (
     <line style={{stroke:"#000", strokeWidth: "2px"}}
      x1={currX} y1={minY}
      x2={currX} y2={maxY} />
      )
  }
  
  normXLine() {
    const svgX = document.getElementById("svg").getBoundingClientRect()
    return svgX.x
  }
  
  priceLabels() {
    const maxY = this.getMaxY()
    const minY = this.getMinY()
    const svgMax = this.getSvgY(maxY)
    const svgMin = this.getSvgY(minY)
    
    return (
      <g>
        <text x="-5" y="20">
          ${maxY}
        </text>
        <text x="-5" y="280">
        ${minY}
        </text>
      </g>
      )
  }
  
  getNormXData() {
    const gData = this.props.data.slice(0)
    const normXData = []
    for(let i = 0; i < gData.length; i++) {
      const normX = this.getSvgX(gData[i]['x'])
      normXData.push(normX)
    }
    return normXData
  }
  
   getNormYData() {
    const gData = this.props.data.slice(0)
    const normYData = []
    for(let i = 0; i < gData.length; i++) {
      const normX = this.getSvgX(gData[i]['y'])
      normYData.push(normX)
    }
    return normYData
  }
  
  
  getClosestPointIndex(){
    let { svgWidth } = this.props
    let closestPoint= {}
    let svgData = this.getNormXData()
    const hoverPoint = this.state.xPoint - this.normXLine()
    let closestIndex = 0
    
    for(let i=0, shortestDistanceBetweenPoints=svgWidth; i < svgData.length; i++){
      let currentArrayPoint = svgData[i]
      let currentDistanceBetweenPoints = Math.abs(currentArrayPoint - hoverPoint)
      if (currentDistanceBetweenPoints <= shortestDistanceBetweenPoints){
        shortestDistanceBetweenPoints = currentDistanceBetweenPoints
        
        closestPoint = currentArrayPoint
        closestIndex = i
      }
    }
    return closestIndex
  }
  
makeActivePoint(){
  const { data } = this.props
  const closestX= data[this.getClosestPointIndex()].x
  const closestY=data[this.getClosestPointIndex()].y
  const normX = this.getSvgX(closestX)
  const normY = this.getSvgY(closestY)
    
  const {color, pointRadius} = this.props
  
  return (
    <circle
      className='linechart_point'
      style={{stroke: color}}
      r={pointRadius}
      cx= {normX}
      cy={normY}
    />
  );
}
  
  
render() {
    const { svgWidth, svgHeight } = this.props
    
    return (
      <svg 
      id="svg"
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      onMouseMove = {(e) => this.mouseMoveHandler(e)}

      > 
        {this.makePath()}
        {this.makeAxis()}
        {this.state.xPoint ? this.makeXLine() : null /* render fuckall */}
        {this.priceLabels()}
        {this.state.xPoint ? this.makeActivePoint() : null }
        
      </svg>
      
    )

  }
}
LineChart.defaultProps = {
  data: [],  
  color: 'purple',  
  svgHeight: 300,  
  svgWidth: 900,
  pointRadius: 5,
  
}
export default LineChart