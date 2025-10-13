import React, { useRef } from 'react';
import { 
  Modal, 
  View,
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { Button } from './PostButton';
import { SPACING, BORDER_RADIUS } from '../constants/layout';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';
import { colors } from '../constants/theme';
import ThemedText from './ThemedText';

const { width, height } = Dimensions.get('window');

interface OTPModalProps {
  visible: boolean;
  otp: string[];
  onOtpChange: (value: string, index: number) => void;
  onVerify: () => void;
  onClose: () => void;
}

export const OTPModal: React.FC<OTPModalProps> = ({
  visible,
  otp,
  onOtpChange,
  onVerify,
  onClose,
}) => {
  const otpInputs = useRef<TextInput[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      onOtpChange(value, index);
      if (value && index < 3) {
        otpInputs.current[index + 1]?.focus();
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity style={styles.modalClose} onPress={onClose}>
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>

          {/* Top Content */}
          <View style={styles.topContent}>
            {/* Title - Left Aligned */}
            <View style={{ marginBottom: 10 }}>
              <ThemedText variant='subheading'>OTP Verification</ThemedText>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Enter the 4-digit code we sent to 07078787399{'\n'}                    to verify your phone number
            </Text>

            {/* OTP Input Boxes */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    if (ref) otpInputs.current[index] = ref;
                  }}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>

            {/* Verify Button */}
            <View style={styles.buttonWrapper}>
              <Button title="Verify" onPress={onVerify} />
            </View>
          </View>

        
          <TouchableOpacity style={styles.textButton}>
            <Text style={styles.modalLink}>
              Need help? <Text style={styles.linkBlue}>Contact support</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',    
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    width: width - 20,
    height: height * 0.75,         
    backgroundColor: '#F1F1F1',
    paddingVertical: SPACING['3xl'],
    paddingHorizontal: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    justifyContent: 'space-between', 
  },
  modalClose: {
    position: 'absolute',
    top: SPACING.lg,
    right: SPACING.lg,
    zIndex: 1,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: BORDER_RADIUS['2xl'],
  },
  modalCloseText: {
    fontSize: FONT_SIZES['2xl'],
    color: colors.textDisabled,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  topContent: {
    flex: 1,                        
    width: '100%',
  },
  modalSubtitle: {
    fontSize: FONT_SIZES.base,
    color: colors.textDisabled,
    marginBottom: SPACING['3xl'],
    lineHeight: 18,
    alignSelf: 'flex-start',
    width: '90%',
    textAlign: 'left',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING['3xl'],
    gap: SPACING.md,
    width: '100%',
  },
  otpInput: {
    //flex: 1,
    width: 52,
    height: 52,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: BORDER_RADIUS.sm,
    textAlign: 'center',
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.medium,
    color: colors.textBody,
  },
  buttonWrapper: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  textButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    width: '100%',
    paddingBottom: SPACING.xl,             
  },
  modalLink: {
    fontSize: FONT_SIZES.base,
    color: colors.textDisabled,
    fontWeight: FONT_WEIGHTS.medium,
    fontFamily: 'Poppins_500Medium'
  },
  linkBlue: {
    color: colors.blue,
    fontFamily: 'Poppins_500Medium',
    textDecorationLine: 'underline'
  },
});