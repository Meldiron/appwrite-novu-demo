<script lang="ts">
	import { goto } from '$app/navigation';

	import { authStore } from '$lib/auth';
	import { onMount } from 'svelte';

	$: isAllowed = $authStore.profile && $authStore.user;

	onMount(() => {
		if (!isAllowed) {
			return goto('/');
		}

		initNovu($authStore.user);
	});
</script>

{#if isAllowed}
	<slot />
{/if}

<div class="fixed top-4 right-10">
	<nav>
		<div id="notification-bell" class=" cursor-pointer rounded-full bg-pink-100 text-pink-500 p-3">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-7 w-7"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
				/>
			</svg>
			<span id="unseen-badge" />
		</div>
	</nav>
</div>
