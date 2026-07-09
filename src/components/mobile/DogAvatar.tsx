"use client";

import Image from "next/image";
import { useState } from "react";
import { dogEmotions } from "@/lib/dog-emotions";

type DogAvatarProps = {
  imageClassName?: string;
  showLabel?: boolean;
  className?: string;
  photoUrl?: string;
  name?: string;
};

export function DogAvatar({
  imageClassName = "h-52 w-52",
  showLabel = true,
  className = "",
  photoUrl,
  name = "Dog",
}: DogAvatarProps) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const emotion = dogEmotions[index];

  const handleClick = () => {
    if (photoUrl) return;
    setAnimating(true);
    setIndex((current) => (current + 1) % dogEmotions.length);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group flex flex-col items-center gap-2 ${className}`}
      aria-label={
        photoUrl
          ? `${name} profile photo`
          : `${emotion.label}. Tap to change emotion.`
      }
    >
      <div
        className={`relative ${photoUrl ? "overflow-hidden rounded-full" : ""} ${imageClassName}`}
      >
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={`${name} profile photo`}
            fill
            sizes="240px"
            priority
            className="object-cover"
          />
        ) : (
          <Image
            key={emotion.id}
            src={`/dog-emotions/${emotion.id}.png`}
            alt={emotion.label}
            fill
            sizes="240px"
            priority
            className={`object-contain ${animating ? "animate-dog-pop" : ""}`}
            onAnimationEnd={() => setAnimating(false)}
          />
        )}
      </div>
      {showLabel && !photoUrl && (
        <span
          key={`${emotion.id}-label`}
          className="text-sm font-medium text-zinc-600 transition-opacity duration-300 group-active:opacity-60"
        >
          {emotion.label}
        </span>
      )}
      {showLabel && photoUrl && (
        <span className="text-sm font-medium text-zinc-600">{name}</span>
      )}
    </button>
  );
}
