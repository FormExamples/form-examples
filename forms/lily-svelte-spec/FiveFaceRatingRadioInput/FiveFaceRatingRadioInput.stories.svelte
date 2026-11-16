<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import FiveFaceRatingRadioInput from "./FiveFaceRatingRadioInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/FiveFaceRatingRadioInput",
        component: FiveFaceRatingRadioInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Radio Input" }}
/>
