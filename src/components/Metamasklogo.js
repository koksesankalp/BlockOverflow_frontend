import ModelViewer from '@metamask/logo';
import React, { Component } from 'react';

class Metamasklogo extends Component {
    componentDidMount() {
        this.viewer = ModelViewer({
            pxNotRatio: true,
            width: 50,
            height: 50,
            followMouse: true,
        });
        this.el.appendChild(this.viewer.container);
    }
    componentWillUnmount() {
        this.viewer.stopAnimation();
    }
    render() {
        return (
            <div ref={el => {this.el = el}} />
        )
    }
}
export default Metamasklogo;