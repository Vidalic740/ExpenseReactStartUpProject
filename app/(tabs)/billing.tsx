import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function BillingScreen() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [slideAnim] = useState(new Animated.Value(SCREEN_HEIGHT));

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Reminders\nDaily summary messages',
      price: '$5/month',
      color: '#FF7F50',
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Everything in Basic\nPriority support',
      price: '$10/month',
      color: '#FFD700',
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Everything in Pro\nAdvanced analytics',
      price: '$20/month',
      color: '#FFC0CB',
    },
  ];

  const paymentMethods = ['Stripe', 'PayPal', 'M-Pesa', 'AstroPay', 'Google Pay', 'Apple Pay'];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    setShowPaymentModal(true);

    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT / 2, // Slide to half the screen height
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setShowPaymentModal(false);
    });
  };

  return (
    <View style={styles.main}>
      <Text style={styles.header}>Choose Your Subscription Plan</Text>

      <View style={styles.plansContainer}>
        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planBox,
              { backgroundColor: plan.color },
              selectedPlan === plan.id && styles.selectedPlan,
            ]}
            onPress={() => handlePlanSelect(plan.id)}
          >
            <Text style={styles.planTitle}>{plan.name}</Text>
            <Text style={styles.price}>{plan.price}</Text>
            <Text style={styles.info}>{plan.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Payment Modal */}
      {showPaymentModal && (
        <Modal transparent animationType="none">
          <TouchableOpacity style={styles.overlay} onPress={closeModal} />

          <Animated.View style={[styles.paymentContainer, { top: slideAnim }]}>
            <Text style={styles.paymentHeader}>Choose a Payment Method</Text>
            <ScrollView contentContainerStyle={styles.paymentList}>
              {paymentMethods.map((method, index) => (
                <TouchableOpacity key={index} style={styles.paymentButton}>
                  <Text style={styles.paymentText}>{method}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: 40,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },

  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  plansContainer: {
    marginBottom: 30,
  },

  planBox: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },

  selectedPlan: {
    borderColor: '#007bff',
    borderWidth: 2,
  },

  planTitle: {
    fontSize: 26,
    fontWeight: '600',
  },

  price: {
    fontSize: 22,
    marginTop: 6,
  },

  info: {
    fontSize: 17,
    marginTop: 6,
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000088',
  },

  paymentContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT / 2 + 50,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
  },

  paymentHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },

  paymentList: {
    paddingBottom: 100,
  },

  paymentButton: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },

  paymentText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
