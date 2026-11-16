<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import InternationalPatientSummary from "./InternationalPatientSummary.svelte";
    import InternationalPatientSummarySection from "../InternationalPatientSummarySection/InternationalPatientSummarySection.svelte";
    import AllergyRecordList from "../AllergyRecordList/AllergyRecordList.svelte";

    const { Story } = defineMeta({
        title: "Headless/InternationalPatientSummary",
        component: InternationalPatientSummary,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <InternationalPatientSummary
        label="Patient summary"
        contentsLabel="Contents"
        omittedLabel="Section missing from document"
        requiredHeadings={{
            medications: "Medication summary",
            allergies: "Allergies and intolerances",
            problems: "Problem list",
        }}
        sections={[
            { key: "allergies", heading: "Allergies and intolerances", status: "none-known" },
        ]}
    >
        <InternationalPatientSummarySection
            section="allergies"
            heading="Allergies and intolerances"
            status="none-known"
            statusLabel="No known allergies"
        >
            <AllergyRecordList
                status="none-known"
                statusLabel="No known allergies"
            />
        </InternationalPatientSummarySection>
    </InternationalPatientSummary>
</Story>
