import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./Image.svelte";
describe("Image", () => {
    test("renders an img", () => {
        render(Subject, { props: { src: "/photo.jpg", alt: "A photo" } });
        expect(screen.getByRole("img", { name: "A photo" })).toBeTruthy();
    });
    test("has correct src", () => {
        render(Subject, { props: { src: "/img.png", alt: "Pic" } });
        expect(screen.getByRole("img").getAttribute("src")).toBe("/img.png");
    });
    test("renders a bare img, never a figure", () => {
        const { container } = render(Subject, { props: { src: "/x.jpg", alt: "X" } });
        expect(container.querySelector("img.image")).toBeTruthy();
        expect(container.querySelector("figure")).toBeNull();
    });
    test("passes through attributes", () => {
        render(Subject, { props: { src: "/x.jpg", alt: "X", "data-testid": "img" } });
        expect(screen.getByTestId("img")).toBeTruthy();
    });
});
