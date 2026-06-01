<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import SuperBanner from "./SuperBanner.svelte";
    const { Story } = defineMeta({
        title: "Headless/SuperBanner",
        component: SuperBanner,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <SuperBanner label="SuperBanner example">
        <span>SuperBanner example</span>
    </SuperBanner>
</Story>
