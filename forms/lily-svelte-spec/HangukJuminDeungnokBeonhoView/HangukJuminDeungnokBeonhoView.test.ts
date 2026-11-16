import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./HangukJuminDeungnokBeonhoView.svelte";

describe("HangukJuminDeungnokBeonhoView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "Resident Registration Number (주민등록번호)", value: "test-value" },
        });

        const el = document.querySelector(".hanguk-jumin-deungnok-beonho-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("hanguk-jumin-deungnok-beonho-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "Resident Registration Number (주민등록번호)", value: "test-value" },
        });

        const el = document.querySelector(".hanguk-jumin-deungnok-beonho-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Resident Registration Number (주민등록번호)" } });

        const el = document.querySelector(".hanguk-jumin-deungnok-beonho-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Resident Registration Number (주민등록번호)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
