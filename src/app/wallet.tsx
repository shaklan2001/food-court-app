import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ListRenderItemInfo, StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import Text from '../components/ui/Text';
import View from '../components/ui/View';
import { betterwayApiCall } from '../network/useApiPort';
import { useAppSelector } from '../store/store';
import { showToast } from '../utils';
import { ScreenHeader } from './cart';

const StarIconSVG = memo(({ width = 24, height = 24 }: { width?: number; height?: number }) => (
  <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
    <G clipPath="url(#clip0_752_1341)">
      <Path d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z" fill="white"/>
      <Path d="M13.9999 2.92822L17.1806 9.37293L24.2927 10.4064L19.1463 15.4229L20.3612 22.5063L13.9999 19.162L7.63857 22.5063L8.85345 15.4229L3.70703 10.4064L10.8192 9.37293L13.9999 2.92822Z" fill="#FFCE00"/>
      <Path d="M14 19.164V19.162L20.3613 22.5063L19.1464 15.4229L24.2928 10.4064L17.1807 9.37293L14 2.92822V19.164Z" fill="#FFBC00"/>
      <Path d="M14 2.92822V13.0806L24.2928 10.4064L17.1807 9.37293L14 2.92822Z" fill="#FF9500"/>
      <Path d="M20.3613 22.5063L14 13.0806L7.63867 22.5063L14 19.162L20.3613 22.5063Z" fill="#FFAA00"/>
      <Path d="M20.3613 22.5063L14 13.0806V19.164V19.162L20.3613 22.5063Z" fill="#FF9500"/>
      <Path d="M10.8192 9.37293L3.70703 10.4064L13.9999 13.0806V2.92822" fill="#FFDC4A"/>
    </G>
    <Defs>
      <ClipPath id="clip0_752_1341">
        <Rect width="28" height="28" fill="white"/>
      </ClipPath>
    </Defs>
  </Svg>
));

StarIconSVG.displayName = 'StarIconSVG';

const ShoppingBagIcon = memo(() => (
  <FontAwesome5 name="shopping-bag" size={20} color="#A20538" />
));

ShoppingBagIcon.displayName = 'ShoppingBagIcon';

const BackgroundCard = memo(() => (
  <View
    position="absolute"
    top={0}
    left={0}
    right={0}
    bottom={0}
  >
    <Image 
      source={require('@/assets/images/bg-image.png')} 
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 16,
      }}
      resizeMode="cover"
    />
  </View>
));

BackgroundCard.displayName = 'BackgroundCard';

const TransactionItem = memo(({
  icon,
  name,
  date,
  amount,
  isCredit = false,
}: {
  icon: React.ReactNode;
  name: string;
  date: string;
  amount: string;
  isCredit?: boolean;
}) => {
  return (
    <View
      flexDirection="row"
      alignItems="center"
      backgroundColor="mainBackground"
      padding="m"
      borderRadius="m"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={0.05}
      shadowRadius={2}
      shadowColor="textPrimary"
      elevation={1}
    >
      <View
        width={40}
        height={40}
        borderRadius="xxl"
        borderWidth={1}
        borderColor="primary"
        alignItems="center"
        justifyContent="center"
        marginRight="s"
      >
        {icon}
      </View>
      <View flex={1}>
        <Text
          fontSize={16}
          fontWeight="500"
          color="textPrimary"
          fontFamily="Poppins-Medium"
          marginBottom="xs"
        >
          {name}
        </Text>
        <Text
          fontSize={12}
          color="textSecondary"
          fontFamily="Poppins-Regular"
        >
          {date}
        </Text>
      </View>
      <Text
        fontSize={16}
        fontWeight="600"
        color={isCredit ? "success" : "danger"}
        fontFamily="Poppins-SemiBold"
      >
        {amount}
      </Text>
    </View>
  );
});

TransactionItem.displayName = 'TransactionItem';

