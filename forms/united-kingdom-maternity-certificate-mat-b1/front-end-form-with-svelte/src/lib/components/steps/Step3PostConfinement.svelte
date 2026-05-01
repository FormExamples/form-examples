<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const data = assessment.data;
	const post = data.postConfinement;
</script>

<SectionCard
	title="Part B — Post-Confinement Certificate"
	description="Complete Part B only when the certificate is being issued after the birth. The expected date of confinement (EWC) is still required for SMP / Maternity Allowance entitlement."
>
	{#if data.certificateType === 'post'}
		<TextInput
			label="Baby's actual date of birth"
			name="actualDateOfBirth"
			type="date"
			bind:value={post.actualDateOfBirth}
			required
		/>

		<TextInput
			label="Expected date of confinement (EWC)"
			name="postEwc"
			type="date"
			bind:value={post.expectedDateOfConfinement}
			required
		/>
	{:else if data.certificateType === 'pre'}
		<p class="text-sm text-gray-500">
			Part A (pre-confinement) was selected in Step 2 — Part B is not applicable.
		</p>
	{:else}
		<p class="text-sm text-gray-500">
			Select a certificate type in Step 2 to enable this section.
		</p>
	{/if}
</SectionCard>
