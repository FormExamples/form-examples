import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./FileDialog.svelte";
function textSnippet(text: string) { return (($anchor: Comment) => { $anchor.before(document.createTextNode(text)); }) as any; }
describe("FileDialog", () => {
    test("not visible when closed", () => { render(Subject, { props: { label: "Open", open: false, children: textSnippet("files") } }); expect(screen.queryByRole("dialog")).toBeNull(); });
    test("visible when open", () => { render(Subject, { props: { label: "Open", open: true, children: textSnippet("files") } }); expect(screen.getByRole("dialog")).toBeTruthy(); });
    test("has aria-label", () => { render(Subject, { props: { label: "Open file", open: true, children: textSnippet("files") } }); expect(screen.getByLabelText("Open file")).toBeTruthy(); });
    test("passes through attributes", () => { render(Subject, { props: { label: "F", open: true, "data-testid": "fd", children: textSnippet("x") } }); expect(screen.getByTestId("fd")).toBeTruthy(); });
});
