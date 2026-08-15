<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import BradenSubscale from '#lib/components/ui/BradenSubscale.svelte';

	const d = assessment.data.bradenScale;

	const sensory = [
		{ value: 1, title: 'Completely limited', desc: 'Unresponsive (does not moan, flinch, or grasp) to painful stimuli OR limited ability to feel pain over most of body surface.' },
		{ value: 2, title: 'Very limited', desc: 'Responds only to painful stimuli; cannot communicate discomfort except by moaning or restlessness, OR has a sensory impairment limiting feeling pain or discomfort over half of body.' },
		{ value: 3, title: 'Slightly limited', desc: 'Responds to verbal commands but cannot always communicate discomfort, OR has some sensory impairment limiting ability to feel pain in 1-2 extremities.' },
		{ value: 4, title: 'No impairment', desc: 'Responds to verbal commands; has no sensory deficit which would limit ability to feel or voice pain or discomfort.' }
	];
	const moisture = [
		{ value: 1, title: 'Constantly moist', desc: 'Skin is kept moist almost constantly by perspiration, urine, etc.; dampness detected every time patient is moved or turned.' },
		{ value: 2, title: 'Very moist', desc: 'Skin is often, but not always, moist; linen must be changed at least once a shift.' },
		{ value: 3, title: 'Occasionally moist', desc: 'Skin is occasionally moist, requiring an extra linen change approximately once a day.' },
		{ value: 4, title: 'Rarely moist', desc: 'Skin is usually dry; linen only requires changing at routine intervals.' }
	];
	const activity = [
		{ value: 1, title: 'Bedfast', desc: 'Confined to bed.' },
		{ value: 2, title: 'Chairfast', desc: 'Ability to walk severely limited or non-existent; cannot bear own weight and/or must be assisted into chair or wheelchair.' },
		{ value: 3, title: 'Walks occasionally', desc: 'Walks occasionally during day, but for very short distances, with or without assistance; spends majority of each shift in bed or chair.' },
		{ value: 4, title: 'Walks frequently', desc: 'Walks outside the room at least twice a day and inside the room at least once every 2 hours during waking hours.' }
	];
	const mobility = [
		{ value: 1, title: 'Completely immobile', desc: 'Does not make even slight changes in body or extremity position without assistance.' },
		{ value: 2, title: 'Very limited', desc: 'Makes occasional slight changes in body or extremity position, but unable to make frequent or significant changes independently.' },
		{ value: 3, title: 'Slightly limited', desc: 'Makes frequent though slight changes in body or extremity position independently.' },
		{ value: 4, title: 'No limitations', desc: 'Makes major and frequent changes in position without assistance.' }
	];
	const nutrition = [
		{ value: 1, title: 'Very poor', desc: 'Never eats a complete meal; rarely eats more than 1/3 of any food offered, OR is NPO and/or maintained on clear liquids or IVs for more than 5 days.' },
		{ value: 2, title: 'Probably inadequate', desc: 'Rarely eats a complete meal and generally eats only about 1/2 of any food offered, OR receives less than optimum amount of liquid diet or tube feeding.' },
		{ value: 3, title: 'Adequate', desc: 'Eats over half of most meals; eats a total of 4 servings of protein each day, OR is on a tube feeding or TPN regimen which probably meets most nutritional needs.' },
		{ value: 4, title: 'Excellent', desc: 'Eats most of every meal; never refuses; usually eats a total of 4+ servings of meat and dairy products. Occasionally eats between meals; does not require supplementation.' }
	];
	const frictionShear = [
		{ value: 1, title: 'Problem', desc: 'Requires moderate to maximum assistance in moving; complete lifting without sliding against sheets is impossible; frequently slides down in bed or chair, requiring frequent repositioning with maximum assistance.' },
		{ value: 2, title: 'Potential problem', desc: 'Moves feebly or requires minimum assistance; during a move skin probably slides to some extent against sheets, chair, restraints, or other devices; maintains relatively good position in chair or bed most of the time but occasionally slides down.' },
		{ value: 3, title: 'No apparent problem', desc: 'Moves in bed and in chair independently and has sufficient muscle strength to lift up completely during move; maintains good position in bed or chair at all times.' }
	];
</script>

<Fieldset legend="Braden Scale Scoring">
	<p class="hint">Pressure-ulcer risk: score each subscale based on observed status (total 6-23, lower = higher risk).</p>

	<BradenSubscale
		name="sensoryPerception"
		label="1. Sensory perception — ability to respond meaningfully to pressure-related discomfort"
		options={sensory}
		bind:value={d.sensoryPerception}
	/>
	<BradenSubscale
		name="braden-moisture"
		label="2. Moisture — degree to which skin is exposed to moisture"
		options={moisture}
		bind:value={d.moisture}
	/>
	<BradenSubscale
		name="activity"
		label="3. Activity — degree of physical activity"
		options={activity}
		bind:value={d.activity}
	/>
	<BradenSubscale
		name="mobility"
		label="4. Mobility — ability to change and control body position"
		options={mobility}
		bind:value={d.mobility}
	/>
	<BradenSubscale
		name="nutrition"
		label="5. Nutrition — usual food intake pattern"
		options={nutrition}
		bind:value={d.nutrition}
	/>
	<BradenSubscale
		name="frictionShear"
		label="6. Friction and shear"
		options={frictionShear}
		bind:value={d.frictionShear}
	/>
</Fieldset>
