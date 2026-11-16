<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MedicationRecordList from "./MedicationRecordList.svelte";
    import MedicationRecordListItem from "../MedicationRecordListItem/MedicationRecordListItem.svelte";

    const { Story } = defineMeta({
        title: "Headless/MedicationRecordList",
        component: MedicationRecordList,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <MedicationRecordList
        status="known"
        statusLabel="Current medicines"
    >
        <MedicationRecordListItem
            status="active"
            statusLabel="Active"
            effective="2025-03-03"
            effectiveLabel="Since 3 Mar 2025"
        >
            ramipril 5 mg capsule, oral, once a day
        </MedicationRecordListItem>
    </MedicationRecordList>
</Story>

<Story name="No known medicines">
    <MedicationRecordList
        status="none-known"
        statusLabel="No known medicines"
    />
</Story>
