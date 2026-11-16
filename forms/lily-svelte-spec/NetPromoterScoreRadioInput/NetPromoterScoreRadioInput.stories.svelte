<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import NetPromoterScoreRadioInput from "./NetPromoterScoreRadioInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/NetPromoterScoreRadioInput",
        component: NetPromoterScoreRadioInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Radio Input" }}
/>
