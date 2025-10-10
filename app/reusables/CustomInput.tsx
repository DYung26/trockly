import React, { useState } from 'react';
import { 
 View,
 Text,
 TextInput,
 TextInputProps,
 StyleSheet,
} from 'react-native';
import { colors } from '../constants/theme';
import ThemedText from './ThemedText';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';
import { SPACING, BORDER_RADIUS } from '../constants/layout';

interface CustomInputProps extends TextInputProps {
 label: string;
 error?: string;
 secureText?: boolean;
 rightIcon?: React.ReactNode;
 isPassword?: boolean;
}


export const CustomInput: React.FC<CustomInputProps> = ({ 
  label,
  error,
  secureText = false,
  rightIcon,
  style,
 isPassword = false,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);


  return (
   <View style={styles.container}>
     <ThemedText variant='h3'>{label}</ThemedText>

     <View style={[styles.inputWrapper, error && styles.inputError]}>
       <TextInput
         style={[styles.input, style]}
         placeholderTextColor={colors.borderColor}
         secureTextEntry={secureText && !showPassword}
         {...props}
       />

       {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
     </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
   </View>
  );
};


const styles = StyleSheet.create({
 container: {
   // marginBottom: 20,
  },
  label: {
    fontSize: FONT_SIZES.base,
    color: colors.textPrimary,
    marginBottom: 8,
    fontWeight: FONT_WEIGHTS.medium,
  },
  inputWrapper: {
     flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: FONT_SIZES.md,
    color: colors.borderColor,
  },
  iconContainer: {
    paddingLeft: SPACING.sm,
  },
  inputError: {
    borderColor: colors.red,
  },
  errorText: {
    color: colors.red,
    fontSize: FONT_SIZES.xs,
    marginTop: 4,
  },
});