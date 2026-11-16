<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import RedOrangeYellowGreenBlueRadioGroup from "./RedOrangeYellowGreenBlueRadioGroup.svelte";

    const { Story } = defineMeta({
        title: "Headless/RedOrangeYellowGreenBlueRadioGroup",
        component: RedOrangeYellowGreenBlueRadioGroup,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Radio Group" }}
>
    <span>Group content</span>
</Story>
