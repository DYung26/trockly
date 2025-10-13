import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';


interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  label?: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad';
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  prefix?: string;
}


export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  keyboardType = 'default',
  maxLength,
  multiline = false,
  numberOfLines = 1,
  prefix,
}) => (
  <View style={styles.inputContainer}>
    {label && <Text style={styles.inputLabel}>{label}</Text>}
    <View style={styles.inputWrapper}>
      {prefix && <Text style={styles.inputPrefix}>{prefix}</Text>}
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline, prefix && styles.inputWithPrefix]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  </View>
);


const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  inputPrefix: {
    fontSize: 15,
    color: '#374151',
    paddingLeft: 16,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  inputWithPrefix: {
    paddingLeft: 8,
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: 'top',
  },
});