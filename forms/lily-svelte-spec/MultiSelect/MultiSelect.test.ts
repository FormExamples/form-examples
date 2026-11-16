import { render, screen } from "@testing-library/svelte";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./MultiSelect.svelte";

function optionsSnippet() {
    return (($anchor: Comment) => {
        for (const [v, t] of [
            ["a", "Option A"],
            ["b", "Option B"],
            ["c", "Option C"],
        ]) {
            const opt = document.createElement("option");
            opt.value = v;
            opt.textContent = t;
            $anchor.before(opt);
        }
    }) as any;
}

function select() {
    return screen.getByLabelText("Pick") as HTMLSelectElement;
}

describe("MultiSelect", () => {
    test("renders a native <select multiple> with the base class", () => {
        render(Subject, { props: { label: "Pick", children: optionsSnippet() } });
        expect(select().tagName).toBe("SELECT");
        expect(select().multiple).toBe(true);
        expect(select().getAttribute("class")).toContain("multi-select");
    });

    test("is exposed as a listbox", () => {
        render(Subject, { props: { label: "Pick", children: optionsSnippet() } });
        expect(screen.getByRole("listbox", { name: "Pick" })).toBeTruthy();
    });

    test("renders option children", () => {
        render(Subject, { props: { label: "Pick", children: optionsSnippet() } });
        expect(screen.getAllByRole("option")).toHaveLength(3);
    });

    test("initial value array selects the matching options", () => {
        render(Subject, {
            props: { label: "Pick", value: ["a", "c"], children: optionsSnippet() },
        });
        const selected = Array.from(select().selectedOptions).map((o) => o.value);
        expect(selected).toEqual(["a", "c"]);
    });

    test("selecting several options works natively", async () => {
        const user = userEvent.setup();
        render(Subject, { props: { label: "Pick", children: optionsSnippet() } });
        await user.selectOptions(select(), ["a", "b"]);
        const selected = Array.from(select().selectedOptions).map((o) => o.value);
        expect(selected).toEqual(["a", "b"]);
    });

    test("size sets the visible rows", () => {
        render(Subject, { props: { label: "Pick", size: 4, children: optionsSnippet() } });
        expect(select().getAttribute("size")).toBe("4");
    });

    test("supports required and disabled", () => {
        render(Subject, {
            props: { label: "Pick", required: true, disabled: true, children: optionsSnippet() },
        });
        expect(select().required).toBe(true);
        expect(select().disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "Pick", "data-testid": "ms", children: optionsSnippet() },
        });
        expect(screen.getByTestId("ms")).toBeTruthy();
    });
});
