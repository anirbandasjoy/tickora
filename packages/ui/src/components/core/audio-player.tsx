"use client";

import {
  Check,
  Headphones,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Popover, PopoverAnchor, PopoverContent } from "./popover";
import { Slider } from "./slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

export function formatAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const LOAD_ERROR_MESSAGE =
  "Audio failed to load. Check your connection and try again.";

/** Allowed divergence between playback position and the synced target. */
const SYNC_DRIFT_TOLERANCE = 2; // seconds

type UseAudioPlayerOptions = {
  /** Max times the audio can be played. Unlimited when omitted. */
  maxPlays?: number;
  /**
   * false = restricted mode: seeking blocked, play limit enforced.
   * true (default) = full access: seek/skip/speed, unlimited plays.
   */
  allowSeeking?: boolean;
  /** localStorage key to persist the play count across refreshes. */
  persistKey?: string;
  /**
   * Restricted mode only: continuously updated target position in seconds.
   * Playback jumps here on load and is re-seeked whenever it drifts more
   * than SYNC_DRIFT_TOLERANCE seconds away (buffering stalls, mobile
   * background suspension, …). The consumer owns the timeline — for exams
   * this is the pause-adjusted audio position derived from the server.
   */
  syncedPosition?: number;
  /**
   * Restricted mode only: increment to request playback to start.
   * Bump inside a user-gesture handler (e.g. "Continue Exam" click) so the
   * resulting play() call passes autoplay policies.
   */
  autoPlaySignal?: number;
  /** Notified whenever playback starts or stops. */
  onPlayingChange?: (isPlaying: boolean) => void;
};

/**
 * Shared audio player hook.
 * Single source of truth for play/pause, seek, skip, volume, mute,
 * playback rate, play-count limits and error handling.
 */
