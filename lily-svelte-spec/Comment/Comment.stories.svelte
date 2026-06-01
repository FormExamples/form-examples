<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import Comment from "./Comment.svelte";
    const { Story } = defineMeta({
        title: "Headless/Comment",
        component: Comment,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <Comment label="Comment example">
        <span>Comment example</span>
    </Comment>
</Story>
