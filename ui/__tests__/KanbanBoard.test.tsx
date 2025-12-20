import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import KanbanBoard from "../components/KanbanBoard";
import { IssuesProvider } from "../components/IssuesProvider";

describe("KanbanBoard drag-and-drop", () => {
  it("renders columns and issues", () => {
    render(
      <IssuesProvider>
        <KanbanBoard />
      </IssuesProvider>
    );
    expect(screen.getByText("Backlog")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });
  // More DnD tests would go here (mocking drag events)
});
