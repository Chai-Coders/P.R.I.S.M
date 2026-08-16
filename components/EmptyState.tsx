import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useDrive } from '../context/DriveContext';

interface EmptyStateProps {
  onAddDocument: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddDocument }) => {
  const { colors } = useTheme();
  const { searchQuery, selectedCategory, resetSampleDocuments } = useDrive();

  const isSearchOrFilter = searchQuery.length > 0 || selectedCategory !== 'all';

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
        <MaterialCommunityIcons
          name={isSearchOrFilter ? 'file-search-outline' : 'folder-upload-outline'}
          size={56}
          color={colors.primary}
        />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>
        {isSearchOrFilter ? 'No matching documents' : 'Your Drive is empty'}
      </Text>

      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {isSearchOrFilter
          ? 'Try adjusting your search criteria or filter to find what you are looking for.'
          : 'Upload, scan, or create new documents to store them securely in your Google Drive.'}
      </Text>

      <View style={styles.btnRow}>
        {!isSearchOrFilter && (
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            onPress={onAddDocument}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.primaryBtnText}>Add Document</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.secondaryBtn,
            { borderColor: colors.primary, backgroundColor: colors.cardBackground },
          ]}
          onPress={resetSampleDocuments}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="refresh" size={18} color={colors.primary} style={{ marginRight: 6 }} />
          <Text style={[styles.secondaryBtnText, { color: colors.primary }]}>
            Restore Sample Docs
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 280,
  },
  btnRow: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 240,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 24,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 11,
    borderRadius: 24,
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
