import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import FranceNumeroDIdentificationAuRepertoireView from "./FranceNumeroDIdentificationAuRepertoireView.svelte";

describe("FranceNumeroDIdentificationAuRepertoireView", () => {
    test("renders with content", () => {
        render(FranceNumeroDIdentificationAuRepertoireView, { props: { label: "Test" } });
        const el = document.querySelector(
            ".france-numero-d-identification-au-repertoire-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain(
            "france-numero-d-identification-au-repertoire-view",
        );
    });
});
