<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Timer from './Timer.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Timer',
    component: Timer,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Timer'}}
>
  <p>Timer content</p>
</Story>
