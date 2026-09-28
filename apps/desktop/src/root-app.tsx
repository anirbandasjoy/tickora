import { Component, type ErrorInfo, type ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./lib/store";
import App from "./App";

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary] Caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            gap: 16,
            padding: 24,
            fontFamily: "system-ui, sans-serif",
            color: "#f87171",
            background: "#0f172a",
          }}
        >
          <div style={{ fontSize: 32 }}>⚠️</div>
          <p style={{ fontWeight: 600, fontSize: 16 }}>Something went wrong</p>
          <pre
            style={{
              fontSize: 12,
              color: "#94a3b8",
              maxWidth: 500,
              overflow: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            {this.state.error.message}
          </pre>
          <button
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "#6366f1",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => this.setState({ error: null })}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function RootApp() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  );
}
