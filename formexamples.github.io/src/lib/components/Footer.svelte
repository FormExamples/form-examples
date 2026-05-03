<script lang="ts">
  import { REPO_URL } from '$lib/site';
  const year = new Date().getFullYear();
</script>

<footer class="mt-16 border-t border-slate-200 py-8 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
  <div class="px-4 sm:px-6">
    © {year} —
    <a href={REPO_URL} rel="noopener noreferrer">medical-forms on GitHub</a>
  </div>
</footer>
