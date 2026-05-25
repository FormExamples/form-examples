import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";

import CheckListItem from "./CheckListItem.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

// Wrap CheckListItem in an <ol> for valid HTML context
function renderInList(props: Record<string, unknown>) {
    const container = document.createElement("div");
    const ol = document.createElement("ol");
    container.appendChild(ol);
    document.body.appendChild(container);
    const result = render(CheckListItem, { props, target: ol });
    return { ...result, container };
}

describe("CheckListItem", () => {
    it("renders an li element", () => {
        renderInList({ children: textSnippet("Task") });
        const li = document.querySelector("li");
        expect(li).toBeTruthy();
    });

    it("renders a checkbox input", () => {
        renderInList({ children: textSnippet("Task") });
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toBeTruthy();
    });

    it("renders children as label text", () => {
        renderInList({ children: textSnippet("Buy groceries") });
        const label = document.querySelector("label");
        expect(label?.textContent).toContain("Buy groceries");
    });

    it("is unchecked by default", () => {
        renderInList({ children: textSnippet("Task") });
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(checkbox.checked).toBe(false);
    });

    it("supports checked prop", () => {
        renderInList({ children: textSnippet("Done"), checked: true });
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(checkbox.checked).toBe(true);
    });

    it("supports disabled prop", () => {
        renderInList({ children: textSnippet("Locked"), disabled: true });
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(checkbox.disabled).toBe(true);
    });

    it("spreads additional attributes onto li", () => {
        renderInList({ children: textSnippet("Task"), "data-testid": "item-1" });
        const li = document.querySelector("[data-testid='item-1']");
        expect(li).toBeTruthy();
        expect(li?.tagName).toBe("LI");
    });
});
