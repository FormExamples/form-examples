<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import {
		contactPreferenceLabel,
		eyesightStandardLabel,
		formatDateUk,
		monocularAdaptationLabel,
		monocularDurationLabel,
		priorityColor,
		priorityLabel,
		severityColor,
		severityLabel,
		visualFieldCauseLabel,
		whichEyeLabel,
		whichEyesLabel
	} from '$lib/engine/utils';

	const data = assessment.data;
	const result = assessment.result;

	function backToForm() {
		goto('/');
	}

	function startOver() {
		assessment.reset();
		goto('/');
	}

	function formatYesNo(v: string): string {
		if (v === 'yes') return 'Yes';
		if (v === 'no') return 'No';
		return '—';
	}
</script>

<div class="min-h-screen bg-gray-50">
	<header class="border-b border-gray-200 bg-white shadow-sm no-print">
		<div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-gray-900">DVLA V1 — Submission Report</h1>
			<div class="flex gap-2">
				<button
					type="button"
					onclick={backToForm}
					class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
				>
					Back to form
				</button>
				<button
					type="button"
					onclick={startOver}
					class="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark"
				>
					Start over
				</button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-3xl px-4 py-6 space-y-6">
		{#if !result}
			<div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
				No submission found. Please return to the form.
			</div>
		{:else}
			<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="text-xl font-bold text-gray-900">Submission summary</h2>
				<p class="mt-1 text-sm text-gray-500">
					Submitted {new Date(result.timestamp).toLocaleString('en-GB')}
				</p>

				<div class="mt-4 flex flex-wrap items-center gap-3">
					<span class="text-sm text-gray-700">Completeness:</span>
					{#if result.isComplete}
						<Badge
							colorClass="bg-green-100 text-green-800 border-green-300"
							label="Complete"
						/>
					{:else}
						<Badge
							colorClass="bg-red-100 text-red-800 border-red-300"
							label="Incomplete — {result.firedValidations.length} issue(s)"
						/>
					{/if}
					<span class="text-sm text-gray-500">
						{Math.round(result.completionRatio * 100)}% of rules satisfied
					</span>
				</div>
			</section>

			{#if result.firedValidations.length > 0}
				<section class="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
					<h2 class="text-lg font-bold text-red-900">Validation issues</h2>
					<ul class="mt-3 space-y-2">
						{#each result.firedValidations as v (v.id)}
							<li class="flex items-start gap-3">
								<Badge
									colorClass={severityColor(v.severity)}
									label={severityLabel(v.severity)}
								/>
								<div>
									<p class="text-sm font-medium text-gray-900">{v.message}</p>
									<p class="text-xs text-gray-600">
										[{v.id}] section: {v.section}
									</p>
								</div>
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			{#if result.flaggedIssues.length > 0}
				<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<h2 class="text-lg font-bold text-gray-900">Flagged issues for DVLA review</h2>
					<ul class="mt-3 space-y-3">
						{#each result.flaggedIssues as f (f.id)}
							<li class="flex items-start gap-3">
								<Badge colorClass={priorityColor(f.priority)} label={priorityLabel(f.priority)} />
								<div>
									<p class="text-sm font-medium text-gray-900">{f.message}</p>
									<p class="text-xs text-gray-600">[{f.id}] category: {f.category}</p>
								</div>
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="text-lg font-bold text-gray-900">Part A — Personal details</h2>
				<dl class="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
					<div><dt class="text-gray-500">Title</dt><dd>{data.personalDetails.title || '—'}</dd></div>
					<div><dt class="text-gray-500">Full name</dt><dd>{data.personalDetails.fullName || '—'}</dd></div>
					<div><dt class="text-gray-500">Date of birth</dt><dd>{formatDateUk(data.personalDetails.dateOfBirth) || '—'}</dd></div>
					<div><dt class="text-gray-500">Postcode</dt><dd>{data.personalDetails.postcode || '—'}</dd></div>
					<div class="sm:col-span-2"><dt class="text-gray-500">Address</dt><dd class="whitespace-pre-line">{data.personalDetails.address || '—'}</dd></div>
					<div><dt class="text-gray-500">Email</dt><dd>{data.personalDetails.email || '—'}</dd></div>
					<div><dt class="text-gray-500">Contact number</dt><dd>{data.personalDetails.contactNumber || '—'}</dd></div>
					{#if data.personalDetails.changeOfDetails}
						<div class="sm:col-span-2"><dt class="text-gray-500">Change of details</dt><dd class="whitespace-pre-line">{data.personalDetails.changeOfDetails}</dd></div>
					{/if}
				</dl>
			</section>

			<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="text-lg font-bold text-gray-900">Part B — Healthcare professionals</h2>
				<h3 class="mt-3 text-sm font-semibold text-gray-700">GP</h3>
				<dl class="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
					<div><dt class="text-gray-500">Name</dt><dd>{data.healthcareProfessionals.gp.name || '—'}</dd></div>
					<div><dt class="text-gray-500">Surgery</dt><dd>{data.healthcareProfessionals.gp.surgeryName || '—'}</dd></div>
					<div><dt class="text-gray-500">Date last seen</dt><dd>{formatDateUk(data.healthcareProfessionals.gp.dateLastSeen) || '—'}</dd></div>
				</dl>
				{#if data.healthcareProfessionals.consultant.name}
					<h3 class="mt-4 text-sm font-semibold text-gray-700">Consultant</h3>
					<dl class="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
						<div><dt class="text-gray-500">Name</dt><dd>{data.healthcareProfessionals.consultant.name}</dd></div>
						<div><dt class="text-gray-500">Speciality</dt><dd>{data.healthcareProfessionals.consultant.speciality || '—'}</dd></div>
						<div><dt class="text-gray-500">Hospital</dt><dd>{data.healthcareProfessionals.consultant.hospitalName || '—'}</dd></div>
						<div><dt class="text-gray-500">Date last seen</dt><dd>{formatDateUk(data.healthcareProfessionals.consultant.dateLastSeen) || '—'}</dd></div>
					</dl>
				{/if}
			</section>

			<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="text-lg font-bold text-gray-900">Vision self-declaration</h2>
				<dl class="mt-3 space-y-3 text-sm">
					<div>
						<dt class="font-semibold text-gray-700">Q1 — Eyesight standard</dt>
						<dd>{eyesightStandardLabel(data.eyesightStandards.meetsStandard) || '—'}</dd>
					</div>
					<div>
						<dt class="font-semibold text-gray-700">Q2 — Vision in both eyes</dt>
						<dd>{formatYesNo(data.visionInBothEyes.hasVisionInBothEyes)}</dd>
						{#if data.visionInBothEyes.hasVisionInBothEyes === 'no'}
							<dd class="ml-4 text-gray-600">
								Eye: {whichEyeLabel(data.visionInBothEyes.whichEye) || '—'};
								Duration: {monocularDurationLabel(data.visionInBothEyes.duration) || '—'};
								Adaptation: {monocularAdaptationLabel(data.visionInBothEyes.adaptation) || '—'};
								Declaration confirmed: {data.visionInBothEyes.monocularDeclarationConfirmed ? 'Yes' : 'No'}
							</dd>
						{/if}
					</div>
					<div>
						<dt class="font-semibold text-gray-700">Q3 — Visual field problem</dt>
						<dd>{formatYesNo(data.fieldOfVision.hasProblem)}</dd>
						{#if data.fieldOfVision.hasProblem === 'yes'}
							<dd class="ml-4 text-gray-600">
								Caused solely by an eye condition: {formatYesNo(data.fieldOfVision.causedSolelyByEyeCondition)}
								{#if data.fieldOfVision.causedSolelyByEyeCondition === 'no'}
									; Cause: {visualFieldCauseLabel(data.fieldOfVision.cause) || '—'}
									{#if data.fieldOfVision.cause === 'other'}
										({data.fieldOfVision.causeOtherDetails})
									{/if}
								{/if}
							</dd>
						{/if}
					</div>
					<div>
						<dt class="font-semibold text-gray-700">Q4 — Glaucoma</dt>
						<dd>
							{formatYesNo(data.glaucoma.hasCondition)}
							{#if data.glaucoma.hasCondition === 'yes'}
								— {whichEyesLabel(data.glaucoma.whichEyes) || '—'}
							{/if}
						</dd>
					</div>
					<div>
						<dt class="font-semibold text-gray-700">Q5 — Retinitis pigmentosa</dt>
						<dd>
							{formatYesNo(data.retinitisPigmentosa.hasCondition)}
							{#if data.retinitisPigmentosa.hasCondition === 'yes'}
								— {whichEyesLabel(data.retinitisPigmentosa.whichEyes) || '—'}
							{/if}
						</dd>
					</div>
					<div>
						<dt class="font-semibold text-gray-700">Q6 — Laser treatment</dt>
						<dd>{formatYesNo(data.laserTreatment.hasHadTreatment)}</dd>
						{#if data.laserTreatment.hasHadTreatment === 'yes'}
							<dd class="ml-4 text-gray-600">
								First L: {formatDateUk(data.laserTreatment.leftEyeFirstDate) || '—'};
								First R: {formatDateUk(data.laserTreatment.rightEyeFirstDate) || '—'};
								Last L: {formatDateUk(data.laserTreatment.leftEyeLastDate) || '—'};
								Last R: {formatDateUk(data.laserTreatment.rightEyeLastDate) || '—'}
							</dd>
						{/if}
					</div>
					<div>
						<dt class="font-semibold text-gray-700">Q7 — Blepharospasm</dt>
						<dd>{formatYesNo(data.blepharospasm.hasCondition)}</dd>
						{#if data.blepharospasm.hasCondition === 'yes'}
							<dd class="ml-4 text-gray-600">
								Eye(s): {whichEyesLabel(data.blepharospasm.whichEyes) || '—'};
								Treatment: {formatYesNo(data.blepharospasm.hasHadTreatment)};
								Adequately controlled: {formatYesNo(data.blepharospasm.adequatelyControlled)}
							</dd>
						{/if}
					</div>
					<div>
						<dt class="font-semibold text-gray-700">Q8 — Night blindness</dt>
						<dd>
							{formatYesNo(data.nightBlindness.hasCondition)}
							{#if data.nightBlindness.hasCondition === 'yes'}
								— {whichEyesLabel(data.nightBlindness.whichEyes) || '—'}
							{/if}
						</dd>
					</div>
					<div>
						<dt class="font-semibold text-gray-700">Q9 — Double vision</dt>
						<dd>{formatYesNo(data.doubleVision.hasCondition)}</dd>
						{#if data.doubleVision.hasCondition === 'yes'}
							<dd class="ml-4 text-gray-600">
								Controlled: {formatYesNo(data.doubleVision.controlled)};
								{#if data.doubleVision.controlled === 'no'}
									Same for 6 months: {formatYesNo(data.doubleVision.sameForSixMonthsOrMore)};
								{/if}
								Declaration confirmed: {data.doubleVision.doubleVisionDeclarationConfirmed ? 'Yes' : 'No'};
								Signed by: {data.doubleVision.declarationSignatureName || '—'};
								Date: {formatDateUk(data.doubleVision.declarationDate) || '—'}
							</dd>
						{/if}
					</div>
					<div>
						<dt class="font-semibold text-gray-700">Q10 — Other vision conditions</dt>
						<dd>{formatYesNo(data.otherVisionConditions.hasOther)}</dd>
						{#if data.otherVisionConditions.hasOther === 'yes'}
							<dd class="ml-4 text-gray-600 whitespace-pre-line">
								{data.otherVisionConditions.details || '—'}
							</dd>
						{/if}
					</div>
					<div>
						<dt class="font-semibold text-gray-700">Q11 — Recent contact</dt>
						<dd>
							{formatYesNo(data.recentContact.hadContact)}
							{#if data.recentContact.hadContact === 'yes'}
								— {formatDateUk(data.recentContact.dateOfContact) || '—'}
							{/if}
						</dd>
					</div>
				</dl>
			</section>

			<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="text-lg font-bold text-gray-900">Authorisation</h2>
				<dl class="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
					<div><dt class="text-gray-500">Declaration confirmed</dt><dd>{data.authorisation.declarationConfirmed ? 'Yes' : 'No'}</dd></div>
					<div><dt class="text-gray-500">Name</dt><dd>{data.authorisation.name || '—'}</dd></div>
					<div><dt class="text-gray-500">Signature</dt><dd>{data.authorisation.signature || '—'}</dd></div>
					<div><dt class="text-gray-500">Date</dt><dd>{formatDateUk(data.authorisation.date) || '—'}</dd></div>
					<div><dt class="text-gray-500">Electronic correspondence</dt><dd>{formatYesNo(data.authorisation.authoriseElectronicCorrespondence)}</dd></div>
					<div><dt class="text-gray-500">Contact via HCP</dt><dd>{contactPreferenceLabel(data.authorisation.contactPreferenceFromHealthcareProfessional) || '—'}</dd></div>
					<div><dt class="text-gray-500">Contact from DVLA</dt><dd>{contactPreferenceLabel(data.authorisation.contactPreferenceFromDvla) || '—'}</dd></div>
				</dl>
			</section>
		{/if}
	</main>
</div>
