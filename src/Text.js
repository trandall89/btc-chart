import React from 'react'
import {Component} from 'react'

class Text extends Component {
    render() {
        return (
            <div>
                <input type="text" placeholder={this.props.message} />
            </div>
        )
    }
}

export default Text
