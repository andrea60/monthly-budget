import { render, screen } from "@testing-library/react";
import { QueryCard } from "./QueryCard";
import { UseQueryResult } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";

describe("QueryCard", () => {
  it("renders loading state", () => {
    const query: UseQueryResult<unknown, Error> = {
      isPending: true,
      isError: false,
      data: undefined,
      error: null,
    } as any;

    render(
      <QueryCard query={query}>
        {() => <div data-testid="content">Data</div>}
      </QueryCard>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
  });

  it("renders error state", () => {
    const query: UseQueryResult<unknown, Error> = {
      isPending: false,
      isError: true,
      data: undefined,
      error: new Error("Test error"),
    } as any;

    render(
      <QueryCard query={query}>
        {() => <div data-testid="content">Data</div>}
      </QueryCard>
    );

    expect(
      screen.getByText("An error occured: Test error")
    ).toBeInTheDocument();
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
  });

  it("renders data state", () => {
    const query: UseQueryResult<string, Error> = {
      isPending: false,
      isError: false,
      data: "Test data",
      error: null,
    } as any;

    render(<QueryCard query={query}>{(data) => <div>{data}</div>}</QueryCard>);

    expect(screen.getByText("Test data")).toBeInTheDocument();
  });
});
