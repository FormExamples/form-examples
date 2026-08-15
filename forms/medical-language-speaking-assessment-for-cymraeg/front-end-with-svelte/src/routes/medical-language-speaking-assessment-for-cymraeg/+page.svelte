<script lang="ts">
	// Welcome page: explains the work and offers prominent links to the two
	// working surfaces — the examiner form and the exam-admin dashboard. All
	// user-facing chrome resolves through the i18n message layer (en / cy).
	import { locale } from '#lib/i18n/locale.svelte.js';
	const t = locale.t;
	const plural = 'medical-language-speaking-assessments-for-cymraeg';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href={`/${plural}/new`}
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">{t('startNewAssessment')}</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				{t('startBody')}
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">{t('startCta')}</span>
		</a>
		<a
			href={`/${plural}`}
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">{t('dashboardTitle')}</h2>
			<p class="mt-2 text-sm text-base-content/70">
				{t('dashboardBody')}
			</p>
			<span class="mt-4 inline-block text-sm font-semibold text-primary">{t('dashboardCta')}</span>
		</a>
	</div>

	<section class="mt-12">
		<h2 class="text-lg font-semibold text-base-content">{t('aboutThisWork')}</h2>
		<dl class="mt-4 space-y-4 text-sm">
			<div>
				<dt class="font-semibold text-base-content">{t('purpose')}</dt>
				<dd class="mt-1 text-base-content/70">
					{t('purposeBody')}
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">{t('specification')}</dt>
				<dd class="mt-1 text-base-content/70">
					{t('specificationBody')}
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">{t('documentation')}</dt>
				<dd class="mt-1 text-base-content/70">
					{t('documentationBody')}
				</dd>
			</div>
		</dl>
	</section>
</main>
