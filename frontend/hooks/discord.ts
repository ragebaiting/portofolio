import { useEffect, useRef, useState } from "react";

export interface DiscordData {
	discord_status: string;
	activities: any[];
	discord_user: {
		username: string;
		avatar: string;
		id: string;
		discriminator: string;
		display_name?: string;
	};
}

class DiscordFetch {
	private _active = true;
	private _setDiscord: React.Dispatch<React.SetStateAction<DiscordData | null>>;
	private _setLoading: React.Dispatch<React.SetStateAction<boolean>>;

	constructor(
		setDiscord: React.Dispatch<React.SetStateAction<DiscordData | null>>,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>
	) {
		this._setDiscord = setDiscord;
		this._setLoading = setLoading;
	}

	public deactivate() {
		this._active = false;
	}

	public async fetch() {
		this._setLoading(true);
		try {
			const res = await fetch("http://localhost:3001/api/lanyard");
			const data = await res.json();
			if (data && data.discord_user && this._active) {
				this._setDiscord(data);
			} else if (this._active) {
				this._setDiscord(null);
			}
		} catch {
			if (this._active) this._setDiscord(null);
		}
		this._setLoading(false);
	}
}

export function discord() {
	const [discord, setDiscord] = useState<DiscordData | null>(null);
	const [loading, setLoading] = useState(true);
	const fetcherRef = useRef<DiscordFetch | null>(null);

	useEffect(() => {
		const fetcher = new DiscordFetch(setDiscord, setLoading);
		fetcherRef.current = fetcher;
		fetcher.fetch();
		const interval = setInterval(() => fetcher.fetch(), 5000);
		return () => {
			fetcher.deactivate();
			clearInterval(interval);
		};
	}, []);

	return { discord, loading };
}
