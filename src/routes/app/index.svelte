<script context="module" lang="ts">
	import { appwrite, fetchAuthStatus, type Profile } from '$lib/appwrite';

	export async function load(req: any) {
		const profiles = await appwrite.database.listDocuments(
			'profiles',
			undefined,
			50,
			undefined,
			undefined,
			undefined,
			['$id'],
			['DESC']
		);
		return {
			props: {
				pofiles: profiles.documents
			}
		};
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import { authStore } from '$lib/auth';
	import Loader from '$lib/Loader.svelte';

	export let pofiles: Profile[];

	let processingPage = false;
	let hasNextPage = true;
	let offset = 0;
	async function loadNextPage() {
		if (processingPage) {
			return;
		}

		try {
			processingPage = true;
			const newProfiles = await appwrite.database.listDocuments<Profile>(
				'profiles',
				undefined,
				50,
				offset + 50,
				undefined,
				undefined,
				['$id'],
				['DESC']
			);

			if (newProfiles.documents.length <= 0) {
				hasNextPage = false;
			}

			pofiles.push(...newProfiles.documents);
			pofiles = pofiles;

			offset += 50;
		} catch (err: any) {
			alert(err.message ?? err);
		} finally {
			processingPage = false;
		}
	}

	let processingLogout = false;
	async function onLogout() {
		if (processingLogout) {
			return;
		}

		try {
			processingLogout = true;
			await appwrite.account.deleteSession('current');

			authStore.setProfile(undefined);
			authStore.setUser(undefined);

			goto('/');
		} catch (err: any) {
			alert(err.message ?? err);
		} finally {
			processingLogout = false;
		}
	}
</script>

<h1 class="text-4xl font-bold text-slate-800">
	Welcome {$authStore.profile?.nickname}
</h1>
<h2 class="mb-10 text-lg font-bold text-slate-400">
	whose favourite number is {$authStore.profile?.favouriteNumber}.
</h2>

<p class="mb-8 text-lg text-slate-800">
	You can now follow other users. When you follow someone, they get notified using Novu. Do you want
	to get notified? Share your profile and get followed by your friends.
</p>

<div
	class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 items-start sm:items-center justify-start sm:space-x-3"
>
	<a href={'/app/profiles/' + $authStore.profile?.$id}>
		<button
			type="button"
			class="flex items-center justify-center space-x-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-10 py-3"
		>
			<span>My Profile</span>
		</button>
	</a>
	<button
		on:click={onLogout}
		type="button"
		class="flex items-center justify-center space-x-3 bg-pink-200 hover:bg-pink-300 text-pink-500 rounded-xl px-10 py-3"
	>
		{#if processingLogout}
			<Loader />
		{/if}
		<span>Logout</span>
	</button>
</div>

<div class="h-1 w-full rounded-full bg-slate-100 my-8" />

<h1 class="text-4xl font-bold text-slate-800">Recently created profiles</h1>

<div class="flex flex-col space-y-4 py-4">
	{#each pofiles as profile, index}
		<div class="flex items-center justify-start space-x-2">
			<div class="flex items-end justify-start space-x-2">
				<span class="text-pink-500 font-bold text-3xl">{index + 1}.</span>
				<p class="text-slate-800 text-xl">{profile.nickname}</p>
			</div>
			<a href={'/app/profiles/' + profile.$id} class="bg-slate-300 text-slate-600 rounded-full p-1">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
				</svg>
			</a>
		</div>
	{/each}

	{#if hasNextPage}
		<button
			on:click={loadNextPage}
			type="button"
			class=" w-full flex items-center justify-center space-x-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-10 py-3"
		>
			{#if processingPage}
				<Loader />
			{/if}
			<span>Load More</span>
		</button>
	{/if}
</div>
