<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import AotearoaNationalHealthIndexView from "./AotearoaNationalHealthIndexView.svelte";

    const { Story } = defineMeta({
        title: "Headless/AotearoaNationalHealthIndexView",
        component: AotearoaNationalHealthIndexView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "National Health Index (NHI) Number View" }}
/>
