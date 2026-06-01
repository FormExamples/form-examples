import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Tooltip.svelte";

describe("Tooltip", () => {
    test("hidden when not visible", () => {
        render(Subject, { props: { label: "Help text", visible: false } });
        expect(screen.queryByRole("tooltip")).toBeNull();
    });

    test("visible when visible is true", () => {
        render(Subject, { props: { label: "Help text", visible: true } });
        expect(screen.getByRole("tooltip")).toBeTruthy();
    });

    test("displays label text", () => {
        render(Subject, { props: { label: "Additional info", visible: true } });
        expect(screen.getByRole("tooltip").textContent).toBe("Additional info");
    });

    test("supports id for aria-describedby linking", () => {
        render(Subject, { props: { label: "Tip", visible: true, id: "my-tip" } });
        expect(screen.getByRole("tooltip").id).toBe("my-tip");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "T", visible: true, "data-testid": "tt" } });
        expect(screen.getByTestId("tt")).toBeTruthy();
    });
});
