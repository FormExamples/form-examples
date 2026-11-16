<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import AsSaudiyahRaqmAlHuwiyahAlWataniyahInput from "./AsSaudiyahRaqmAlHuwiyahAlWataniyahInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/AsSaudiyahRaqmAlHuwiyahAlWataniyahInput",
        component: AsSaudiyahRaqmAlHuwiyahAlWataniyahInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "National Identification Number Input" }}
/>
