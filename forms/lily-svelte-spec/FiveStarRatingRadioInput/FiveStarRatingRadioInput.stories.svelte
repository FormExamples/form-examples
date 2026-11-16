<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import FiveStarRatingRadioInput from "./FiveStarRatingRadioInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/FiveStarRatingRadioInput",
        component: FiveStarRatingRadioInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Radio Input" }}
/>
