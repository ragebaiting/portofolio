import { useEffect, useRef, useState } from "react";

export interface SpotifyData {
	album: string;
	album_art_url: string;
	artist: string;
	song: string;
	track_id: string;
}

class SpotifyFetch {
	private _active = true;
	private _setSpotify: React.Dispatch<React.SetStateAction<SpotifyData | null>>;
	private _setLoading: React.Dispatch<React.SetStateAction<boolean>>;

	constructor(
		setSpotify: React.Dispatch<React.SetStateAction<SpotifyData | null>>,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>
	) {
		this._setSpotify = setSpotify;
		this._setLoading = setLoading;
	}

	public deactivate() {
		this._active = false;
	}

	public async fetch() {
		this._setLoading(true);
		try {
			const res = await fetch("https://rest.clt.lol/api/lanyard");
			const data = await res.json();
			if (data && data.spotify && this._active) {
				this._setSpotify(data.spotify);
			} else if (this._active) {
				this._setSpotify(null);
			}
		} catch {
			if (this._active) this._setSpotify(null);
		}
		this._setLoading(false);
	}
}

export function spotify() {
	const [spotify, setSpotify] = useState<SpotifyData | null>(null);
	const [loading, setLoading] = useState(true);
	const fetcherRef = useRef<SpotifyFetch | null>(null);

	useEffect(() => {
		const fetcher = new SpotifyFetch(setSpotify, setLoading);
		fetcherRef.current = fetcher;
		fetcher.fetch();
		const interval = setInterval(() => fetcher.fetch(), 5000);
		return () => {
			fetcher.deactivate();
			clearInterval(interval);
		};
	}, []);

	return { spotify, loading };
}

