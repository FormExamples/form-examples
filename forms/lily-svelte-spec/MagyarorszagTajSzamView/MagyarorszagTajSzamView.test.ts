import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MagyarorszagTajSzamView.svelte";

describe("MagyarorszagTajSzamView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "Társadalombiztosítási Azonosító Jel (TAJ)", value: "test-value" },
        });

        const el = document.querySelector(".magyarorszag-taj-szam-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("magyarorszag-taj-szam-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "Társadalombiztosítási Azonosító Jel (TAJ)", value: "test-value" },
        });

        const el = document.querySelector(".magyarorszag-taj-szam-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Társadalombiztosítási Azonosító Jel (TAJ)" } });

        const el = document.querySelector(".magyarorszag-taj-szam-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Társadalombiztosítási Azonosító Jel (TAJ)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
