<script lang="ts">
	import { goto } from '$app/navigation';
	import Loader from '$lib/Loader.svelte';

	import { appwrite, type Profile } from '$lib/appwrite';
	import { authStore } from '$lib/auth';
	import { onMount } from 'svelte';

	$: isAuthorized = $authStore.profile && $authStore.user;

	onMount(() => {
		if (isAuthorized) {
			goto('/app');
		}
	});

	let registerMail = '';
	let registerPassword = '';
	let registerNickname = '';
	let registerNumber = '';
	let registerProcessing = false;

	let loginMail = '';
	let loginPassword = '';
	let loginProcessing = false;

	async function onRegister() {
		if (registerProcessing) {
			return;
		}

		try {
			registerProcessing = true;

			const user = await appwrite.account.create('unique()', registerMail, registerPassword);
			const _session = await appwrite.account.createSession(registerMail, registerPassword);

			const profile = await appwrite.database.createDocument<Profile>('profiles', user.$id, {
				nickname: registerNickname,
				favouriteNumber: +registerNumber
			});

			authStore.setUser(user);
			authStore.setProfile(profile);

			goto('/app');
		} catch (err: any) {
			console.error(err);
			alert(err.message ?? err);
		} finally {
			registerProcessing = false;
		}
	}

	async function onLogin() {
		if (loginProcessing) {
			return;
		}

		try {
			loginProcessing = true;

			const _session = await appwrite.account.createSession(loginMail, loginPassword);

			const user = await appwrite.account.get();
			const profile = await appwrite.database.getDocument<Profile>('profiles', user.$id);

			authStore.setUser(user);
			authStore.setProfile(profile);

			goto('/app');
		} catch (err: any) {
			console.error(err);
			alert(err.message ?? err);
		} finally {
			loginProcessing = false;
		}
	}
</script>

<p class="mb-8 text-lg text-slate-800">
	Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae soluta quod labore consectetur
	quos? Quo illum repellat, aut blanditiis consectetur optio quasi aperiam rerum, esse culpa, eius
	sequi eligendi expedita.
</p>

<p class="mb-8 text-lg text-slate-400">
	Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore excepturi at asperiores! Dolor
	voluptas aspernatur ipsam reiciendis eum vero libero cumque sint distinctio dolorum, quasi labore
	pariatur rerum quam voluptates.
</p>

<h2 class="text-2xl font-bold text-slate-800 mb-8 mt-8">Let's Create Account!</h2>

<p class="mb-8 text-lg text-slate-800">
	Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus voluptates accusantium
	necessitatibus, magni laborum placeat sint aliquam commodi dolorum quod quis perspiciatis eum?
	Aliquam earum repudiandae sunt. Provident, veritatis reiciendis.
</p>

<p class="mb-8 text-lg text-slate-400">
	Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus voluptates accusantium
	necessitatibus, magni laborum placeat sint aliquam commodi dolorum quod quis perspiciatis eum?
	Aliquam earum repudiandae sunt. Provident, veritatis reiciendis.
</p>

<div class="grid grid-cols-6 md:grid-cols-12 gap-12">
	<form on:submit|preventDefault={onRegister} class="col-span-6 flex flex-col space-y-3">
		<h2 class="text-lg text-pink-500 uppercase">New user? Register!</h2>

		<input
			bind:value={registerMail}
			class="w-full bg-pink-50 p-3 rounded-xl border-2 border-pink-300 placeholder-pink-300 text-pink-500 focus:outline-none focus:ring ring-pink-500"
			type="email"
			required={true}
			placeholder="Your e-mail address"
		/>
		<input
			bind:value={registerPassword}
			class="w-full bg-pink-50 p-3 rounded-xl border-2 border-pink-300 placeholder-pink-300 text-pink-500 focus:outline-none focus:ring ring-pink-500"
			type="password"
			required={true}
			placeholder="Your password"
		/>
		<input
			bind:value={registerNickname}
			class="w-full bg-pink-50 p-3 rounded-xl border-2 border-pink-300 placeholder-pink-300 text-pink-500 focus:outline-none focus:ring ring-pink-500"
			type="text"
			required={true}
			placeholder="Your nickname"
		/>
		<input
			bind:value={registerNumber}
			class="w-full bg-pink-50 p-3 rounded-xl border-2 border-pink-300 placeholder-pink-300 text-pink-500 focus:outline-none focus:ring ring-pink-500"
			type="number"
			required={true}
			placeholder="Your favourite number"
		/>
		<button
			type="submit"
			class="flex items-center justify-center space-x-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-10 py-3"
		>
			{#if registerProcessing}
				<Loader />
			{/if}

			<span>Register</span>
		</button>
	</form>

	<form on:submit|preventDefault={onLogin} class="col-span-6 flex flex-col space-y-3">
		<h2 class="text-lg text-pink-500 uppercase">Existing user? Login!</h2>

		<input
			class="w-full bg-pink-50 p-3 rounded-xl border-2 border-pink-300 placeholder-pink-300 text-pink-500 focus:outline-none focus:ring ring-pink-500"
			type="email"
			required={true}
			bind:value={loginMail}
			placeholder="Your e-mail address"
		/>
		<input
			class="w-full bg-pink-50 p-3 rounded-xl border-2 border-pink-300 placeholder-pink-300 text-pink-500 focus:outline-none focus:ring ring-pink-500"
			type="password"
			required={true}
			bind:value={loginPassword}
			placeholder="Your password"
		/>
		<button
			type="submit"
			class="flex items-center justify-center space-x-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-10 py-3"
		>
			{#if loginProcessing}
				<Loader />
			{/if}
			<span>Login</span>
		</button>
	</form>
</div>
