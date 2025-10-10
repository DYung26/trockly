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
     borderRadius: 8,
     paddingVertical: 16,
     alignItems: 'center',
     marginBottom: 16,
    },
    buttonDisabled: {
      backgroundColor: colors.surfaceDisabled,
    },
    buttonActive: {
      backgroundColor: colors.blue
    },
    text: {
      fontSize: 16,
      fontWeight: '600',
    },
    textDisabled: {
     color: colors.textDisabled
    },
    textActive: {
      color: colors.greyWhite,
      fontFamily: 'Poppins_500Medium',
      fontWeight: '500',
      fontSize: 14,
    },
});

export default AuthButton;