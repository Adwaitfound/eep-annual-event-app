import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Card from '../../components/common/Card';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants';

const EventInfoScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Event Information</Text>
          <Text style={styles.subtitle}>
            Everything you need to know
          </Text>
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.cardTitle}>About the Event</Text>
          <Text style={styles.cardText}>
            Welcome to the Foundation for Economic Education and Peace Annual Event.
          </Text>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={styles.cardTitle}>Venue Information</Text>
          <Text style={styles.cardText}>
            Venue details and maps will be available soon.
          </Text>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={styles.cardTitle}>Important Dates</Text>
          <Text style={styles.cardText}>
            Event dates and schedule will be announced soon.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  infoCard: {
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  cardText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});

export default EventInfoScreen;
