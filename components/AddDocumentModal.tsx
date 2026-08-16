import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useDrive } from '../context/DriveContext';
import { FileCategory } from '../types/drive';

interface AddDocumentModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddDocumentModal: React.FC<AddDocumentModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const { addDocument } = useDrive();

  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState<Exclude<FileCategory, 'all' | 'starred'>>('pdf');
  const [snippet, setSnippet] = useState('');

  const handleCreate = () => {
    if (!docName.trim()) return;

    let extension = '.pdf';
    let thumbColor = '#EA4335';

    if (docCategory === 'scan') {
      extension = '.scan';
      thumbColor = '#34A853';
    } else if (docCategory === 'image') {
      extension = '.png';
      thumbColor = '#FBBC04';
    } else if (docCategory === 'doc') {
      extension = '.doc';
      thumbColor = '#4285F4';
    }

    const finalName = docName.toLowerCase().endsWith(extension)
      ? docName
      : `${docName}${extension}`;

    addDocument({
      name: finalName,
      category: docCategory,
      size: '1.2 MB',
      isStarred: false,
      contentSnippet: snippet.trim() || 'Newly created document in Google Drive.',
      thumbnailColor: thumbColor,
    });

    setDocName('');
    setSnippet('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                styles.modalCard,
                { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
              ]}
            >
              <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Add New Document</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Document Name Input */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textMuted }]}>Document Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBg },
                  ]}
                  placeholder="e.g. Annual_Budget_Plan"
                  placeholderTextColor={colors.textMuted}
                  value={docName}
                  onChangeText={setDocName}
                />
              </View>

              {/* Category Selection */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textMuted }]}>Document Type</Text>
                <View style={styles.categoryRow}>
                  {[
                    { id: 'pdf', label: 'PDF', icon: 'file-pdf-box', color: '#EA4335' },
                    { id: 'scan', label: 'Scan', icon: 'scanner', color: '#34A853' },
                    { id: 'image', label: 'Image', icon: 'image', color: '#FBBC04' },
                    { id: 'doc', label: 'Doc', icon: 'file-document-outline', color: '#4285F4' },
                  ].map((item) => {
                    const isSelected = docCategory === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => setDocCategory(item.id as any)}
                        style={[
                          styles.catChip,
                          {
                            backgroundColor: isSelected ? `${item.color}20` : colors.iconBg,
                            borderColor: isSelected ? item.color : colors.border,
                          },
                        ]}
                      >
                        <MaterialCommunityIcons name={item.icon as any} size={18} color={item.color} />
                        <Text
                          style={[
                            styles.catChipText,
                            { color: colors.text, fontWeight: isSelected ? '700' : '400' },
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Snippet / Description Input */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textMuted }]}>Description / Snippet</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    { color: colors.text, borderColor: colors.border, backgroundColor: colors.inputBg },
                  ]}
                  placeholder="Add brief description or notes..."
                  placeholderTextColor={colors.textMuted}
                  value={snippet}
                  onChangeText={setSnippet}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Actions */}
              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={[styles.cancelBtn, { borderColor: colors.border }]}
                  onPress={onClose}
                >
                  <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.createBtn,
                    { backgroundColor: docName.trim() ? colors.primary : colors.border },
                  ]}
                  onPress={handleCreate}
                  disabled={!docName.trim()}
                >
                  <Text style={styles.createText}>Create Document</Text>
                </TouchableOpacity>
              </View>
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
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  catChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  catChipText: {
    fontSize: 12,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  createBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  createText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
