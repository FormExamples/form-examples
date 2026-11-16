<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ColorRadioInput from "./ColorRadioInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/ColorRadioInput",
        component: ColorRadioInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ color: "#005eb8", label: "Radio Input" }}
/>
