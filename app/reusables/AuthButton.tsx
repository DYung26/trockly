import React from 'react';
import { 
 TouchableOpacity, 
 Text,
 StyleSheet,
 GestureResponderEvent,
 StyleProp,
 ViewStyle,
 TextStyle,
 ActivityIndicator
} from 'react-native';
import { colors } from '../constants/theme';
import { BORDER_RADIUS, SPACING } from '../constants/layout';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';

interface AuthButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?:boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  title, 
  onPress, 
  disabled = false, 
  loading = false,
  style, 
  textStyle 
}) => {
   return (
    <TouchableOpacity
      style={[styles.button, disabled ? styles.buttonDisabled : styles.buttonActive, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
    {loading ? (
        <ActivityIndicator color={colors.white} />
    ): (
    <Text style={[styles.text, disabled ? styles.textDisabled : styles.textActive, textStyle]}>
      {title}
     </Text>
    )}
    </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
    button: {
     borderRadius: BORDER_RADIUS['5xl'],
     paddingVertical: SPACING.lg,
     alignItems: 'center',
     marginBottom: SPACING.lg,
    },
    buttonDisabled: {
      backgroundColor: colors.surfaceDisabled,
    },
    buttonActive: {
      backgroundColor: colors.blue
    },
    text: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.semibold,
    },
    textDisabled: {
     color: colors.textDisabled
    },
    textActive: {
      color: colors.greyWhite,
      fontFamily: 'Poppins_500Medium',
      fontWeight: FONT_WEIGHTS.semibold,
      fontSize: FONT_SIZES.base,
    },
});

export default AuthButton;