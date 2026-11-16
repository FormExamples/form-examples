<script lang="ts">
    // BodyMap component
    //
    // A headless picker for marking regions of the body, such as wound or pain sites (spec/healthcare-ui item 11,
    // P27-T11). A <fieldset> named by its <legend>, holding the consumer's drawing (an SVG in the default slot; Lily ships
    // no drawing) and a list of real checkboxes, one per region. The drawing is a picture only (aria-hidden): the checkboxes
    // are how a keyboard or screen-reader user chooses, and they submit with the form by themselves. Where script runs, a
    // click on a drawing shape whose data-region names a region toggles its checkbox, and chosen shapes get data-selected.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. The question, rendered as the <legend> ("Where is the pain?").
    //   regions — { id: string; label: string }[], required. The regions, in the order the list shows them.
    //   selected — string[], bindable, default []. The chosen region ids.
    //   name — string, optional. The checkboxes' form name; each chosen region submits its id.
    //   children — Snippet, optional. The drawing. Mark each clickable shape with data-region="{id}".
    //   ...restProps — additional HTML attributes spread onto the <fieldset>.
    //
    // Keyboard:
    //   - Tab moves through the checkboxes; Space toggles one (native checkboxes).
    //
    // Accessibility:
    //   - Native checkboxes in a fieldset named by its legend, each named by the region's words. The drawing is
    //     aria-hidden, since its shapes are not focusable; the list is the equivalent.
    import type { Snippet } from "svelte";
    import { warnMissingName } from "../dev-warning";

    let {
        class: className = "",
        label,
        regions = [],
        selected = $bindable([]),
        name,
        children,
        ...restProps
    }: {
        label: string;
        regions: { id: string; label: string }[];
        selected?: string[];
        name?: string;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() => warnMissingName("BodyMap", label, restProps["aria-labelledby"]));

    let figure: HTMLDivElement | undefined = $state();

    function toggle(id: string) {
        selected = selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id];
    }

    function onFigureClick(event: MouseEvent) {
        const id = (event.target as Element | null)
            ?.closest("[data-region]")
            ?.getAttribute("data-region");
        if (id && regions.some((r) => r.id === id)) toggle(id);
    }

    // Mirror the choice onto the drawing, so the theme can fill the chosen shapes.
    $effect(() => {
        if (!figure) return;
        for (const shape of figure.querySelectorAll("[data-region]")) {
            if (selected.includes(shape.getAttribute("data-region") ?? ""))
                shape.setAttribute("data-selected", "true");
            else shape.removeAttribute("data-selected");
        }
    });
</script>

<!-- BodyMap.svelte -->
<fieldset
    class={`body-map ${className}`}
    {...restProps}
>
    <legend class="body-map-legend">{label}</legend>
    {#if children}
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
        <div
            bind:this={figure}
            class="body-map-figure"
            aria-hidden="true"
            onclick={onFigureClick}
        >
            {@render children()}
        </div>
    {/if}
    <ul class="body-map-regions">
        {#each regions as region (region.id)}
            <li>
                <label class="body-map-region"
                    ><input
                        type="checkbox"
                        {name}
                        value={region.id}
                        checked={selected.includes(region.id)}
                        onchange={() => toggle(region.id)}
                    />
                    {region.label}</label
                >
            </li>
        {/each}
    </ul>
</fieldset>
