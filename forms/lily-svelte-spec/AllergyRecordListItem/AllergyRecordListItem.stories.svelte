<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import AllergyRecordListItem from "./AllergyRecordListItem.svelte";

    const { Story } = defineMeta({
        title: "Headless/AllergyRecordListItem",
        component: AllergyRecordListItem,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ul>
        <AllergyRecordListItem
            substance="Penicillin"
            reaction="Anaphylaxis"
            severity="severe"
            severityLabel="Severe"
            criticality="high"
            criticalityLabel="High risk"
            clinicalStatus="active"
            clinicalStatusLabel="Active"
            verificationStatus="confirmed"
            verificationStatusLabel="Confirmed"
            typeLabel="Allergy"
            categoryLabel="Medication"
            updated="2026-11-03"
            updatedLabel="Updated 3 Nov 2026"
        />
    </ul>
</Story>
