"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = "booting" | "awaiting" | "inputting" | "granted" | "denied";
type LineColor = "green" | "red" | "yellow" | "dim" | "white";

interface Line {
  id: number;
  text: string;
  color: LineColor;
}

// ─── 6 Randomized command sets ────────────────────────────────────────────────
const COMMAND_SETS: { text: string; color: LineColor }[][] = [
  // Set 1 – Classic Kernel Boot
  [
    { text: "$ sudo ./boot_kernel --silent", color: "dim" },
    { text: "[  OK  ] initializing system modules...", color: "green" },
    { text: "[  OK  ] mounting virtual filesystem...", color: "green" },
    { text: "[ INFO ] connecting to secure gateway...", color: "yellow" },
    { text: "[ INFO ] establishing encrypted tunnel...", color: "yellow" },
    { text: "[ WARN ] bypassing firewall protocols...", color: "red" },
    { text: "[ WARN ] injecting root payload...", color: "red" },
    { text: "[  OK  ] credentials verified...", color: "green" },
    { text: "[  OK  ] access protocol armed — awaiting passphrase", color: "green" },
  ],
  // Set 2 – Network Intrusion
  [
    { text: "$ nmap -sV -p 1-65535 target.sys", color: "dim" },
    { text: "[ SCAN ] probing 65535 ports...", color: "yellow" },
    { text: "[  OK  ] 3 open ports discovered", color: "green" },
    { text: "[ WARN ] SSL certificate mismatch detected", color: "red" },
    { text: "[ INFO ] launching exploit CVE-2024-0001...", color: "yellow" },
    { text: "[ WARN ] AV signature detected — obfuscating...", color: "red" },
    { text: "[  OK  ] obfuscation complete", color: "green" },
    { text: "[  OK  ] shell access obtained", color: "green" },
    { text: "[  OK  ] persistent backdoor installed — awaiting passphrase", color: "green" },
  ],
  // Set 3 – AI Inference Hijack
  [
    { text: "$ python3 hijack_inference.py --model gpt-override", color: "dim" },
    { text: "[ INFO ] loading adversarial weights...", color: "yellow" },
    { text: "[  OK  ] model hijacked successfully", color: "green" },
    { text: "[ WARN ] safety guardrails disabled", color: "red" },
    { text: "[ INFO ] injecting custom system prompt...", color: "yellow" },
    { text: "[  OK  ] prompt injection confirmed", color: "green" },
    { text: "[ WARN ] exfiltrating training data...", color: "red" },
    { text: "[  OK  ] 47.3 GB retrieved", color: "green" },
    { text: "[  OK  ] AI override complete — enter passphrase", color: "green" },
  ],
  // Set 4 – Satellite Uplink
  [
    { text: "$ ./uplink --freq 2.4GHz --beam GLOBAL", color: "dim" },
    { text: "[ INFO ] scanning orbital frequencies...", color: "yellow" },
    { text: "[  OK  ] satellite KH-13 locked", color: "green" },
    { text: "[ INFO ] decrypting telemetry stream...", color: "yellow" },
    { text: "[  OK  ] telemetry decrypted", color: "green" },
    { text: "[ WARN ] jamming counter-measures deployed", color: "red" },
    { text: "[ WARN ] rerouting signal via 3 proxies...", color: "red" },
    { text: "[  OK  ] signal rerouted — origin masked", color: "green" },
    { text: "[  OK  ] uplink stable — enter passphrase to proceed", color: "green" },
  ],
  // Set 5 – Blockchain Exploit
  [
    { text: "$ node exploit_contract.js --chain ETH --gas 0", color: "dim" },
    { text: "[ INFO ] locating vulnerable smart contract...", color: "yellow" },
    { text: "[  OK  ] re-entrancy vulnerability found at 0x4f8e", color: "green" },
    { text: "[ WARN ] initiating flash loan attack...", color: "red" },
    { text: "[ INFO ] borrowing 50,000 ETH...", color: "yellow" },
    { text: "[  OK  ] loan obtained", color: "green" },
    { text: "[ WARN ] draining liquidity pool...", color: "red" },
    { text: "[  OK  ] ◎ 50,000 ETH drained to burner wallet", color: "green" },
    { text: "[  OK  ] exploit complete — enter passphrase", color: "green" },
  ],
  // Set 6 – Zero-Day Deployment
  [
    { text: "$ ./zeroday --target aryan.world --stealth", color: "dim" },
    { text: "[ INFO ] fingerprinting OS: Ubuntu 24.04 LTS", color: "yellow" },
    { text: "[  OK  ] zero-day CVE-2025-9981 selected", color: "green" },
    { text: "[ WARN ] disabling kernel protections...", color: "red" },
    { text: "[  OK  ] ASLR + DEP bypassed", color: "green" },
    { text: "[ INFO ] writing shellcode to heap...", color: "yellow" },
    { text: "[ WARN ] triggering buffer overflow...", color: "red" },
    { text: "[  OK  ] root shell spawned", color: "green" },
    { text: "[  OK  ] host compromised — enter passphrase to unlock", color: "green" },
  ],
];

