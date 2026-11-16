import { render, screen } from "@testing-library/svelte";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./MultiSelectWithExtras.svelte";

function optionsSnippet() {
    return (($anchor: Comment) => {
        for (const [v, t] of [
            ["a", "Option A"],
            ["b", "Option B"],
        ]) {
            const opt = document.createElement("option");
            opt.value = v;
            opt.textContent = t;
            $anchor.before(opt);
        }
    }) as any;
}

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const span = document.createElement("span");
        span.textContent = text;
        $anchor.before(span);
    }) as any;
}

function select() {
    return screen.getByLabelText("Pick") as HTMLSelectElement;
}

describe("MultiSelectWithExtras", () => {
    test("wrapper div carries the base class; select is multiple", () => {
        const { container } = render(Subject, {
            props: { label: "Pick", children: optionsSnippet() },
        });
        const root = container.firstElementChild as HTMLElement;
        expect(root.tagName).toBe("DIV");
        expect(root.getAttribute("class")).toContain("multi-select-with-extras");
        expect(select().multiple).toBe(true);
    });

    test("aria-label is on the select, not the wrapper", () => {
        const { container } = render(Subject, {
            props: { label: "Pick", children: optionsSnippet() },
        });
        expect(select().tagName).toBe("SELECT");
        expect((container.firstElementChild as HTMLElement).getAttribute("aria-label")).toBeNull();
    });

    test("renders before and after snippets around the select in order", () => {
        const { container } = render(Subject, {
            props: {
                label: "Pick",
                children: optionsSnippet(),
                before: textSnippet("BEFORE"),
                after: textSnippet("AFTER"),
            },
        });
        const kids = Array.from((container.firstElementChild as HTMLElement).children).map(
            (c) => c.tagName + ":" + c.textContent?.slice(0, 6),
        );
        expect(kids[0]).toBe("SPAN:BEFORE");
        expect(kids[1].startsWith("SELECT")).toBe(true);
        expect(kids[2]).toBe("SPAN:AFTER");
    });

    test("initial array value selects options", () => {
        render(Subject, { props: { label: "Pick", value: ["b"], children: optionsSnippet() } });
        expect(Array.from(select().selectedOptions).map((o) => o.value)).toEqual(["b"]);
    });

    test("multiple options can be selected", async () => {
        const user = userEvent.setup();
        render(Subject, { props: { label: "Pick", children: optionsSnippet() } });
        await user.selectOptions(select(), ["a", "b"]);
        expect(select().selectedOptions).toHaveLength(2);
    });

    test("size, required and disabled reach the select", () => {
        render(Subject, {
            props: {
                label: "Pick",
                size: 5,
                required: true,
                disabled: true,
                children: optionsSnippet(),
            },
        });
        expect(select().getAttribute("size")).toBe("5");
        expect(select().required).toBe(true);
        expect(select().disabled).toBe(true);
    });

    test("rest props land on the wrapper", () => {
        const { container } = render(Subject, {
            props: { label: "Pick", "data-testid": "x", children: optionsSnippet() },
        });
        expect(screen.getByTestId("x")).toBe(container.firstElementChild);
    });
});
