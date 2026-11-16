<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import FiveStarRatingRadioGroup from "./FiveStarRatingRadioGroup.svelte";

    const { Story } = defineMeta({
        title: "Headless/FiveStarRatingRadioGroup",
        component: FiveStarRatingRadioGroup,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Radio Group" }}
>
    <span>Group content</span>
</Story>
