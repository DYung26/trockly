import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DividerWithTextProps {
  text: string;
}

const DividerWithText: React.FC<DividerWithTextProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.withText}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  line: {
    flex: 1,
    height: 1,
    borderColor: '#DDDEE0',
    borderWidth: 1,
  },
  withText: {
    color: '#777A84',
    fontWeight: '400',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginHorizontal: 6, 
  },
});

export default DividerWithText;
