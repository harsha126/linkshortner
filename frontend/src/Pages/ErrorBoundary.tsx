import React, { Component, ReactNode } from 'react';
import { Result, Button } from 'antd';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('Error caught by ErrorBoundary:', error, info);
    }

    handleReload = () => {
        this.setState({ hasError: false, error: undefined });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <Result
                    status="error"
                    title="Something went wrong"
                    subTitle={this.state.error?.message || 'An unexpected error occurred.'}
                    extra={[
                        <Button type="primary" onClick={this.handleReload} key="reload">
                            Reload Page
                        </Button>,
                    ]}
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
