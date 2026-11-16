<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ObservationView from "./ObservationView.svelte";

    const { Story } = defineMeta({
        title: "Headless/ObservationView",
        component: ObservationView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ObservationView
        label="Potassium"
        value="5.9"
        unit="mmol/L"
        interpretation="H"
        flagLabel="High"
        range="3.5–5.3"
    />
</Story>

<Story name="Not recorded">
    <ObservationView
        label="Potassium"
        status="not-recorded"
        statusLabel="Not recorded"
    />
</Story>
