import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useDrive } from '../context/DriveContext';
import { FileCategory } from '../types/drive';

interface CategoryItem {
  id: FileCategory;
  label: string;
  iconName: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'all', label: 'All Files', iconName: 'folder-outline' },
  { id: 'starred', label: 'Starred', iconName: 'star-outline' },
  { id: 'pdf', label: 'PDFs', iconName: 'document-text-outline' },
  { id: 'scan', label: 'Scans', iconName: 'scan-outline' },
  { id: 'image', label: 'Images', iconName: 'image-outline' },
  { id: 'doc', label: 'Docs', iconName: 'newspaper-outline' },
];

export const CategoryFilter: React.FC = () => {
  const { colors } = useTheme();
  const { selectedCategory, setSelectedCategory } = useDrive();

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
              activeOpacity={0.7}
            >
              <Ionicons
                name={cat.iconName as any}
                size={16}
                color={isSelected ? '#FFFFFF' : colors.textSecondary}
                style={styles.chipIcon}
              />
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isSelected ? '#FFFFFF' : colors.text,
                    fontWeight: isSelected ? '600' : '400',
                  },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 8,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 13,
  },
});
