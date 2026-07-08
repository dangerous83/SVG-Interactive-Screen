import { useState } from 'react'
import type { Member } from '../data/team'
import { initials } from '../data/team'

/*
  Portrait with initials fallback. If `photo` is null or the image fails to load,
  a holographic initials medallion is shown instead.
*/
export default function MemberAvatar({
  member,
  className = '',
}: {
  member: Member
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const accent = member.org === 'securevisa' ? '#33d6ff' : '#ff7a30'
  const showPhoto = member.photo && !failed

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ boxShadow: `0 0 24px ${accent}33` }}
    >
      {showPhoto ? (
        <img
          src={member.photo as string}
          alt={member.name}
          loading="lazy"
          onError={() => setFailed(true)}
          draggable={false}
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center font-display font-bold text-white"
          style={{
            background: `radial-gradient(circle at 30% 25%, ${accent}40, #0a1430 75%)`,
          }}
        >
          <span className="text-[clamp(1.5rem,4vw,3rem)] tracking-widest">
            {initials(member.name)}
          </span>
        </div>
      )}
      {/* Holographic sheen */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(160deg, transparent 55%, ${accent}22 100%)`,
        }}
      />
    </div>
  )
}
