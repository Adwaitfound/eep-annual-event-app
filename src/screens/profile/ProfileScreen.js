import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { logOut } from '../../services/firebase/auth';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants';

const ProfileScreen = ({ navigation }) => {
  const { user, userProfile } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logOut();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {userProfile?.displayName?.[0]?.toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.name}>
            {userProfile?.displayName || 'User'}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.cardTitle}>Profile Information</Text>
          
          {userProfile?.organization && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Organization:</Text>
              <Text style={styles.infoValue}>{userProfile.organization}</Text>
            </View>
          )}
          
          {userProfile?.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{userProfile.phone}</Text>
            </View>
          )}
          
          {!userProfile?.organization && !userProfile?.phone && (
            <Text style={styles.emptyText}>
              Complete your profile to add more information
            </Text>
          )}
        </Card>

        <Button
          title="Edit Profile"
          variant="outline"
          onPress={() => navigation.navigate('ProfileSetup')}
          style={styles.editButton}
        />

        <Button
          title="Logout"
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
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
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.lg,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: FONT_SIZES.xxl,
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  email: {
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
    marginBottom: SPACING.md,
  },
  infoRow: {
    marginBottom: SPACING.sm,
  },
  infoLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  emptyText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  editButton: {
    marginBottom: SPACING.md,
  },
  logoutButton: {
    borderColor: COLORS.error,
  },
});

export default ProfileScreen;
