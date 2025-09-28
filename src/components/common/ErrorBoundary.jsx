import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container kingdom-container">
          <div className="kingdom-card text-center">
            <h2 className="kingdom-title text-danger">
              🏰 Something went wrong in the Kingdom!
            </h2>
            <p className="kingdom-text">
              The royal scribes have been notified of this issue.
            </p>
            <button 
              className="kingdom-btn kingdom-btn-primary"
              onClick={() => window.location.reload()}
            >
              🔄 Reload the Kingdom
            </button>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4 text-start">
                <summary className="kingdom-text-muted">Error Details (Dev Mode)</summary>
                <pre className="bg-dark text-light p-3 rounded mt-2">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;