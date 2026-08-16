import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export type FeatureType = 'scanner' | 'chatbot';

interface FeatureNoticeModalProps {
  visible: boolean;
  featureType: FeatureType | null;
  onClose: () => void;
}

export const FeatureNoticeModal: React.FC<FeatureNoticeModalProps> = ({
  visible,
  featureType,
  onClose,
}) => {
  const { colors } = useTheme();

  if (!featureType) return null;

  const isScanner = featureType === 'scanner';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                styles.modalCard,
                { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
              ]}
            >
              {/* Badge Icon */}
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: isScanner ? '#E6F4EA' : colors.primaryLight },
                ]}
              >
                <MaterialCommunityIcons
                  name={isScanner ? 'scanner' : 'robot-outline'}
                  size={42}
                  color={isScanner ? '#34A853' : colors.primary}
                />
              </View>

              {/* Status Badge */}
              <View style={[styles.badge, { backgroundColor: colors.badgeBg }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>Feature Preview</Text>
              </View>

              {/* Feature Title */}
              <Text style={[styles.title, { color: colors.text }]}>
                {isScanner ? 'Document Scanner' : 'PRISM AI Assistant'}
              </Text>

              {/* Description */}
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {isScanner
                  ? 'The camera document scanner icon is ready! Full scanning, edge-detection, and document capture functionality will be connected here soon.'
                  : 'The AI Chatbot icon is ready! Instant document search, summaries, and conversational Q&A functionality will be connected here soon.'}
              </Text>

              {/* Dismiss Button */}
              <TouchableOpacity
                style={[styles.closeBtn, { backgroundColor: colors.primary }]}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.closeBtnText}>Got it</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  closeBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});
