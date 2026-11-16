<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MedicationView from "./MedicationView.svelte";

    const { Story } = defineMeta({
        title: "Headless/MedicationView",
        component: MedicationView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <MedicationView
        nameSegments={[{ text: "hydr" }, { text: "ALAZINE", tallMan: true }]}
        strength="25 mg"
        form="tablet"
        route="oral"
        frequency="twice daily"
    />
</Story>
