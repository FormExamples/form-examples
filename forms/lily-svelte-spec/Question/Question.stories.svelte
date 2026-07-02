<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import Question from "./Question.svelte";
    const { Story } = defineMeta({
        title: "Headless/Question",
        component: Question,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <Question label="Question example">
        <span>Question example</span>
    </Question>
</Story>
