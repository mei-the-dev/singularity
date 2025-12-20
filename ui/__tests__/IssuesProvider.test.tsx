
import React from "react";
import { render, screen } from "@testing-library/react";
import { IssuesProvider, useIssues } from "../components/IssuesProvider";

function TestComponent() {
  const { issues, refresh, updateIssueStatus } = useIssues();
  return (
    <div>
      <div data-testid="issues-length">{issues.length}</div>
      <div data-testid="refresh-type">{typeof refresh}</div>
      <div data-testid="update-type">{typeof updateIssueStatus}</div>
      <span>Child Rendered</span>
    </div>
  );
}

describe("IssuesProvider", () => {
  it("provides issues, functions, and renders children", () => {
    render(
      <IssuesProvider>
        <TestComponent />
      </IssuesProvider>
    );
    expect(screen.getByTestId("issues-length")).toBeInTheDocument();
    expect(screen.getByTestId("refresh-type")).toHaveTextContent("function");
    expect(screen.getByTestId("update-type")).toHaveTextContent("function");
    expect(screen.getByText("Child Rendered")).toBeInTheDocument();
  });
});
