import React from "react";
import { render, screen } from "@testing-library/react";
import KanbanColumn, { KanbanColumnProps } from "../components/KanbanColumn";

describe("KanbanColumn", () => {
  const baseProps: KanbanColumnProps = {
    id: "todo",
    title: "To Do",
    issues: [
      { id: "1", title: "First issue" },
      { id: "2", title: "Second issue" },
    ],
  };

  it("renders the column title and issue count", () => {
    render(<KanbanColumn {...baseProps} />);
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders all issues as cards", () => {
    render(<KanbanColumn {...baseProps} />);
    expect(screen.getByText("First issue")).toBeInTheDocument();
    expect(screen.getByText("Second issue")).toBeInTheDocument();
  });
});
