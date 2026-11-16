<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import RecordList from "./RecordList.svelte";
    import RecordListItem from "../RecordListItem/RecordListItem.svelte";

    const { Story } = defineMeta({
        title: "Headless/RecordList",
        component: RecordList,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <RecordList
        status="known"
        statusLabel="Vital signs"
    >
        <RecordListItem
            status="final"
            statusLabel="Final"
            updated="2026-11-03"
            updatedLabel="Updated 3 Nov 2026"
        >
            Blood pressure 128/82 mmHg
        </RecordListItem>
    </RecordList>
</Story>

<Story name="No vital signs recorded">
    <RecordList
        status="none-known"
        statusLabel="No vital signs recorded"
    />
</Story>
