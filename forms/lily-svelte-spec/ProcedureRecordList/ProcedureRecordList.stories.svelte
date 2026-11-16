<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ProcedureRecordList from "./ProcedureRecordList.svelte";
    import ProcedureRecordListItem from "../ProcedureRecordListItem/ProcedureRecordListItem.svelte";

    const { Story } = defineMeta({
        title: "Headless/ProcedureRecordList",
        component: ProcedureRecordList,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ProcedureRecordList
        status="known"
        statusLabel="Procedures"
    >
        <ProcedureRecordListItem
            procedure="Appendectomy"
            status="completed"
            statusLabel="Completed"
            performed="2018-04-22"
            performedLabel="22 Apr 2018"
        />
    </ProcedureRecordList>
</Story>

<Story name="No known procedures">
    <ProcedureRecordList
        status="none-known"
        statusLabel="No known procedures"
    />
</Story>
