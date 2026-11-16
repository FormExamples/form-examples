<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ProcedureRecordListItem from "./ProcedureRecordListItem.svelte";

    const { Story } = defineMeta({
        title: "Headless/ProcedureRecordListItem",
        component: ProcedureRecordListItem,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ul>
        <ProcedureRecordListItem
            procedure="Appendectomy"
            status="completed"
            statusLabel="Completed"
            performed="2018-04-22"
            performedLabel="22 Apr 2018"
        />
    </ul>
</Story>
