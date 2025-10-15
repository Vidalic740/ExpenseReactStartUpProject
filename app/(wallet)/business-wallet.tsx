// app/(business)/BusinessHomeScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import * as SecureStore from "expo-secure-store";
import { useAppTheme } from "@/context/ThemeContext";

const screenWidth = Dimensions.get("window").width;

type KPI = { label: string; value: string; color: string; icon: string };
type ItemBought = { id: string; name: string; qty: number; total: number; date: string };
type Debtor = { id: string; name: string; amountOwed: number; lastActivity: string };
type Tx = { id: string; title: string; amount: number; type: "IN" | "OUT"; date: string };

export default function BusinessHomeScreen() {
  const { colors } = useAppTheme();

  const [loading, setLoading] = useState(true);

  // Replace these with live calls to your backend
  const [balance, setBalance] = useState<number | null>(null);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [itemsBought, setItemsBought] = useState<ItemBought[]>([]);
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [chartData, setChartData] = useState<{ labels: string[]; income: number[]; expense: number[] }>({
    labels: [],
    income: [],
    expense: [],
  });

  useEffect(() => {
    // Demo: load initial UI data. Replace with real API calls.
    const loadDemo = async () => {
      try {
        setLoading(true);
        // If you need JWT:
        const token = await SecureStore.getItemAsync("userToken");
        // TODO: use token to call backend endpoints to fetch:
        // - wallet balance for business wallet
        // - kpis (revenue, expenses, profit, debtors total)
        // - items bought (recent)
        // - debtors list
        // - recent transactions
        // - chart monthly income/expense

        // Demo static data
        setBalance(128452.75);

        setKpis([
          { label: "Revenue", value: "Ksh 250,300", color: "#34D399", icon: "cash" },
          { label: "Expenses", value: "Ksh 98,740", color: "#F87171", icon: "cart-outline" },
          { label: "Profit", value: "Ksh 151,560", color: "#60A5FA", icon: "bank" },
          { label: "Debtors", value: "Ksh 45,200", color: "#F59E0B", icon: "account-clock" },
        ]);

        setItemsBought([
          { id: "i1", name: "Printer Paper (5 boxes)", qty: 5, total: 8500, date: "2025-10-01" },
          { id: "i2", name: "Office Chairs (3)", qty: 3, total: 33000, date: "2025-09-18" },
          { id: "i3", name: "Laptop (2)", qty: 2, total: 230000, date: "2025-09-05" },
        ]);

        setDebtors([
          { id: "d1", name: "Kibera Supplies Ltd", amountOwed: 12000, lastActivity: "3d ago" },
          { id: "d2", name: "Tamu Restaurant", amountOwed: 3200, lastActivity: "7d ago" },
          { id: "d3", name: "GreenTech", amountOwed: 30000, lastActivity: "1mo ago" },
        ]);

        setTransactions([
          { id: "t1", title: "Invoice #INV-1023", amount: 45000, type: "IN", date: "2025-10-10" },
          { id: "t2", title: "Purchase: Stationery", amount: 8500, type: "OUT", date: "2025-10-09" },
          { id: "t3", title: "Payment Received - GreenTech", amount: 30000, type: "IN", date: "2025-10-01" },
        ]);

        // Simple monthly demo chart labels & values
        setChartData({
          labels: ["1", "5", "10", "15", "20", "25", "30"],
          income: [12000, 25000, 18000, 40000, 22000, 30000, 15000],
          expense: [8000, 7000, 12000, 15000, 9000, 11000, 6000],
        });
      } catch (err) {
        console.error("Failed to fetch business dashboard data:", err);
        Alert.alert("Error", "Failed to load business dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDemo();
  }, []);

  // memoize chart dataset for LineChart
  const chartConfig = useMemo(
    () => ({
      backgroundGradientFrom: colors.card,
      backgroundGradientTo: colors.card,
      color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
      labelColor: () => colors.subText,
      propsForDots: { r: "3" },
      decimalPlaces: 0,
    }),
    [colors]
  );

  const renderKpi = ({ item }: { item: KPI }) => (
    <View style={[styles.kpiCard, { backgroundColor: item.color + "22", borderColor: item.color + "55" }]}>
      <View style={[styles.kpiIcon, { backgroundColor: item.color }]}>
        <MaterialCommunityIcons name={item.icon as any} size={18} color="#fff" />
      </View>
      <Text style={[styles.kpiLabel, { color: colors.text }]}>{item.label}</Text>
      <Text style={[styles.kpiValue, { color: colors.text }]}>{item.value}</Text>
    </View>
  );

  const renderItemBought = ({ item }: { item: ItemBought }) => (
    <View style={[styles.rowCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowTitle, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.rowSub, { color: colors.subText }]}>{item.date} • Qty: {item.qty}</Text>
      </View>
      <Text style={[styles.rowAmount, { color: colors.text }]}>Ksh {item.total.toLocaleString()}</Text>
    </View>
  );

  const renderDebtor = ({ item }: { item: Debtor }) => (
    <View style={[styles.rowCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowTitle, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.rowSub, { color: colors.subText }]}>{item.lastActivity}</Text>
      </View>
      <Text style={[styles.rowAmount, { color: "#F59E0B" }]}>Ksh {item.amountOwed.toLocaleString()}</Text>
    </View>
  );

  const renderTransaction = ({ item }: { item: Tx }) => {
    const income = item.type === "IN";
    return (
      <View style={[styles.rowCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.rowTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.rowSub, { color: colors.subText }]}>{item.date}</Text>
        </View>
        <Text style={[styles.rowAmount, { color: income ? "#10B981" : "#EF4444" }]}>
          {income ? "+" : "-"}Ksh {Math.abs(item.amount).toLocaleString()}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 48 }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.hiText, { color: colors.text }]}>Business Wallet</Text>
          <Text style={[styles.subHeading, { color: colors.subText }]}>Manage inventory, invoices & debtors</Text>
        </View>

        <TouchableOpacity style={[styles.iconCircle, { backgroundColor: colors.card }]}>
          <MaterialCommunityIcons name="dots-vertical" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Balance Card (ATM-style) */}
      <LinearGradient colors={[colors.accent, "#28527A"]} style={styles.balanceCard}>
        <View style={styles.balanceTop}>
          <View style={styles.balanceLeft}>
            <Text style={styles.cardLabel}>Available Balance</Text>
            <Text style={styles.cardBalance}>
              Ksh {balance ? Number(balance).toLocaleString() : "0.00"}
            </Text>
          </View>
          <View style={styles.balanceRight}>
            <MaterialCommunityIcons name="briefcase-account" size={32} color="rgba(255,255,255,0.95)" />
          </View>
        </View>

        {/* Small details row */}
        <View style={styles.balanceBottom}>
          <View style={styles.smallDetail}>
            <Text style={styles.smallLabel}>Business</Text>
            <Text style={styles.smallValue}>Main Wallet</Text>
          </View>
          <View style={styles.smallDetail}>
            <Text style={styles.smallLabel}>Updated</Text>
            <Text style={styles.smallValue}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Quick actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.card }]} onPress={() => Alert.alert("Add Item")}>
          <MaterialCommunityIcons name="cart-plus" size={22} color={colors.accent} />
          <Text style={[styles.actionLabel, { color: colors.text }]}>Add Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.card }]} onPress={() => Alert.alert("Create Invoice")}>
          <MaterialCommunityIcons name="file-document-edit" size={22} color={colors.accent} />
          <Text style={[styles.actionLabel, { color: colors.text }]}>Invoice</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.card }]} onPress={() => Alert.alert("Receive Payment")}>
          <MaterialCommunityIcons name="cash-plus" size={22} color={colors.accent} />
          <Text style={[styles.actionLabel, { color: colors.text }]}>Receive</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.card }]} onPress={() => Alert.alert("Record Expense")}>
          <MaterialCommunityIcons name="credit-card-remove" size={22} color={colors.accent} />
          <Text style={[styles.actionLabel, { color: colors.text }]}>Expense</Text>
        </TouchableOpacity>
      </View>

      {/* KPI row */}
      <View style={{ marginTop: 16 }}>
        <FlatList data={kpis} horizontal keyExtractor={(i) => i.label} renderItem={renderKpi} ItemSeparatorComponent={() => <View style={{ width: 12 }} />} showsHorizontalScrollIndicator={false} />
      </View>

      {/* Chart */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Month Overview</Text>
        <LineChart
          data={{
            labels: chartData.labels,
            datasets: [
              { data: chartData.income, color: () => "#34D399" },
              { data: chartData.expense, color: () => "#F87171" },
            ],
            legend: ["Income", "Expense"],
          }}
          width={screenWidth - 32}
          height={160}
          chartConfig={chartConfig as any}
          bezier
          withInnerLines={false}
          style={{ borderRadius: 12, marginTop: 8 }}
        />
      </View>

      {/* Items Bought */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Items Bought</Text>
          <TouchableOpacity onPress={() => Alert.alert("View All Items")}>
            <Text style={{ color: colors.accent }}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList data={itemsBought} keyExtractor={(i) => i.id} renderItem={renderItemBought} ItemSeparatorComponent={() => <View style={{ height: 8 }} />} />
      </View>

      {/* Debtors */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Debtors</Text>
          <TouchableOpacity onPress={() => Alert.alert("Manage Debtors")}>
            <Text style={{ color: colors.accent }}>Manage</Text>
          </TouchableOpacity>
        </View>
        <FlatList data={debtors} keyExtractor={(d) => d.id} renderItem={renderDebtor} ItemSeparatorComponent={() => <View style={{ height: 8 }} />} />
      </View>

      {/* Recent Transactions */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => Alert.alert("All Transactions")}>
            <Text style={{ color: colors.accent }}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList data={transactions} keyExtractor={(t) => t.id} renderItem={renderTransaction} ItemSeparatorComponent={() => <View style={{ height: 8 }} />} />
      </View>

      {/* Floating Action */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.accent }]}
        onPress={() => Alert.alert("Quick Actions", "Open quick actions sheet")}
      >
        <MaterialCommunityIcons name="plus" size={26} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  hiText: { fontSize: 20, fontWeight: "800" },
  subHeading: { fontSize: 13, marginTop: 2 },
  iconCircle: { width: 42, height: 42, borderRadius: 10, justifyContent: "center", alignItems: "center" },

  balanceCard: {
    height: 140,
    borderRadius: 16,
    padding: 16,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  balanceTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  balanceLeft: {},
  cardLabel: { color: "rgba(255,255,255,0.9)", fontSize: 14 },
  cardBalance: { color: "#fff", fontSize: 28, fontWeight: "900", marginTop: 6 },
  balanceRight: { alignItems: "flex-end" },
  balanceBottom: { flexDirection: "row", justifyContent: "space-between" },
  smallDetail: {},
  smallLabel: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
  smallValue: { color: "rgba(255,255,255,0.95)", fontSize: 12, fontWeight: "600" },

  quickActions: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  actionBtn: { flex: 1, marginHorizontal: 6, padding: 12, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  actionLabel: { marginTop: 8, fontSize: 13, fontWeight: "600" },

  kpiCard: {
    width: 140,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  kpiIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  kpiLabel: { fontSize: 13, fontWeight: "700" },
  kpiValue: { fontSize: 14, marginTop: 6 },

  section: { marginTop: 16, padding: 12, borderRadius: 12 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700" },

  rowCard: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 10, borderWidth: 1 },
  rowTitle: { fontSize: 15, fontWeight: "700" },
  rowSub: { fontSize: 12, marginTop: 4 },
  rowAmount: { fontSize: 15, fontWeight: "800" },

  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  fab: {
    position: "absolute",
    bottom: 28,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});

