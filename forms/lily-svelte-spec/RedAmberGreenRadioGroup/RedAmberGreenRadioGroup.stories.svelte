<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import RedAmberGreenRadioGroup from "./RedAmberGreenRadioGroup.svelte";

    const { Story } = defineMeta({
        title: "Headless/RedAmberGreenRadioGroup",
        component: RedAmberGreenRadioGroup,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Radio Group" }}
>
    <span>Group content</span>
</Story>
