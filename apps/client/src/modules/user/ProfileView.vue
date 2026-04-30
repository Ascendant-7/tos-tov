<template>
	<div class="profile-page">
		<header class="topbar animate-fade-in">
			<div class="page-title">My Profile</div>
			<div class="topbar-actions">
				<label class="search">
					<span class="search-icon">&#128269;</span>
					<input type="text" placeholder="Search destinations..." />
				</label>
				<button class="icon-btn" aria-label="Notifications">
					<span class="dot"></span>
					&#128276;
				</button>
				<div class="avatar-pill">YO</div>
			</div>
		</header>

		<section class="profile-card animate-scale-in">
			<div class="cover">
				<img
					src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop"
					alt="Landscape cover"
				/>
				<button class="cover-camera" aria-label="Change cover">&#128247;</button>
			</div>

			<div class="profile-body">
				<div class="profile-row">
					<div class="avatar">
						<span>YO</span>
						<span class="online"></span>
					</div>
					<div class="profile-info">
						<h2>Your Name</h2>
						<p class="location">Based in Phnom Penh, Cambodia</p>
						<p class="bio">
							Passionate explorer, street food lover, and adventure seeker. Cambodia is my forever home base.
						</p>
					</div>
					<button class="edit-btn">Edit Profile</button>
				</div>

				<div class="stats">
					<div>
						<strong>7</strong>
						<span>Trips Created</span>
					</div>
					<div>
						<strong>12</strong>
						<span>Places Visited</span>
					</div>
					<div>
						<strong>3</strong>
						<span>Countries</span>
					</div>
					<div>
						<strong>4.2k</strong>
						<span>Km Traveled</span>
					</div>
				</div>
			</div>
		</section>

		<div class="tabs animate-fade-in-up">
			<button class="tab active">Trips</button>
			<button class="tab">Saved</button>
			<button class="tab">History</button>
			<button class="tab">Achievements</button>
		</div>

		<section class="trip-list">
			<article class="trip-card animate-fade-in-up delay-2">
				<img
					src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=400&auto=format&fit=crop"
					alt="Koh Rong"
				/>
				<div class="trip-info">
					<h3>Phnom Penh -&gt; Koh Kong -&gt; Koh Rong</h3>
					<div class="trip-meta">
						<span>7 days</span>
						<span class="pill planned">Planned</span>
					</div>
				</div>
				<button class="kebab" aria-label="More">&#8942;</button>
			</article>

			<article class="trip-card animate-fade-in-up delay-3">
				<img
					src="https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=400&auto=format&fit=crop"
					alt="Siem Reap"
				/>
				<div class="trip-info">
					<h3>Siem Reap Temple Circuit</h3>
					<div class="trip-meta">
						<span>4 days</span>
						<span class="pill completed">Completed</span>
					</div>
				</div>
				<button class="kebab" aria-label="More">&#8942;</button>
			</article>

			<article class="trip-card animate-fade-in-up delay-4">
				<img
					src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=400&auto=format&fit=crop"
					alt="Kampot"
				/>
				<div class="trip-info">
					<h3>Secret Kampot Weekend</h3>
					<div class="trip-meta">
						<span>3 days</span>
						<span class="pill draft">Draft</span>
					</div>
				</div>
				<button class="kebab" aria-label="More">&#8942;</button>
			</article>
		</section>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped>
.profile-page {
	font-family: var(--font-sans);
	padding: 28px 32px 64px;
	min-height: 100vh;
	background: radial-gradient(circle at 20% 10%, #f7f2ea 0%, #f9f7f3 40%, #f4f1ec 100%);
	color: #1a1a1a;
}

.topbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24px;
}

.page-title {
	font-size: 26px;
	color: #2b2b2b;
}

.topbar-actions {
	display: flex;
	align-items: center;
	gap: 12px;
}

.search {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 14px;
	border-radius: 999px;
	background: #efeae1;
	color: #8b857e;
	min-width: 260px;
}

.search input {
	border: none;
	outline: none;
	background: transparent;
	width: 100%;
	font-size: 14px;
	color: #5a554f;
}

.search-icon {
	font-size: 14px;
}

.icon-btn {
	position: relative;
	width: 38px;
	height: 38px;
	border-radius: 999px;
	background: #f4f0e9;
	border: 1px solid #e3ddd3;
	display: grid;
	place-items: center;
	font-size: 16px;
}

.icon-btn .dot {
	position: absolute;
	top: 6px;
	right: 6px;
	width: 8px;
	height: 8px;
	background: #f26b5e;
	border-radius: 50%;
}

