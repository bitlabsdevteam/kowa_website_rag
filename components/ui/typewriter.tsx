'use client';

// Typewriter — types/deletes through one or more strings with a blinking cursor.
//
// Adapted from a shadcn/Tailwind drop-in to this project's vanilla-CSS system:
// the missing `cn` util and Tailwind classes were replaced with a local class
// joiner and the `.typewriter*` rules in app/globals.css. The framer-motion
// cursor animation is unchanged.

import { useEffect, useMemo, useState } from 'react';
import { motion, type Variants } from 'framer-motion';

function joinClasses(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

interface TypewriterProps {
  text: string | string[];
  speed?: number;
  initialDelay?: number;
  waitTime?: number;
  deleteSpeed?: number;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
  hideCursorOnType?: boolean;
  cursorChar?: string | React.ReactNode;
  cursorAnimationVariants?: {
    initial: Variants['initial'];
    animate: Variants['animate'];
  };
  cursorClassName?: string;
}

const Typewriter = ({
  text,
  speed = 50,
  initialDelay = 0,
  waitTime = 2000,
  deleteSpeed = 30,
  loop = true,
  className,
  showCursor = true,
  hideCursorOnType = false,
  cursorChar = '|',
  cursorClassName = 'typewriter-cursor',
  cursorAnimationVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.01,
        repeat: Infinity,
        repeatDelay: 0.4,
        repeatType: 'reverse',
      },
    },
  },
}: TypewriterProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  // Reset all typing state whenever the source text changes (e.g. a locale
  // switch). Without this, a non-looping instance that has finished typing
  // never re-runs, so it keeps stale characters from the previous language.
  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsDeleting(false);
    setCurrentTextIndex(0);
  }, [texts]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const currentText = texts[currentTextIndex];

    const startTyping = () => {
      if (isDeleting) {
        if (displayText === '') {
          setIsDeleting(false);
          if (currentTextIndex === texts.length - 1 && !loop) {
            return;
          }
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          setCurrentIndex(0);
          timeout = setTimeout(() => {}, waitTime);
        } else {
          timeout = setTimeout(() => {
            setDisplayText((prev) => prev.slice(0, -1));
          }, deleteSpeed);
        }
      } else {
        if (currentIndex < currentText.length) {
          timeout = setTimeout(() => {
            setDisplayText((prev) => prev + currentText[currentIndex]);
            setCurrentIndex((prev) => prev + 1);
          }, speed);
        } else if (texts.length > 1) {
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, waitTime);
        }
      }
    };

    // Apply initial delay only at the start
    if (currentIndex === 0 && !isDeleting && displayText === '') {
      timeout = setTimeout(startTyping, initialDelay);
    } else {
      startTyping();
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, displayText, isDeleting, speed, deleteSpeed, waitTime, texts, currentTextIndex, loop, initialDelay]);

  return (
    <span className={joinClasses('typewriter', className)}>
      <span>{displayText}</span>
      {showCursor && (
        <motion.span
          variants={cursorAnimationVariants}
          className={joinClasses(
            cursorClassName,
            hideCursorOnType && (currentIndex < texts[currentTextIndex].length || isDeleting) ? 'is-hidden' : '',
          )}
          initial="initial"
          animate="animate"
        >
          {cursorChar}
        </motion.span>
      )}
    </span>
  );
};

export { Typewriter };
