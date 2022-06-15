import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, AsyncStorage } from 'react-native';
import { colors } from './src/utils/colors';
import { spacing } from './src/utils/sizes';
import { Focus } from './src/features/focus/focus';
import { FocusHistory } from './src/features/focus/focusHistory';
import { Timer } from './src/features/timer/timer';

const STATUSES = {
  COMPLETE: 1,
  CANCELLED: 2,
};

export default function App() {
  const [focusSubject, setFocusSubject] = useState(null);
  const [focusHistory, setFocusHistory] = useState([]);

  const addFocusHistorySubjectWithStatus = (subject, status) => {
    setFocusHistory([...focusHistory, { subject, status, key: String(focusHistory.length + 1) }]);
  };

  const onClear = () => {
    setFocusHistory([])
  }

  const saveFocusHistory = async () => {
    try {
      await AsyncStorage.setItem('focusHistory', JSON.stringify(focusHistory));
    } catch (err) {
      console.log(err)
    }
  }

  const loadFocusHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('focusHistory');
      if(history && JSON.parse(history).length) {
        setFocusHistory(JSON.parse(history))
      }

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    saveFocusHistory();
  }, [focusHistory.length])


  useEffect(() => {
    loadFocusHistory();
  }, [])

  return (
    <View style={styles.container}>
      {focusSubject ? (
        <Timer
          focusSubject={focusSubject}
          onTimerEnd={() => {
            addFocusHistorySubjectWithStatus(focusSubject, STATUSES.COMPLETE);
            setFocusSubject(null);
          }}
          clearSubject={() => {
            addFocusHistorySubjectWithStatus(focusSubject, STATUSES.CANCELLED);
            setFocusSubject(null);
          }}
        />
      ) : (
        <View style={{flex: 1}}>
          <Focus addSubject={setFocusSubject} />
          <FocusHistory
            focusHistory={focusHistory}
            onClear={onClear}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? spacing.xxl : spacing.xxxl - 12,
    backgroundColor: colors.darkBlue,
  },
});
