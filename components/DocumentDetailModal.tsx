import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Share,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { DriveDocument } from '../types/drive';
import { useTheme } from '../context/ThemeContext';
import { useDrive } from '../context/DriveContext';

interface DocumentDetailModalProps {
  document: DriveDocument | null;
  visible: boolean;
  onClose: () => void;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  document,
  visible,
  onClose,
}) => {
  const { colors } = useTheme();
  const { toggleStar, deleteDocument, renameDocument } = useDrive();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');

  if (!document) return null;

  const handleStartRename = () => {
    setNewName(document.name);
    setIsEditing(true);
  };

  const handleSaveRename = () => {
    if (newName.trim()) {
      renameDocument(document.id, newName.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteDocument(document.id);
    onClose();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out document: ${document.name}`,
        title: document.name,
      });
    } catch (error) {
      console.log('Share error', error);
    }
  };

  const getCategoryIcon = () => {
    switch (document.category) {
      case 'pdf':
        return { name: 'file-pdf-box', color: '#EA4335' };
      case 'scan':
        return { name: 'scanner', color: '#34A853' };
      case 'image':
        return { name: 'image', color: '#FBBC04' };
      case 'doc':
      default:
        return { name: 'file-document-outline', color: '#4285F4' };
    }
  };

  const iconInfo = getCategoryIcon();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
              ]}
            >
              {/* Header Preview Banner */}
              <View
                style={[
                  styles.headerBanner,
                  {
                    backgroundColor: document.thumbnailColor
                      ? `${document.thumbnailColor}20`
                      : colors.iconBg,
                  },
                ]}
              >
                <MaterialCommunityIcons name={iconInfo.name as any} size={54} color={iconInfo.color} />
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={22} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* Title & Rename Input */}
              <View style={styles.content}>
                {isEditing ? (
                  <View style={styles.renameRow}>
                    <TextInput
                      style={[
                        styles.renameInput,
                        { color: colors.text, borderColor: colors.primary, backgroundColor: colors.inputBg },
                      ]}
                      value={newName}
                      onChangeText={setNewName}
                      autoFocus
                    />
                    <TouchableOpacity
                      onPress={handleSaveRename}
                      style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                    >
                      <Text style={styles.saveBtnText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.titleRow}>
                    <Text style={[styles.docTitle, { color: colors.text }]} numberOfLines={2}>
                      {document.name}
                    </Text>
                    <TouchableOpacity onPress={handleStartRename} style={styles.editBtn}>
                      <Ionicons name="pencil-outline" size={18} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Metadata */}
                <View style={[styles.metaContainer, { backgroundColor: colors.iconBg }]}>
                  <View style={styles.metaItem}>
                    <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Type</Text>
                    <Text style={[styles.metaValue, { color: colors.text }]}>
                      {document.category.toUpperCase()} Document
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Size</Text>
                    <Text style={[styles.metaValue, { color: colors.text }]}>{document.size}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Modified</Text>
                    <Text style={[styles.metaValue, { color: colors.text }]}>{document.updatedAt}</Text>
                  </View>
                </View>

                {/* Document Content Snippet */}
                {document.contentSnippet && (
                  <View style={styles.snippetContainer}>
                    <Text style={[styles.snippetLabel, { color: colors.textMuted }]}>
                      Document Preview
                    </Text>
                    <Text style={[styles.snippetText, { color: colors.textSecondary }]}>
                      &quot;{document.contentSnippet}&quot;
                    </Text>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionsList}>
                  <TouchableOpacity
                    style={[styles.actionRow, { borderBottomColor: colors.border }]}
                    onPress={() => toggleStar(document.id)}
                  >
                    <Ionicons
                      name={document.isStarred ? 'star' : 'star-outline'}
                      size={20}
                      color={document.isStarred ? '#FBBC04' : colors.textSecondary}
                    />
                    <Text style={[styles.actionText, { color: colors.text }]}>
                      {document.isStarred ? 'Remove from Starred' : 'Add to Starred'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionRow, { borderBottomColor: colors.border }]}
                    onPress={handleShare}
                  >
                    <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
                    <Text style={[styles.actionText, { color: colors.text }]}>Share document</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionRow} onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={20} color="#EA4335" />
                    <Text style={[styles.actionText, { color: '#EA4335' }]}>Delete document</Text>
                  </TouchableOpacity>
                </View>
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
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    maxHeight: '85%',
    borderWidth: 1,
  },
  headerBanner: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 16,
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  content: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  docTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  editBtn: {
    padding: 6,
  },
  renameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  renameInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  metaItem: {
    alignItems: 'flex-start',
  },
  metaLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  snippetContainer: {
    marginBottom: 16,
  },
  snippetLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  snippetText: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  actionsList: {
    marginTop: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
