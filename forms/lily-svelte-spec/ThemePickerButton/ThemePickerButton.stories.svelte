<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ThemePickerButton from "./ThemePickerButton.svelte";
    const { Story } = defineMeta({
        title: "Headless/ThemePickerButton",
        component: ThemePickerButton,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <ThemePickerButton label="ThemePickerButton example">
        <span>ThemePickerButton example</span>
    </ThemePickerButton>
</Story>
