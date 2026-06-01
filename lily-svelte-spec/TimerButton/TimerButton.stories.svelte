<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import TimerButton from "./TimerButton.svelte";
    const { Story } = defineMeta({
        title: "Headless/TimerButton",
        component: TimerButton,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <TimerButton label="TimerButton example">
        <span>TimerButton example</span>
    </TimerButton>
</Story>
