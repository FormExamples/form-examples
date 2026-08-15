<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OKS_OPTIONS } from '#lib/config/options.js';
	import type { OksSection } from '#lib/engine/types.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;

	// Each Oxford Knee Score item is stored as `number | null` (0 worst to 4
	// best), but the shared Select component's bindable value is a string, so
	// each field binds through a get/set pair rather than directly.
	function oksItemValue(key: keyof OksSection): string {
		const v = d.oks[key];
		return v === null ? '' : String(v);
	}
	function setOksItemValue(key: keyof OksSection, v: string): void {
		d.oks[key] = v === '' ? null : Number(v);
	}
</script>

<Fieldset legend="4. Oxford Knee Score">
	<p class="hint">
		Twelve items, each scored 0 (worst) to 4 (best) from the patient's answers. Total ranges 0–48;
		48 is the best possible outcome. (Dawson et al., <em>J Bone Joint Surg Br</em> 1998.)
	</p>

	<Field label="1. Usual knee pain severity" inputId="oks-oksPainSeverity">
		<Select
			id="oks-oksPainSeverity"
			label="1. Usual knee pain severity"
			bind:value={() => oksItemValue('oksPainSeverity'), (v) => setOksItemValue('oksPainSeverity', v)}
		>
			<option value="">— Select —</option>
			{#each OKS_OPTIONS.oksPainSeverity as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="2. Washing and drying difficulty" inputId="oks-oksWashingAndDrying">
		<Select
			id="oks-oksWashingAndDrying"
			label="2. Washing and drying difficulty"
			bind:value={() => oksItemValue('oksWashingAndDrying'), (v) => setOksItemValue('oksWashingAndDrying', v)}
		>
			<option value="">— Select —</option>
			{#each OKS_OPTIONS.oksWashingAndDrying as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="3. Getting in/out of a car or public transport" inputId="oks-oksTransport">
		<Select
			id="oks-oksTransport"
			label="3. Getting in/out of a car or public transport"
			bind:value={() => oksItemValue('oksTransport'), (v) => setOksItemValue('oksTransport', v)}
		>
			<option value="">— Select —</option>
			{#each OKS_OPTIONS.oksTransport as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="4. Walking distance before severe pain" inputId="oks-oksWalkingDistance">
		<Select
			id="oks-oksWalkingDistance"
			label="4. Walking distance before severe pain"
			bind:value={() => oksItemValue('oksWalkingDistance'), (v) => setOksItemValue('oksWalkingDistance', v)}
		>
			<option value="">— Select —</option>
			{#each OKS_OPTIONS.oksWalkingDistance as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="5. Pain sitting or lying" inputId="oks-oksPainSittingOrLying">
		<Select
			id="oks-oksPainSittingOrLying"
			label="5. Pain sitting or lying"
			bind:value={() => oksItemValue('oksPainSittingOrLying'), (v) => setOksItemValue('oksPainSittingOrLying', v)}
		>
			<option value="">— Select —</option>
			{#each OKS_OPTIONS.oksPainSittingOrLying as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="6. Limping when walking" inputId="oks-oksLimping">
		<Select
			id="oks-oksLimping"
			label="6. Limping when walking"
			bind:value={() => oksItemValue('oksLimping'), (v) => setOksItemValue('oksLimping', v)}
		>
			<option value="">— Select —</option>
			{#each OKS_OPTIONS.oksLimping as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="7. Kneeling difficulty" inputId="oks-oksKneeling">
		<Select
			id="oks-oksKneeling"
			label="7. Kneeling difficulty"
			bind:value={() => oksItemValue('oksKneeling'), (v) => setOksItemValue('oksKneeling', v)}
		>
			<option value="">— Select —</option>
			{#each OKS_OPTIONS.oksKneeling as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="8. Night pain frequency" inputId="oks-oksNightPainFrequency">
		<Select
			id="oks-oksNightPainFrequency"
			label="8. Night pain frequency"
			bind:value={() => oksItemValue('oksNightPainFrequency'), (v) => setOksItemValue('oksNightPainFrequency', v)}
		>
			<option value="">— Select —</option>
			{#each OKS_OPTIONS.oksNightPainFrequency as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="9. Pain interfering with usual work" inputId="oks-oksPainInterferingWithWork">
		<Select
			id="oks-oksPainInterferingWithWork"
			label="9. Pain interfering with usual work"
			bind:value={() =>
				oksItemValue('oksPainInterferingWithWork'), (v) => setOksItemValue('oksPainInterferingWithWork', v)}
		>
			<option value="">— Select —</option>
			{#each OKS_OPTIONS.oksPainInterferingWithWork as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="10. Feeling the knee might &quot;give way&quot;" inputId="oks-oksGivingWay">
		<Select
			id="oks-oksGivingWay"
			label="10. Feeling the knee might &quot;give way&quot;"
			bind:value={() => oksItemValue('oksGivingWay'), (v) => setOksItemValue('oksGivingWay', v)}
		>
			<option value="">— Select —</option>
			{#each OKS_OPTIONS.oksGivingWay as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="11. Ability to do household shopping alone" inputId="oks-oksShopping">
		<Select
			id="oks-oksShopping"
			label="11. Ability to do household shopping alone"
			bind:value={() => oksItemValue('oksShopping'), (v) => setOksItemValue('oksShopping', v)}
		>
			<option value="">— Select —</option>
			{#each OKS_OPTIONS.oksShopping as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="12. Ability to walk down a flight of stairs" inputId="oks-oksStairs">
		<Select
			id="oks-oksStairs"
			label="12. Ability to walk down a flight of stairs"
			bind:value={() => oksItemValue('oksStairs'), (v) => setOksItemValue('oksStairs', v)}
		>
			<option value="">— Select —</option>
			{#each OKS_OPTIONS.oksStairs as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
