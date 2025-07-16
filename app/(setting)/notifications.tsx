import { useAppTheme } from '@/context/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Button, Platform, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

export default function NotificationScreen() {
  const { colors } = useAppTheme();

  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(false);
  const [dailyReminderTime, setDailyReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [appUpdatesEnabled, setAppUpdatesEnabled] = useState(true);
  const [weeklySummaryEnabled, setWeeklySummaryEnabled] = useState(false);
  const [monthlySummaryEnabled, setMonthlySummaryEnabled] = useState(true);

  const [budgetThresholdEnabled, setBudgetThresholdEnabled] = useState(false);
  const [tipsAndSuggestionsEnabled, setTipsAndSuggestionsEnabled] = useState(false);

  const onChangeTime = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setDailyReminderTime(selectedDate);
    }
  };

  return (
    <ScrollView style={[styles.main, { backgroundColor: colors.background }]}>

      {/* Daily Reminder */}
      <View style={styles.option}>
        <Text style={[styles.label, { color: colors.text }]}>
          Daily expense/income reminder
        </Text>
        <Switch
          value={dailyReminderEnabled}
          onValueChange={setDailyReminderEnabled}
        />
      </View>

      {dailyReminderEnabled && (
        <View style={styles.timePickerContainer}>
          <Text style={[styles.subLabel, { color: colors.text }]}>Reminder Time:</Text>
          <Button title={dailyReminderTime.toLocaleTimeString()} onPress={() => setShowTimePicker(true)} />
          {showTimePicker && (
            <DateTimePicker
              value={dailyReminderTime}
              mode="time"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeTime}
            />
          )}
        </View>
      )}

      {/* App Updates */}
      <View style={styles.option}>
        <Text style={[styles.label, { color: colors.text }]}>New app updates</Text>
        <Switch value={appUpdatesEnabled} onValueChange={setAppUpdatesEnabled} />
      </View>

      {/* Weekly Summary */}
      <View style={styles.option}>
        <Text style={[styles.label, { color: colors.text }]}>Weekly expense summary</Text>
        <Switch value={weeklySummaryEnabled} onValueChange={setWeeklySummaryEnabled} />
      </View>

      {/* Monthly Summary */}
      <View style={styles.option}>
        <Text style={[styles.label, { color: colors.text }]}>Monthly expense summary</Text>
        <Switch value={monthlySummaryEnabled} onValueChange={setMonthlySummaryEnabled} />
      </View>

      {/* Budget Threshold Notification */}
      <View style={styles.option}>
        <Text style={[styles.label, { color: colors.text }]}>Notify when nearing budget limit</Text>
        <Switch value={budgetThresholdEnabled} onValueChange={setBudgetThresholdEnabled} />
      </View>

      {/* Tips and Suggestions */}
      <View style={styles.option}>
        <Text style={[styles.label, { color: colors.text }]}>Finance tips & suggestions</Text>
        <Switch value={tipsAndSuggestionsEnabled} onValueChange={setTipsAndSuggestionsEnabled} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 16,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
  subLabel: {
    fontSize: 14,
    marginBottom: 3,
  },
  timePickerContainer: {
    marginVertical: 6,
  },
});
