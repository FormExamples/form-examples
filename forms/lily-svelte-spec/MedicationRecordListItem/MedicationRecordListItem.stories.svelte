<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MedicationRecordListItem from "./MedicationRecordListItem.svelte";

    const { Story } = defineMeta({
        title: "Headless/MedicationRecordListItem",
        component: MedicationRecordListItem,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ul>
        <MedicationRecordListItem
            status="active"
            statusLabel="Active"
            effective="2025-03-03"
            effectiveLabel="Since 3 Mar 2025"
        >
            ramipril 5 mg capsule, oral, once a day
        </MedicationRecordListItem>
    </ul>
</Story>
