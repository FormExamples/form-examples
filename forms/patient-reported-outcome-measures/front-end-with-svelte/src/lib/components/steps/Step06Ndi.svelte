<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import type { NdiResponse } from '$lib/engine/types';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import ScaleItemField from './ScaleItemField.svelte';

	const n = assessment.data.ndi;

	interface NdiOption {
		value: number;
		label: string;
	}
	interface NdiSection {
		field: keyof NdiResponse;
		number: number;
		title: string;
		options: NdiOption[];
	}

	const sections: NdiSection[] = [
		{
			field: 'painIntensity',
			number: 1,
			title: 'Pain intensity',
			options: [
				{ value: 0, label: 'I have no pain at the moment' },
				{ value: 1, label: 'The pain is very mild at the moment' },
				{ value: 2, label: 'The pain is moderate at the moment' },
				{ value: 3, label: 'The pain is fairly severe at the moment' },
				{ value: 4, label: 'The pain is very severe at the moment' },
				{ value: 5, label: 'The pain is the worst imaginable at the moment' }
			]
		},
		{
			field: 'personalCare',
			number: 2,
			title: 'Personal care (washing, dressing, etc.)',
			options: [
				{ value: 0, label: 'I can look after myself normally without causing extra pain' },
				{ value: 1, label: 'I can look after myself normally but it causes extra pain' },
				{
					value: 2,
					label: 'It is painful to look after myself and I am slow and careful'
				},
				{ value: 3, label: 'I need some help but manage most of my personal care' },
				{ value: 4, label: 'I need help every day in most aspects of self care' },
				{ value: 5, label: 'I do not get dressed, wash with difficulty and stay in bed' }
			]
		},
		{
			field: 'lifting',
			number: 3,
			title: 'Lifting',
			options: [
				{ value: 0, label: 'I can lift heavy weights without extra pain' },
				{ value: 1, label: 'I can lift heavy weights but it gives extra pain' },
				{
					value: 2,
					label:
						'Pain prevents me from lifting heavy weights off the floor, but I can manage if conveniently positioned (e.g. on a table)'
				},
				{
					value: 3,
					label:
						'Pain prevents me from lifting heavy weights, but I can manage light to medium weights if conveniently positioned'
				},
				{ value: 4, label: 'I can lift very light weights' },
				{ value: 5, label: 'I cannot lift or carry anything at all' }
			]
		},
		{
			field: 'reading',
			number: 4,
			title: 'Reading',
			options: [
				{ value: 0, label: 'I can read as much as I want with no pain in my neck' },
				{ value: 1, label: 'I can read as much as I want with slight pain in my neck' },
				{ value: 2, label: 'I can read as much as I want with moderate pain in my neck' },
				{
					value: 3,
					label: 'I cannot read as much as I want because of moderate pain in my neck'
				},
				{
					value: 4,
					label: 'I cannot read as much as I want because of severe pain in my neck'
				},
				{ value: 5, label: 'I cannot read at all' }
			]
		},
		{
			field: 'headache',
			number: 5,
			title: 'Headache',
			options: [
				{ value: 0, label: 'I have no headaches at all' },
				{ value: 1, label: 'I have slight headaches which come infrequently' },
				{ value: 2, label: 'I have moderate headaches which come infrequently' },
				{ value: 3, label: 'I have moderate headaches which come frequently' },
				{ value: 4, label: 'I have severe headaches which come frequently' },
				{ value: 5, label: 'I have headaches almost all the time' }
			]
		},
		{
			field: 'concentration',
			number: 6,
			title: 'Concentration',
			options: [
				{ value: 0, label: 'I can concentrate fully when I want with no difficulty' },
				{ value: 1, label: 'I can concentrate fully when I want with slight difficulty' },
				{ value: 2, label: 'I have a fair degree of difficulty concentrating when I want' },
				{ value: 3, label: 'I have a lot of difficulty concentrating when I want' },
				{ value: 4, label: 'I have a great deal of difficulty concentrating when I want' },
				{ value: 5, label: 'I cannot concentrate at all' }
			]
		},
		{
			field: 'work',
			number: 7,
			title: 'Work',
			options: [
				{ value: 0, label: 'I can do as much work as I want' },
				{ value: 1, label: 'I can only do my usual work but no more' },
				{ value: 2, label: 'I can do most of my usual work but no more' },
				{ value: 3, label: 'I cannot do my usual work' },
				{ value: 4, label: 'I can hardly do any work at all' },
				{ value: 5, label: 'I cannot do any work at all' }
			]
		},
		{
			field: 'driving',
			number: 8,
			title: 'Driving',
			options: [
				{ value: 0, label: 'I can drive my car without any neck pain' },
				{
					value: 1,
					label: 'I can drive my car as long as I want with slight pain in my neck'
				},
				{
					value: 2,
					label: 'I can drive my car as long as I want with moderate pain in my neck'
				},
				{
					value: 3,
					label:
						'I cannot drive my car as long as I want because of moderate pain in my neck'
				},
				{
					value: 4,
					label: 'I can hardly drive at all because of severe pain in my neck'
				},
				{ value: 5, label: 'I cannot drive my car at all' }
			]
		},
		{
			field: 'sleeping',
			number: 9,
			title: 'Sleeping',
			options: [
				{ value: 0, label: 'I have no trouble sleeping' },
				{
					value: 1,
					label: 'My sleep is slightly disturbed (less than 1 hour sleepless)'
				},
				{ value: 2, label: 'My sleep is mildly disturbed (1-2 hours sleepless)' },
				{ value: 3, label: 'My sleep is moderately disturbed (2-3 hours sleepless)' },
				{ value: 4, label: 'My sleep is greatly disturbed (3-5 hours sleepless)' },
				{ value: 5, label: 'My sleep is completely disturbed (5-7 hours sleepless)' }
			]
		},
		{
			field: 'recreation',
			number: 10,
			title: 'Recreation',
			options: [
				{
					value: 0,
					label: 'I am able to engage in all my recreation activities with no neck pain at all'
				},
				{
					value: 1,
					label: 'I am able to engage in all my recreation activities with some pain in my neck'
				},
				{
					value: 2,
					label:
						'I am able to engage in most, but not all, of my usual recreation activities because of pain in my neck'
				},
				{
					value: 3,
					label: 'I am able to engage in a few of my usual recreation activities because of pain in my neck'
				},
				{
					value: 4,
					label: 'I can hardly do any recreation activities because of pain in my neck'
				},
				{ value: 5, label: 'I cannot do any recreation activities at all' }
			]
		}
	];
</script>

<Fieldset legend="Step 6 of 9 — Neck Disability Index (NDI)">
	<p class="hint">
		10 sections, each answered A-F (recorded here as 0-5: A = 0 ... F = 5). Vernon H, Mior S.
		1991.
	</p>

	{#each sections as section (section.field)}
		<ScaleItemField
			number={`Section ${section.number}`}
			legend={section.title}
			name={`ndi-${section.field}`}
			options={section.options}
			bind:value={n[section.field]}
		/>
	{/each}
</Fieldset>
