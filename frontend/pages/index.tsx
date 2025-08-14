
// u can steal this in 2 years i probably would of killed myself by then 

import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { spotify } from '../hooks/spotify';
import { discord } from '../hooks/discord';
import { time } from '../hooks/time';
import { FaGithub, FaDiscord, FaTwitter } from 'react-icons/fa';
import { SiRoblox } from 'react-icons/si';

const Status = {
  dnd: { text: 'text-red-500', bg: 'bg-red-500' },
  idle: { text: 'text-yellow-500', bg: 'bg-yellow-500' },
  online: { text: 'text-green-500', bg: 'bg-green-500' },
  offline: { text: 'text-gray-500', bg: 'bg-gray-500' },
  default: { text: 'text-gray-500', bg: 'bg-gray-500' },
} as const;

type StatusKey = keyof typeof Status;

const getStatus = (status: string) => Status[(status as StatusKey) || 'default'] ?? Status.default;

const StatusDot = ({ status }: { status: string }) => {
  const color = getStatus(status).bg;
  return (
    <span className="relative flex h-2 w-2 mr-2 items-center justify-center">
      <span className={`animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] absolute inline-flex h-full w-full rounded-full opacity-75 ${color}`} />
      <span className={`relative inline-flex rounded-full h-1 w-1 ${color} items-center justify-center`} />
    </span>
  );
};

const useClock = () => {
  const now = time();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const isSleeping = hour < 9 && hour >= 1;
  const timeStr = `${hour % 12 === 0 ? 12 : hour % 12}:${minute.toString().padStart(2, '0')}${hour < 12 ? 'AM' : 'PM'}`;
  return { hour, minute, isSleeping, timeStr };
};

