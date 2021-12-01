import React, { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so that the next render will show the fallback UI
    console.error(error)
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // log error to an error reporting service
    console.error(error, info)
  }

  render() {
    // eslint-disable-next-line no-console
    console.log('ErrorBoundary render')

    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}

export default ErrorBoundary
