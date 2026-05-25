import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ImageInput.svelte";

describe("ImageInput", () => {
    test("renders an image input", () => {
        render(Subject, { props: { src: "/test.png", alt: "Submit" } });
        const input = screen.getByRole("button", { name: "Submit" }) as HTMLInputElement;
        expect(input.type).toBe("image");
    });

    test("has src attribute", () => {
        render(Subject, { props: { src: "/test.png", alt: "Submit" } });
        const input = screen.getByRole("button", { name: "Submit" }) as HTMLInputElement;
        expect(input.src).toContain("/test.png");
    });

    test("has alt attribute", () => {
        render(Subject, { props: { src: "/test.png", alt: "Submit" } });
        const input = screen.getByRole("button", { name: "Submit" }) as HTMLInputElement;
        expect(input.alt).toBe("Submit");
    });

    test("supports width", () => {
        render(Subject, { props: { src: "/test.png", alt: "Submit", width: 100 } });
        const input = screen.getByRole("button", { name: "Submit" }) as HTMLInputElement;
        expect(input.getAttribute("width")).toBe("100");
    });

    test("supports height", () => {
        render(Subject, { props: { src: "/test.png", alt: "Submit", height: 50 } });
        const input = screen.getByRole("button", { name: "Submit" }) as HTMLInputElement;
        expect(input.getAttribute("height")).toBe("50");
    });

    test("supports disabled", () => {
        render(Subject, { props: { src: "/test.png", alt: "Submit", disabled: true } });
        const input = screen.getByRole("button", { name: "Submit" }) as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { src: "/test.png", alt: "Submit", "data-testid": "ii" } });
        expect(screen.getByTestId("ii")).toBeTruthy();
    });
});