const Home: NextPage = () => {
  const { spotify: spotifyData } = spotify();
  const [loading, setLoading] = useState(false);

  const { discord: discordData } = discord();
  const [discordLoading, setDiscordLoading] = useState(false);

  const { isSleeping, timeStr } = useClock();
  const [timeLoading, setTimeLoading] = useState(false);

  const [descLoading, setDescLoading] = useState(false);
  const description = [
    "clt, backend-focused software engineer, based around next.js, fluent in langs such as rust, elixir, typescript."
  ];

  const [expLoading, setExpLoading] = useState(false);
  const experiences = [
    { role: "Lead Dev @ Datawave (2023 - 2024)" }
  ];

  return (
    <>
      <Head>
        <title>x_x</title>
        <meta name="description" content="Security Enthusiast, Software Engineer." />
        <meta name="theme-color" content="#ffffff" /> 

        <meta property="og:title" content="clt.lol" />
        <meta property="og:description" content="Security Enthusiast, Software Engineer." />
        <meta property="og:image" content="https://clt.lol/img/pfp.jpg" />
        <meta property="og:url" content="https://clt.lol/" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="clt.lol" />
        <meta name="twitter:description" content="Security Enthusiast, Software Engineer." />
        <meta name="twitter:image" content="https://clt.lol/img/pfp.jpg" />
      </Head>

      <div className="flex flex-col min-h-screen bg-zinc-950" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        <main className="flex-1 p-20">
          <div className="w-full">
          <div className="w-20 h-20 rounded-md mb-2 flex items-center justify-center overflow-hidden">
            {descLoading ? (
              <div className="w-full h-full bg-zinc-700/40 animate-pulse" />
            ) : (
              <img src="/img/pfp.jpg" alt="Profile" className="w-full h-full object-cover" />
            )}
          </div>
          <h1
            className="text-white text-4xl leading-snug"
            style={{ fontFamily: 'Crimson Pro, serif' }}
          >
            Cybersec <span className="italic">Analyst</span>,<br />
            Full-Stack Software <span className="italic">Engineer</span>.
          </h1>
          {descLoading ? (
            <div className="w-[350px] h-4 bg-zinc-700/40 rounded animate-pulse mb-14 mt-5" />
          ) : (
            description.map((desc, i) => (
              <p key={i} className="text-zinc-500/80 max-w-[500px] mb-14 text-sm font-thin mt-5">{desc}</p>
            ))
          )}
          {loading ? (
            <div className="flex items-center gap-3 mb-10">
              <div className="w-14 h-14 rounded bg-zinc-700/40 animate-pulse" />
              <div className="flex flex-col gap-1">
                <div className="w-40 h-4 bg-zinc-700/40 rounded animate-pulse" />
                <div className="w-24 h-3 bg-zinc-700/20 rounded animate-pulse" />
              </div>
            </div>
          ) : spotifyData ? (
            <div className="flex items-center gap-3 mb-10">
              <img
                src={spotifyData.album_art_url}
                alt="Album Art"
                className="w-14 h-14 rounded"
              />
              <div>
                <p className="text-green-500 text-xs">
                  Listening to <span className="font-semibold">{spotifyData.song}</span> by {spotifyData.artist}
                </p>
                <p className="text-zinc-400/40 text-[10px]">Album: {spotifyData.album}</p>
              </div>
            </div>
          ) : (
            <p className="text-green-500 text-xs mt-5">[Spotify] Not listening to anything :(</p>
          )}
          <p className="text-zinc-400/50 text-sm font-semibold mt-5">/ Experiences</p>
          {expLoading ? (
            <div className="ml-3 flex flex-col gap-2">
              <div className="w-48 h-3 bg-zinc-700/40 rounded animate-pulse" />
              <div className="w-32 h-3 bg-zinc-700/20 rounded animate-pulse" />
            </div>
          ) : (
            experiences.map((exp, i) => (
              <p key={i} className="text-zinc-600/50 text-xs ml-3">- {exp.role}</p>
            ))
          )}
          <p className="text-zinc-400/50 text-sm font-semibold mt-5">/ Projects</p>
          {loading ? (
            <div className="ml-3 flex flex-col gap-2">
              <div className="w-48 h-3 bg-zinc-700/40 rounded animate-pulse" />
              <div className="w-32 h-3 bg-zinc-700/20 rounded animate-pulse" />
            </div>
          ) : (
            <div className="text-zinc-400/20 ml-3 text-xs">nothing here.. yet.. :(</div>
          )}
          </div>
          
        </main>
        <div className="p-20 select-none w-full">
          <div className="flex flex-col gap-2 text-xs text-zinc-400/80">
            <div className="flex items-center gap-3 mb-3">
              {(!discordData?.discord_user || discordLoading) ? (
                <>
                  <div className="w-14 h-14 rounded bg-zinc-700/40 animate-pulse" />
                  <div className="flex flex-col gap-1 ml-2">
                    <div className="w-32 h-4 bg-zinc-700/40 rounded animate-pulse" />
                    <div className="w-20 h-3 bg-zinc-700/20 rounded animate-pulse" />
                    <div className="w-16 h-3 bg-zinc-700/20 rounded animate-pulse mt-1" />
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={`https://cdn.discordapp.com/avatars/${discordData.discord_user.id}/${discordData.discord_user.avatar}.png`}
                    alt="Discord Avatar"
                    className="w-14 h-14 rounded"
                  />
                  <div>
                    <p className="text-zinc-300 text-xs font-semibold">
                      {discordData.discord_user.display_name || `@${discordData.discord_user.username}`}
                    </p>
                    <p className="text-zinc-400/60 text-xs -mt-1 mb-1">
                      @{discordData.discord_user.username}
                    </p>
                    <div className="flex items-center mt-1">
                      <StatusDot status={discordData.discord_status} />
                      <span className={`text-xs font-semibold ${getStatus(discordData.discord_status).text}`}>
                        {discordData.discord_status}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-4 mb-1 text-lg">
              <a
                href="https://github.com/ragebaiting"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition flex items-center gap-1"
              >
                <FaGithub />
                <span className="text-xs font-normal ml-1">[Github]</span>
              </a>
              <a
                href="https://roblox.com/users/8756713122/profile"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition flex items-center gap-1"
              >
                <SiRoblox />
                <span className="text-xs font-normal ml-1">[Roblox]</span>
              </a>
              <a
                href="https://discord.com/users/1139680335198687293"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition flex items-center gap-1"
              >
                <FaDiscord />
                <span className="text-xs font-normal ml-1">[Discord]</span>
              </a>
              <a
                href="https://clt.lol/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition flex items-center gap-1"
              >
                <FaTwitter />
                <span className="text-xs font-normal ml-1">[Twitter (x)]</span>
              </a>
            </div>
            <div className="flex items-center gap-2">
              {timeLoading ? (
                <div className="w-32 h-4 bg-zinc-700/40 rounded animate-pulse" />
              ) : (
                <span>
                  {timeStr} - Likely {isSleeping ? 'sleeping' : 'awake'}.
                </span>
              )}
              <span className="mx-2">•</span>
              <span>🇬🇧 London, UK</span>
              <span className="mx-2">•</span>
              <a
                href="https://github.com/ragebaiting/portofolio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-200 underline text-xs"
              >
                Page Source
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

