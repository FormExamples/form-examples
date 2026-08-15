<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import PclRating from '#lib/components/ui/PclRating.svelte';

	const d = assessment.data.clusterDNegativeAlterations;
</script>

<Fieldset legend="Negative Alterations in Cognitions & Mood (DSM-5 Cluster D)">
	<p class="hint">In the past month, how much were you bothered by:</p>
	<PclRating label="8. Trouble remembering important parts of the stressful experience?" name="d8" bind:value={d.item8TroubleRememberingImportantParts} />
	<PclRating label="9. Having strong negative beliefs about yourself, other people, or the world?" name="d9" bind:value={d.item9StrongNegativeBeliefs} />
	<PclRating label="10. Blaming yourself or someone else for the stressful experience or what happened after it?" name="d10" bind:value={d.item10BlamingSelfOrOthers} />
	<PclRating label="11. Having strong negative feelings such as fear, horror, anger, guilt, or shame?" name="d11" bind:value={d.item11StrongNegativeFeelings} />
	<PclRating label="12. Loss of interest in activities that you used to enjoy?" name="d12" bind:value={d.item12LossOfInterest} />
	<PclRating label="13. Feeling distant or cut off from other people?" name="d13" bind:value={d.item13FeelingDistantFromOthers} />
	<PclRating label="14. Trouble experiencing positive feelings (for example being unable to feel happiness or have loving feelings for people close to you)?" name="d14" bind:value={d.item14TroubleExperiencingPositiveFeelings} />
</Fieldset>
