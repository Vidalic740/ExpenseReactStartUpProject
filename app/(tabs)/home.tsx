import { useAppTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

type Transaction = {
  id: string;
  amount: number | string;
  type: string;
  createdAt: string;
  category: { name: string } | null;
};

type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
};

type PredefinedBill = {
  id: string;
  name: string;
  amount: number;
};

export default function HomeScreen() {
  const { colors, theme } = useAppTheme();
  const isDark = theme === 'dark';

  // UI state
  const [greeting, setGreeting] = useState('Hello');
  const [fullName, setFullName] = useState('Fullname');
  const [loading, setLoading] = useState(true);
  const [showBillSheet, setShowBillSheet] = useState(false);

  // Data state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [predefinedBills, setPredefinedBills] = useState<PredefinedBill[]>([]);

  // Totals
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);

  // --- Load saved user bills from secure storage (unchanged) ---
  useEffect(() => {
    const loadBills = async () => {
      const saved = await SecureStore.getItemAsync('userBills');
      if (saved) setBills(JSON.parse(saved));
    };
    loadBills();
  }, []);

  // --- Save bill helper (unchanged) ---
  const saveBill = async (newBill: Bill) => {
    const updated = [...bills, newBill];
    setBills(updated);
    await SecureStore.setItemAsync('userBills', JSON.stringify(updated));
  };

  // --- Add custom bill flow (unchanged logic) ---
  const handleAddCustomBill = async () => {
    setShowBillSheet(false);
    // Note: Alert.prompt behaves differently on Android/iOS; kept as originally used.
    Alert.prompt('Add Bill', 'Enter bill name:', async (name) => {
      if (!name) return;
      Alert.prompt('Amount', 'Enter amount (Ksh):', async (amountStr) => {
        const amount = Number(amountStr);
        if (isNaN(amount)) return Alert.alert('Invalid', 'Enter a valid amount.');
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 5);
        await saveBill({
          id: Date.now().toString(),
          name,
          amount,
          dueDate: dueDate.toISOString(),
        });
        Alert.alert('Success', 'New bill added!');
      });
    });
  };

  // --- Greeting by time (unchanged) ---
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('Good Morning');
    else if (hour >= 12 && hour < 16) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // --- Fetch profile (unchanged API call) ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) return;

        const res = await fetch('http://192.168.2.105:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();

        if (data?.profile?.firstname && data?.profile?.surname) {
          setFullName(`${data.profile.firstname} ${data.profile.surname}`);
        } else if (data?.email) {
          setFullName(data.email.split('@')[0]);
        }
      } catch (err) {
        console.log('Profile fetch failed:', err);
      }
    };
    fetchProfile();
  }, []);

  // --- Fetch transactions periodically (unchanged API call + interval) ---
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) return;
        const res = await fetch('http://192.168.2.105:5000/api/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) setTransactions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
    const intervalId = setInterval(fetchTransactions, 10000);
    return () => clearInterval(intervalId);
  }, []);

  // --- Compute totals (unchanged calculation) ---
  useEffect(() => {
    const income = transactions
      .filter((t) => t.type.toLowerCase() === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = transactions
      .filter((t) => t.type.toLowerCase() === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    setTotalIncome(income);
    setTotalExpense(expense);
    setAvailableBalance(income - expense);
  }, [transactions]);

  // --- Chart data assembly (kept the same) ---
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dayLabels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
  const filteredDayLabels = dayLabels.slice(4, 19);

  const dailyData = useMemo(() => {
    const incomeByDay = Array(daysInMonth).fill(0);
    const expenseByDay = Array(daysInMonth).fill(0);
    transactions.forEach((tx) => {
      const d = new Date(tx.createdAt);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        const day = d.getDate() - 1;
        const amt = Number(tx.amount);
        if (tx.type.toLowerCase() === 'income') incomeByDay[day] += amt;
        else expenseByDay[day] += amt;
      }
    });
    return { incomeByDay, expenseByDay };
  }, [transactions]);

  const chartData = {
    labels: filteredDayLabels,
    datasets: [
      { data: filteredDayLabels.map((d) => dailyData.incomeByDay[parseInt(d) - 1]), color: () => colors.success ?? '#34D399' },
      { data: filteredDayLabels.map((d) => dailyData.expenseByDay[parseInt(d) - 1]), color: () => colors.danger ?? '#EF4444' },
    ],
    legend: ['Income', 'Expense'],
  };

  // --- Fetch predefined bills (unchanged API call) ---
  useEffect(() => {
    const fetchBillCategories = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) return;
        const res = await fetch('http://192.168.2.105:5000/api/categories/bills', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch bill categories');
        const data = await res.json();
        if (Array.isArray(data.categories)) setPredefinedBills(data.categories);
      } catch (err) {
        console.error('Error fetching bill categories:', err);
      }
    };
    fetchBillCategories();
  }, []);

  // --- Select a predefined bill (unchanged logic) ---
  const handleSelectBill = async (item: { name: string; amount: number }) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    await saveBill({
      id: Date.now().toString(),
      name: item.name,
      amount: item.amount,
      dueDate: dueDate.toISOString(),
    });
    setShowBillSheet(false);
    Alert.alert('Bill Added', `${item.name} added successfully.`);
  };

  // --- UI ---
  return (
    <ScrollView style={[styles.display, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greetings, { color: colors.text }]}>{greeting} 👋</Text>
            <Text style={[styles.username, { color: colors.subText }]}>Welcome back, {fullName}</Text>
          </View>
          <TouchableOpacity
            style={[styles.headerIcon, { backgroundColor: colors.card }]}
            onPress={() => router.push('/(wallet)/business-wallet')}
          >
            <MaterialCommunityIcons name="wallet-plus" size={22} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Overview — gradient card */}
        <LinearGradient
          colors={[colors.accent, '#537A9F', '#28527A']}
          style={styles.overviewCard}
        >
          <View style={styles.overviewCol}>
            <MaterialCommunityIcons name="wallet-outline" size={22} color="#fff" />
            <Text style={styles.overviewLabel}>Total Income</Text>
            <Text style={styles.overviewValue}>Ksh {totalIncome.toLocaleString()}</Text>
          </View>
          <View style={styles.overviewCol}>
            <MaterialCommunityIcons name="trending-down" size={22} color="#fff" />
            <Text style={styles.overviewLabel}>Expenses</Text>
            <Text style={styles.overviewValue}>Ksh {totalExpense.toLocaleString()}</Text>
          </View>
          <View style={styles.overviewCol}>
            <MaterialCommunityIcons name="cash-multiple" size={22} color="#fff" />
            <Text style={styles.overviewLabel}>Available</Text>
            <Text style={styles.overviewValue}>Ksh {availableBalance.toLocaleString()}</Text>
          </View>
        </LinearGradient>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.success }]} onPress={() => router.push('/(add)/income')}>
            <MaterialCommunityIcons name="arrow-up-bold-circle" size={20} color="#fff" />
            <Text style={styles.actionText}>Add Income</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.danger }]} onPress={() => router.push('/(add)/expense')}>
            <MaterialCommunityIcons name="arrow-down-bold-circle" size={20} color="#fff" />
            <Text style={styles.actionText}>Add Expense</Text>
          </TouchableOpacity>
        </View>

        {/* Chart */}
        <View style={[styles.chartCard, { backgroundColor: colors.card, shadowColor: colors.shadow ?? '#000' }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>This Month</Text>
            <Text style={{ color: colors.subText }}>Last 14 days</Text>
          </View>
          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: colors.card,
              backgroundGradientFrom: colors.card,
              backgroundGradientTo: colors.card,
              decimalPlaces: 0,
              color: (opacity = 1) => (isDark ? `rgba(255,255,255,${opacity})` : `rgba(17,24,39,${opacity})`),
              labelColor: () => colors.subText,
              propsForDots: { r: '3' },
            }}
            bezier
            style={{ borderRadius: 14, marginTop: 6 }}
          />
        </View>

        {/* Recent Transactions */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/transactions')}>
              <Text style={{ color: colors.accent, fontWeight: '600' }}>View All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.accent} style={{ marginVertical: 20 }} />
          ) : transactions.length === 0 ? (
            <Text style={{ color: colors.subText }}>No transactions found.</Text>
          ) : (
            transactions.slice(0, 5).map((tx) => {
              const isIncome = tx.type.toLowerCase() === 'income';
              const txDate = new Date(tx.createdAt);
              return (
                <View
                  key={tx.id}
                  style={[
                    styles.transactionItem,
                    { backgroundColor: isIncome ? '#ecfdf5' : '#fff1f2' },
                  ]}
                >
                  <View style={[styles.iconWrapper, { backgroundColor: isIncome ? colors.success : colors.danger }]}>
                    <MaterialCommunityIcons name={isIncome ? 'arrow-up-bold' : 'arrow-down-bold'} size={18} color="#fff" />
                  </View>

                  <View style={styles.transactionInfo}>
                    <Text style={[styles.transactionName, { color: isIncome ? colors.success : colors.danger }]}>
                      {tx.category?.name || 'Unknown'}
                    </Text>
                    <Text style={[styles.transactionDesc, { color: colors.subText }]}>
                      {tx.type} • {txDate.toLocaleDateString()}
                    </Text>
                  </View>

                  <Text style={{ fontWeight: '700', color: isIncome ? colors.success : colors.danger }}>
                    {isIncome ? '+' : '-'}Ksh {Number(tx.amount).toLocaleString()}
                  </Text>
                </View>
              );
            })
          )}
        </View>

        {/* Upcoming Bills */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Bills</Text>
            <TouchableOpacity onPress={() => setShowBillSheet(true)}>
              <Text style={{ color: colors.accent, fontWeight: '600' }}>Add</Text>
            </TouchableOpacity>
          </View>

          {bills.length === 0 ? (
            <Text style={{ color: colors.subText }}>No upcoming bills.</Text>
          ) : (
            bills.map((bill) => (
              <View key={bill.id} style={[styles.transactionItem, { backgroundColor: '#fff7ed' }]}>
                <View style={[styles.iconWrapper, { backgroundColor: colors.warning ?? '#f59e0b' }]}>
                  <MaterialCommunityIcons name="calendar-month" size={18} color="#fff" />
                </View>

                <View style={styles.transactionInfo}>
                  <Text style={[styles.transactionName, { color: colors.warning ?? '#b45309' }]}>{bill.name}</Text>
                  <Text style={[styles.transactionDesc, { color: colors.subText }]}>
                    Due {new Date(bill.dueDate).toLocaleDateString()}
                  </Text>
                </View>

                <Text style={{ fontWeight: '700', color: colors.warning ?? '#b45309' }}>
                  Ksh {bill.amount.toLocaleString()}
                </Text>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Bill Selection Modal */}
      <Modal visible={showBillSheet} transparent animationType="slide" onRequestClose={() => setShowBillSheet(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowBillSheet(false)} />
        <View style={[styles.sheet, { backgroundColor: colors.card }]}>
          <Text style={[styles.sheetTitle, { color: colors.text }]}>Select a Recurring Bill</Text>
          <ScrollView style={{ maxHeight: 380, marginBottom: 8 }}>
            {predefinedBills.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.sheetItem}
                onPress={() => handleSelectBill(item)}
              >
                <MaterialCommunityIcons name="checkbox-marked-circle" size={22} color={colors.accent} />
                <Text style={[styles.sheetText, { color: colors.text }]}>{item.name}</Text>
                <Text style={{ color: colors.subText }}>Ksh {item.amount?.toLocaleString?.() ?? item.amount}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity onPress={handleAddCustomBill} style={[styles.sheetBtn, { backgroundColor: colors.accent }]}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Add Custom Bill</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  display: { flex: 1 },
  container: { padding: 16 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  greetings: { fontSize: 26, fontWeight: '700' },
  username: { fontSize: 16, fontWeight: '600' },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  overviewCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 18,
    elevation: 3,
  },
  overviewCol: { alignItems: 'center', width: '30%' },
  overviewLabel: { color: '#e6eef7', fontSize: 12, marginTop: 6 },
  overviewValue: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 6 },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    gap: 8,
  },
  actionText: { color: '#fff', marginLeft: 8, fontWeight: '700' },

  chartCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    elevation: 2,
  },

  sectionCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    elevation: 1,
  },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },

  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 12,
    padding: 10,
  },
  iconWrapper: { borderRadius: 12, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  transactionInfo: { flex: 1 },
  transactionName: { fontSize: 15, fontWeight: '700' },
  transactionDesc: { fontSize: 12 },

  // Modal / sheet
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 18,
    maxHeight: '70%',
  },
  sheetTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#e6e6e6',
    gap: 12,
  },
  sheetText: { flex: 1, fontSize: 15 },
  sheetBtn: { marginTop: 12, borderRadius: 12, alignItems: 'center', padding: 14 },
});
