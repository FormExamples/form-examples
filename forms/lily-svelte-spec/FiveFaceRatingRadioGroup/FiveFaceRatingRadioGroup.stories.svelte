<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import FiveFaceRatingRadioGroup from "./FiveFaceRatingRadioGroup.svelte";

    const { Story } = defineMeta({
        title: "Headless/FiveFaceRatingRadioGroup",
        component: FiveFaceRatingRadioGroup,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Radio Group" }}
>
    <span>Group content</span>
</Story>
