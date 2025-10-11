import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useCallback, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, View } from "../../components/ui";
import { pageHorizantalPadding, supportCategories, supportIssueTypes } from "../../utils/commomCompute";
import { ScreenHeader } from '../cart';

const SupportTicket = () => {
  const [category, setCategory] = useState('');
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showIssueDropdown, setShowIssueDropdown] = useState(false);

  const handleSubmit = useCallback(() => {
    // Handle form submission
    console.log('Support ticket submitted:', {
      category,
      issue,
      description,
    });
  }, [category, issue, description]);

  const handleCategorySelect = useCallback((selectedCategory: string) => {
    setCategory(selectedCategory);
    setShowCategoryDropdown(false);
  }, []);

  const handleIssueSelect = useCallback((selectedIssue: string) => {
    setIssue(selectedIssue);
    setShowIssueDropdown(false);
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
        <View flex={1} backgroundColor="mainBackgroundLight">
          <ScreenHeader title="Report Issue" moreAction={false} />
          
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView 
              style={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
            <View paddingHorizontal={pageHorizantalPadding} paddingTop="l">
              <Text
                fontSize={24}
                fontWeight="700"
                color="textPrimary"
                fontFamily="Poppins-Bold"
                marginBottom="s"
              >
                Raise a Support Ticket
              </Text>
              
              <Text
                fontSize={14}
                fontWeight="400"
                color="textSecondary"
                fontFamily="Poppins-Regular"
                marginBottom="xl"
              >
                Submit a request for assistance with an issue or inquiry.
              </Text>

              <View gap="l">
                {/* Category Field */}
                <View>
                  <Text
                    fontSize={14}
                    fontWeight="600"
                    color="textPrimary"
                    fontFamily="Poppins-SemiBold"
                    marginBottom="s"
                  >
                    Category <Text color="primary">*</Text>
                  </Text>
                  
                  <Pressable onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}>
                    <View
                      backgroundColor="mainBackground"
                      borderRadius="m"
                      paddingVertical="m"
                      paddingHorizontal="m"
                      borderWidth={1}
                      borderColor="inputBorder"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Text
                        fontSize={16}
                        fontWeight="400"
                        color={category ? "textPrimary" : "inputPlaceholder"}
                        fontFamily="Poppins-Regular"
                      >
                        {category || 'Select Category'}
                      </Text>
                      <Ionicons 
                        name={showCategoryDropdown ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color="textPrimary" 
                      />
                    </View>
                  </Pressable>

                  {showCategoryDropdown && (
                    <View
                      backgroundColor="mainBackground"
                      borderRadius="m"
                      marginTop="xs"
                      borderWidth={1}
                      borderColor="inputBorder"
                      maxHeight={200}
                    >
                      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                        {supportCategories.map((cat, index) => (
                          <Pressable
                            key={index}
                            onPress={() => handleCategorySelect(cat)}
                            style={styles.dropdownItem}
                          >
                            <Text
                              fontSize={16}
                              fontWeight="400"
                              color="textPrimary"
                              fontFamily="Poppins-Regular"
                              paddingVertical="s"
                              paddingHorizontal="m"
                            >
                              {cat}
                            </Text>
                            {index < supportCategories.length - 1 && (
                              <View borderTopWidth={1} borderTopColor="inputBorder" />
                            )}
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Issue Field */}
                <View>
                  <Text
                    fontSize={14}
                    fontWeight="600"
                    color="textPrimary"
                    fontFamily="Poppins-SemiBold"
                    marginBottom="s"
                  >
                    Issue <Text color="primary">*</Text>
                  </Text>
                  
                  <Pressable onPress={() => setShowIssueDropdown(!showIssueDropdown)}>
                    <View
                      backgroundColor="mainBackground"
                      borderRadius="m"
                      paddingVertical="m"
                      paddingHorizontal="m"
                      borderWidth={1}
                      borderColor="inputBorder"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Text
                        fontSize={16}
                        fontWeight="400"
                        color={issue ? "textPrimary" : "inputPlaceholder"}
                        fontFamily="Poppins-Regular"
                      >
                        {issue || 'Select your issue type'}
                      </Text>
                      <Ionicons 
                        name={showIssueDropdown ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color="textPrimary" 
                      />
                    </View>
                  </Pressable>

                  {showIssueDropdown && (
                    <View
                      backgroundColor="mainBackground"
                      borderRadius="m"
                      marginTop="xs"
                      borderWidth={1}
                      borderColor="inputBorder"
                      maxHeight={200}
                    >
                      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                        {supportIssueTypes.map((issueType, index) => (
                          <Pressable
                            key={index}
                            onPress={() => handleIssueSelect(issueType)}
                            style={styles.dropdownItem}
                          >
                            <Text
                              fontSize={16}
                              fontWeight="400"
                              color="textPrimary"
                              fontFamily="Poppins-Regular"
                              paddingVertical="s"
                              paddingHorizontal="m"
                            >
                              {issueType}
                            </Text>
                            {index < supportIssueTypes.length - 1 && (
                              <View borderTopWidth={1} borderTopColor="inputBorder" />
                            )}
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Description Field */}
                <View>
                  <Text
                    fontSize={14}
                    fontWeight="600"
                    color="textPrimary"
                    fontFamily="Poppins-SemiBold"
                    marginBottom="s"
                  >
                    Describe your Issue <Text color="primary">*</Text>
                  </Text>
                  
                  <TextInput
                    placeholder="Write your issue in detail"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={6}
                    style={styles.textArea}
                    textAlignVertical="top"
                  />
                </View>

                {/* Submit Button */}
                <View marginTop="l" marginBottom="xl">
                  <Button
                    title="Submit Support Ticket"
                    variant="primary"
                    onPress={handleSubmit}
                    disabled={!category || !issue || !description.trim()}
                  />
                </View>
              </View>
            </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  dropdownItem: {
    // Additional styling if needed
  },
  textArea: {
    backgroundColor: 'mainBackground',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
    minHeight: 120,
  },
});

export default SupportTicket;
