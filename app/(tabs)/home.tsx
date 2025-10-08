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
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

type Transaction = {
  id: string;
  amount: number | string;
  type: string;
  createdAt: string;
  category: { name: string };
};

type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
};

export default function HomeScreen() {
  const { colors, theme } = useAppTheme();
  const isDark = theme === 'dark';
  const backgroundColor = colors.background;
  const cardBg = colors.card;

  const textColor = colors.text;
  const fadedText = colors.subText;

  const [greeting, setGreeting] = useState('Hello');
  const [fullName, setFullName] = useState('Fullname');

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBillSheet, setShowBillSheet] = useState(false);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);

  // 🧾 Load saved bills
  useEffect(() => {
    const loadBills = async () => {
      const saved = await SecureStore.getItemAsync('userBills');
      if (saved) setBills(JSON.parse(saved));
    };
    loadBills();
  }, []);

  // 📦 Save bill helper
  const saveBill = async (newBill: Bill) => {
    const updated = [...bills, newBill];
    setBills(updated);
    await SecureStore.setItemAsync('userBills', JSON.stringify(updated));
  };

  // ➕ Add a bill manually (custom)
  const handleAddCustomBill = async () => {
    setShowBillSheet(false);
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

  // 🕒 Set greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12){
	    setGreeting('Good Morning');
    } else if (hour >= 12 && hour < 16){
	    setGreeting('Good Afternoon');
    } else if (hour >= 17 && hour < 21){
	    setGreeting('Good Evening');
    } else {
	   setGreeting ('Good Evening');
    }
  }, []);

  // 👤 Fetch user's profile name
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

  // 🧩 Fetch transactions
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

  // 💰 Compute totals
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

  // 📆 Chart data
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
      { data: filteredDayLabels.map((d) => dailyData.incomeByDay[parseInt(d) - 1]), color: () => '#34D399' },
      { data: filteredDayLabels.map((d) => dailyData.expenseByDay[parseInt(d) - 1]), color: () => '#A855F7' },
    ],
    legend: ['Income', 'Expense'],
  };

  const predefinedBills = [
    { name: 'Rent', amount: 15000 },
    { name: 'Water Bill', amount: 500 },
    { name: 'Electricity Bill', amount: 2000 },
    { name: 'Internet (WiFi)', amount: 2500 },
    { name: 'Netflix', amount: 1200 },
    { name: 'Spotify', amount: 600 },
    { name: 'DStv', amount: 2500 },
    { name: 'Gym Subscription', amount: 3000 },
  ];

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

  return (
    <ScrollView style={[styles.display, { backgroundColor }]}>
      <View style={styles.main}>
        {/* 👋 Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greetings, { color: textColor }]}> {greeting} 👋</Text>
            <Text style={[styles.username, { color: fadedText }]}>Welcome back, {fullName}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(wallet)/add')}>
            <MaterialCommunityIcons name="wallet-plus" size={28} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* 💳 Overview */}
        <LinearGradient colors={[colors.accent, '#537A9F', '#28527A']} style={styles.card}>
          <View style={styles.cardItem}>
            <MaterialCommunityIcons name="wallet" size={24} color="#fff" />
            <Text style={styles.title}>Total Earnings</Text>
            <Text style={styles.value}>Ksh. {totalIncome.toLocaleString()}</Text>
          </View>
          <View style={styles.cardItem}>
            <MaterialCommunityIcons name="trending-down" size={24} color="#fff" />
            <Text style={styles.title}>Expense</Text>
            <Text style={styles.value}>Ksh. {totalExpense.toLocaleString()}</Text>
          </View>
          <View style={styles.cardItem}>
            <MaterialCommunityIcons name="cash" size={24} color="#fff" />
            <Text style={styles.title}>Available</Text>
            <Text style={styles.value}>Ksh. {availableBalance.toLocaleString()}</Text>
          </View>
        </LinearGradient>

        {/* ⚡ Buttons */}
        <View style={styles.btnHolder}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#059669' }]}
            onPress={() => router.push('/(add)/income')}
          >
            <Text style={styles.btnText}>Add Income</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#dc2626' }]}
            onPress={() => router.push('/(add)/expense')}
          >
            <Text style={styles.btnText}>Add Expense</Text>
          </TouchableOpacity>
        </View>

        {/* 📈 Chart */}
        <View style={[styles.chartCard, { backgroundColor: cardBg }]}>
          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: cardBg,
              backgroundGradientFrom: cardBg,
              backgroundGradientTo: cardBg,
              decimalPlaces: 0,
              color: (opacity = 1) =>
                isDark ? `rgba(255,255,255,${opacity})` : `rgba(30,41,59,${opacity})`,
              labelColor: () => textColor,
            }}
            bezier
            style={{ borderRadius: 16, marginLeft: -8 }}
          />
        </View>

        {/* 💳 Recent Transactions */}
        <View style={[styles.transactionsCard, { backgroundColor: cardBg }]}>
          <View style={styles.transactionsHeader}>
            <Text style={[styles.transactionsTitle, { color: textColor }]}>Recent Transactions</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 20 }} />
          ) : transactions.length === 0 ? (
            <Text style={{ color: fadedText }}>No transactions found.</Text>
          ) : (
            transactions.slice(0, 5).map((tx) => {
              const isIncome = tx.type.toLowerCase() === 'income';
              const txDate = new Date(tx.createdAt);
              return (
                <View
                  key={tx.id}
                  style={[
                    styles.transactionItem,
                    { backgroundColor: isIncome ? '#d1fae5' : '#fee2e2' },
                  ]}
                >
                  <View
                    style={[
                      styles.iconWrapper,
                      { backgroundColor: isIncome ? '#059669' : '#dc2626' },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={isIncome ? 'arrow-up-bold' : 'arrow-down-bold'}
                      size={20}
                      color="#fff"
                    />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text
                      style={[
                        styles.transactionName,
                        { color: isIncome ? '#059669' : '#dc2626' },
                      ]}
                    >
                      {tx.category?.name || 'Unknown'}
                    </Text>
                    <Text style={[styles.transactionDesc, { color: fadedText }]}>
                      {tx.type} • {txDate.toLocaleDateString()}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: isIncome ? '#059669' : '#dc2626',
                    }}
                  >
                    {isIncome ? '+' : '-'}Ksh. {Number(tx.amount).toLocaleString()}
                  </Text>
                </View>
              );
            })
          )}
        </View>

        {/* 🧾 Upcoming Bills (Now BELOW Transactions) */}
        <View style={[styles.transactionsCard, { backgroundColor: cardBg }]}>
          <View style={styles.transactionsHeader}>
            <Text style={[styles.transactionsTitle, { color: textColor }]}>Upcoming Bills</Text>
            <TouchableOpacity onPress={() => setShowBillSheet(true)}>
              <Text style={{ color: colors.accent }}>Add Bill</Text>
            </TouchableOpacity>
          </View>

          {bills.length === 0 ? (
            <Text style={{ color: fadedText }}>No upcoming bills.</Text>
          ) : (
            bills.map((bill) => {
              const due = new Date(bill.dueDate);
              const diffDays = Math.ceil(
                (due.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              return (
                <View key={bill.id} style={[styles.transactionItem, { backgroundColor: '#fef3c7' }]}>
                  <View style={[styles.iconWrapper, { backgroundColor: '#f59e0b' }]}>
                    <MaterialCommunityIcons name="calendar-clock" size={20} color="#fff" />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={[styles.transactionName, { color: '#b45309' }]}>{bill.name}</Text>
                    <Text style={[styles.transactionDesc, { color: fadedText }]}>
                      Due in {diffDays} day(s)
                    </Text>
                  </View>
                  <Text style={{ fontWeight: 'bold', color: '#b45309' }}>
                    Ksh. {bill.amount.toLocaleString()}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </View>

      {/* 📜 Bottom Sheet Modal */}
      <Modal visible={showBillSheet} transparent animationType="slide" onRequestClose={() => setShowBillSheet(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowBillSheet(false)} />
        <View style={[styles.sheet, { backgroundColor: cardBg }]}>
          <Text style={[styles.sheetTitle, { color: textColor }]}>Select a Recurring Bill</Text>
          <ScrollView style={{ maxHeight: 400 }}>
            {predefinedBills.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={styles.sheetItem}
                onPress={() => handleSelectBill(item)}
              >
                <MaterialCommunityIcons name="checkbox-marked-circle" size={22} color={colors.accent} />
                <Text style={[styles.sheetText, { color: textColor }]}>{item.name}</Text>
                <Text style={{ color: fadedText }}>Ksh. {item.amount.toLocaleString()}</Text>
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
  display: { flexGrow: 1 },
  main: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 20 },
  greetings: { fontSize: 26, fontWeight: '700' },
  username: { fontSize: 22, fontWeight: '700' },
  card: { flexDirection: 'row', justifyContent: 'space-around', borderRadius: 20, padding: 20, marginBottom: 14 },
  cardItem: { alignItems: 'center' },
  title: { fontSize: 14, color: '#f8fafc' },
  value: { fontSize: 16, fontWeight: '600', color: '#e2e8f0' },
  btnHolder: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  button: { height: 45, width: 150, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16 },
  chartCard: { padding: 16, borderRadius: 16, marginBottom: 20 },
  transactionsCard: { padding: 16, borderRadius: 16, marginBottom: 30, elevation: 2 },
  transactionsHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  transactionsTitle: { fontSize: 18, fontWeight: '600' },
  transactionItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderRadius: 12, padding: 12 },
  iconWrapper: { borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  transactionInfo: { flex: 1 },
  transactionName: { fontSize: 16, fontWeight: '500' },
  transactionDesc: { fontSize: 12 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  sheetTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  sheetItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderColor: '#ccc' },
  sheetText: { flex: 1, marginLeft: 8, fontSize: 16 },
  sheetBtn: { marginTop: 16, borderRadius: 12, alignItems: 'center', padding: 14 },
});

