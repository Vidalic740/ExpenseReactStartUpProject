import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
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
    const fetchBusinessData = async () => {
      try {
        setLoading(true);

        const token = await SecureStore.getItemAsync("userToken");
        if (!token) throw new Error("Authentication token not found.");

        const headers = { Authorization: `Bearer ${token}` };

        // 🔹 Replace these URLs with your Laravel backend endpoints
        const [walletRes, kpiRes, itemsRes, debtorsRes, txRes, chartRes] = await Promise.all([
          fetch("https://yourdomain.com/api/business-wallet", { headers }),
          fetch("https://yourdomain.com/api/business-wallet/kpis", { headers }),
          fetch("https://yourdomain.com/api/business-wallet/items", { headers }),
          fetch("https://yourdomain.com/api/business-wallet/debtors", { headers }),
          fetch("https://yourdomain.com/api/business-wallet/transactions", { headers }),
          fetch("https://yourdomain.com/api/business-wallet/chart", { headers }),
        ]);

        if (
          !walletRes.ok ||
          !kpiRes.ok ||
          !itemsRes.ok ||
          !debtorsRes.ok ||
          !txRes.ok ||
          !chartRes.ok
        ) {
          throw new Error("Failed to fetch one or more business data resources.");
        }

        const [wallet, kpiData, items, debtorData, txData, chart] = await Promise.all([
          walletRes.json(),
          kpiRes.json(),
          itemsRes.json(),
          debtorsRes.json(),
          txRes.json(),
          chartRes.json(),
        ]);

        setBalance(wallet.balance ?? 0);
        setKpis(kpiData ?? []);
        setItemsBought(items ?? []);
        setDebtors(debtorData ?? []);
        setTransactions(txData ?? []);
        setChartData(chart ?? { labels: [], income: [], expense: [] });
      } catch (err) {
        console.error("Error loading business dashboard:", err);
        Alert.alert("Error", "Failed to load business wallet data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

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

  const renderRowCard = (title: string, sub: string, amount: string, color?: string) => (
    <View style={[styles.rowCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.rowSub, { color: colors.subText }]}>{sub}</Text>
      </View>
      <Text style={[styles.rowAmount, { color: color ?? colors.text }]}>{amount}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={{ color: colors.subText, marginTop: 8 }}>Loading business wallet...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={[{ key: "main" }]} // dummy
      keyExtractor={(item) => item.key}
      style={[styles.container, { backgroundColor: colors.background }]}
      renderItem={null}
      ListHeaderComponent={
        <>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.hiText, { color: colors.text }]}>Business Wallet</Text>
              <Text style={[styles.subHeading, { color: colors.subText }]}>
                Manage inventory, invoices & debtors
              </Text>
            </View>
            <TouchableOpacity style={[styles.iconCircle, { backgroundColor: colors.card }]}>
              <MaterialCommunityIcons name="dots-vertical" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Balance card */}
          <LinearGradient colors={[colors.accent, "#28527A"]} style={styles.balanceCard}>
            <View style={styles.balanceTop}>
              <View>
                <Text style={styles.cardLabel}>Available Balance</Text>
                <Text style={styles.cardBalance}>
                  Ksh {balance ? balance.toLocaleString() : "0.00"}
                </Text>
              </View>
              <MaterialCommunityIcons name="briefcase-account" size={32} color="#fff" />
            </View>
            <View style={styles.balanceBottom}>
              <Text style={styles.smallLabel}>Business</Text>
              <Text style={styles.smallValue}>{new Date().toLocaleDateString()}</Text>
            </View>
          </LinearGradient>

          {/* Quick actions */}
          <View style={styles.quickActions}>
            {[
              { icon: "cart-plus", label: "Add Item" },
              { icon: "file-document-edit", label: "Invoice" },
              { icon: "cash-plus", label: "Receive" },
              { icon: "credit-card-remove", label: "Expense" },
            ].map((a) => (
              <TouchableOpacity
                key={a.label}
                style={[styles.actionBtn, { backgroundColor: colors.card }]}
                onPress={() => Alert.alert(a.label)}
              >
                <MaterialCommunityIcons name={a.icon as any} size={22} color={colors.accent} />
                <Text style={[styles.actionLabel, { color: colors.text }]}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* KPI cards */}
          <FlatList
            data={kpis}
            horizontal
            keyExtractor={(i) => i.label}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.kpiCard,
                  { backgroundColor: item.color + "22", borderColor: item.color + "55" },
                ]}
              >
                <View style={[styles.kpiIcon, { backgroundColor: item.color }]}>
                  <MaterialCommunityIcons name={item.icon as any} size={18} color="#fff" />
                </View>
                <Text style={[styles.kpiLabel, { color: colors.text }]}>{item.label}</Text>
                <Text style={[styles.kpiValue, { color: colors.text }]}>{item.value}</Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            showsHorizontalScrollIndicator={false}
          />

          {/* Chart */}
          {chartData.labels.length > 0 && (
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
          )}

          {/* Items Bought */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Items Bought</Text>
              <TouchableOpacity>
                <Text style={{ color: colors.accent }}>View all</Text>
              </TouchableOpacity>
            </View>
            {itemsBought.length === 0 ? (
              <Text style={{ color: colors.subText }}>No items found.</Text>
            ) : (
              <FlatList
                data={itemsBought}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) =>
                  renderRowCard(
                    item.name,
                    `${item.date} • Qty: ${item.qty}`,
                    `Ksh ${item.total.toLocaleString()}`
                  )
                }
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              />
            )}
          </View>

          {/* Debtors */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Debtors</Text>
              <TouchableOpacity>
                <Text style={{ color: colors.accent }}>Manage</Text>
              </TouchableOpacity>
            </View>
            {debtors.length === 0 ? (
              <Text style={{ color: colors.subText }}>No debtors yet.</Text>
            ) : (
              <FlatList
                data={debtors}
                keyExtractor={(d) => d.id}
                renderItem={({ item }) =>
                  renderRowCard(
                    item.name,
                    item.lastActivity,
                    `Ksh ${item.amountOwed.toLocaleString()}`,
                    "#F59E0B"
                  )
                }
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              />
            )}
          </View>

          {/* Transactions */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
              <TouchableOpacity>
                <Text style={{ color: colors.accent }}>See all</Text>
              </TouchableOpacity>
            </View>
            {transactions.length === 0 ? (
              <Text style={{ color: colors.subText }}>No recent transactions.</Text>
            ) : (
              <FlatList
                data={transactions}
                keyExtractor={(t) => t.id}
                renderItem={({ item }) =>
                  renderRowCard(
                    item.title,
                    item.date,
                    `${item.type === "IN" ? "+" : "-"}Ksh ${Math.abs(item.amount).toLocaleString()}`,
                    item.type === "IN" ? "#10B981" : "#EF4444"
                  )
                }
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              />
            )}
          </View>
        </>
      }
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  hiText: { fontSize: 20, fontWeight: "800" },
  subHeading: { fontSize: 13 },
  iconCircle: { width: 42, height: 42, borderRadius: 10, justifyContent: "center", alignItems: "center" },

  balanceCard: { height: 140, borderRadius: 16, padding: 16, justifyContent: "space-between", marginBottom: 16 },
  balanceTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardLabel: { color: "rgba(255,255,255,0.9)", fontSize: 14 },
  cardBalance: { color: "#fff", fontSize: 28, fontWeight: "900", marginTop: 6 },
  balanceBottom: { flexDirection: "row", justifyContent: "space-between" },
  smallLabel: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
  smallValue: { color: "rgba(255,255,255,0.95)", fontSize: 12, fontWeight: "600" },

  quickActions: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  actionBtn: { flex: 1, marginHorizontal: 6, padding: 12, borderRadius: 12, alignItems: "center" },
  actionLabel: { marginTop: 8, fontSize: 13, fontWeight: "600" },

  kpiCard: { width: 140, padding: 12, borderRadius: 12, borderWidth: 1, alignItems: "flex-start" },
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
});

