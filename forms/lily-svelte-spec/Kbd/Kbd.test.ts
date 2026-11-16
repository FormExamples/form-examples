import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Kbd from "./Kbd.svelte";

describe("Kbd", () => {
    test("renders a native <kbd> element with content", () => {
        render(Kbd, { props: { label: "Test" } as any });
        const el = document.querySelector(".kbd") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.tagName).toBe("KBD");
        expect(el.getAttribute("class")).toContain("kbd");
    });
});
