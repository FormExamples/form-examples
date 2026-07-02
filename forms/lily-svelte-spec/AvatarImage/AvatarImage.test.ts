import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./AvatarImage.svelte";

describe("AvatarImage", () => {
  test("renders an img element", () => {
    render(Subject, { props: { src: "/photo.jpg", alt: "Jane Doe" } });
    expect(screen.getByAltText("Jane Doe")).toBeTruthy();
  });

  test("has correct src", () => {
    render(Subject, { props: { src: "/photos/jane.jpg", alt: "Jane Doe" } });
    expect(screen.getByAltText("Jane Doe").getAttribute("src")).toBe(
      "/photos/jane.jpg",
    );
  });

  test("is aria-hidden", () => {
    render(Subject, { props: { src: "/photo.jpg", alt: "Jane Doe" } });
    expect(screen.getByAltText("Jane Doe").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  test("passes through attributes", () => {
    render(Subject, {
      props: { src: "/photo.jpg", alt: "Jane", "data-testid": "aci" },
    });
    expect(screen.getByTestId("aci")).toBeTruthy();
  });
});
