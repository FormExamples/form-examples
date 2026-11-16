<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MalaysiaKadPengenalanInput from "./MalaysiaKadPengenalanInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/MalaysiaKadPengenalanInput",
        component: MalaysiaKadPengenalanInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "MyKad Number (NRIC) Input" }}
/>