.avatar-pill {
	width: 38px;
	height: 38px;
	border-radius: 50%;
	background: #0f4f3f;
	color: #fff;
	display: grid;
	place-items: center;
	font-weight: 600;
}

.profile-card {
	background: #fff;
	border-radius: 20px;
	overflow: hidden;
	box-shadow: 0 16px 40px rgba(20, 20, 20, 0.08);
	border: 1px solid #efe9df;
}

.cover {
	position: relative;
	height: 160px;
	overflow: hidden;
}

.cover img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transform: scale(1.02);
}

.cover-camera {
	position: absolute;
	right: 16px;
	bottom: 14px;
	width: 34px;
	height: 34px;
	border-radius: 10px;
	background: rgba(255, 255, 255, 0.9);
	border: 1px solid #e0d9cf;
	display: grid;
	place-items: center;
}

.profile-body {
	padding: 22px 28px 20px;
}

.profile-row {
	display: grid;
	grid-template-columns: auto 1fr auto;
	gap: 18px;
	align-items: center;
}

.avatar {
	width: 64px;
	height: 64px;
	border-radius: 18px;
	background: #0f4f3f;
	display: grid;
	place-items: center;
	color: #fff;
	font-weight: 700;
	position: relative;
}

.avatar .online {
	position: absolute;
	right: -2px;
	bottom: -2px;
	width: 14px;
	height: 14px;
	border-radius: 50%;
	background: #28c76f;
	border: 2px solid #fff;
}

.profile-info h2 {
	font-size: 20px;
	margin-bottom: 4px;
}

.location {
	font-size: 13px;
	color: #8a847c;
	margin-bottom: 6px;
}

.bio {
	font-size: 14px;
	color: #6f6a63;
}

.edit-btn {
	border: 1px solid #e1d9ce;
	background: #f8f4ee;
	padding: 8px 14px;
	border-radius: 999px;
	font-weight: 600;
	font-size: 13px;
}

.stats {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 12px;
	text-align: center;
	margin-top: 18px;
	padding-top: 16px;
	border-top: 1px solid #f1ece4;
}

.stats strong {
	font-size: 18px;
	display: block;
	color: #2b2b2b;
}

.stats span {
	font-size: 12px;
	color: #8a847c;
}

.tabs {
	display: inline-flex;
	gap: 12px;
	padding: 8px;
	margin: 22px 0;
	background: #f1ebe2;
	border-radius: 999px;
}

.tab {
	border: none;
	background: transparent;
	padding: 8px 18px;
	font-size: 13px;
	color: #6f6962;
	border-radius: 999px;
}

.tab.active {
	background: #fff;
	color: #2c2925;
	box-shadow: 0 6px 16px rgba(20, 20, 20, 0.08);
}

.trip-list {
	display: grid;
	gap: 14px;
}

.trip-card {
	display: grid;
	grid-template-columns: auto 1fr auto;
	gap: 16px;
	align-items: center;
	padding: 14px 18px;
	background: #fff;
	border: 1px solid #eee7de;
	border-radius: 18px;
	box-shadow: 0 10px 24px rgba(20, 20, 20, 0.05);
}

.trip-card img {
	width: 64px;
	height: 64px;
	border-radius: 16px;
	object-fit: cover;
}

.trip-info h3 {
	font-size: 15px;
	margin-bottom: 6px;
}

.trip-meta {
	display: flex;
	gap: 12px;
	align-items: center;
	font-size: 12px;
	color: #8a847c;
}

.pill {
	padding: 4px 10px;
	border-radius: 999px;
	font-weight: 600;
	font-size: 11px;
}

.pill.planned {
	background: #e6f3ff;
	color: #3478f6;
}

.pill.completed {
	background: #e5f8ef;
	color: #2b9f62;
}

.pill.draft {
	background: #f8eee1;
	color: #a86a27;
}

.kebab {
	width: 32px;
	height: 32px;
	border-radius: 10px;
	border: 1px solid #ede6dc;
	background: #f8f4ee;
	display: grid;
	place-items: center;
	font-size: 18px;
}

@media (max-width: 960px) {
	.profile-row {
		grid-template-columns: 1fr;
		text-align: center;
	}

	.profile-info {
		order: 2;
	}

	.edit-btn {
		order: 3;
		justify-self: center;
	}

	.stats {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.trip-card {
		grid-template-columns: 1fr;
		text-align: left;
	}

	.trip-card img {
		width: 100%;
		height: 140px;
	}
}

@media (max-width: 640px) {
	.profile-page {
		padding: 20px 16px 48px;
	}

	.topbar {
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
	}

	.search {
		width: 100%;
	}

	.tabs {
		width: 100%;
		overflow-x: auto;
	}
}
</style>