const BalanceCard = memo(({ balance, isLoading }: { balance: number; isLoading: boolean }) => (
  <View 
    marginTop="l"
    marginBottom="xl"
    backgroundColor="mainBackground"
    shadowOffset={{ width: 0, height: 2 }}
    shadowOpacity={0.1}
    shadowRadius={4}
    elevation={2}
    borderRadius="xl"
  >
    <View
      height={120}
      borderRadius="xl"
      overflow="hidden"
      position="relative"
      justifyContent="center"
      alignItems="center"
    >
      <BackgroundCard />
      <View justifyContent="center" alignItems="center">
        <Text fontSize={14} color="textOnPrimary" fontFamily="Poppins-Regular">Total Balance</Text>
      </View>
      <View flexDirection="row" alignItems="center">
        <StarIconSVG width={32} height={32} />
        {isLoading ? (
          <ActivityIndicator size="large" color="#FFFFFF" style={{ marginLeft: 8 }} />
        ) : (
          <Text fontSize={36} lineHeight={42.5} fontWeight="bold" color="textOnPrimary" fontFamily="Poppins-Bold" marginLeft="s">
            {balance.toLocaleString()}
          </Text>
        )}
      </View>
    </View>
    <View
      flexDirection="row"
      paddingHorizontal="m"
      paddingVertical="m"
      backgroundColor="mainBackground"
      borderRadius="m"
      justifyContent="center"
      marginBottom="m"
      alignItems="center"
      gap="s"
      marginLeft={'s'}
    >
      <Ionicons name="information-circle-outline" size={30} color="#6B7280" />
      <Text
        fontSize={12}
        color="textPrimary"
        lineHeight={15}
        fontFamily="Poppins-Regular"
        opacity={0.8}
      >
        These coins are your digital currency! Collect, save, and spend them on exciting features and rewards.
      </Text>
    </View>
  </View>
));

BalanceCard.displayName = 'BalanceCard';

type WalletTransaction = {
  id: string;
  changePoints: number;
  reason?: string;
  relatedOrderId?: number;
  createdAt?: string;
};

type TransactionDisplay = {
  id: string;
  name: string;
  date: string;
  amount: string;
  isCredit: boolean;
  icon: React.ReactNode;
};

const ITEM_HEIGHT = 80;
const ITEM_SPACING = 10;
const STACK_OFFSET = 12;

const AnimatedTransactionCard = memo(({ transaction, index, scrollY }: {
  transaction: TransactionDisplay;
  index: number;
  scrollY: SharedValue<number>;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const position = index * (ITEM_HEIGHT + ITEM_SPACING);
    const inputRange = [
      position - (ITEM_HEIGHT + ITEM_SPACING),
      position,
      position + (ITEM_HEIGHT + ITEM_SPACING),
    ];

    const scale = interpolate(
      scrollY.value,
      inputRange,
      [0.92, 1, 0.95],
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      scrollY.value,
      inputRange,
      [STACK_OFFSET, 0, -STACK_OFFSET],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      scrollY.value,
      inputRange,
      [0.85, 1, 0.9],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  }, [index, scrollY]);

  return (
    <Animated.View style={[styles.transactionCardWrapper, { marginBottom: ITEM_SPACING }, animatedStyle]}>
      <TransactionItem
        icon={transaction.icon}
        name={transaction.name}
        date={transaction.date}
        amount={transaction.amount}
        isCredit={transaction.isCredit}
      />
    </Animated.View>
  );
});

AnimatedTransactionCard.displayName = 'AnimatedTransactionCard';

