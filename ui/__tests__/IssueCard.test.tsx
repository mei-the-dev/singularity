import React from "react";
import { render, screen } from "@testing-library/react";
import IssueCard from "../components/IssueCard";

describe("IssueCard", () => {
  const issue = {
    id: "1",
    title: "Fix login bug",
    type: "bug",
    assignee: "Alice",
    priority: "High",
    status: "in-progress"
  };

  it("renders all fields", () => {
    render(<IssueCard issue={issue} />);
    expect(screen.getByText("Fix login bug")).toBeInTheDocument();
    expect(screen.getByText("bug")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("#1")).toBeInTheDocument();
  });
});
