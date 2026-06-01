<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BulgariaEdinenGrazhdanskiNomerInput from './BulgariaEdinenGrazhdanskiNomerInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/BulgariaEdinenGrazhdanskiNomerInput',
    component: BulgariaEdinenGrazhdanskiNomerInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Bulgaria Edinen Grazhdanski Nomer Input'}}
/>
