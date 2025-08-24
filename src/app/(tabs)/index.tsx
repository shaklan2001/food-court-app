import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Button, Card, Text, View } from '../../components/ui';

export default function HomeScreen() {
  return (
    <View
      flex={1}
      backgroundColor="mainBackground"
      paddingVertical="xl"
      paddingHorizontal="m"
    >
      <Text variant="header" marginBottom="l" textAlign="center">
        🍽️ Food Court App <AntDesign name="stepforward" size={24} color="black" />
      </Text>

      <Text variant="body" marginBottom="xl" textAlign="center" color="textSecondary">
        Welcome to your food court app with Shopify Restyle theming!
      </Text>

      <View gap="l">
        <Card variant="primary">
          <Text variant="subheader" color="textOnPrimary" marginBottom="s">
            Featured Today
          </Text>
          <Text variant="body" color="textOnPrimary">
            Check out our special deals and featured restaurants
          </Text>
        </Card>

        <View
          flexDirection={{
            phone: 'column',
            tablet: 'row',
          }}
          gap="m"
        >
          <Card variant="secondary" flex={1}>
            <Text variant="body" fontWeight="600" marginBottom="xs">
              🍕 Pizza Corner
            </Text>
            <Text variant="caption">
              Fresh Italian pizza made to order
            </Text>
          </Card>

          <Card variant="secondary" flex={1}>
            <Text variant="body" fontWeight="600" marginBottom="xs">
              🍔 Burger Junction
            </Text>
            <Text variant="caption">
              Gourmet burgers with premium ingredients
            </Text>
          </Card>
        </View>

        <Card variant="elevated">
          <Text variant="subheader" marginBottom="s">
            Quick Actions
          </Text>
          <View gap="m">
            <Button
              title="Browse Restaurants"
              variant="primary"
              onPress={() => console.log('Browse restaurants pressed')}
            />

            <Button
              title="View My Orders"
              variant="outline"
              textVariant="body"
              onPress={() => console.log('View orders pressed')}
            />
          </View>
        </Card>

        <View backgroundColor="primary" padding="m" borderRadius="m" marginTop="l">
          <Text variant="body" color="textOnPrimary" textAlign="center" fontWeight="600">
            Your primary color (#FF0000) is now integrated with Restyle! 🎨
          </Text>
        </View>
      </View>
    </View>
  );
}

