
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Pressable,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

interface VehicleData {
  Make: string;
  Model: string;
  ModelYear: string;
  BodyClass: string;
  Doors: string;
  Cylinders: string;
  DisplacementCC: string;
  DisplacementCI: string;
  DisplacementL: string;
  EngineModel: string;
  FuelTypePrimary: string;
  Transmission: string;
  DriveType: string;
  [key: string]: string;
}

export default function ResultsScreen() {
  const router = useRouter();
  const { vin } = useLocalSearchParams<{ vin: string }>();
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicleData();
  }, [vin]);

  const fetchVehicleData = async () => {
    if (!vin) {
      setError('No VIN provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // NHTSA API endpoint
      const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.Results && data.Results.length > 0) {
        // Convert results array to object
        const vehicleInfo: VehicleData = {};
        data.Results.forEach((item: { Variable: string; Value: string }) => {
          if (item.Value) {
            vehicleInfo[item.Variable] = item.Value;
          }
        });
        setVehicleData(vehicleInfo);
      } else {
        setError('No vehicle data found for this VIN');
      }
    } catch (err) {
      console.error('Error fetching vehicle data:', err);
      setError('Failed to fetch vehicle data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = async () => {
    // Replace with your actual Setmore booking URL
    const setmoreUrl = 'https://setmore.com/bookingpage/'; // Update this with your actual booking page
    
    try {
      const canOpen = await Linking.canOpenURL(setmoreUrl);
      if (canOpen) {
        await Linking.openURL(setmoreUrl);
      } else {
        Alert.alert('Error', 'Unable to open booking page');
      }
    } catch (err) {
      console.error('Error opening booking page:', err);
      Alert.alert('Error', 'Failed to open booking page');
    }
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.text }]}>{value || 'N/A'}</Text>
    </View>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Vehicle Details',
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
              <Text style={[styles.headerTitle, { color: colors.text }]}>Vehicle Details</Text>
              <View style={{ width: 40 }} />
            </View>
          )}

          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Fetching vehicle data...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.centerContent}>
              <IconSymbol name="exclamationmark.circle.fill" color={colors.accent} size={48} />
              <Text style={[styles.errorText, { color: colors.accent }]}>{error}</Text>
              <Pressable
                style={[styles.retryButton, { backgroundColor: colors.primary }]}
                onPress={fetchVehicleData}
              >
                <Text style={[styles.retryButtonText, { color: colors.card }]}>Try Again</Text>
              </Pressable>
            </View>
          ) : vehicleData ? (
            <>
              {/* Main Vehicle Info Card */}
              <View style={[styles.card, { backgroundColor: colors.card }]}>
                <View style={styles.cardHeader}>
                  <IconSymbol name="car.fill" color={colors.primary} size={32} />
                  <View style={styles.cardTitleContainer}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>
                      {vehicleData.ModelYear} {vehicleData.Make} {vehicleData.Model}
                    </Text>
                    <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                      VIN: {vin}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Body & Doors Section */}
              <View style={[styles.section, { backgroundColor: colors.card }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Body Information</Text>
                <InfoRow label="Body Class" value={vehicleData.BodyClass} />
                <InfoRow label="Doors" value={vehicleData.Doors} />
              </View>

              {/* Engine Section */}
              <View style={[styles.section, { backgroundColor: colors.card }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Engine Specifications</Text>
                <InfoRow label="Cylinders" value={vehicleData.Cylinders} />
                <InfoRow label="Displacement (L)" value={vehicleData.DisplacementL} />
                <InfoRow label="Displacement (CC)" value={vehicleData.DisplacementCC} />
                <InfoRow label="Engine Model" value={vehicleData.EngineModel} />
                <InfoRow label="Fuel Type" value={vehicleData.FuelTypePrimary} />
              </View>

              {/* Transmission & Drive Section */}
              <View style={[styles.section, { backgroundColor: colors.card }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Transmission & Drive</Text>
                <InfoRow label="Transmission" value={vehicleData.Transmission} />
                <InfoRow label="Drive Type" value={vehicleData.DriveType} />
              </View>

              {/* Book Now Button */}
              <Pressable
                style={[styles.bookButton, { backgroundColor: colors.primary }]}
                onPress={handleBookNow}
              >
                <IconSymbol name="calendar" color={colors.card} size={20} />
                <Text style={[styles.bookButtonText, { color: colors.card }]}>Book Service Now</Text>
              </Pressable>

              {/* Additional Info */}
              <View style={[styles.section, { backgroundColor: colors.card }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Additional Information</Text>
                {Object.entries(vehicleData).map(([key, value]) => {
                  // Skip already displayed fields
                  if ([
                    'Make', 'Model', 'ModelYear', 'BodyClass', 'Doors', 'Cylinders',
                    'DisplacementCC', 'DisplacementCI', 'DisplacementL', 'EngineModel',
                    'FuelTypePrimary', 'Transmission', 'DriveType'
                  ].includes(key)) {
                    return null;
                  }
                  return value ? <InfoRow key={key} label={key} value={value} /> : null;
                })}
              </View>
            </>
          ) : null}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
  },
  bookButton: {
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
  bookButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
