
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

type SearchMethod = 'vin' | 'license-plate' | 'year-make-model';

export default function ManualInputScreen() {
  const router = useRouter();
  const [searchMethod, setSearchMethod] = useState<SearchMethod | null>(null);
  const [vin, setVin] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');

  const handleSearch = () => {
    if (searchMethod === 'vin') {
      if (!vin.trim()) {
        Alert.alert('Error', 'Please enter a VIN');
        return;
      }
      router.push({
        pathname: '/(tabs)/(home)/results',
        params: { vin: vin.trim() }
      });
    } else if (searchMethod === 'license-plate') {
      if (!licensePlate.trim()) {
        Alert.alert('Error', 'Please enter a license plate');
        return;
      }
      // For license plate, we'll pass it as a search parameter
      // Note: NHTSA API primarily works with VINs, so this would need additional handling
      Alert.alert('Info', 'License plate lookup requires additional API integration');
    } else if (searchMethod === 'year-make-model') {
      if (!year.trim() || !make.trim() || !model.trim()) {
        Alert.alert('Error', 'Please enter year, make, and model');
        return;
      }
      // For year/make/model, we'll pass it as search parameters
      // Note: NHTSA API primarily works with VINs, so this would need additional handling
      Alert.alert('Info', 'Year/Make/Model lookup requires additional API integration');
    }
  };

  const handleReset = () => {
    setSearchMethod(null);
    setVin('');
    setLicensePlate('');
    setYear('');
    setMake('');
    setModel('');
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Manual Input',
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
          {/* Header with back button */}
          {Platform.OS !== 'ios' && (
            <View style={styles.headerRow}>
              <Pressable
                style={[styles.backButton, { backgroundColor: colors.card }]}
                onPress={() => router.back()}
              >
                <IconSymbol name="chevron.left" color={colors.primary} size={24} />
              </Pressable>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Manual Input</Text>
              <View style={{ width: 40 }} />
            </View>
          )}

          {!searchMethod ? (
            <>
              <View style={styles.header}>
                <IconSymbol name="keyboard" color={colors.primary} size={48} />
                <Text style={[styles.title, { color: colors.text }]}>Search Method</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Choose how you want to search for vehicle information
                </Text>
              </View>

              <View style={styles.optionsContainer}>
                <Pressable
                  style={[styles.optionCard, { backgroundColor: colors.card, borderColor: colors.secondary }]}
                  onPress={() => setSearchMethod('vin')}
                >
                  <View style={[styles.optionIcon, { backgroundColor: colors.primary }]}>
                    <IconSymbol name="number" color={colors.card} size={32} />
                  </View>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>Search by VIN</Text>
                  <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                    Enter a 17-character Vehicle Identification Number
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.optionCard, { backgroundColor: colors.card, borderColor: colors.secondary }]}
                  onPress={() => setSearchMethod('license-plate')}
                >
                  <View style={[styles.optionIcon, { backgroundColor: colors.secondary }]}>
                    <IconSymbol name="rectangle.fill" color={colors.card} size={32} />
                  </View>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>Search by License Plate</Text>
                  <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                    Enter your vehicle&apos;s license plate number
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.optionCard, { backgroundColor: colors.card, borderColor: colors.accent }]}
                  onPress={() => setSearchMethod('year-make-model')}
                >
                  <View style={[styles.optionIcon, { backgroundColor: colors.accent }]}>
                    <IconSymbol name="calendar" color={colors.card} size={32} />
                  </View>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>Search by Year, Make & Model</Text>
                  <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                    Enter the year, make, and model of your vehicle
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <View style={styles.header}>
                <Pressable
                  style={[styles.backIconButton, { backgroundColor: colors.secondary }]}
                  onPress={handleReset}
                >
                  <IconSymbol name="chevron.left" color={colors.card} size={24} />
                </Pressable>
                <Text style={[styles.title, { color: colors.text }]}>
                  {searchMethod === 'vin' && 'Enter VIN'}
                  {searchMethod === 'license-plate' && 'Enter License Plate'}
                  {searchMethod === 'year-make-model' && 'Enter Vehicle Details'}
                </Text>
              </View>

              {searchMethod === 'vin' && (
                <View style={[styles.formCard, { backgroundColor: colors.card }]}>
                  <Text style={[styles.label, { color: colors.text }]}>VIN (17 characters)</Text>
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.secondary }]}
                    placeholder="e.g., 1HGCM82633A123456"
                    placeholderTextColor={colors.textSecondary}
                    value={vin}
                    onChangeText={setVin}
                    maxLength={17}
                    autoCapitalize="characters"
                  />
                  <Text style={[styles.helperText, { color: colors.textSecondary }]}>
                    {vin.length}/17 characters
                  </Text>
                </View>
              )}

              {searchMethod === 'license-plate' && (
                <View style={[styles.formCard, { backgroundColor: colors.card }]}>
                  <Text style={[styles.label, { color: colors.text }]}>License Plate</Text>
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.secondary }]}
                    placeholder="e.g., ABC1234"
                    placeholderTextColor={colors.textSecondary}
                    value={licensePlate}
                    onChangeText={setLicensePlate}
                    autoCapitalize="characters"
                  />
                  <Text style={[styles.helperText, { color: colors.textSecondary }]}>
                    Enter your vehicle&apos;s license plate number
                  </Text>
                </View>
              )}

              {searchMethod === 'year-make-model' && (
                <View style={[styles.formCard, { backgroundColor: colors.card }]}>
                  <Text style={[styles.label, { color: colors.text }]}>Year</Text>
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.secondary }]}
                    placeholder="e.g., 2020"
                    placeholderTextColor={colors.textSecondary}
                    value={year}
                    onChangeText={setYear}
                    keyboardType="number-pad"
                    maxLength={4}
                  />

                  <Text style={[styles.label, { color: colors.text, marginTop: 16 }]}>Make</Text>
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.secondary }]}
                    placeholder="e.g., Honda"
                    placeholderTextColor={colors.textSecondary}
                    value={make}
                    onChangeText={setMake}
                  />

                  <Text style={[styles.label, { color: colors.text, marginTop: 16 }]}>Model</Text>
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.secondary }]}
                    placeholder="e.g., Civic"
                    placeholderTextColor={colors.textSecondary}
                    value={model}
                    onChangeText={setModel}
                  />
                </View>
              )}

              <Pressable
                style={[styles.searchButton, { backgroundColor: colors.primary }]}
                onPress={handleSearch}
              >
                <IconSymbol name="magnifyingglass" color={colors.card} size={20} />
                <Text style={[styles.searchButtonText, { color: colors.card }]}>Search</Text>
              </Pressable>
            </>
          )}
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
    paddingVertical: 16,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  backIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
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
    textAlign: 'center',
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
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  formCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  searchButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginVertical: 16,
    gap: 8,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 5,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
