<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import AsSaudiyahRaqmAlHuwiyahAlWataniyahView from "./AsSaudiyahRaqmAlHuwiyahAlWataniyahView.svelte";

    const { Story } = defineMeta({
        title: "Headless/AsSaudiyahRaqmAlHuwiyahAlWataniyahView",
        component: AsSaudiyahRaqmAlHuwiyahAlWataniyahView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "National Identification Number View" }}
/>
