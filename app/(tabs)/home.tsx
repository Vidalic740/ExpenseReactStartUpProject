import { useAppTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const { colors, theme } = useAppTheme();
  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#1e293b' : '#fdfdfd';
  const cardBg = isDark ? '#334155' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const fadedText = isDark ? '#94a3b8' : '#64748B';

  type Transaction = {
    id: string;
    title: string;
    amount: number | string;
    type: 'income' | 'expense';
    date: string;
  };

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        Alert.alert('Authentication Error', 'No token found. Please login again.');
        return;
      }

      const res = await fetch('http://192.168.70.19:3000/api/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

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
}, []);


  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { data: [45000, 52000, 48000, 55000, 50000, 58000], color: () => '#34D399', strokeWidth: 2 },
      { data: [32000, 38000, 35000, 42000, 39000, 45000], color: () => '#A855F7', strokeWidth: 2 },
      { data: [13000, 14000, 13000, 13000, 11000, 13000], color: () => '#22D3EE', strokeWidth: 2 },
    ],
    legend: ['Income', 'Expense', 'Savings'],
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
            <Text style={styles.title}>Total Amount</Text>
            <Text style={styles.value}>Ksh. 20,000</Text>
          </View>
          <View style={styles.cardItem}>
            <MaterialCommunityIcons name="trending-down" size={24} color="#fff" />
            <Text style={styles.title}>Expense</Text>
            <Text style={styles.value}>Ksh. 5,000</Text>
          </View>
          <View style={styles.cardItem}>
            <MaterialCommunityIcons name="cash" size={24} color="#fff" />
            <Text style={styles.title}>Available Balance</Text>
            <Text style={styles.value}>Ksh. 15,000</Text>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.btnHolder}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#059669' }]} onPress={() => router.push('/(add)/income')}>
            <Text style={styles.btnText}>Add Income</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#dc2626' }]} onPress={() => router.push('/(add)/expense')}>
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
              color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(30, 41, 59, ${opacity})`,
              labelColor: () => isDark ? '#f1f5f9' : '#1e293b',
              propsForDots: { r: '4', strokeWidth: '2', stroke: '#fff' },
            }}
            bezier
            style={{ borderRadius: 16, marginLeft: -8 }}
          />
        </View>

        {/* Recent Transactions */}
        <View style={[styles.transactionsCard, { backgroundColor: cardBg }]}>
          <View style={styles.transactionsHeader}>
            <Text style={[styles.transactionsTitle, { color: textColor }]}>Recent Transactions</Text>
            <TouchableOpacity><Text style={{ color: colors.accent }}>View All</Text></TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 20 }} />
          ) : transactions.length === 0 ? (
            <Text style={{ color: fadedText }}>No transactions found.</Text>
          ) : (
            transactions.slice(0, 4).map((tx) => (
              <View
                key={tx.id}
                style={[styles.transactionItem, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    {
                      backgroundColor: tx.type === 'income' ? '#d1fae5' : '#fee2e2',
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={tx.type === 'income' ? 'arrow-up-bold' : 'arrow-down-bold'}
                    size={20}
                    color={tx.type === 'income' ? '#059669' : '#dc2626'}
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={[styles.transactionName, { color: textColor }]}>{tx.title}</Text>
                  <Text style={[styles.transactionDesc, { color: fadedText }]}>
                    {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} • {new Date(tx.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text
                  style={
                    tx.type === 'income'
                      ? styles.transactionAmountPositive
                      : styles.transactionAmountNegative
                  }
                >
                  {tx.type === 'income' ? '+' : '-'}Ksh. {Number(tx.amount).toLocaleString()}
                </Text>
              </View>
            ))
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
    shadowOffset: { width: 0, height: 4},
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
  chartTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
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
    backgroundColor: '#d1fae5',
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
