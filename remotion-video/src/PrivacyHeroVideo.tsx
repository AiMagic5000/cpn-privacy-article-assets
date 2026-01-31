import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// Video configuration
const DURATION_SECONDS = 45;
const FPS = 30;

// Voiceover script sections with timing (in frames) and associated slides
const SCRIPT_SECTIONS = [
  {
    text: "Are you tired of your credit history following you everywhere?",
    startFrame: 0,
    endFrame: 120,
    slide: 'hero-header.jpg',
  },
  {
    text: "What if you could start fresh with a completely separate financial identity?",
    startFrame: 130,
    endFrame: 280,
    slide: 'slide-poster.png',
  },
  {
    text: "Introducing the Credit Privacy File - a legal way to establish standing in commerce.",
    startFrame: 290,
    endFrame: 450,
    slide: 'slide-cpn-package.png',
  },
  {
    text: "Registered with the IRS, your Credit Privacy File gives you legitimate financial separation from your Social Security Number credit profile.",
    startFrame: 460,
    endFrame: 680,
    slide: 'slide-poster.png',
  },
  {
    text: "This isn't about hiding. It's about privacy protection and a fresh start.",
    startFrame: 690,
    endFrame: 850,
    slide: 'hero-header.jpg',
  },
  {
    text: "Thousands have already taken control of their financial privacy.",
    startFrame: 860,
    endFrame: 1000,
    slide: 'slide-cpn-package.png',
  },
  {
    text: "Download your free guide today and learn how you can too.",
    startFrame: 1010,
    endFrame: 1200,
    slide: 'guide-screenshot.png',
    showGuide: true,
  },
  {
    text: "CreditPrivacyNumber.com - Your path to financial freedom starts here.",
    startFrame: 1210,
    endFrame: 1350,
    slide: 'guide-screenshot.png',
    showGuide: true,
  },
];

// Animated text component
const AnimatedText: React.FC<{
  text: string;
  startFrame: number;
  endFrame: number;
}> = ({ text, startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 15, endFrame - 15, endFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const scale = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  const translateY = interpolate(
    frame,
    [startFrame, startFrame + 20],
    [30, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  if (frame < startFrame || frame > endFrame) return null;

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        fontSize: 38,
        fontWeight: 700,
        color: '#FFFFFF',
        textAlign: 'center',
        maxWidth: '75%',
        textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)',
        lineHeight: 1.4,
      }}
    >
      {text}
    </div>
  );
};

// Slide image component with transitions
const SlideImage: React.FC<{
  slide: string;
  startFrame: number;
  endFrame: number;
}> = ({ slide, startFrame, endFrame }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 20, endFrame - 20, endFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const scale = interpolate(
    frame,
    [startFrame, endFrame],
    [1, 1.05],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  if (frame < startFrame || frame > endFrame) return null;

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <Img
        src={staticFile(slide)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </AbsoluteFill>
  );
};

// Pulsing CTA button
const CTAButton: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();

  if (frame < startFrame) return null;

  const scale = interpolate(
    Math.sin((frame - startFrame) * 0.1),
    [-1, 1],
    [1, 1.05]
  );

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 30],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 60,
        left: '50%',
        transform: `translateX(-50%) scale(${scale})`,
        opacity,
        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        padding: '18px 45px',
        borderRadius: 12,
        boxShadow: '0 8px 30px rgba(245, 158, 11, 0.5)',
      }}
    >
      <span
        style={{
          color: '#FFFFFF',
          fontSize: 26,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 2,
        }}
      >
        Download Free Guide
      </span>
    </div>
  );
};

// Animated logo/brand
const BrandOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 25,
        left: 25,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: 45,
          height: 45,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.5)',
        }}
      >
        <span style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 700 }}>
          CP
        </span>
      </div>
      <span
        style={{
          color: '#FFFFFF',
          fontSize: 18,
          fontWeight: 600,
          textShadow: '0 2px 10px rgba(0,0,0,0.7)',
        }}
      >
        CreditPrivacyNumber.com
      </span>
    </div>
  );
};

// Animated background particles
const BackgroundParticles: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 5 }}>
      {[...Array(15)].map((_, i) => {
        const x = (i * 73 + frame * (0.5 + i * 0.02)) % 1280;
        const y = (i * 47 + frame * (0.3 + i * 0.01)) % 720;
        const size = 3 + (i % 5);
        const opacity = 0.15 + (i % 3) * 0.1;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              background: '#3B82F6',
              opacity,
            }}
          />
        );
      })}
    </div>
  );
};

// Guide showcase section (two-column layout)
const GuideShowcase: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame) return null;

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 30],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const slideIn = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        padding: '80px 60px',
        zIndex: 50,
      }}
    >
      {/* Left side - Guide Video */}
      <div
        style={{
          flex: 1,
          maxWidth: '45%',
          transform: `translateX(${interpolate(slideIn, [0, 1], [-100, 0])}px)`,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
        }}
      >
        <OffthreadVideo
          src={staticFile('guide-video.mp4')}
          style={{
            width: '100%',
            height: 'auto',
          }}
          muted
        />
      </div>

      {/* Right side - Guide Screenshot */}
      <div
        style={{
          flex: 1,
          maxWidth: '45%',
          transform: `translateX(${interpolate(slideIn, [0, 1], [100, 0])}px)`,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
        }}
      >
        <Img
          src={staticFile('guide-screenshot.png')}
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// Main video composition
export const PrivacyHeroVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Get current section for slide display
  const currentSection = SCRIPT_SECTIONS.find(
    (section) => frame >= section.startFrame && frame <= section.endFrame
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0F172A',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Dark base layer */}
      <AbsoluteFill style={{ backgroundColor: '#0F172A' }} />

      {/* Slide images with transitions */}
      {SCRIPT_SECTIONS.map((section, index) => (
        <SlideImage
          key={index}
          slide={section.slide}
          startFrame={section.startFrame}
          endFrame={section.endFrame}
        />
      ))}

      {/* Dark overlay for text readability */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.75) 50%, rgba(15,23,42,0.85) 100%)',
          zIndex: 10,
        }}
      />

      {/* Animated particles */}
      <BackgroundParticles />

      {/* Brand overlay */}
      <BrandOverlay />

      {/* Guide showcase for final sections */}
      {currentSection?.showGuide && (
        <GuideShowcase startFrame={1010} />
      )}

      {/* Main content area - text */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 60,
          zIndex: 20,
        }}
      >
        {SCRIPT_SECTIONS.map((section, index) => (
          <AnimatedText
            key={index}
            text={section.text}
            startFrame={section.startFrame}
            endFrame={section.endFrame}
          />
        ))}
      </AbsoluteFill>

      {/* CTA Button - appears near the end */}
      <CTAButton startFrame={1000} />

      {/* Background music at 28% volume */}
      <Sequence from={0}>
        <Audio src={staticFile('background-music.mp3')} volume={0.28} />
      </Sequence>

      {/* Audio track - 11Labs voiceover */}
      <Sequence from={0}>
        <Audio src={staticFile('voiceover.mp3')} volume={1} />
      </Sequence>
    </AbsoluteFill>
  );
};
