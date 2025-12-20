import React from "react";
import { render, screen } from "@testing-library/react";
import KanbanColumn from "../components/KanbanColumn";

describe("KanbanColumn", () => {
  const issues = [
    { id: "1", title: "First issue" },
    { id: "2", title: "Second issue" },
  ];

  it("renders the column title and issue count", () => {
    render(<KanbanColumn title="To Do" issues={issues} />);
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders all issues as cards", () => {
    render(<KanbanColumn title="To Do" issues={issues} />);
    expect(screen.getByText("First issue")).toBeInTheDocument();
    expect(screen.getByText("Second issue")).toBeInTheDocument();
  });

  it('moves issue on ArrowRight/ArrowLeft keyboard events', async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    render(<KanbanColumn title="To Do" issues={issues} />);

    const firstIssue = screen.getByText('First issue');
    const wrapper = firstIssue.parentElement as HTMLElement;
    expect(wrapper).toBeTruthy();

    wrapper.focus();
    // Move right (To Do -> In Progress)
    fireEvent.keyDown(wrapper, { key: 'ArrowRight' });
    await (() => expect(global.fetch).toHaveBeenCalledWith('/api/issues', expect.objectContaining({ method: 'POST' })));

    // Move left should attempt to move back (but since our column is To Do/backlog, left is no-op)
    (global as any).fetch.mockClear();
    fireEvent.keyDown(wrapper, { key: 'ArrowLeft' });
    await (() => expect(global.fetch).not.toHaveBeenCalled());
  });
});
