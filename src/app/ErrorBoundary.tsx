/**
 * @packageDocumentation
 *
 * Top-level React error boundary that catches unhandled exceptions in the component
 * tree and renders a user-facing fallback instead of a blank screen.
 */
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AppErrorPage } from '@pages/AppErrorPage';

interface ErrorBoundaryProps {
  children: ReactNode;
  onNavigateHome: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

/**
 * Wraps a subtree and catches any runtime exceptions that bubble up from it.
 *
 * @remarks
 * The boundary resets automatically when React unmounts and remounts it via a changed
 * `key` prop — wiring `key` to the current route in the parent ensures the error state
 * clears on every navigation without requiring an explicit reset callback.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { hasError: true, errorMessage };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <AppErrorPage
          errorMessage={this.state.errorMessage}
          onNavigateHome={this.props.onNavigateHome}
        />
      );
    }
    return this.props.children;
  }
}
