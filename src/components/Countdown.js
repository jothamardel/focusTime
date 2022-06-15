import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors } from '../utils/colors';
import { fontSizes, spacing } from '../utils/sizes';

const minutesToMilles = (min) => min * 1000 * 60;

const formatTime = (time) => (time < 10 ? `0${time}` : time);

export const Countdown = ({ minutes = 1, isPaused, onProgress, onEnd }) => {
  const [millis, setMillis] = useState(null);
  const interval = React.useRef(null);
  const countDown = () => {
    setMillis((time) => {
      if (time === 0) {
        clearInterval(interval.current);
        return time;
      }

      const timeLeft = time - 1000;
      // report the progress
      return timeLeft;
    });
  };

  useEffect(() => {
    setMillis(minutesToMilles(minutes));
  }, [minutes]);

  useEffect(() => {
    onProgress(millis / minutesToMilles(minutes));
    if(millis === 0) {
      onEnd();
    }
  }, [millis])

  useEffect(() => {
    if (isPaused) {
      if (interval.current) clearInterval(interval.current);
      return;
    }
    interval.current = setInterval(countDown, 1000);
    return () => clearInterval(interval.current);
  }, [isPaused]);

  const minute = Math.floor(millis / 1000 / 60) % 60;
  const seconds = Math.floor(millis / 1000) % 60;

  return (
    <Text style={styles.text}>
      {formatTime(minutes)}:{formatTime(seconds)}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.white,
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    padding: spacing.lg,
    backgroundColor: 'rgba(94, 132, 226, 0.3)',
  },
});
