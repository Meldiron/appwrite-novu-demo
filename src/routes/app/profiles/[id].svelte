<script context="module" lang="ts">
	import { appwrite, fetchAuthStatus, type Follow, type Profile } from '$lib/appwrite';
	import { authStore } from '$lib/auth';
	import { get } from 'svelte/store';

	export async function load(req: any) {
		const profile = await appwrite.database.getDocument('profiles', req.params.id);

		let follow: Follow | undefined;
		try {
			const selfProfileId = get(authStore).profile?.$id;
			if (selfProfileId) {
				const followResponse = await appwrite.database.listDocuments<Follow>('follows', [
					Query.equal('followBy', selfProfileId),
					Query.equal('followTo', profile.$id)
				]);
				follow = followResponse.documents[0];
			}
		} catch (err) {
			console.warn(err);
			// Okay, follow not there
		}

		return {
			props: {
				profile,
				follow
			}
		};
	}
</script>

<script lang="ts">
	import Loader from '$lib/Loader.svelte';
	import { Query } from 'appwrite';

	export let profile: Profile;
	export let follow: Follow | undefined;

	function getDateVerbose(d: number) {
		const date = new Date(d * 1000);
		const monthNames = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		];

		return `${monthNames[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
	}

	let processingFollow = false;
	async function onFollow() {
		if (processingFollow) {
			return;
		}

		try {
			processingFollow = true;

			follow = await appwrite.database.createDocument<Follow>('follows', 'unique()', {
				createdAt: Math.round(Date.now() / 1000),
				followBy: $authStore.profile?.$id,
				followTo: profile.$id
			});
		} catch (err: any) {
			alert(err.message ?? err);
		} finally {
			processingFollow = false;
		}
	}
</script>

<h1 class="text-4xl font-bold text-slate-800">
	This is {profile.nickname}
</h1>
<h2 class="mb-10 text-lg font-bold text-slate-400">
	whose favourite number is {profile.favouriteNumber}.
</h2>

{#if profile.$id === $authStore.profile?.$id}
	<p class="mb-8 text-lg text-slate-400">You cannot follow yourself!</p>
{:else if follow}
	<p class="mb-8 text-lg text-pink-500">
		You are already following {profile.nickname} since
		<b class="font-bold">{getDateVerbose(follow.createdAt)}</b>!
	</p>
{:else}
	<button
		on:click={onFollow}
		type="button"
		class="flex items-center justify-center space-x-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-10 py-3"
	>
		{#if processingFollow}
			<Loader />
		{/if}
		<span>Follow {profile.nickname}</span>
	</button>
{/if}
