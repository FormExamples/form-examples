<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import NetPromoterScoreRadioGroup from "./NetPromoterScoreRadioGroup.svelte";

    const { Story } = defineMeta({
        title: "Headless/NetPromoterScoreRadioGroup",
        component: NetPromoterScoreRadioGroup,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Radio Group" }}
>
    <span>Group content</span>
</Story>
