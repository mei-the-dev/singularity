"use client";
import React from "react";

interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends React.Component<{children: React.ReactNode}, State> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: any) {
    // Log error to service if needed
    // console.error(error, info);
  }
  render() {
    if (this.state.hasError) {
      return <div className="p-8 text-red-400 bg-black/80 rounded-xl text-center">An unexpected error occurred.<br/>{this.state.error?.message}</div>;
    }
    return this.props.children;
  }
}
