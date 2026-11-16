<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ImmunizationRecordListItem from "./ImmunizationRecordListItem.svelte";

    const { Story } = defineMeta({
        title: "Headless/ImmunizationRecordListItem",
        component: ImmunizationRecordListItem,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ul>
        <ImmunizationRecordListItem
            vaccine="MMR vaccine"
            occurrence="2025-09-12"
            occurrenceLabel="12 Sep 2025"
            doseNumberLabel="Dose 2 of 2"
            status="completed"
            statusLabel="Given"
            lotNumber="AB1234"
        />
    </ul>
</Story>
