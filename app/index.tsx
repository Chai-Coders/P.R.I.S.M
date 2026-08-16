import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useDrive } from '../context/DriveContext';
import { Header } from '../components/Header';
import { CategoryFilter } from '../components/CategoryFilter';
import { DocumentCard } from '../components/DocumentCard';
import { DocumentListItem } from '../components/DocumentListItem';
import { EmptyState } from '../components/EmptyState';
import { DocumentDetailModal } from '../components/DocumentDetailModal';
import { FeatureNoticeModal, FeatureType } from '../components/FeatureNoticeModal';
import { AddDocumentModal } from '../components/AddDocumentModal';
import { DriveDocument } from '../types/drive';

export default function DriveHomeScreen() {
  const { colors } = useTheme();
  const {
    filteredDocuments,
    viewMode,
    sortField,
    setSortField,
    clearAllDocuments,
    resetSampleDocuments,
  } = useDrive();

  // Modal states
  const [selectedDoc, setSelectedDoc] = useState<DriveDocument | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const [featureModalVisible, setFeatureModalVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState<FeatureType | null>(null);

  const [addDocModalVisible, setAddDocModalVisible] = useState(false);

  const handleOpenDocDetail = (doc: DriveDocument) => {
    setSelectedDoc(doc);
    setDetailModalVisible(true);
  };

  const handleOpenFeature = (type: FeatureType) => {
    setActiveFeature(type);
    setFeatureModalVisible(true);
  };

  const toggleSort = () => {
    if (sortField === 'date') setSortField('name');
    else setSortField('date');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Google Drive Header */}
      <Header />

      {/* Category Chips */}
      <CategoryFilter />

      {/* Files Section Title Bar */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Files ({filteredDocuments.length})
          </Text>

          {/* Sort button */}
          <TouchableOpacity
            style={[styles.sortBtn, { backgroundColor: colors.iconBg }]}
            onPress={toggleSort}
          >
            <MaterialCommunityIcons name="sort-variant" size={16} color={colors.primary} />
            <Text style={[styles.sortBtnText, { color: colors.textSecondary }]}>
              {sortField === 'date' ? 'Date' : 'Name'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Clear / Demo Actions */}
        <View style={styles.actionRow}>
          {filteredDocuments.length > 0 ? (
            <TouchableOpacity onPress={clearAllDocuments} style={styles.textLinkBtn}>
              <Text style={[styles.textLink, { color: colors.textMuted }]}>Clear All (Test Empty)</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={resetSampleDocuments} style={styles.textLinkBtn}>
              <Text style={[styles.textLink, { color: colors.primary }]}>Load Sample Docs</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main Files Display Grid / List / Empty State */}
      {filteredDocuments.length === 0 ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <EmptyState onAddDocument={() => setAddDocModalVisible(true)} />
        </ScrollView>
      ) : viewMode === 'grid' ? (
        <FlatList
          data={filteredDocuments}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridColumnWrapper}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <DocumentCard
              document={item}
              onPress={() => handleOpenDocDetail(item)}
              onOptionPress={() => handleOpenDocDetail(item)}
            />
          )}
        />
      ) : (
        <FlatList
          data={filteredDocuments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <DocumentListItem
              document={item}
              onPress={() => handleOpenDocDetail(item)}
              onOptionPress={() => handleOpenDocDetail(item)}
            />
          )}
        />
      )}

      {/* Floating Action Buttons Container */}
      <View style={styles.fabContainer}>
        {/* Document Scanner Icon Button */}
        <TouchableOpacity
          style={[styles.fabSecondary, { backgroundColor: '#34A853', shadowColor: colors.shadowColor }]}
          onPress={() => handleOpenFeature('scanner')}
          activeOpacity={0.85}
          accessibilityLabel="Scan Document"
        >
          <MaterialCommunityIcons name="scanner" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* AI Chatbot Icon Button */}
        <TouchableOpacity
          style={[styles.fabSecondary, { backgroundColor: colors.primary, shadowColor: colors.shadowColor }]}
          onPress={() => handleOpenFeature('chatbot')}
          activeOpacity={0.85}
          accessibilityLabel="AI Chatbot"
        >
          <MaterialCommunityIcons name="robot-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Create Document (+) FAB Button */}
        <TouchableOpacity
          style={[styles.fabPrimary, { backgroundColor: '#1F1F1F', shadowColor: colors.shadowColor }]}
          onPress={() => setAddDocModalVisible(true)}
          activeOpacity={0.85}
          accessibilityLabel="Add New Document"
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <DocumentDetailModal
        visible={detailModalVisible}
        document={selectedDoc}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedDoc(null);
        }}
      />

      <FeatureNoticeModal
        visible={featureModalVisible}
        featureType={activeFeature}
        onClose={() => {
          setFeatureModalVisible(false);
          setActiveFeature(null);
        }}
      />

      <AddDocumentModal
        visible={addDocModalVisible}
        onClose={() => setAddDocModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textLinkBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  textLink: {
    fontSize: 12,
    fontWeight: '500',
  },
  gridColumnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  listPadding: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    alignItems: 'center',
    gap: 12,
  },
  fabSecondary: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabPrimary: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});
