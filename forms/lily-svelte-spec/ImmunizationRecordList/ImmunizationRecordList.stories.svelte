<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ImmunizationRecordList from "./ImmunizationRecordList.svelte";
    import ImmunizationRecordListItem from "../ImmunizationRecordListItem/ImmunizationRecordListItem.svelte";

    const { Story } = defineMeta({
        title: "Headless/ImmunizationRecordList",
        component: ImmunizationRecordList,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ImmunizationRecordList
        status="known"
        statusLabel="Immunizations"
    >
        <ImmunizationRecordListItem
            vaccine="MMR vaccine"
            occurrence="2025-09-12"
            occurrenceLabel="12 Sep 2025"
            doseNumberLabel="Dose 2 of 2"
            status="completed"
            statusLabel="Given"
            lotNumber="AB1234"
        />
    </ImmunizationRecordList>
</Story>

<Story name="No immunizations recorded">
    <ImmunizationRecordList
        status="none-known"
        statusLabel="No immunizations recorded"
    />
</Story>
