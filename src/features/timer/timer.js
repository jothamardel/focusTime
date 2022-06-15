import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Vibration, Platform } from 'react-native';
import { ProgressBar } from 'react-native-paper';

import { Countdown } from '../../components/Countdown';
import { RoundedButton } from '../../components/RoundedButton';
import { Timing } from './Timing';

import { spacing } from '../../utils/sizes';
import { colors } from '../../utils/colors';

import { useKeepAwake } from 'expo-keep-awake';

const DEFAULT_TIME = 0.1

export const Timer = ({ focusSubject, onTimerEnd, clearSubject }) => {
  useKeepAwake();
  const [isStarted, setIsStarted] = useState(false);
  const [minutes, setMinutes] = useState(DEFAULT_TIME);
  const [progress, setProgress] = useState(1);

  const onProgress = (progress) => {
    setProgress(progress);
  };

  const vibrate = () => {
    if(Platform.OS === 'ios') {
      const interval = setInterval(() => Vibration.vibrate(), 1000)
      setTimeout(() => clearInterval(interval), 10000)
    } else {
      Vibration.vibrate(5000)
    }
  }

  const onEnd = () => {
    vibrate()
    setMinutes(DEFAULT_TIME);
    setProgress(1);
    setIsStarted(false);
    onTimerEnd()
  }

  const changeTime = (min) => {
    setMinutes(min);
    setProgress(1);
    setIsStarted(false);
  };

  // const clearSubject = () => {

  // }

  return (
    <View style={styles.container}>
      <View style={styles.countdown}>
        <Countdown
          minutes={minutes}
          isPaused={!isStarted}
          onProgress={onProgress}
          onEnd={onEnd}
        />
      </View>
      <View style={{ paddingTop: spacing.xxxl }}>
        <Text style={styles.title}>Focusing on: </Text>
        <Text style={styles.task}>{focusSubject}</Text>
      </View>
      <ProgressBar
        color="#5E84E2"
        style={{ height: 10, marginTop: spacing.sm }}
        progress={progress}
      />
      <View style={styles.buttonWrapper}>
        <Timing onChangeTime={changeTime} />
      </View>
      <View style={styles.buttonWrapper}>
        <RoundedButton
          title={`${isStarted ? 'pause ' : 'start'}`}
          onPress={() => setIsStarted(!isStarted)}
        />
      </View>
       <View
        style={styles.clearSubject}
       >
          <RoundedButton
            title="-"
            size={50}
            onPress={() => {
              clearSubject();
            }}
          />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    flexDirection: 'row',
  },
  clearSubject: {
    paddingBottom: 25,
    paddingLeft: 25
  },
  container: {
    flex: 1,
  },
  countdown: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  task: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  title: {
    color: colors.white,
    textAlign: 'center',
  },
});
