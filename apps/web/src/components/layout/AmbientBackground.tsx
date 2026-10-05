import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const AmbientBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Gentle floating animation for background aurora orbs
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          x: '+=60',
          y: '+=40',
          duration: 12,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          x: '-=50',
          y: '+=50',
          duration: 15,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1
        });
      }

      if (orb3Ref.current) {
        gsap.to(orb3Ref.current, {
          x: '+=40',
          y: '-=60',
          duration: 18,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 2
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="ambient-aurora-root" ref={containerRef} aria-hidden="true">
      <div ref={orb1Ref} className="aurora-orb aurora-orb-1" />
      <div ref={orb2Ref} className="aurora-orb aurora-orb-2" />
      <div ref={orb3Ref} className="aurora-orb aurora-orb-3" />
      <div className="aurora-grid-overlay" />
    </div>
  );
};
