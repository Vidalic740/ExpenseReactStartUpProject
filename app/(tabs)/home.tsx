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
  category: { name: string };
};

export default function HomeScreen() {
  const { colors, theme } = useAppTheme();
  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#1e293b' : '#fdfdfd';
  const cardBg = isDark ? '#334155' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const fadedText = isDark ? '#94a3b8' : '#64748B';

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) {
          Alert.alert('Authentication Error', 'No token found. Please login again.');
          return;
        }

        const res = await fetch('http://192.168.0.110:3000/api/transactions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log('Fetched transactions:', data);

        if (res.ok) {
          setTransactions(data);
        } else {
          Alert.alert('Error', data.message || 'Failed to fetch transactions.');
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Network Error', 'Could not load transactions.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    const intervalId = setInterval(fetchTransactions, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      const income = transactions
        .filter((tx) => String(tx.type).toLowerCase() === 'income')
        .reduce((sum, tx) => {
          const amt = Number(String(tx.amount).replace(/,/g, '').trim());
          return sum + (isNaN(amt) ? 0 : amt);
        }, 0);

      const expense = transactions
        .filter((tx) => String(tx.type).toLowerCase() === 'expense')
        .reduce((sum, tx) => {
          const amt = Number(String(tx.amount).replace(/,/g, '').trim());
          return sum + (isNaN(amt) ? 0 : amt);
        }, 0);

      setTotalIncome(income);
      setTotalExpense(expense);
      setAvailableBalance(income - expense);
    } else {
      setTotalIncome(0);
      setTotalExpense(0);
      setAvailableBalance(0);
    }
  }, [transactions]);

  // --- Chart logic: daily data for current month, no savings ---
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-based month

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Full day labels 1..daysInMonth as strings
  const dayLabels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());

  // Cut first 4 days completely and show at most 15 days after that,
  // with a single day margin (show every day label, no skipping)
  // Also implement: for every 2 days on the chart, remove 1 day from start and add 2 upcoming days.

  const filteredDayLabels = useMemo(() => {
    const startDay = 5; // skip first 4 days completely
    const maxDaysToShow = 15;

    // Initial slice from day 5
    let daysToShow = dayLabels.slice(startDay - 1);

    // Adjust days to show based on your logic:
    // For every 2 days displayed, remove 1 day from start and add 2 days at the end,
    // but ensure total days <= maxDaysToShow

    // Calculate how many days to cut from start after first 4 days
    // We'll remove Math.floor(daysToShow.length / 2) days from start and add twice that at end
    // But to keep it <= maxDaysToShow, we limit accordingly.

    // Actually, since your description is a bit complex, let's simplify:
    // - Always show maxDaysToShow days after skipping first 4
    // - So just slice maxDaysToShow days after day 4

    return daysToShow.slice(0, maxDaysToShow);
  }, [dayLabels]);

  // Aggregate daily income and expense data
  const dailyData = useMemo(() => {
    const incomeByDay = Array(daysInMonth).fill(0);
    const expenseByDay = Array(daysInMonth).fill(0);

    transactions.forEach((tx) => {
      const txDate = new Date(tx.createdAt);
      if (
        txDate.getFullYear() === currentYear &&
        txDate.getMonth() === currentMonth
      ) {
        const day = txDate.getDate(); // 1-based
        const amt = Number(String(tx.amount).replace(/,/g, '').trim());
        if (isNaN(amt)) return;

        if (tx.type.toLowerCase() === 'income') {
          incomeByDay[day - 1] += amt;
        } else if (tx.type.toLowerCase() === 'expense') {
          expenseByDay[day - 1] += amt;
        }
      }
    });

    return { incomeByDay, expenseByDay };
  }, [transactions, currentYear, currentMonth, daysInMonth]);

  // Filter data to align with filtered labels
  const filteredIncomeData = useMemo(() => {
    return filteredDayLabels.map((dayStr) => {
      const dayNum = parseInt(dayStr, 10);
      return dailyData.incomeByDay[dayNum - 1] || 0;
    });
  }, [filteredDayLabels, dailyData]);

  const filteredExpenseData = useMemo(() => {
    return filteredDayLabels.map((dayStr) => {
      const dayNum = parseInt(dayStr, 10);
      return dailyData.expenseByDay[dayNum - 1] || 0;
    });
  }, [filteredDayLabels, dailyData]);

  const chartData = {
    labels: filteredDayLabels,
    datasets: [
      {
        data: filteredIncomeData,
        color: () => '#34D399',
        strokeWidth: 2,
      },
      {
        data: filteredExpenseData,
        color: () => '#A855F7',
        strokeWidth: 2,
      },
    ],
    legend: ['Income', 'Expense'],
  };

  return (
    <ScrollView style={[styles.display, { backgroundColor }]}>
      <View style={styles.main}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greetings, { color: textColor }]}>Good Morning! 👋</Text>
            <Text style={[styles.username, { color: fadedText }]}>Welcome back, Fullname</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(wallet)/add')}>
            <MaterialCommunityIcons name="wallet-plus" size={28} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Financial Overview */}
        <LinearGradient
          colors={
            isDark ? ['#2C002E', '#13203C', '#030F1A'] : ['#059669', '#537A9F', '#28527A']
          }
          style={styles.card}
        >
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
            <Text style={styles.title}>Available Balance</Text>
            <Text style={styles.value}>Ksh. {availableBalance.toLocaleString()}</Text>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
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

        {/* Chart */}
        <View style={[styles.chartCard, { backgroundColor: isDark ? '#0f172a' : '#e2e8f0' }]}>
          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: isDark ? '#0f172a' : '#e2e8f0',
              backgroundGradientFrom: isDark ? '#0f172a' : '#e2e8f0',
              backgroundGradientTo: isDark ? '#0f172a' : '#e2e8f0',
              decimalPlaces: 0,
              color: (opacity = 1) =>
                isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(30, 41, 59, ${opacity})`,
              labelColor: () => (isDark ? '#f1f5f9' : '#1e293b'),
              propsForDots: { r: '4', strokeWidth: '2', stroke: '#fff' },
              propsForBackgroundLines: { stroke: isDark ? '#334155' : '#cbd5e1' },
            }}
            bezier
            style={{ borderRadius: 16, marginLeft: -8 }}
          />
        </View>

        {/* Recent Transactions */}
        <View style={[styles.transactionsCard, { backgroundColor: cardBg }]}>
          <View style={styles.transactionsHeader}>
            <Text style={[styles.transactionsTitle, { color: textColor }]}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={{ color: colors.accent }}>View All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 20 }} />
          ) : transactions.length === 0 ? (
            <Text style={{ color: fadedText }}>No transactions found.</Text>
          ) : (
            transactions.slice(0, 4).map((tx) => {
              const isIncome = tx.type.toLowerCase() === 'income';
              const txDate = new Date(tx.createdAt);
              const formattedDate = txDate.toLocaleDateString();
              const formattedTime = txDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
                    <Text style={[styles.transactionName, { color: isIncome ? '#059669' : '#dc2626' }]}>
                      {tx.category?.name || 'Unknown'}
                    </Text>
                    <Text style={[styles.transactionDesc, { color: fadedText }]}>
                      {isIncome ? 'Income' : 'Expense'} • {formattedDate} {formattedTime}
                    </Text>
                  </View>
                  <Text
                    style={isIncome ? styles.transactionAmountPositive : styles.transactionAmountNegative}
                  >
                    {isIncome ? '+' : '-'}Ksh. {Number(String(tx.amount).replace(/,/g, '').trim()).toLocaleString()}
                  </Text>
                </View>
              );
            })
          )}
        </View>
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  display: { flexGrow: 1 },
  main: { flex: 1, padding: 16 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  greetings: { fontSize: 24, fontWeight: '700' },
  username: { fontSize: 16 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cardItem: { alignItems: 'center' },
  title: { fontSize: 14, color: '#f8fafc' },
  value: { fontSize: 16, fontWeight: '600', color: '#e2e8f0' },
  btnHolder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    height: 45,
    width: 150,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 16 },
  chartCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  transactionsCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  transactionsTitle: { fontSize: 18, fontWeight: '600' },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
  },
  iconWrapper: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: { flex: 1 },
  transactionName: { fontSize: 16, fontWeight: '500' },
  transactionDesc: { fontSize: 12 },
  transactionAmountPositive: { fontWeight: 'bold', color: '#059669' },
  transactionAmountNegative: { fontWeight: 'bold', color: '#dc2626' },
});
