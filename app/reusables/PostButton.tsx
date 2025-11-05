import React from 'react';
import {
  TouchableOpacity,
  Text, 
  StyleSheet 
} from 'react-native';
import { colors } from '../constants/theme';
import { BORDER_RADIUS } from '../constants/layout';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';

interface ButtonProps {
   title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  style?: object;
  forceEnabled?: boolean;
}


 const Button: React.FC<ButtonProps> = ({
    title,
    onPress, 
    disabled = false,
    variant = 'primary',
    style,
    forceEnabled = false 
}) => {
    const isDisabled = !forceEnabled && disabled;
 return (
  <TouchableOpacity
    style={[
      styles.button,
      variant === 'primary' ? styles.buttonPrimary : styles.buttonSecondary,
      isDisabled && styles.buttonDisabled,
      style,
    ]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.8}
  >
    <Text 
      style={[
      styles.buttonText, 
      variant === 'secondary' && styles.buttonTextSecondary,
      isDisabled && styles.buttonTextDisabled
      ]}
      >
      {title}
    </Text>
  </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['5xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.blue,
  },
  buttonSecondary: {
   // backgroundColor: '#F3F4F6',
  },
  buttonDisabled: {
    backgroundColor: colors.surfaceDisabled,
  },
  buttonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.medium,
    color: colors.greyWhite,
    fontFamily: 'Poppins_500Medium'
  },
  buttonTextSecondary: {
    color: colors.textDisabled
  },
  buttonTextDisabled: {
    color: colors.textDisabled
  }
});

export default Button;