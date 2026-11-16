<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import InternationalPatientSummarySection from "./InternationalPatientSummarySection.svelte";

    const { Story } = defineMeta({
        title: "Headless/InternationalPatientSummarySection",
        component: InternationalPatientSummarySection,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{
        section: "problems",
        heading: "Problem list",
        status: "not-recorded",
        statusLabel: "Not recorded",
    }}
/>
