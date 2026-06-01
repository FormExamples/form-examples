import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./FileManager.svelte";
function textSnippet(text: string) { return (($anchor: Comment) => { $anchor.before(document.createTextNode(text)); }) as any; }
describe("FileManager", () => {
    test("renders a region", () => { render(Subject, { props: { label: "Files", children: textSnippet("content") } }); expect(screen.getByRole("region")).toBeTruthy(); });
    test("has aria-label", () => { render(Subject, { props: { label: "File browser", children: textSnippet("content") } }); expect(screen.getByLabelText("File browser")).toBeTruthy(); });
    test("passes through attributes", () => { render(Subject, { props: { label: "F", "data-testid": "fm", children: textSnippet("x") } }); expect(screen.getByTestId("fm")).toBeTruthy(); });
});
