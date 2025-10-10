import React from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';
import { useTheme } from '../providers/ThemeProviders';
import Colors from '../constants/Color';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';
import { SPACING } from '../constants/layout';

type Variant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subheading'
  | 'body'
  | 'caption'
  | 'instructions'
  | 'description'

interface ThemedTextProps extends TextProps {
  variant?: Variant;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'body',
  children,
  style,
  ...rest
}) => {
  const { theme: themeKey } = useTheme();
  const colors = Colors[themeKey];

  const textStyles: Record<Variant, TextStyle> = {
    h1: {
      fontSize: FONT_SIZES['2xl'],
      fontFamily: 'Poppins_700Bold',
      color: colors.text,
      lineHeight: 40,
      fontWeight: FONT_WEIGHTS.bold
    },
    h2: {
      fontSize: FONT_SIZES['3xl'],
      fontFamily: 'Poppins_600SemiBold',
      color: colors.text,
      lineHeight: 32,
    },
    h3: {
      fontSize: FONT_SIZES.xs,
      fontFamily: 'Poppins_500Medium',
      color: colors.label,
      lineHeight: 28,
      fontWeight: FONT_WEIGHTS.normal
    },
    h4: {
      fontSize: FONT_SIZES.xs,
      color: colors.buttonText,
      fontWeight: FONT_WEIGHTS.normal,
      fontFamily: 'Poppins_500Medium',
      marginRight: 8,
    },
    h5: {
    color: colors.lightGreen,
    textDecorationLine: 'underline',
    fontWeight: FONT_WEIGHTS.normal,
    fontFamily: 'Poppins_500Medium',
    fontSize: FONT_SIZES.base,
    },
    h6: {
    color: colors.textSecondaryDark,
    fontWeight: FONT_WEIGHTS.normal,
    fontSize: FONT_SIZES.base,
    fontFamily: 'Poppins_500Medium'
    },
    subheading: {
      fontSize: FONT_SIZES.lg,
      fontFamily: 'Poppins_700Bold',
      color: colors.text,
      fontWeight: FONT_WEIGHTS.bold,
    },
    body: {
      fontSize: FONT_SIZES.lg,
      fontFamily: 'Poppins_400Regular',
      color: colors.text,
      lineHeight: 24,
    },
    caption: {
      color: colors.textBlue,
       fontSize: 14,
    fontWeight: FONT_WEIGHTS.normal,
    fontFamily: 'Poppins_500Medium',
    textDecorationLine: 'underline'
    },
    instructions: {
     fontSize: FONT_SIZES.base,
     color: colors.textSecondaryDark,
     textAlign: 'center',
     marginBottom: SPACING['3xl'],
     lineHeight: 22,
    },
    description: {
     fontSize: FONT_SIZES.base,
     color: colors.buttonText,
     textAlign: 'center',
     lineHeight: 22,
     paddingHorizontal: SPACING.lg,
     marginTop: 5,
    }
  };

  return (
    <Text style={[textStyles[variant], style]} {...rest}>
      {children}
    </Text>
  );
};

export default ThemedText;
