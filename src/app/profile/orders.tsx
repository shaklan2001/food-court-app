import theme from '@/src/theme/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../components/ui";
import { SearchIcon, SortIcon } from '../../utils/Svgs';
import { pageHorizantalPadding } from "../../utils/commomCompute";
import { ScreenHeader } from '../cart';

// Mock data - replace with actual API data
const mockOrders = [
  {
    id: '1',
    restaurantName: 'Sk. Misal House & Pav Bhaji',
    restaurantImage: 'https://via.placeholder.com/60',
    items: ['1 x Veg Single Combo', '3 x Idli Sambhar'],
    orderDate: '05 Sep, 8:15PM',
    status: 'Delivered',
    price: '₹520',
    rating: 0,
  },
  {
    id: '2',
    restaurantName: 'Sk. Misal House & Pav Bhaji',
    restaurantImage: 'https://via.placeholder.com/60',
    items: ['1 x Veg Single Combo', '3 x Idli Sambhar'],
    orderDate: '05 Sep, 8:15PM',
    status: 'Delivered',
    price: '₹520',
    rating: 0,
  },
];

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [orders] = useState(mockOrders); // Replace with actual data from API

  const handleReorder = (_orderId: string) => {
    // TODO: Implement reorder functionality
  };

  const handleRateOrder = (_orderId: string, _rating: number) => {
    // TODO: Implement rating functionality
  };

  if (orders.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.mainBackgroundLight }}>
        <View flex={1} backgroundColor="mainBackgroundLight">
          <ScreenHeader title="Your Orders" moreAction={false} />

          <View flex={1} justifyContent="center" alignItems="center" paddingHorizontal={pageHorizantalPadding}>
            <Ionicons name="bag-outline" size={80} color="#D3D3D3" />
            <Text
              fontSize={18}
              fontWeight="600"
              color="textPrimary"
              fontFamily="Poppins-SemiBold"
              marginTop="l"
              marginBottom="s"
            >
              No Orders Yet
            </Text>
            <Text
              fontSize={14}
              fontWeight="400"
              color="textSecondary"
              fontFamily="Poppins-Regular"
              textAlign="center"
              lineHeight={20}
            >
              Your order history will appear here once you place your first order
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.mainBackgroundLight }}>
      <View flex={1} backgroundColor="mainBackgroundLight">
        <ScreenHeader title="Your Orders" moreAction={false} />

        {/* Search Bar */}
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            marginTop: 16,
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 49,
              backgroundColor: theme.colors.mainBackground,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: 'rgba(0, 0, 0, 0.1)',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 15,
            }}
          >
            <TextInput
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
                color: theme.colors.textPrimary,
                flex: 1,
              }}
              placeholder="Search"
              placeholderTextColor="rgba(1, 1, 1, 0.3)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <SortIcon />
          </View>
          <TouchableOpacity>
            <View
              style={{
                width: 49,
                height: 49,
                backgroundColor: theme.colors.primary,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <SearchIcon />
            </View>
          </TouchableOpacity>
        </View>

        {/* Orders List */}
        <ScrollView
          style={{ flex: 1, marginTop: 20 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {orders.map((order) => (
            <View
              key={order.id}
              style={{
                backgroundColor: theme.colors.mainBackground,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.1)',
                padding: 10,
                gap: 10,
              }}
            >
              {/* Restaurant Header */}
              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <Image
                  source={{ uri: order.restaurantImage }}
                  style={{ width: 60, height: 60, borderRadius: 30 }}
                />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text
                    fontSize={18}
                    fontWeight="500"
                    fontFamily="Poppins-Medium"
                    color="textPrimary"
                    style={{ lineHeight: 27 }}
                  >
                    {order.restaurantName}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Text
                      fontSize={12}
                      fontFamily="Poppins-Regular"
                      color="textPrimary"
                      style={{ lineHeight: 21 }}
                    >
                      View menu
                    </Text>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={18}
                      color={theme.colors.textPrimary}
                    />
                  </View>
                </View>
              </View>

              {/* Divider */}
              <View style={{ height: 0.5, backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />

              {/* Order Items */}
              <View style={{ gap: 4 }}>
                {order.items.map((item, idx) => (
                  <Text
                    key={idx}
                    fontSize={12}
                    fontFamily="Poppins-Regular"
                    color="textPrimary"
                    style={{ lineHeight: 18 }}
                  >
                    {item}
                  </Text>
                ))}
              </View>

              {/* Divider */}
              <View style={{ height: 0.5, backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />

              {/* Order Details */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ gap: 4 }}>
                  <Text
                    fontSize={12}
                    fontFamily="Poppins-Regular"
                    color="textPrimary"
                    style={{ lineHeight: 18 }}
                  >
                    Order placed on {order.orderDate}
                  </Text>
                  <View
                    style={{
                      backgroundColor: 'rgba(45, 202, 21, 0.15)',
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 40,
                      alignSelf: 'flex-start',
                    }}
                  >
                    <Text
                      fontSize={12}
                      fontFamily="Poppins-Regular"
                      style={{ color: '#2dca15', lineHeight: 18 }}
                    >
                      {order.status}
                    </Text>
                  </View>
                </View>
                <Text
                  fontSize={18}
                  fontWeight="600"
                  fontFamily="Poppins-SemiBold"
                  color="textPrimary"
                  style={{ lineHeight: 18 }}
                >
                  {order.price}
                </Text>
              </View>

              {/* Divider */}
              <View style={{ height: 0.5, backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />

              {/* Rating */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text
                  fontSize={12}
                  fontFamily="Poppins-Regular"
                  color="textPrimary"
                  style={{ lineHeight: 18 }}
                >
                  Rate your order
                </Text>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => handleRateOrder(order.id, star)}
                    >
                      <Ionicons
                        name={order.rating >= star ? 'star' : 'star-outline'}
                        size={20}
                        color={order.rating >= star ? '#FFD700' : '#D3D3D3'}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Divider */}
              <View style={{ height: 0.5, backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />

              {/* Reorder Button */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text
                  fontSize={12}
                  fontFamily="Poppins-Regular"
                  color="textPrimary"
                  style={{ lineHeight: 18 }}
                >
                  Liked the order
                </Text>
                <TouchableOpacity onPress={() => handleReorder(order.id)}>
                  <View
                    style={{
                      backgroundColor: theme.colors.primary,
                      borderRadius: 6,
                      paddingHorizontal: 14,
                      paddingVertical: 4,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <MaterialCommunityIcons name="repeat" size={16} color={theme.colors.mainBackground} />
                    <Text
                      fontSize={14}
                      fontFamily="SF Pro"
                      style={{ color: theme.colors.mainBackground }}
                    >
                      Reorder
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Orders;
