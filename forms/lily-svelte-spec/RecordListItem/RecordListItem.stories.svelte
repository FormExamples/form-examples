<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import RecordListItem from "./RecordListItem.svelte";

    const { Story } = defineMeta({
        title: "Headless/RecordListItem",
        component: RecordListItem,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ul>
        <RecordListItem
            status="final"
            statusLabel="Final"
            updated="2026-11-03"
            updatedLabel="Updated 3 Nov 2026"
        >
            Blood pressure 128/82 mmHg
        </RecordListItem>
    </ul>
</Story>
