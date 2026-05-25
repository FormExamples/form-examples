import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./TelLink.svelte";

describe("TelLink", () => {
  test("renders as a link", () => {
    render(Subject, { props: { phone: "+1-555-0100" } });
    expect(screen.getByRole("link")).toBeTruthy();
  });

  test("displays the phone number", () => {
    render(Subject, { props: { phone: "+1-555-0100" } });
    expect(screen.getByText("+1-555-0100")).toBeTruthy();
  });

  test("links to tel:", () => {
    render(Subject, { props: { phone: "+1-555-0100" } });
    expect(screen.getByRole("link").getAttribute("href")).toBe(
      "tel:+1-555-0100",
    );
  });

  test("supports custom label", () => {
    render(Subject, { props: { phone: "+1-555-0100", label: "Call us" } });
    expect(screen.getByRole("link").getAttribute("aria-label")).toBe("Call us");
  });

  test("passes through attributes", () => {
    render(Subject, { props: { phone: "123", "data-testid": "pv" } });
    expect(screen.getByTestId("pv")).toBeTruthy();
  });
});
