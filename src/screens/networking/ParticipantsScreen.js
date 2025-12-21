import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNetworking } from '../../context/NetworkingContext';
import Loading from '../../components/common/Loading';
import Card from '../../components/common/Card';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants';

const ParticipantsScreen = ({ navigation }) => {
  const { participants, loading } = useNetworking();

  if (loading) {
    return <Loading fullScreen text="Loading participants..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Network</Text>
          <Text style={styles.subtitle}>
            Connect with {participants.length} participants
          </Text>
        </View>

        {participants.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No participants available yet. Check back soon!
            </Text>
          </Card>
        ) : (
          participants.map((participant) => (
            <Card key={participant.uid} style={styles.participantCard}>
              <Text style={styles.participantName}>
                {participant.displayName || 'Anonymous User'}
              </Text>
              <Text style={styles.participantOrg}>
                {participant.organization || 'No organization'}
              </Text>
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
  participantCard: {
    marginBottom: SPACING.md,
  },
  participantName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  participantOrg: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
});

export default ParticipantsScreen;
