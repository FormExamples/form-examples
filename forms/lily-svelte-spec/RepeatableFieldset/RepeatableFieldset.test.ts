import { fireEvent, render, screen } from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Host from "./RepeatableFieldsetTestHost.svelte";

const items = () =>
    [...document.querySelectorAll(".repeatable-fieldset-item")] as HTMLFieldSetElement[];
const legends = () => items().map((el) => el.querySelector("legend")?.textContent);

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("RepeatableFieldset", () => {
    test("renders a fieldset named by its legend, one named fieldset per item", () => {
        render(Host, { props: { initial: [{ name: "Aspirin" }, { name: "Metformin" }] } });
        expect(screen.getByRole("group", { name: "Medicines" }).className).toContain(
            "repeatable-fieldset",
        );
        expect(legends()).toEqual(["Medicine 1", "Medicine 2"]);
        expect(screen.getByRole("group", { name: "Medicine 2" })).toBe(items()[1]);
    });

    test("add appends an item, renumbers, announces, and moves focus to its first field", async () => {
        render(Host, { props: { initial: [{ name: "Aspirin" }] } });
        await fireEvent.click(screen.getByRole("button", { name: "Add another medicine" }));
        expect(legends()).toEqual(["Medicine 1", "Medicine 2"]);
        expect(document.activeElement).toBe(items()[1].querySelector("input"));
        expect(screen.getByRole("status").textContent).toBe("Medicine 2 added");
    });

    test("remove takes out that item, keeps the others' values, and moves focus to the add button", async () => {
        render(Host, {
            props: { initial: [{ name: "Aspirin" }, { name: "Metformin" }, { name: "Ramipril" }] },
        });
        await fireEvent.click(screen.getByRole("button", { name: "Remove medicine 2" }));
        expect(legends()).toEqual(["Medicine 1", "Medicine 2"]);
        expect(screen.getByTestId("names").textContent).toBe("Aspirin|Ramipril");
        expect(items()[1].querySelector("input")?.value).toBe("Ramipril");
        expect(document.activeElement).toBe(
            screen.getByRole("button", { name: "Add another medicine" }),
        );
        expect(screen.getByRole("status").textContent).toBe("Medicine 2 removed");
    });

    test("min leaves out the remove buttons; max disables the add button", () => {
        render(Host, { props: { initial: [{ name: "Aspirin" }], min: 1, max: 1 } });
        expect(screen.queryByRole("button", { name: /Remove/ })).toBeNull();
        expect(
            (screen.getByRole("button", { name: "Add another medicine" }) as HTMLButtonElement)
                .disabled,
        ).toBe(true);
    });

    test("the buttons are real buttons that do not submit a form", () => {
        render(Host, { props: { initial: [{ name: "Aspirin" }] } });
        for (const button of document.querySelectorAll("fieldset button"))
            expect(button.getAttribute("type")).toBe("button");
    });
});
