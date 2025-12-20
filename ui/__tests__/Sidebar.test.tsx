
import React from "react";
import { render } from "@testing-library/react";
import Sidebar from "../components/Sidebar";

describe("Sidebar", () => {
  it("renders all navigation icons", () => {
    const { container } = render(<Sidebar />);
    // Should render 4 icons (Layout, GitPullRequest, Activity, Settings)
    expect(container.querySelectorAll("svg").length).toBe(4);
  });
});
