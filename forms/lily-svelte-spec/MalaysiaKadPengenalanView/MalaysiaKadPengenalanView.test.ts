import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MalaysiaKadPengenalanView.svelte";

describe("MalaysiaKadPengenalanView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "MyKad Number (NRIC)", value: "test-value" } });

        const el = document.querySelector(".malaysia-kad-pengenalan-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("malaysia-kad-pengenalan-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "MyKad Number (NRIC)", value: "test-value" } });

        const el = document.querySelector(".malaysia-kad-pengenalan-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "MyKad Number (NRIC)" } });

        const el = document.querySelector(".malaysia-kad-pengenalan-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"MyKad Number (NRIC)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
