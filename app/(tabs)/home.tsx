import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.display}>
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.greetings}>Good Morning!{'\n'} Fullname</Text>
        </View>
        <LinearGradient
          colors={['#0e524f','#0d7a3f']}
          start={{x:1,y:0}}
          end={{x:0,y:0}}
          style={styles.card}>
            <View style={styles.account}>
              <Text style={styles.title}>Account</Text>
              <Text style={styles.value}>Ksh.20000</Text>
            </View>
            <View style={styles.expense}>
            <Text style={styles.title}>Expense</Text>
            <Text style={styles.value}>Ksh.5000</Text>
            </View>
            <View style={styles.balance}>
            <Text style={styles.title}>Balance</Text>
            <Text style={styles.value}>Ksh.15000</Text>
            </View>
          </LinearGradient>

          {/* Income & Expense Buttons */}
          <View style={styles.btnHolder}>
            {/* Add Income button */}
            <TouchableOpacity accessible={true}
              accessibilityLabel='Tap me!'>
              <View style={styles.button}>
                <Text style={styles.btnText}>Add Income</Text>
              </View>
            </TouchableOpacity>
            
            {/* Add Expense button */}
            <TouchableOpacity accessible={true}
              accessibilityLabel='Tap me!'>
              <View style={styles.button}>
                <Text style={styles.btnText}>Add Expense</Text>
              </View>
            </TouchableOpacity>
          </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main:{
    flex: 1,
    padding: 10,
  },

  display:{
    flexGrow: 1,
  },

  header:{
    marginTop: 20,
  },

  greetings:{
    fontSize: 18,
  },

  card:{
    height: 110,
    marginTop: 10,
    borderRadius: 30,
    flexDirection: 'row',
  },

  account:{
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title:{
    fontSize: 18,
    color: '#ffefff',
    justifyContent: 'center',
  },

  value:{
    fontSize: 16,
    color: '#ede5f3',
  },

  expense:{
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },

  balance:{
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnHolder:{
    height: 'auto',
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'row',
    alignSelf: 'center',
  },

  button:{
    height: 42,
    width: 150,
    backgroundColor: '#822452',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    margin: 5,
  },

  btnText:{
    fontSize: 16,
    color: '#f5ecfd',
  },
});
