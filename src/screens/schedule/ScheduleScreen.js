import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSchedule } from '../../context/ScheduleContext';
import Loading from '../../components/common/Loading';
import Card from '../../components/common/Card';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants';

const ScheduleScreen = ({ navigation }) => {
  const { sessions, loading, getFilteredSessions } = useSchedule();

  if (loading) {
    return <Loading fullScreen text="Loading schedule..." />;
  }

  const filteredSessions = getFilteredSessions();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Event Schedule</Text>
          <Text style={styles.subtitle}>
            {filteredSessions.length} sessions available
          </Text>
        </View>

        {filteredSessions.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No sessions available yet. Check back soon!
            </Text>
          </Card>
        ) : (
          filteredSessions.map((session) => (
            <Card key={session.id} style={styles.sessionCard}>
              <Text style={styles.sessionTitle}>{session.title}</Text>
              <Text style={styles.sessionTime}>
                {session.startTime} - {session.endTime}
              </Text>
              <Text style={styles.sessionLocation}>{session.location}</Text>
            </Card>
          ))
        )}
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
  emptyCard: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  sessionCard: {
    marginBottom: SPACING.md,
  },
  sessionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  sessionTime: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  sessionLocation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
  },
});

export default ScheduleScreen;
