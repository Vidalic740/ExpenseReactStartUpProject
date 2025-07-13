import { Stack } from 'expo-router';

export default function AddLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="income"
        options={{ title: 'Add Income' }} 
      />
      <Stack.Screen
        name="expense"
        options={{ title: 'Add Expense' }}
      />
    </Stack>
  );
}
