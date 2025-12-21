import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/constants';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    if (variant === 'primary') {
      baseStyle.push(styles.primaryButton);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondaryButton);
    } else if (variant === 'outline') {
      baseStyle.push(styles.outlineButton);
    } else if (variant === 'text') {
      baseStyle.push(styles.textButton);
    }
    
    if (disabled || loading) {
      baseStyle.push(styles.disabledButton);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText];
    
    if (variant === 'primary') {
      baseStyle.push(styles.primaryText);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondaryText);
    } else if (variant === 'outline') {
      baseStyle.push(styles.outlineText);
    } else if (variant === 'text') {
      baseStyle.push(styles.textButtonText);
    }
    
    if (textStyle) {
      baseStyle.push(textStyle);
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : COLORS.primary} />
      ) : (
        <>
          {icon && icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  small: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  medium: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  large: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  textButton: {
    backgroundColor: 'transparent',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#fff',
  },
  outlineText: {
    color: COLORS.primary,
  },
  textButtonText: {
    color: COLORS.primary,
  },
});

export default Button;