export default function WalletScreen() {
  const token = useAppSelector((state) => state.auth.token);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const fetchWalletBalance = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await betterwayApiCall({
        method: 'GET',
        url: 'GET_WALLET_BALANCE',
        auth: token,
        query: token ? { timestamp: Date.now() } : undefined,
      });

      if (response?.data?.balance !== undefined) {
        setBalance(response.data.balance);
      } else if (response?.data?.data?.balance !== undefined) {
        setBalance(response.data.data.balance);
      }
    } catch (error: unknown) {
      const message =
        (error as { message?: string })?.message ||
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to fetch wallet balance';
      showToast({
        message,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchWalletTransactions = useCallback(async () => {
    try {
      setTransactionsLoading(true);
      const response = await betterwayApiCall({
        method: 'POST',
        url: 'GET_WALLET_TRANSACTIONS',
        auth: token,
        body: {
          page: 1,
          limit: 14,
        },
      });

      const normalizedResponse = response as {
        transactions?: WalletTransaction[];
        data?: {
          transactions?: WalletTransaction[];
          data?: {
            transactions?: WalletTransaction[];
          };
        };
      };

      const list =
        normalizedResponse.transactions ??
        normalizedResponse.data?.transactions ??
        normalizedResponse.data?.data?.transactions ??
        [];

      if (Array.isArray(list)) {
        setTransactions(list as WalletTransaction[]);
      } else {
        setTransactions([]);
      }
    } catch (error: unknown) {
      const message =
        (error as { message?: string })?.message ||
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to fetch wallet transactions';
      showToast({
        message,
        type: 'error',
      });
      setTransactions([]);
    } finally {
      setTransactionsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchWalletBalance();
    fetchWalletTransactions();
  }, [fetchWalletBalance, fetchWalletTransactions]);

  const formattedTransactions = useMemo<TransactionDisplay[]>(() => {
    const sorted = [...transactions].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return sorted.map((transaction) => {
      const isCredit = (transaction.changePoints ?? 0) >= 0;
      const dateLabel = transaction.createdAt
        ? new Date(transaction.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
        : '—';

      const amountValue = transaction.changePoints ?? 0;
      const amountLabel = `${amountValue > 0 ? '+' : ''}${amountValue} pts`;

      return {
        id: transaction.id,
        name: transaction.reason ?? (transaction.relatedOrderId
          ? `Order #${transaction.relatedOrderId}`
          : 'Wallet activity'),
        date: dateLabel,
        amount: amountLabel,
        isCredit,
        icon: isCredit ? <StarIconSVG width={28} height={28} /> : <ShoppingBagIcon />,
      };
    });
  }, [transactions]);

  const emptyComponent = useMemo(() => (
    <View alignItems="center" justifyContent="center" paddingVertical="l">
      {transactionsLoading ? (
        <ActivityIndicator size="small" color="#A20538" />
      ) : (
        <Text fontSize={14} color="textSecondary" fontFamily="Poppins-Regular">
          No transactions yet. Start ordering to earn coins!
        </Text>
      )}
    </View>
  ), [transactionsLoading]);

  const renderTransaction = useCallback(
    ({ item, index }: ListRenderItemInfo<TransactionDisplay>) => (
      <AnimatedTransactionCard
        transaction={item}
        index={index}
        scrollY={scrollY}
      />
    ),
    [scrollY],
  );

  const keyExtractor = useCallback((item: TransactionDisplay) => item.id, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
        <View flex={1} backgroundColor="mainBackgroundLight">
          <ScreenHeader title="My Wallet" />

          <View paddingHorizontal="m">
            <BalanceCard balance={balance} isLoading={isLoading} />
          </View>

          <View flexDirection="row" alignItems="center" justifyContent="space-between" paddingHorizontal="m" marginBottom="s">
            <Text
              fontSize={20}
              fontWeight="bold"
              color="textPrimary"
              fontFamily="Poppins-Bold"
            >
              Recent Transactions
            </Text>
            <View
              paddingHorizontal="m"
              paddingVertical="s"
              backgroundColor="mainBackground"
              borderRadius="xl"
              shadowOffset={{ width: 0, height: 1 }}
              shadowOpacity={0.05}
              shadowRadius={2}
              elevation={1}
            >
              <Text fontSize={12} color="textSecondary" fontFamily="Poppins-Medium">
                {transactionsLoading ? 'Loading activity…' : `${transactions.length} entries`}
              </Text>
            </View>
          </View>

          <View flex={1}>
            <Animated.FlatList
              data={formattedTransactions}
              keyExtractor={keyExtractor}
              renderItem={renderTransaction}
              ListEmptyComponent={emptyComponent}
              onScroll={scrollHandler}
              scrollEventThrottle={16}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
              showsVerticalScrollIndicator={false}
              initialNumToRender={5}
              maxToRenderPerBatch={10}
              windowSize={5}
              removeClippedSubviews
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  transactionCardWrapper: {
    width: '100%',
  },
});