const CHAR_DELAY = 30;
const LINE_PAUSE = 240;

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function colorClass(c: LineColor): string {
  return (
    {
      green: "text-emerald-400",
      red: "text-red-500",
      yellow: "text-amber-400",
      dim: "text-zinc-500",
      white: "text-zinc-200",
    }[c] ?? "text-zinc-200"
  );
}

// ─── Traffic Lights ───────────────────────────────────────────────────────────
function TrafficLights({
  onClose,
  onMinimize,
  onFullscreen,
}: {
  onClose: () => void;
  onMinimize: () => void;
  onFullscreen: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-[7px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Red — close */}
      <button
        onClick={onClose}
        id="tl-close"
        className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] flex items-center justify-center cursor-pointer hover:brightness-110 transition-all focus:outline-none"
        style={{ boxShadow: "0 0 6px #ff5f5799" }}
        title="Close"
        aria-label="Close"
      >
        <AnimatePresence>
          {hovered && (
            <motion.svg
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              width="7"
              height="7"
              viewBox="0 0 6 6"
              fill="none"
            >
              <path d="M1 1l4 4M5 1l-4 4" stroke="#700" strokeWidth="1.4" strokeLinecap="round" />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>

      {/* Yellow — minimize */}
      <button
        onClick={onMinimize}
        id="tl-minimize"
        className="w-3.5 h-3.5 rounded-full bg-[#febc2e] flex items-center justify-center cursor-pointer hover:brightness-110 transition-all focus:outline-none"
        style={{ boxShadow: "0 0 6px #febc2e99" }}
        title="Minimize"
        aria-label="Minimize"
      >
        <AnimatePresence>
          {hovered && (
            <motion.svg
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              width="8"
              height="2"
              viewBox="0 0 7 2"
              fill="none"
            >
              <path d="M0.5 1h6" stroke="#7a5200" strokeWidth="1.4" strokeLinecap="round" />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>

      {/* Green — fullscreen */}
      <button
        onClick={onFullscreen}
        id="tl-fullscreen"
        className="w-3.5 h-3.5 rounded-full bg-[#28c840] flex items-center justify-center cursor-pointer hover:brightness-110 transition-all focus:outline-none"
        style={{ boxShadow: "0 0 6px #28c84099" }}
        title="Fullscreen"
        aria-label="Fullscreen"
      >
        <AnimatePresence>
          {hovered && (
            <motion.svg
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              width="8"
              height="8"
              viewBox="0 0 7 7"
              fill="none"
            >
              <path
                d="M1 3V1h2M4 1h2v2M6 4v2H4M3 6H1V4"
                stroke="#0a4d0a"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}

// ─── Blinking cursor ──────────────────────────────────────────────────────────
function Cursor({ cls = "bg-emerald-400" }: { cls?: string }) {
  return (
    <motion.span
      className={`inline-block w-[9px] h-[1.15em] ${cls} align-middle ml-px`}
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.52, repeat: Infinity, repeatType: "reverse" }}
    />
  );
}

// ─── ACCESS GRANTED overlay ───────────────────────────────────────────────────
function GrantedOverlay({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <motion.div
        className="text-center px-6"
        initial={{ scale: 0.78, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.12, type: "spring", stiffness: 140, damping: 13 }}
      >
        <motion.p
          className="font-mono font-bold text-5xl sm:text-7xl tracking-widest text-emerald-400 mb-4"
          animate={{
            textShadow: [
              "0 0 20px #34d399",
              "0 0 70px #34d399, 0 0 140px #10b981",
              "0 0 20px #34d399",
            ],
          }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          ACCESS GRANTED
        </motion.p>
        <motion.p
          className="text-emerald-600 font-mono text-lg tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          Welcome, Aryan. Initiating portfolio...
        </motion.p>

        {/* EQ bars */}
        <div className="mt-10 flex items-end justify-center gap-[3px]">
          {Array.from({ length: 26 }).map((_, i) => {
            const h = ((i * 17) % 42) + 6;
            const d = 0.45 + ((i * 13) % 40) / 100;
            return (
            <motion.div
              key={i}
              className="w-[5px] rounded-sm bg-emerald-400"
              animate={{ height: ["4px", `${h}px`, "4px"] }}
              transition={{
                duration: d,
                delay: i * 0.035,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
interface TerminalGateProps {
  onUnlock: () => void;
  playGrantedAudio: () => void;
  playDeniedAudio: () => void;
}

export default function TerminalGate({
  onUnlock,
  playGrantedAudio,
  playDeniedAudio,
}: TerminalGateProps) {
  const [phase, setPhase] = useState<Phase>("booting");
  const [lines, setLines] = useState<Line[]>([]);
  const [typingText, setTypingText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [minimized, setMinimized] = useState(false);
  const [showGranted, setShowGranted] = useState(false);

  const lineId = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const running = useRef(false);

  // Pick a random command set once per mount
  const [commandSet] = useState(
    () => COMMAND_SETS[Math.floor(Math.random() * COMMAND_SETS.length)]
  );

  // Auto-scroll terminal body
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, typingText]);

  // Focus hidden input when phase → inputting
  useEffect(() => {
    if (phase === "inputting") {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [phase]);

  // Boot sequence using the randomly selected command set
  useEffect(() => {
    if (running.current) return;
    running.current = true;

    async function boot() {
      await sleep(600);
      for (const tmpl of commandSet) {
        const id = ++lineId.current;
        for (let i = 1; i <= tmpl.text.length; i++) {
          setTypingText(tmpl.text.slice(0, i));
          await sleep(CHAR_DELAY + (Math.random() * 12 - 6));
        }
        setLines((p) => [...p, { id, text: tmpl.text, color: tmpl.color }]);
        setTypingText("");
        await sleep(LINE_PAUSE);
      }
      await sleep(300);
      setLines((p) => [
        ...p,
        {
          id: ++lineId.current,
          text: '👉  Type "YES" to continue...',
          color: "white",
        },
      ]);
      setPhase("awaiting");
    }

    boot();
  }, [commandSet]);

  // Traffic light handlers
  const handleClose = useCallback(() => {
    window.location.href = "about:blank";
  }, []);

  const handleMinimize = useCallback(() => setMinimized(true), []);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  // Input activation (click-to-type)
  const handleInputRowClick = useCallback(() => {
    if (phase === "awaiting" || phase === "inputting") {
      setPhase("inputting");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [phase]);

  // Submit
  const handleSubmit = useCallback(() => {
    const val = userInput.trim();
    if (!val) return;

    if (val.toLowerCase() === "yes") {
      setPhase("granted");
      setUserInput("");
      playGrantedAudio();
      setShowGranted(true);
    } else {
      setPhase("denied");
      setUserInput("");
      playDeniedAudio();
      // Open 3 tabs then redirect
      setTimeout(() => {
        const url = "https://volumeshaderbm.com/start/";
        window.open(url, "_blank");
        window.open(url, "_blank");
        window.open(url, "_blank");
      }, 1000);
      setTimeout(() => {
        window.location.href = "about:blank";
      }, 3000);
    }
  }, [userInput, playGrantedAudio, playDeniedAudio]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSubmit();
    },
    [handleSubmit]
  );

  // Minimized dock
  if (minimized) {
    return (
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30">
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800/90 border border-zinc-700/60 text-zinc-400 text-sm font-mono backdrop-blur-xl shadow-2xl"
        >
          <div className="w-2 h-2 rounded-full bg-[#28c840]" />
          Terminal — Aryan Chaudhary&rsquo;s World
        </motion.button>
      </div>
    );
  }

  return (
    <>
      {/* ACCESS GRANTED overlay */}
      <AnimatePresence>
        {showGranted && <GrantedOverlay onDone={onUnlock} />}
      </AnimatePresence>

      {/* Terminal backdrop */}
      <motion.div
        className="fixed inset-0 z-30 flex items-center justify-center"
        style={{
          background: showGranted
            ? "transparent"
            : "radial-gradient(ellipse at center, #080808 0%, #000 80%)",
        }}
        animate={{ opacity: showGranted ? 0 : 1 }}
        transition={{ duration: 0.4, delay: showGranted ? 0.15 : 0 }}
      >
        {/* Vignette */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)",
          }}
        />

        {/* Terminal window — wider + taller */}
        <motion.div
          className="relative w-[min(920px,96vw)]"
          initial={{ scale: 0.88, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(8, 8, 8, 0.98)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow:
                "0 50px 120px rgba(0,0,0,0.98), 0 0 0 0.5px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {/* ── Title bar ── */}
            <div
              className="relative flex items-center justify-between px-5 py-3 select-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(40,40,40,0.99) 0%, rgba(30,30,30,0.99) 100%)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <TrafficLights
                onClose={handleClose}
                onMinimize={handleMinimize}
                onFullscreen={handleFullscreen}
              />
              <span
                className="absolute left-1/2 -translate-x-1/2 text-[13px] font-medium tracking-wide pointer-events-none"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Aryan Chaudhary&apos;s World — bash
              </span>
              <div className="w-16" />
            </div>

            {/* ── Terminal body — taller ── */}
            <div
              ref={scrollRef}
              className="font-mono text-[14px] leading-[1.75] p-6 overflow-y-auto"
              style={{ minHeight: "420px", maxHeight: "62vh" }}
            >
              {/* Completed lines */}
              {lines.map((line) => (
                <motion.div
                  key={line.id}
                  className={`${colorClass(line.color)} whitespace-pre-wrap`}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.13 }}
                >
                  {line.text}
                </motion.div>
              ))}

              {/* Live typing line */}
              {typingText && (
                <div className="text-emerald-400 whitespace-pre-wrap">
                  {typingText}
                  <Cursor />
                </div>
              )}

              {/* Input row — visible after boot */}
              {(phase === "awaiting" ||
                phase === "inputting" ||
                phase === "denied") && (
                <motion.div
                  className="mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Clickable prompt row */}
                  <div
                    id="terminal-input-row"
                    role="button"
                    tabIndex={0}
                    onClick={handleInputRowClick}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleInputRowClick()
                    }
                    className={`flex items-center gap-2 rounded-md px-2 py-1 cursor-text transition-colors ${
                      phase === "inputting"
                        ? "bg-white/[0.05]"
                        : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="text-emerald-400 select-none text-lg">
                      ❯
                    </span>
                    <span className="text-zinc-100 flex-1 tracking-wider text-[14px]">
                      {userInput}
                    </span>
                    {phase === "inputting" ? (
                      <Cursor />
                    ) : (
                      <span className="text-zinc-600 text-[11px] ml-1 select-none">
                        click to type
                      </span>
                    )}
                  </div>

                  {phase === "awaiting" && (
                    <p className="text-zinc-600 text-[11px] mt-1.5 pl-2 select-none">
                      👆 Click the line above to activate input
                    </p>
                  )}

                  {/* Hidden real input — captures keystrokes when focused */}
                  <input
                    ref={inputRef}
                    type="text"
                    id="terminal-hidden-input"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                    onKeyDown={handleKeyDown}
                    onBlur={() => {
                      // Keep phase as inputting if they only blurred (not submitted)
                    }}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-label="Terminal passphrase input"
                    className="absolute opacity-0 w-0 h-0 pointer-events-none"
                  />
                </motion.div>
              )}

              {/* Verdict: denied */}
              <AnimatePresence>
                {phase === "denied" && (
                  <motion.div
                    key="denied"
                    className="mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, x: [0, -8, 8, -5, 5, 0] }}
                    transition={{ duration: 0.45 }}
                  >
                    <motion.p
                      className="text-red-500 font-bold text-2xl tracking-widest"
                      animate={{
                        textShadow: [
                          "0 0 8px #ef4444",
                          "0 0 32px #ef4444",
                          "0 0 8px #ef4444",
                        ],
                      }}
                      transition={{ duration: 0.75, repeat: Infinity }}
                    >
                      ❌ ACCESS DENIED
                    </motion.p>
                    <p className="text-red-700 text-sm mt-1">
                      Terminating session. Opening 3 warnings... Goodbye.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Status bar ── */}
            <div
              className="flex items-center justify-between px-5 py-[6px] font-mono text-[11.5px]"
              style={{
                background: "rgba(18,18,18,0.99)",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.22)",
              }}
            >
              <span>aryan@portfolio ~ bash</span>
              <span>
                {phase === "granted"
                  ? "🟢 authenticated"
                  : phase === "denied"
                  ? "🔴 unauthorized"
                  : phase === "inputting"
                  ? "⌨️  typing..."
                  : phase === "awaiting"
                  ? "⚡ awaiting passphrase"
                  : "⏳ initializing"}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