export function useAudioPlayer(
  src: string,
  {
    maxPlays = Infinity,
    allowSeeking = true,
    persistKey,
    syncedPosition,
    autoPlaySignal,
    onPlayingChange,
  }: UseAudioPlayerOptions = {},
) {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [isMuted, setIsMuted] = React.useState(false);
  const [playbackRate, setPlaybackRateState] = React.useState(1);
  const [error, setError] = React.useState<string | null>(null);
  const [isMetadataLoaded, setIsMetadataLoaded] = React.useState(false);
  const [needsInteraction, setNeedsInteraction] = React.useState(false);
  // True while the file is loading (metadata pending) or playback is stalled
  // waiting for data (buffering) — covers seek-triggered range fetches too.
  const [isBuffering, setIsBuffering] = React.useState(true);

  /** Target of the last programmatic seek — lets the seeking guard tell
   *  our own seeks apart from user-initiated ones. */
  const pendingSeekTargetRef = React.useRef<number | null>(null);
  const lastAutoPlaySignalRef = React.useRef(0);

  const isRestricted = !allowSeeking;

  // Play count persisted per key (restricted/exam mode only)
  const [playCount, setPlayCount] = React.useState<number>(() => {
    if (!isRestricted || !persistKey || typeof window === "undefined") return 0;
    try {
      return Number(localStorage.getItem(persistKey)) || 0;
    } catch {
      return 0;
    }
  });

  const hasPlaysRemaining = allowSeeking || playCount < maxPlays;

  // Reset when source changes (part switch)
  React.useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
    setIsMetadataLoaded(false);
    setNeedsInteraction(false);
    setIsBuffering(true);
    lastAutoPlaySignalRef.current = 0;

    // Reset playback rate on source switch
    setPlaybackRateState(1);
    if (audioRef.current) {
      audioRef.current.playbackRate = 1;
    }
  }, [src]);

  // Pause audio on unmount
  React.useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
    };
  }, []);

  // Persist play count (restricted/exam mode only)
  React.useEffect(() => {
    if (!isRestricted || !persistKey) return;
    try {
      localStorage.setItem(persistKey, String(playCount));
    } catch {
      // localStorage unavailable
    }
  }, [playCount, persistKey, isRestricted]);

  /** Programmatic seek that the restricted-mode seeking guard allows through. */
  const seekTo = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    pendingSeekTargetRef.current = value;
    audio.currentTime = value;
    const displayTime = Number.isFinite(audio.duration)
      ? Math.min(value, audio.duration)
      : value;
    setCurrentTime(displayTime);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    // Sync: re-seek when playback drifts from the target position.
    if (
      isRestricted &&
      syncedPosition != null &&
      Math.abs(audio.currentTime - syncedPosition) > SYNC_DRIFT_TOLERANCE
    ) {
      seekTo(syncedPosition);
      return;
    }
    setCurrentTime(audio.currentTime);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration);
    setIsMetadataLoaded(true);
    // Sync: jump straight to the target position on load.
    if (isRestricted && syncedPosition != null) {
      const dur = Number.isFinite(audio.duration) ? audio.duration : Infinity;
      const target = Math.min(syncedPosition, Math.max(0, dur - 0.25));
      if (target > 0) seekTo(target);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (isRestricted) setPlayCount((prev) => prev + 1);
  };

  const handleError = () => {
    setError(LOAD_ERROR_MESSAGE);
    setIsPlaying(false);
    setIsBuffering(false);
  };

  // Buffering lifecycle: stalled/waiting → buffering; data ready → playing
  const handleWaiting = () => setIsBuffering(true);
  const handleStalled = () => setIsBuffering(true);
  const handlePlaying = () => setIsBuffering(false);
  const handleCanPlay = () => setIsBuffering(false);

  // Block user-initiated seeking in restricted mode (keyboard/media keys),
  // while letting our own programmatic sync seeks pass through.
  const handleSeeking = () => {
    const audio = audioRef.current;
    if (allowSeeking || !audio) return;
    if (pendingSeekTargetRef.current === audio.currentTime) return;
    audio.currentTime = syncedPosition ?? currentTime;
  };

  const togglePlay = () => {
    if (!audioRef.current || !hasPlaysRemaining) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setError(null);
        })
        .catch((err: unknown) => {
          const message =
            err instanceof DOMException && err.name === "NotAllowedError"
              ? "Audio playback was blocked. Please interact with the page first."
              : "Failed to play audio. Please try again.";
          setError(message);
          setIsPlaying(false);
        });
    }
  };

  const handleSeek = (value: number) => {
    if (!allowSeeking || !audioRef.current) return;
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const skip = (seconds: number) => {
    if (!allowSeeking || !audioRef.current) return;
    const t = Math.max(
      0,
      Math.min(audioRef.current.currentTime + seconds, duration),
    );
    audioRef.current.currentTime = t;
    setCurrentTime(t);
  };

  const handleVolumeChange = (value: number) => {
    if (!audioRef.current) return;
    setVolume(value);
    audioRef.current.volume = value;
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      const newVol = volume || 0.5;
      audioRef.current.volume = newVol;
      setVolume(newVol);
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = rate;
    setPlaybackRateState(rate);
  };

  const retry = () => {
    setError(null);
    // Reset the load cycle so metadata reload re-seeks to the current clock
    // position and the queued autoplay signal re-fires once data arrives.
    setIsMetadataLoaded(false);
    setIsBuffering(true);
    lastAutoPlaySignalRef.current = 0;
    audioRef.current?.load();
  };

  // Autoplay: starts when the consumer's signal increments. The signal is
  // bumped inside a user-gesture handler (e.g. "Continue Exam" click) so the
  // play() call passes autoplay policies. Queued until metadata loads so the
  // initial sync seek happens first — works both when the signal fires
  // before the player mounts (fresh exam start) and after (resume click).
  React.useEffect(() => {
    if (autoPlaySignal == null || autoPlaySignal <= 0) return;
    if (!isMetadataLoaded) return;
    if (lastAutoPlaySignalRef.current === autoPlaySignal) return;
    lastAutoPlaySignalRef.current = autoPlaySignal;
    const audio = audioRef.current;
    if (!audio || !hasPlaysRemaining) return;
    // Re-seek to the latest target position so time lost to loading (or
    // spent behind the guidelines overlay) is accounted for at start —
    // avoids an audible drift-correction jump right after playback begins.
    if (isRestricted && syncedPosition != null && !isPlaying) {
      const dur = Number.isFinite(audio.duration) ? audio.duration : Infinity;
      seekTo(Math.min(syncedPosition, Math.max(0, dur - 0.25)));
    }
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setError(null);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "NotAllowedError") {
          // No user gesture available (gesture-less auto-start flow) —
          // surface a hint and retry on the first interaction.
          setNeedsInteraction(true);
          setIsPlaying(false);
          return;
        }
        setError("Failed to play audio. Please try again.");
        setIsPlaying(false);
      });
  }, [
    autoPlaySignal,
    isMetadataLoaded,
    hasPlaysRemaining,
    isRestricted,
    syncedPosition,
    isPlaying,
  ]);

  // Retry playback on the first page interaction after an autoplay block.
  React.useEffect(() => {
    if (!needsInteraction) return;
    const retryPlay = () => {
      setNeedsInteraction(false);
      audioRef.current?.play().then(
        () => setIsPlaying(true),
        () => {},
      );
    };
    window.addEventListener("pointerdown", retryPlay);
    window.addEventListener("keydown", retryPlay);
    return () => {
      window.removeEventListener("pointerdown", retryPlay);
      window.removeEventListener("keydown", retryPlay);
    };
  }, [needsInteraction]);

  // Surface playback state changes to the consumer.
  const onPlayingChangeRef = React.useRef(onPlayingChange);
  React.useEffect(() => {
    onPlayingChangeRef.current = onPlayingChange;
  }, [onPlayingChange]);
  React.useEffect(() => {
    onPlayingChangeRef.current?.(isPlaying);
  }, [isPlaying]);

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    playCount,
    hasPlaysRemaining,
    error,
    needsInteraction,
    isBuffering,
    isMetadataLoaded,
    togglePlay,
    handleSeek,
    skip,
    handleVolumeChange,
    toggleMute,
    changePlaybackRate,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handleError,
    handleSeeking,
    handleWaiting,
    handleStalled,
    handlePlaying,
    handleCanPlay,
    retry,
  };
}

