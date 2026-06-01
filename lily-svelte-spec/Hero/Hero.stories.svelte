<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import Hero from "./Hero.svelte";
    const { Story } = defineMeta({
        title: "Headless/Hero",
        component: Hero,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <Hero label="Hero example">
        <span>Hero example</span>
    </Hero>
</Story>
