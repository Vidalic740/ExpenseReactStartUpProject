import { useAppTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Language = {
  code: string;
  name: string;
};

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ar', name: 'Arabic' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'sw', name: 'Swahili' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ko', name: 'Korean' },
  { code: 'it', name: 'Italian' },
  { code: 'tr', name: 'Turkish' },
  { code: 'ms', name: 'Malay' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'fa', name: 'Persian' },
  { code: 'am', name: 'Amharic' },
  { code: 'zu', name: 'Zulu' },
];

export default function LanguageScreen() {
  const { colors } = useAppTheme();
  const { i18n, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language);

  const handleSelectLanguage = (lang: Language) => {
    setSelectedLanguage(lang.code);
    i18n.changeLanguage(lang.code); // 🌐 Change language globally
  };

  const renderItem = ({ item }: { item: Language }) => (
    <TouchableOpacity
      onPress={() => handleSelectLanguage(item)}
      style={[
        styles.langItem,
        {
          backgroundColor:
            selectedLanguage === item.code ? colors.accent : colors.card,
        },
      ]}
    >
      <Text style={{ color: colors.text }}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.main, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>
        {t('selectLanguage') || 'Select Your Language'}
      </Text>
      <FlatList
        data={LANGUAGES}
        keyExtractor={(item) => item.code}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  langItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
});
