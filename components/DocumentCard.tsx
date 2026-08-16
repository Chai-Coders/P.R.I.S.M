import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DriveDocument } from '../types/drive';
import { useTheme } from '../context/ThemeContext';
import { useDrive } from '../context/DriveContext';

interface DocumentCardProps {
  document: DriveDocument;
  onPress: () => void;
  onOptionPress: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onPress,
  onOptionPress,
}) => {
  const { colors } = useTheme();
  const { toggleStar } = useDrive();

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
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardBorder,
          shadowColor: colors.shadowColor,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Visual Document Header Preview */}
      <View
        style={[
          styles.previewArea,
          { backgroundColor: document.thumbnailColor ? `${document.thumbnailColor}15` : colors.iconBg },
        ]}
      >
        <MaterialCommunityIcons name={iconInfo.name as any} size={48} color={iconInfo.color} />
        
        {/* Star Button */}
        <TouchableOpacity
          style={styles.starBtn}
          onPress={() => toggleStar(document.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={document.isStarred ? 'star' : 'star-outline'}
            size={18}
            color={document.isStarred ? '#FBBC04' : colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      {/* Document Information Footer */}
      <View style={styles.detailsArea}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name={iconInfo.name as any} size={18} color={iconInfo.color} style={styles.miniIcon} />
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {document.name}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={[styles.metaText, { color: colors.textMuted }]}>
            {document.size} • {document.updatedAt}
          </Text>
          <TouchableOpacity onPress={onOptionPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="ellipsis-vertical" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
    width: '48%',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  previewArea: {
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  starBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  detailsArea: {
    padding: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  miniIcon: {
    marginRight: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  metaText: {
    fontSize: 11,
  },
});
