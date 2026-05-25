<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ReviewDate from './ReviewDate.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ReviewDate',
    component: ReviewDate,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Review Date'}}
>
  <span>View content</span>
</Story>
