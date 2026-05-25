<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SwitchButton from './SwitchButton.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SwitchButton',
    component: SwitchButton,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Switch Button'}}
/>
