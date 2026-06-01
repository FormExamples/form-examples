<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Editable from './Editable.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Editable',
    component: Editable,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Editable'}}
/>
