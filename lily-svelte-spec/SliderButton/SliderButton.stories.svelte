<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import SliderButton from "./SliderButton.svelte";
    const { Story } = defineMeta({
        title: "Headless/SliderButton",
        component: SliderButton,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <SliderButton label="SliderButton example">
        <span>SliderButton example</span>
    </SliderButton>
</Story>
