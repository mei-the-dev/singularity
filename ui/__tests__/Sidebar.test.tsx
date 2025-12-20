import React from "react";
import { render } from "@testing-library/react";
import Sidebar from "../components/Sidebar";
import { IssuesProvider } from "../components/IssuesProvider";

describe("Sidebar", () => {
  it("renders all navigation icons", () => {
    const { container } = render(
      <IssuesProvider>
        <Sidebar />
      </IssuesProvider>
    );
    // Should render 5 icons (Layout, GitPullRequest, Activity, Search, Settings)
    expect(container.querySelectorAll("svg").length).toBe(5);
  });
});
