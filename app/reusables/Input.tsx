import React from "react";
import { TextInput, StyleSheet, View,  TextInputProps } from "react-native";
import { colors } from "../constants/theme";
import ThemedText from "./ThemedText";
import { radius, spacing } from "../constants/layout";

interface InputProps extends TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
}

const Input: React.FC<InputProps> = ({ label, value, onChangeText, placeholder, secureTextEntry, ...rest }) => {
  return (
    <View style={styles.container}>
      {label && <ThemedText variant='subheading' style={styles.label}>{label}</ThemedText>}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.gray}
        secureTextEntry={secureTextEntry}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.setBlue,
    borderRadius: radius.sm,
     paddingHorizontal: spacing.flg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    fontSize: 16,
    color: colors.text,
  },
});

export default Input;
