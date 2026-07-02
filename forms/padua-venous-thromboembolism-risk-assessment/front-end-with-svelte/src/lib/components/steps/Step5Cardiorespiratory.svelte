<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculatePaduaGrade } from '$lib/engine/padua-grader';
	import { pointColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const cr = assessment.data.cardiorespiratory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const subtotal = $derived(() => {
		const fp = calculatePaduaGrade(assessment.data).factorPoints;
		return (
			(fp.heartOrRespiratoryFailure ?? 0) +
			(fp.acuteMiOrIschaemicStroke ?? 0) +
			(fp.acuteInfectionOrRheumatological ?? 0)
		);
	});
</script>

<Fieldset legend="Step 5 of 8 — Cardiorespiratory and acute illness">
	<p class="hint">Each of these acute conditions scores 1 point.</p>

	<Field label="Acute heart and/or respiratory failure?">
		<p class="hint">Factor 7 — 1 point when present.</p>
		<RadioGroup label="Acute heart and/or respiratory failure?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="cardiorespiratory-heartOrRespiratoryFailure"
						value={opt.value}
						bind:group={cr.heartOrRespiratoryFailure}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Acute myocardial infarction or ischaemic stroke?">
		<p class="hint">Factor 8 — 1 point when present.</p>
		<RadioGroup label="Acute myocardial infarction or ischaemic stroke?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="cardiorespiratory-acuteMiOrIschaemicStroke"
						value={opt.value}
						bind:group={cr.acuteMiOrIschaemicStroke}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Acute infection and/or rheumatological disorder?">
		<p class="hint">Factor 9 — 1 point when present.</p>
		<RadioGroup label="Acute infection and/or rheumatological disorder?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="cardiorespiratory-acuteInfectionOrRheumatological"
						value={opt.value}
						bind:group={cr.acuteInfectionOrRheumatological}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Cardiorespiratory factor points">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(subtotal())}"
		>
			{subtotal()} {subtotal() === 1 ? 'point' : 'points'}
		</span>
	</Field>
</Fieldset>
