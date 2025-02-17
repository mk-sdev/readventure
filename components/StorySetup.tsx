import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ADVANCEMENT_LEVELS_STORAGE_KEY } from '@/constants/StorageKeys';
import { translations } from '@/constants/Translations';
import { foreignLanguages, homeLanguages, levels, request } from '@/constants/Types';
import { getValue, setValue } from '@/utils/async-storage';
import returnFlag from '@/utils/functions';
import useFavLangs from '@/utils/useFavLangs';
import { LanguagePickerBottomSheet } from './BottomSheets/LanguagePickerBottomSheet';

export default function StorySetup({
  appLang,
  setRequest,
}: {
  appLang: homeLanguages;
  setRequest: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [description, setDescription] = useState('');
  const [dropDownValue, setDropDownValue] = useState<foreignLanguages | null>(null);
  const { loadFavLangs, favLangs } = useFavLangs();
  const [advancementLevel, setAdvancementLevel] = useState<levels>('A1');
  const levels: levels[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

  const bottomSheetRef = useRef<{ open: () => void; close: () => void }>(null);
  const [dropDownItems, setDropDownItems] = useState<{ label: string; value: foreignLanguages }[]>([]);

  async function handleSubmit() {
    const request: request = {
      description,
      lang: dropDownValue as foreignLanguages,
      homeLang: appLang,
      level: advancementLevel,
    };
    setRequest(JSON.stringify(request));

    let storedLevels: Record<string, levels> = await getValue(ADVANCEMENT_LEVELS_STORAGE_KEY);
    if (!storedLevels) storedLevels = {};
    storedLevels[dropDownValue as string] = advancementLevel;
    setValue(ADVANCEMENT_LEVELS_STORAGE_KEY, storedLevels);
  }

  useEffect(() => {
    (async () => {
      let storedLevels: Record<string, levels> = await getValue(ADVANCEMENT_LEVELS_STORAGE_KEY);
      setAdvancementLevel(storedLevels?.[dropDownValue as string] ?? 'A1');
    })();
  }, [dropDownValue]);

  useFocusEffect(
    useCallback(() => {
      loadFavLangs();
    }, [])
  );

  useEffect(() => {
    let newItems = Object.entries(translations[appLang].foreignLanguages).map(([key, value]) => ({
      label: value,
      value: key as foreignLanguages,
    }));

    newItems = [
      ...newItems.filter(item => favLangs.includes(item.value)),
      ...newItems.filter(item => !favLangs.includes(item.value)),
    ];
    setDropDownItems(newItems);
    setDropDownValue(dropDownValue || newItems[0]?.value);
  }, [favLangs, appLang]);

  return (
    <React.Fragment>
      <Text style={styles.label}>{translations[appLang].textDescriptionLabel}</Text>
      <Text>{translations[appLang].textDescriptionInfo}</Text>
      <TextInput
        multiline
        numberOfLines={10}
        placeholder={translations[appLang].textDescriptionPlaceholder}
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      
      <Text style={styles.label}>{translations[appLang].languageLabel}</Text>
      <Pressable style={styles.languageSelector} onPress={() => bottomSheetRef.current?.open()}>
        {dropDownValue && returnFlag(dropDownValue)}
        <Text style={styles.languageText}>
          {dropDownItems.find(item => item.value === dropDownValue)?.label || 'Select Language'}
        </Text>
      </Pressable>

      <View style={styles.levelContainer}>
        {levels.map(level => (
          <Pressable key={level} onPress={() => setAdvancementLevel(level)}>
            <Text style={[styles.level, { backgroundColor: level === advancementLevel ? 'red' : '#ddd' }]}>
              {level}
            </Text>
          </Pressable>
        ))}
      </View>

      <Button onPress={handleSubmit} title="submit" />

      <LanguagePickerBottomSheet
        ref={bottomSheetRef}
        languages={dropDownItems}
        selectedLanguage={dropDownValue}
        onSelect={setDropDownValue}
      />
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 200,
    textAlignVertical: 'top',
    backgroundColor: '#eee',
    width: '90%',
    padding: 10,
    borderRadius: 5,
  },
  languageSelector: {
    padding: 15,
    backgroundColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
  },
  languageText: {
    fontSize: 16,
    marginLeft: 10,
  },
  levelContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '90%',
    marginTop: 10,
    justifyContent: 'center',
  },
  level: {
    fontSize: 30,
  },
});
