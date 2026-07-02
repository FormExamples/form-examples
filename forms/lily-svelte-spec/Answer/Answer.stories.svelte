<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import Answer from "./Answer.svelte";
    const { Story } = defineMeta({
        title: "Headless/Answer",
        component: Answer,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <Answer label="Answer example">
        <span>Answer example</span>
    </Answer>
</Story>
