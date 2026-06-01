import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./Image.svelte";
describe("Image", () => {
    test("renders an img", () => { render(Subject, { props: { src: "/photo.jpg", alt: "A photo" } }); expect(screen.getByRole("img", { name: "A photo" })).toBeTruthy(); });
    test("has correct src", () => { render(Subject, { props: { src: "/img.png", alt: "Pic" } }); expect(screen.getByRole("img").getAttribute("src")).toBe("/img.png"); });
    test("renders caption in figure", () => { render(Subject, { props: { src: "/x.jpg", alt: "X", caption: "Credit" } }); expect(screen.getByText("Credit")).toBeTruthy(); });
    test("passes through attributes", () => { render(Subject, { props: { src: "/x.jpg", alt: "X", "data-testid": "img" } }); expect(screen.getByTestId("img")).toBeTruthy(); });
});
