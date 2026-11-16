import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./RecordListItem.svelte";

const root = () => document.querySelector(".record-list-item") as HTMLElement;
const part = (name: string) => root().querySelector(`.record-list-item-${name}`);

const content = createRawSnippet(() => ({
    render: () => '<span class="content">Blood pressure 128/82 mmHg</span>',
}));

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("RecordListItem", () => {
    test("renders an li with each part, each status as text and data", () => {
        render(Subject, {
            props: {
                status: "final",
                statusLabel: "Final",
                updated: "2026-11-03",
                updatedLabel: "Updated 3 Nov 2026",
                children: content,
            },
        });
        expect(root().tagName).toBe("LI");
        expect(root().getAttribute("data-status")).toBe("final");
        expect(part("status")?.textContent).toBe("Final");
        expect(part("updated")?.tagName).toBe("TIME");
        expect(part("updated")?.getAttribute("datetime")).toBe("2026-11-03");
        expect(part("updated")?.textContent).toBe("Updated 3 Nov 2026");
        expect(root().querySelector(".content")?.textContent).toBe("Blood pressure 128/82 mmHg");
    });

    test("renders only the parts that are given", () => {
        render(Subject, { props: {} });
        expect(part("status")).toBeNull();
        expect(part("updated")).toBeNull();
        expect(root().hasAttribute("data-status")).toBe(false);
    });

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { status: "final" } as never });
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("RecordListItem has no statusLabel"),
            ),
        ).toBe(true);
    });
});
