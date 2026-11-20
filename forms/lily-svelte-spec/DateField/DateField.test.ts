import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./DateField.svelte";
import Host from "./DateFieldTestHost.svelte";

const labels = { dayLabel: "Day", monthLabel: "Month", yearLabel: "Year" };

describe("DateField", () => {
    test("renders a fieldset named by its legend, with three labelled parts", () => {
        const { container } = render(Subject, { props: { label: "Date of birth", ...labels } });
        const fieldset = container.querySelector("fieldset.date-field")!;
        expect(fieldset).toBeTruthy();
        expect(screen.getByRole("group", { name: "Date of birth" })).toBe(fieldset);
        for (const name of ["Day", "Month", "Year"]) {
            const input = screen.getByLabelText(name) as HTMLInputElement;
            expect(input.type).toBe("text");
            expect(input.getAttribute("inputmode")).toBe("numeric");
        }
    });

    test("puts the parts in ISO 8601 order by default, and in the order asked for", () => {
        const order = (container: HTMLElement) =>
            [...container.querySelectorAll("input")].map((input) => input.className);
        const { container, unmount } = render(Subject, { props: { label: "D", ...labels } });
        expect(order(container)).toEqual(["date-field-year", "date-field-month", "date-field-day"]);
        unmount();
        const dmy = render(Subject, { props: { label: "D", ...labels, order: "dmy" } });
        expect(order(dmy.container)).toEqual([
            "date-field-day",
            "date-field-month",
            "date-field-year",
        ]);
    });

    test("fills the parts from value, and names them from name", () => {
        render(Subject, { props: { label: "D", ...labels, value: "2007-03-27", name: "dob" } });
        const day = screen.getByLabelText("Day") as HTMLInputElement;
        expect(day.value).toBe("27");
        expect(day.name).toBe("dob-day");
        expect((screen.getByLabelText("Month") as HTMLInputElement).value).toBe("03");
        expect((screen.getByLabelText("Year") as HTMLInputElement).value).toBe("2007");
    });

    test("keeps the parts as typed while the date is incomplete", async () => {
        render(Subject, { props: { label: "D", ...labels } });
        await fireEvent.input(screen.getByLabelText("Day"), { target: { value: "5" } });
        await fireEvent.input(screen.getByLabelText("Month"), { target: { value: "9" } });
        const year = screen.getByLabelText("Year") as HTMLInputElement;
        expect(year.value).toBe("");
        await fireEvent.input(year, { target: { value: "1990" } });
        expect((screen.getByLabelText("Day") as HTMLInputElement).value).toBe("5");
    });

    test("links the description and the error from the fieldset, and marks the parts invalid", () => {
        const { container } = render(Subject, {
            props: {
                label: "D",
                ...labels,
                description: "For example, 27 3 2007",
                error: "Enter a real date",
            },
        });
        const ids = container
            .querySelector("fieldset")!
            .getAttribute("aria-describedby")!
            .split(" ");
        expect(ids.map((id) => document.getElementById(id)?.textContent)).toEqual([
            "For example, 27 3 2007",
            "Enter a real date",
        ]);
        expect(screen.getByRole("alert").textContent).toBe("Enter a real date");
        expect(screen.getByLabelText("Day").getAttribute("aria-invalid")).toBe("true");
    });

    test("autocomplete bday marks the parts for a date of birth", () => {
        render(Subject, { props: { label: "D", ...labels, autocomplete: "bday" } });
        expect(screen.getByLabelText("Month").getAttribute("autocomplete")).toBe("bday-month");
    });

    test("supports required and disabled", () => {
        const { container } = render(Subject, {
            props: { label: "D", ...labels, required: true, disabled: true },
        });
        expect(screen.getByLabelText("Year").hasAttribute("required")).toBe(true);
        expect((container.querySelector("fieldset") as HTMLFieldSetElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "D", ...labels, "data-testid": "df" } });
        expect(screen.getByTestId("df").tagName).toBe("FIELDSET");
    });

    test("precision month asks for month and year only, and its value has no invented day", async () => {
        const { container } = render(Host, {
            props: { monthLabel: "Month", yearLabel: "Year", precision: "month" },
        });
        expect(screen.queryByLabelText("Day")).toBeNull();
        expect(container.querySelector("fieldset")!.getAttribute("data-precision")).toBe("month");
        await fireEvent.input(screen.getByLabelText("Month"), { target: { value: "3" } });
        await fireEvent.input(screen.getByLabelText("Year"), { target: { value: "2019" } });
        expect(screen.getByTestId("value").textContent).toBe("2019-03");
    });

    test("precision year asks for the year alone", async () => {
        render(Host, { props: { yearLabel: "Year", precision: "year" } });
        expect(screen.queryByLabelText("Day")).toBeNull();
        expect(screen.queryByLabelText("Month")).toBeNull();
        await fireEvent.input(screen.getByLabelText("Year"), { target: { value: "2019" } });
        expect(screen.getByTestId("value").textContent).toBe("2019");
    });

    test("a partial value fills the parts of its precision, and a value of another precision fills none", () => {
        const { unmount } = render(Subject, {
            props: { label: "D", ...labels, precision: "month", value: "2019-03" },
        });
        expect((screen.getByLabelText("Month") as HTMLInputElement).value).toBe("03");
        expect((screen.getByLabelText("Year") as HTMLInputElement).value).toBe("2019");
        unmount();
        render(Subject, {
            props: { label: "D", ...labels, precision: "month", value: "2019-03-14" },
        });
        expect((screen.getByLabelText("Year") as HTMLInputElement).value).toBe("");
    });

    test("precision day is the default, with no data-precision", async () => {
        const { container } = render(Host, { props: labels });
        expect(container.querySelector("fieldset")!.hasAttribute("data-precision")).toBe(false);
        await fireEvent.input(screen.getByLabelText("Day"), { target: { value: "4" } });
        await fireEvent.input(screen.getByLabelText("Month"), { target: { value: "3" } });
        await fireEvent.input(screen.getByLabelText("Year"), { target: { value: "2019" } });
        expect(screen.getByTestId("value").textContent).toBe("2019-03-04");
    });
});
