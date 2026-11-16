<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MiddleTruncation from "./MiddleTruncation.svelte";
    const { Story } = defineMeta({
        title: "Headless/MiddleTruncation",
        component: MiddleTruncation,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <MiddleTruncation
        text="quarterly-report-final-version-3.pdf"
        ellipsis="…"
        strategy="min-end"
        end={6}
    />
</Story>
