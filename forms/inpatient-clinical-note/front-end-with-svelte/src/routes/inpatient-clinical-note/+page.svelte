<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the inpatient clinical note form and
	// the ward dashboard.
	const plural = 'inpatient-clinical-notes';
</script>

<main class="mx-16 px-4 py-12">
	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/inpatient-clinical-note/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new note</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step inpatient clinical note. One continuous single-page wizard covering
				eight note types, grading completeness and banding acuity as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/inpatient-clinical-note/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Ward dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse notes with their computed completeness status and acuity band side by side, and
				filter by completeness, acuity, and ward.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold text-primary">Open the dashboard →</span>
		</a>
	</div>

	<section class="mt-12">
		<h2 class="text-lg font-semibold text-base-content">About this work</h2>
		<dl class="mt-4 space-y-4 text-sm">
			<div>
				<dt class="font-semibold text-base-content">Purpose</dt>
				<dd class="mt-1 text-base-content/70">
					Record one clinical note against an admission episode. A single schema covers all eight
					note types a ward team produces — admission clerking, progress, consult, event, bedside
					procedure, handover, transfer, and discharge planning — across twelve components: note
					header, interval history, observations and NEWS2, examination, investigations reviewed,
					problem list, medications, risk assessments, impression, plan and jobs, escalation, and
					communication.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Two engines</dt>
				<dd class="mt-1 text-base-content/70">
					The <strong>completeness</strong> engine grades the record Complete, Partial, or
					Incomplete against the components required <em>for the note type chosen</em>, and reports
					a percentage; an explicit negative such as "no medication changes" counts as documented.
					The <strong>acuity</strong> engine assigns a Stable, Watch, Escalate, or Critical band by
					taking the worst finding across NEWS2 and the deterioration markers. Safety flags fire
					independently of both. The acuity band is overridable by the author with a recorded
					reason; the completeness status is not, because it is a mechanical property of the
					record.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, both engines, and the flag
					rules. The same engine grades the form, the report, and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Grounded in GMC Good Medical Practice record-keeping, the AoMRC record standards, RCP
					NEWS2 (2017), and NICE NG89 (VTE), NG51 (sepsis), CG103 (delirium), CG179 (pressure
					ulcers), and NG15 (antimicrobial stewardship). A documentation and escalation-prompting
					aid — not a diagnosis, not a deterioration prediction, and not a substitute for clinical
					judgement. A Complete grade means the record is well documented for handover, not that
					the clinical care itself was correct.
				</dd>
			</div>
		</dl>
	</section>
</main>
