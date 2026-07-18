<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the triage form and the clinician
	// dashboard.
	const plural = 'emergency-department-triage-notes';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Emergency Department Triage Note
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			First-contact ED triage classification
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A first-contact emergency-department triage assessment, completed as a single continuous
			wizard, that <strong>classifies</strong> the patient into one of the five Manchester Triage
			System priority levels using vital signs, pain score, and discriminators, with NEWS2-based
			escalation.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/emergency-department-triage-note/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new triage</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step ED triage note. One continuous single-page wizard that classifies the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/emergency-department-triage-note/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse triaged patients with their MTS priority level, category, target time, supporting
				NEWS2 aggregate, and flag count.
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
					Capture the triage findings — arrival, presenting complaint, brief history, triage vital
					signs, pain score, and Manchester Triage System discriminators — and produce a graded
					report: the MTS priority level (1 Immediate, 2 Very urgent, 3 Urgent, 4 Standard, 5
					Non-urgent) with target time, fired discriminators, a supporting NEWS2 aggregate, and
					flagged issues, to support timely clinical prioritisation and escalation. This is a
					classification, not a summed score — the most urgent finding wins.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the classification engine (MTS
					discriminators plus NEWS2 escalation, most-urgent-wins), and the flag rules. The same
					engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the Manchester Triage Group's Emergency Triage (3rd ed.), the Royal College of
					Physicians' NEWS2 (2017), and NICE NG51 (sepsis). A decision-support aid, not a diagnosis.
				</dd>
			</div>
		</dl>
	</section>
</main>
