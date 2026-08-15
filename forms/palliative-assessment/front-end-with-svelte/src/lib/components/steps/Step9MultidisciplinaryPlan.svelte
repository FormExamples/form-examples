<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import type { YesNo } from '#lib/engine/types.js';

	const d = assessment.data.multidisciplinaryPlan;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const referrals: { key: keyof typeof d; label: string }[] = [
		{ key: 'specialistPalliativeCareInvolved', label: 'Specialist palliative care involved?' },
		{ key: 'communityNursingInvolved', label: 'Community nursing involved?' },
		{ key: 'hospiceReferralMade', label: 'Hospice referral made?' },
		{ key: 'socialWorkReferralMade', label: 'Social work referral made?' },
		{ key: 'occupationalTherapyReferralMade', label: 'Occupational therapy referral made?' },
		{ key: 'physiotherapyReferralMade', label: 'Physiotherapy referral made?' },
		{ key: 'dieticianReferralMade', label: 'Dietician referral made?' },
		{ key: 'chaplaincyReferralMade', label: 'Chaplaincy referral made?' },
		{ key: 'psychologyReferralMade', label: 'Psychology referral made?' }
	];
</script>

<Fieldset legend="Multidisciplinary Plan & Referrals">
	<p class="hint">Team involvement, referrals, the key worker, review interval, and the overall plan summary.</p>

	{#each referrals as r (r.key)}
		<Field label={r.label}>
			<RadioGroup label={r.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={r.key} value={opt.value} bind:group={d[r.key] as YesNo} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Other referrals" inputId="otherReferrals">
		<TextAreaInput id="otherReferrals" label="Other referrals" rows={2} bind:value={d.otherReferrals} />
	</Field>

	<div class="field-grid">
		<Field label="Review interval" inputId="reviewInterval">
			<TextInput id="reviewInterval" label="Review interval" placeholder="e.g. 2 weeks, daily" bind:value={d.reviewInterval} />
		</Field>
		<Field label="Key worker name" inputId="keyWorkerName">
			<TextInput id="keyWorkerName" label="Key worker name" bind:value={d.keyWorkerName} />
		</Field>
	</div>

	<Field label="Plan summary" inputId="planSummary">
		<TextAreaInput id="planSummary" label="Plan summary" rows={3} bind:value={d.planSummary} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
