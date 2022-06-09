<script context="module" lang="ts">
	import { fetchAuthStatus } from '$lib/appwrite';
	import { authStore } from '$lib/auth';

	export async function load() {
		await fetchAuthStatus();
		return {};
	}
</script>

<script>
	import { page } from '$app/stores';
	import '../app.css';
</script>

<div class="max-w-[770px] w-full mx-auto p-4 md:pt-12">
	<a
		class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row items-center justify-start sm:space-x-3"
		href={$authStore.profile && $authStore.user ? '/app' : '/'}
	>
		{#if $page.url.pathname !== ($authStore.profile && $authStore.user ? '/app' : '/')}
			<div class="bg-slate-300 text-slate-600 rounded-full p-1">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4 transform rotate-180"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
				</svg>
			</div>
		{/if}

		<h1 class="text-4xl font-bold text-slate-800 text-center sm:text-left">Appwrite ❤️ Novu</h1></a
	>

	<div class="h-1 w-full rounded-full bg-slate-100 my-8" />

	<slot />
</div>
