import { render, screen } from "@testing-library/svelte";
import { tick } from "svelte";
import { describe, expect, test, vi } from "vitest";
import MedicalBanner from "./MedicalBanner.svelte";

describe("MedicalBanner", () => {
    test("renders with content", () => {
        render(MedicalBanner, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("medical-banner");
    });

    test("a dismissible banner closes on its button and reports it", async () => {
        const onclose = vi.fn();
        render(MedicalBanner, {
            props: { label: "Alert", dismissible: true, closeLabel: "Dismiss", onclose } as any,
        });
        screen.getByRole("button", { name: "Dismiss" }).click();
        await tick();
        expect(screen.queryByLabelText("Alert")).toBeNull();
        expect(onclose).toHaveBeenCalledOnce();
    });

    test("a banner that is not dismissible has no close button", () => {
        render(MedicalBanner, { props: { label: "Alert" } as any });
        expect(screen.queryByRole("button")).toBeNull();
    });
});
