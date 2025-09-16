import React from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';
import { useTheme } from '../providers/ThemeProviders';
import Colors from '../constants/Color';

type Variant = 'heading' | 'subheading' | 'body' | 'caption';

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

  const textStyle = {
    heading: { fontSize: 24, fontWeight: 'bold' as const, color: colors.text },
    subheading: { fontSize: 14, fontWeight: '600' as const, color: colors.text },
    body: { fontSize: 16, fontWeight: 'normal' as const, color: colors.text},
    caption: { fontSize: 12, color: colors.textSecondary },
  };

  return (
    <Text style={[textStyle[variant], style]} {...rest}>
      {children}
    </Text>
  );
};

export default ThemedText;