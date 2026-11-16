<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import RedOrangeYellowGreenBlueRadioInput from "./RedOrangeYellowGreenBlueRadioInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/RedOrangeYellowGreenBlueRadioInput",
        component: RedOrangeYellowGreenBlueRadioInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Radio Input" }}
/>
