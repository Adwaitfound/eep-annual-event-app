import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Formik } from 'formik';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile } from '../../services/firebase/firestore';
import { profileSetupValidationSchema } from '../../utils/validators';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants';

const ProfileSetupScreen = ({ navigation }) => {
  const { user, userProfile, setUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSetupProfile = async (values) => {
    setLoading(true);
    try {
      const profileData = {
        displayName: values.fullName,
        organization: values.organization,
        phone: values.phone,
        dietaryPreferences: values.dietaryPreferences,
        emergencyContact: values.emergencyContact,
      };

      await updateUserProfile(user.uid, profileData);
      
      // Update local profile state
      setUserProfile({
        ...userProfile,
        ...profileData,
      });

      Alert.alert(
        'Profile Setup Complete',
        'Your profile has been set up successfully!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Profile setup error:', error);
      Alert.alert(
        'Setup Failed',
        'Failed to set up profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Help us personalize your event experience
          </Text>
        </View>

        <Formik
          initialValues={{
            fullName: userProfile?.displayName || '',
            organization: '',
            phone: '',
            dietaryPreferences: '',
            emergencyContact: '',
          }}
          validationSchema={profileSetupValidationSchema}
          onSubmit={handleSetupProfile}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <Input
                label="Full Name *"
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                placeholder="Enter your full name"
                error={touched.fullName && errors.fullName}
              />

              <Input
                label="Organization *"
                value={values.organization}
                onChangeText={handleChange('organization')}
                onBlur={handleBlur('organization')}
                placeholder="Enter your organization"
                error={touched.organization && errors.organization}
              />

              <Input
                label="Phone Number *"
                value={values.phone}
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                error={touched.phone && errors.phone}
              />

              <Input
                label="Dietary Preferences (Optional)"
                value={values.dietaryPreferences}
                onChangeText={handleChange('dietaryPreferences')}
                onBlur={handleBlur('dietaryPreferences')}
                placeholder="e.g., Vegetarian, Vegan, Gluten-free"
                error={touched.dietaryPreferences && errors.dietaryPreferences}
              />

              <Input
                label="Emergency Contact *"
                value={values.emergencyContact}
                onChangeText={handleChange('emergencyContact')}
                onBlur={handleBlur('emergencyContact')}
                placeholder="Name and phone number"
                multiline
                numberOfLines={2}
                error={touched.emergencyContact && errors.emergencyContact}
              />

              <Button
                title="Complete Setup"
                onPress={handleSubmit}
                loading={loading}
                style={styles.submitButton}
              />

              <Button
                title="Skip for Now"
                variant="text"
                onPress={() => navigation.navigate('Main')}
                style={styles.skipButton}
              />
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  header: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: SPACING.lg,
  },
  submitButton: {
    marginTop: SPACING.md,
  },
  skipButton: {
    marginTop: SPACING.sm,
  },
});

export default ProfileSetupScreen;