type AudioPlayerVariant = "full" | "exam";

type AudioPlayerProps = {
  src?: string;
  /**
   * full — editor/results/preview: seek bar, ±5s skip, speed dropdown, volume popover.
   * exam — exam/practice: clock-driven playback, read-only progress, volume only.
   */
  variant?: AudioPlayerVariant;
  /** Max times the audio can be played (enforced in exam variant). */
  maxPlays?: number;
  /** localStorage key to persist play count across refreshes (exam variant). */
  persistKey?: string;
  /**
   * Exam variant: continuously updated target position in seconds. For exams
   * this is the pause-adjusted listening-audio position derived from the
   * server (`audioElapsedSeconds`) — playback syncs to the audio's own
   * timeline, which starts at its true 0:00.
   */
  syncedPosition?: number;
  /** Exam variant: increment to request playback start (user-gesture anchored). */
  autoPlaySignal?: number;
  /** Exam variant: notified when playback starts/stops. */
  onPlayingChange?: (isPlaying: boolean) => void;
  /** Optional leading label, e.g. "Part 01". */
  label?: React.ReactNode;
  className?: string;
};

function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  inline = false,
}: {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (value: number) => void;
  onToggleMute: () => void;
  inline?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const openVolume = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };
  React.useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const VolumeIcon =
    isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  if (inline) {
    return (
      <div className="hidden items-center gap-2 sm:flex">
        <Button
          size="icon-sm"
          appearance="ghost"
          onClick={onToggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          <VolumeIcon className="size-4" aria-hidden="true" />
        </Button>
        <Slider
          value={[isMuted ? 0 : volume]}
          max={1}
          step={0.01}
          onValueChange={([v]) => onVolumeChange(v ?? 0)}
          aria-label="Volume"
          className="w-20 shrink-0"
        />
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        {/* Hidden on mobile — volume control not needed on touch devices */}
        <div
          className="hidden items-center sm:flex"
          onMouseEnter={openVolume}
          onMouseLeave={scheduleClose}
        >
          <Button
            size="icon-sm"
            appearance="ghost"
            onClick={onToggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            <VolumeIcon className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </PopoverAnchor>
      <PopoverContent
        side="top"
        align="end"
        className="w-32 p-3"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onMouseEnter={openVolume}
        onMouseLeave={scheduleClose}
      >
        <Slider
          value={[isMuted ? 0 : volume]}
          max={1}
          step={0.01}
          onValueChange={([v]) => onVolumeChange(v ?? 0)}
          aria-label="Volume"
        />
      </PopoverContent>
    </Popover>
  );
}

function SpeedControl({
  playbackRate,
  onChange,
}: {
  playbackRate: number;
  onChange: (rate: number) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          appearance="ghost"
          variant="dim"
          aria-label={`Playback speed ${playbackRate}x`}
          className="shrink-0 px-1.5 text-xs tabular-nums"
        >
          {playbackRate}x
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-16">
        {PLAYBACK_RATES.map((rate) => (
          <DropdownMenuItem
            key={rate}
            onClick={() => onChange(rate)}
            className="justify-between text-xs tabular-nums"
          >
            {rate}x{rate === playbackRate && <Check className="size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AudioPlayer({
  src,
  variant = "full",
  maxPlays = 1,
  persistKey,
  syncedPosition,
  autoPlaySignal,
  onPlayingChange,
  label,
  className,
}: AudioPlayerProps) {
  const isExam = variant === "exam";
  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    error,
    needsInteraction,
    hasPlaysRemaining,
    isBuffering,
    isMetadataLoaded,
    togglePlay,
    handleSeek,
    skip,
    handleVolumeChange,
    toggleMute,
    changePlaybackRate,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handleError,
    handleSeeking,
    handleWaiting,
    handleStalled,
    handlePlaying,
    handleCanPlay,
    retry,
  } = useAudioPlayer(src ?? "", {
    maxPlays: isExam ? maxPlays : undefined,
    allowSeeking: !isExam,
    persistKey: isExam ? persistKey : undefined,
    syncedPosition: isExam ? syncedPosition : undefined,
    autoPlaySignal: isExam ? autoPlaySignal : undefined,
    onPlayingChange: isExam ? onPlayingChange : undefined,
  });

  if (!src) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn("flex w-full items-center gap-2", className)}
        role="region"
        aria-label="Audio player"
      >
        {/* biome-ignore lint: audio is controlled programmatically */}
        <audio
          ref={audioRef}
          src={src}
          preload="auto"
          aria-label="Audio"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onSeeking={handleSeeking}
          onError={handleError}
          onWaiting={handleWaiting}
          onStalled={handleStalled}
          onPlaying={handlePlaying}
          onCanPlay={handleCanPlay}
        />

        {label != null && (
          <div className="flex shrink-0 items-center gap-1.5">
            <Headphones className="size-4 text-primary" aria-hidden="true" />
            <span className="text-xs font-semibold">{label}</span>
          </div>
        )}

        {error ? (
          <div className="flex min-w-0 flex-1 items-center gap-2" role="alert">
            <p className="truncate text-xs font-medium text-destructive">
              {error}
            </p>
            <Button size="xs" appearance="outline" onClick={retry}>
              Retry
            </Button>
          </div>
        ) : isExam ? (
          <>
            {/* Live status — playback is clock-driven, no manual controls */}
            {!isMetadataLoaded || isBuffering ? (
              <span className="flex shrink-0 items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                <Loader2 className="size-3 animate-spin" aria-hidden="true" />
                {isMetadataLoaded ? "Buffering…" : "Loading audio…"}
              </span>
            ) : isPlaying ? (
              <span className="flex shrink-0 items-center gap-1.5 text-[10px] font-medium text-primary">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                Playing
              </span>
            ) : (
              <span className="shrink-0 text-[10px] font-medium text-muted-foreground">
                {needsInteraction
                  ? "Starts on first click"
                  : hasPlaysRemaining
                    ? "Waiting"
                    : "Finished"}
              </span>
            )}

            <span className="shrink-0 text-[10px] text-muted-foreground tabular-nums">
              {formatAudioTime(currentTime)} / {formatAudioTime(duration)}
            </span>

            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={handleVolumeChange}
              onToggleMute={toggleMute}
              inline
            />
          </>
        ) : (
          <>
            {/* Skip back */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  appearance="ghost"
                  onClick={() => skip(-5)}
                  aria-label="Rewind 5 seconds"
                  className="shrink-0 touch-manipulation"
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rewind 5s</TooltipContent>
            </Tooltip>

            {/* Play/Pause */}
            <Button
              size="icon-sm"
              appearance="solid"
              variant="primary"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="shrink-0 touch-manipulation rounded-full"
            >
              {isPlaying ? (
                <Pause className="size-4" aria-hidden="true" />
              ) : (
                <Play className="ml-0.5 size-4" aria-hidden="true" />
              )}
            </Button>

            {/* Skip forward */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  appearance="ghost"
                  onClick={() => skip(5)}
                  aria-label="Forward 5 seconds"
                  className="shrink-0 touch-manipulation"
                >
                  <RotateCw className="size-4" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Forward 5s</TooltipContent>
            </Tooltip>

            {/* Seek bar + time */}
            <span className="shrink-0 text-[10px] text-muted-foreground tabular-nums">
              {formatAudioTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration || 1}
              step={0.1}
              onValueChange={([v]) => handleSeek(v ?? 0)}
              aria-label="Audio progress"
              className="min-w-8 flex-1"
            />
            <span className="shrink-0 text-[10px] text-muted-foreground tabular-nums">
              {formatAudioTime(duration)}
            </span>

            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={handleVolumeChange}
              onToggleMute={toggleMute}
            />

            <SpeedControl
              playbackRate={playbackRate}
              onChange={changePlaybackRate}
            />
          </>
        )}
      </div>
    </TooltipProvider>
  );
}
