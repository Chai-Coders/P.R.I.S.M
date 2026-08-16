import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useDrive } from '../context/DriveContext';

export const Header: React.FC = () => {
  const { theme, colors, toggleTheme } = useTheme();
  const { searchQuery, setSearchQuery, viewMode, setViewMode } = useDrive();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Drive Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search in Drive"
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.iconBtn}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* Dark / Light Mode Toggle */}
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.iconBtn, { backgroundColor: colors.iconBg }]}
          accessibilityLabel="Toggle Dark Mode"
        >
          <Ionicons
            name={theme === 'light' ? 'moon-outline' : 'sunny-outline'}
            size={18}
            color={theme === 'light' ? '#1F1F1F' : '#FFD700'}
          />
        </TouchableOpacity>

        {/* View Mode Toggle (Grid / List) */}
        <TouchableOpacity
          onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          style={[styles.iconBtn, { backgroundColor: colors.iconBg }]}
          accessibilityLabel="Toggle View Mode"
        >
          <MaterialIcons
            name={viewMode === 'grid' ? 'view-list' : 'grid-view'}
            size={20}
            color={colors.primary}
          />
        </TouchableOpacity>

        {/* Profile Avatar */}
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>P</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 4,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 16,
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
