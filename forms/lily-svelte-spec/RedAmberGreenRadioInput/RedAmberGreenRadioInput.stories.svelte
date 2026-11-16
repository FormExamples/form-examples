<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import RedAmberGreenRadioInput from "./RedAmberGreenRadioInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/RedAmberGreenRadioInput",
        component: RedAmberGreenRadioInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Radio Input" }}
/>
