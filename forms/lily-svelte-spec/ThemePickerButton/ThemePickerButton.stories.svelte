<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ThemeSelectButton from "./ThemeSelectButton.svelte";
    const { Story } = defineMeta({
        title: "Headless/ThemeSelectButton",
        component: ThemeSelectButton,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <ThemeSelectButton label="ThemeSelectButton example">
        <span>ThemeSelectButton example</span>
    </ThemeSelectButton>
</Story>
