
// u can steal this in 2 years i probably would of killed myself by then 

import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { spotify } from '../hooks/spotify';
import { discord } from '../hooks/discord';
import { time } from '../hooks/time';
import { battery, multiBattery } from '../hooks/battery';
import { FaGithub, FaDiscord, FaTwitter } from 'react-icons/fa';
import { SiRoblox } from 'react-icons/si';
import { IoBatteryFull, IoBatteryHalfOutline, IoBatteryDeadOutline } from "react-icons/io5";

const Status = {
  dnd: { text: 'text-purple-400', bg: 'bg-purple-400' },
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

  const { batteries } = multiBattery();
  const [mounted, setMounted] = useState(false);

  const { isSleeping, timeStr } = useClock();
  const [timeLoading, setTimeLoading] = useState(false);

  const [descLoading, setDescLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const description = [
    "clt, backend-focused software engineer, based around next.js, fluent in langs such as rust, elixir, typescript."
  ];

  const [expLoading, setExpLoading] = useState(false);
  const experiences = [
    { role: "Web engineer @ Inter.org", period: "2026 - Present" },
    { role: "Web engineer @ Oppoah.com", period: "2026 - Present" },
    { role: "Engineer @ Indicia.app", period: "2026 - 2026" },
    { role: "Lead Dev @ Datawave", period: "2023 - 2024" }
  ];

  return (
    <>
      <Head>
        <title>x_x</title>
        <meta name="description" content="Security Enthusiast, Software Engineer." />
        <meta name="theme-color" content="#ffffff" /> 

        <meta property="og:title" content="clt.baby" />
        <meta property="og:description" content="Security Enthusiast, Software Engineer." />
        <meta property="og:image" content="https://clt.baby/img/pfp.jpg" />
        <meta property="og:url" content="https://clt.baby/" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="clt.baby" />
        <meta name="twitter:description" content="Security Enthusiast, Software Engineer." />
        <meta name="twitter:image" content="https://clt.baby/img/pfp.jpg" />
      </Head>

      <div className="flex min-h-screen bg-black" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        <motion.main
          className="flex-1 p-20 w-3/5 flex flex-col justify-between min-h-screen"
          style={{ width: '60%' }}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
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
            Cybersec <span className="italic">Analyst</span>,<div className="ml-1 w-12 h-5 text-xs bg-purple-800/40 border border-purple-700/40 text-purple-500 rounded inline-flex items-center justify-center">he/him</div><br />
            Full-Stack Software <span className="italic">Engineer</span>.
          </h1>
          {descLoading ? (
            <div className="w-[350px] h-4 bg-zinc-700/40 rounded animate-pulse mb-14 mt-5" />
          ) : (
            description.map((desc, i) => (
              <p key={i} className="text-zinc-500/80 max-w-[500px] mb-14 text-sm font-thin mt-5">{desc}</p>
            ))
          )}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-zinc-500/80 text-xs">iPhone 17 Pro Max</span>
            {!mounted || !batteries ? (
              <div className="w-8 h-3 bg-zinc-700/40 rounded animate-pulse" />
            ) : (
              <>
                <span className={`text-xs ${
                  batteries.iPhone < 20 ? 'text-purple-500' : 
                  batteries.iPhone < 70 ? 'text-purple-400' : 
                  'text-purple-300'
                }`}>
                  {batteries.iPhone}%
                </span>
                {batteries.iPhone < 20 ? (
                  <IoBatteryDeadOutline className="text-purple-500 text-lg" />
                ) : batteries.iPhone < 70 ? (
                  <IoBatteryHalfOutline className="text-purple-400 text-lg" />
                ) : (
                  <IoBatteryFull className="text-purple-300 text-lg" />
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-zinc-500/80 text-xs">iPad Pro</span>
            {!mounted || !batteries ? (
              <div className="w-8 h-3 bg-zinc-700/40 rounded animate-pulse" />
            ) : (
              <>
                <span className={`text-xs ${
                  batteries.iPad < 20 ? 'text-purple-500' : 
                  batteries.iPad < 70 ? 'text-purple-400' : 
                  'text-purple-300'
                }`}>
                  {batteries.iPad}%
                </span>
                {batteries.iPad < 20 ? (
                  <IoBatteryDeadOutline className="text-purple-500 text-lg" />
                ) : batteries.iPad < 70 ? (
                  <IoBatteryHalfOutline className="text-purple-400 text-lg" />
                ) : (
                  <IoBatteryFull className="text-purple-300 text-lg" />
                )}
              </>
            )}
          </div>
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
                <p className="text-purple-500 text-xs">
                  Listening to <span className="font-semibold text-purple-400">{spotifyData.song}</span> by {spotifyData.artist}
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
              <p key={i} className="text-zinc-400 text-xs ml-3 flex items-center gap-2 mt-2">- <span className="text-zinc-400">{exp.role}</span> <div className={`text-[8px] rounded inline-flex items-center justify-center px-1 h-5 ${['2026 - Present','2026 - 2026','2023 - 2024'].includes(exp.period) ? 'text-purple-500 bg-purple-800/40 border border-purple-700/40' : 'text-zinc-500 bg-zinc-700/20 border border-zinc-500/10'}`}>{exp.period}</div></p>
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
          <div className="select-none w-full md:w-auto mt-10">
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
                  href="https://discord.com/users/1477032112694759657"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1"
                >
                  <FaDiscord />
                  <span className="text-xs font-normal ml-1">[Discord]</span>
                </a>
                <a
                  href="https://x.com/clthatesyou"
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
                    {mounted ? `${timeStr} - Likely ${isSleeping ? 'sleeping' : 'awake'}.` : 'Loading...'}
                  </span>
                )}
                <span className="mx-2">•</span>
                <span>🇬🇧 London, UK</span>
                <span className="mx-2">•</span>
                <a
                  href="https://github.com/ragebaiting/portofolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-500 hover:text-purple-400 underline text-xs"
                >
                  Page Source
                </a>
              </div>
            </div>
          </div>
        </motion.main>
        <motion.div
          className="hidden md:block min-h-screen flex-shrink-0"
          style={{
            width: '100%',
            maxWidth: '900px',
            margin: '2.5vw',
            backgroundImage: "url('/itOXlDm2NEepUgDR0wvxlmcfww.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '1.5rem',
            boxShadow: '0 0 32px 0 rgba(0,0,0,0.5)',
            border: '2px solid rgba(0,0,0,0.7)',
          }}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </>
  );
};

const HomePage = dynamic(() => Promise.resolve(Home), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950">
      <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
    </div>
  )
});

export default HomePage;

