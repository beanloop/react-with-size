import throttle from 'lodash.throttle'
import * as React from 'react'
import {Component} from 'react'
import {findDOMNode} from 'react-dom'
import wrapDisplayName from 'recompose/wrapDisplayName'

export type Size = {
  width: number
  height: number
}

function getSize(element: HTMLElement) {
  if (!element) return {} as Size

  const rect = element.getBoundingClientRect()

  return {
    width: rect.width,
    height: rect.height,
  }
}

export const withSize = () => WrappedComponent =>
  class extends Component<any, {size: Size; element: HTMLElement}> {
    static displayName = wrapDisplayName(WrappedComponent, 'withSize')

    state = {size: {width: 0, height: 0}, element: undefined}

    onRef = component => {
      const element = findDOMNode(component) as HTMLElement
      if (element === this.state.element) return
      this.setState({element, size: getSize(element)})
    }

    onResize = throttle(() => {
      if (this.state.element) {
        this.setState({size: getSize(this.state.element)} as any)
      }
    }, 500)

    componentDidMount() {
      window.addEventListener('resize', this.onResize)
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.onResize)
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          sizeRef={this.onRef}
          size={this.state.size}
        />
      )
    }
  }
