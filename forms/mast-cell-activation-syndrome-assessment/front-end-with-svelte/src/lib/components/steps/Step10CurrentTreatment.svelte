<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const t = assessment.data.currentTreatment;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Current Treatment">
	<p class="hint">Indicate which treatments you are currently receiving for MCAS.</p>

	<Field label="Are you taking antihistamines (H1 and/or H2 blockers)?">
		<RadioGroup label="Antihistamines">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="antihistamines" value={opt.value} bind:group={t.antihistamines} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Are you taking mast cell stabilizers (e.g., cromolyn sodium, ketotifen)?">
		<RadioGroup label="Mast cell stabilizers">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="mastCellStabilizers" value={opt.value} bind:group={t.mastCellStabilizers} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Are you taking leukotriene inhibitors (e.g., montelukast, zafirlukast)?">
		<RadioGroup label="Leukotriene inhibitors">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="leukotrienInhibitors" value={opt.value} bind:group={t.leukotrienInhibitors} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you have an epinephrine auto-injector (e.g., EpiPen) prescribed?">
		<RadioGroup label="Epinephrine">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="epinephrine" value={opt.value} bind:group={t.epinephrine} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
