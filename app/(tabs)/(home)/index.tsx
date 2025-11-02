import React from "react";
import { Stack, useRouter } from "expo-router";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform, TextInput, Alert } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";

function HomeScreen() {
  const router = useRouter();

  const handleScanPress = () => {
    router.push('/(tabs)/(home)/scanner');
  };

  const handleManualInputPress = () => {
    router.push('/(tabs)/(home)/results?vin=');
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "VIN Scanner",
          }}
        />
      )}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <IconSymbol name="car.fill" color={colors.primary} size={64} />
            <Text style={[styles.title, { color: colors.text }]}>VIN Scanner</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Decode VINs and license plates to get vehicle details
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            <Pressable
              style={[styles.optionCard, { backgroundColor: colors.card, borderColor: colors.secondary }]}
              onPress={handleScanPress}
            >
              <View style={[styles.optionIcon, { backgroundColor: colors.primary }]}>
                <IconSymbol name="camera.fill" color={colors.card} size={32} />
              </View>
              <Text style={[styles.optionTitle, { color: colors.text }]}>Scan VIN</Text>
              <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                Use your camera to scan a VIN or license plate
              </Text>
            </Pressable>

            <Pressable
              style={[styles.optionCard, { backgroundColor: colors.card, borderColor: colors.secondary }]}
              onPress={handleManualInputPress}
            >
              <View style={[styles.optionIcon, { backgroundColor: colors.secondary }]}>
                <IconSymbol name="keyboard" color={colors.card} size={32} />
              </View>
              <Text style={[styles.optionTitle, { color: colors.text }]}>Manual Input</Text>
              <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                Enter a VIN manually to look up vehicle details
              </Text>
            </Pressable>
          </View>

          <View style={styles.infoSection}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Features</Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <IconSymbol name="checkmark.circle.fill" color={colors.primary} size={20} />
                <Text style={[styles.featureText, { color: colors.text }]}>NHTSA Vehicle Data</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="checkmark.circle.fill" color={colors.primary} size={20} />
                <Text style={[styles.featureText, { color: colors.text }]}>Repair Labor Times</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="checkmark.circle.fill" color={colors.primary} size={20} />
                <Text style={[styles.featureText, { color: colors.text }]}>Quick Lube Specs</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 32,
    gap: 12,
  },
  optionCard: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoSection: {
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default HomeScreen;


