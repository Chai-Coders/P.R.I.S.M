import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DriveDocument } from '../types/drive';
import { useTheme } from '../context/ThemeContext';
import { useDrive } from '../context/DriveContext';

interface DocumentListItemProps {
  document: DriveDocument;
  onPress: () => void;
  onOptionPress: () => void;
}

export const DocumentListItem: React.FC<DocumentListItemProps> = ({
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
        styles.container,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardBorder,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Leading File Icon */}
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: document.thumbnailColor ? `${document.thumbnailColor}15` : colors.iconBg },
        ]}
      >
        <MaterialCommunityIcons name={iconInfo.name as any} size={26} color={iconInfo.color} />
      </View>

      {/* Main Details */}
      <View style={styles.textContainer}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {document.name}
        </Text>
        <Text style={[styles.subtext, { color: colors.textMuted }]}>
          {document.size} • {document.updatedAt}
        </Text>
      </View>

      {/* Action Icons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={() => toggleStar(document.id)}
          style={styles.actionBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={document.isStarred ? 'star' : 'star-outline'}
            size={18}
            color={document.isStarred ? '#FBBC04' : colors.textMuted}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOptionPress}
          style={styles.actionBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="ellipsis-vertical" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtext: {
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    padding: 6,
  },
});
