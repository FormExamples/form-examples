import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./CalendarRangePicker.svelte";

function textSnippet(text: string) { return (($anchor: Comment) => { $anchor.before(document.createTextNode(text)); }) as any; }

describe("CalendarRangePicker", () => {
    test("renders application role", () => { render(Subject, { props: { label: "Dates", children: textSnippet("cal") } }); expect(screen.getByRole("application")).toBeTruthy(); });
    test("has aria-label", () => { render(Subject, { props: { label: "Select dates", children: textSnippet("cal") } }); expect(screen.getByLabelText("Select dates")).toBeTruthy(); });
    test("passes through attributes", () => { render(Subject, { props: { label: "D", "data-testid": "crp", children: textSnippet("x") } }); expect(screen.getByTestId("crp")).toBeTruthy(); });
});
