<script lang="ts">
  import ReferenceCard from '$lib/components/ReferenceCard.svelte';

  const refs = [
    {
      title: 'MDCG 2019-11 Rev.1 — EU MDR/IVDR Software Classification',
      href: 'https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en',
      description: 'European Commission guidance on classifying software as a medical device under EU MDR and IVDR.'
    },
    {
      title: 'UK Medical Devices Regulations 2002',
      href: 'https://www.legislation.gov.uk/uksi/2002/618/contents',
      description: 'UK statutory instrument governing the placing of medical devices on the UK market.'
    },
    {
      title: 'ISO/IEC/IEEE 26514:2022',
      href: 'https://www.iso.org/standard/77451.html',
      description: 'International standard for the design and development of information for users of software.'
    },
    {
      title: 'UK MHRA — Software and AI as a Medical Device',
      href: 'https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device/software-and-artificial-intelligence-ai-as-a-medical-device',
      description: 'UK regulator guidance on software and AI products that meet the definition of a medical device.'
    }
  ];
</script>

<h1 class="text-3xl font-semibold tracking-tight">Compliance</h1>
<p class="mt-2 text-muted">Reference standards and guidance the monorepo aligns to.</p>

<div class="mt-8 grid gap-4 sm:grid-cols-2">
  {#each refs as r}
    <ReferenceCard title={r.title} href={r.href} description={r.description} />
  {/each}
</div>

<p class="mt-8 text-sm text-muted">
  These references provide context for the implementation choices in the monorepo. None of the forms
  in this project have themselves been certified as medical devices.
</p>
