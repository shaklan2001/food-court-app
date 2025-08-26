import { Text, View } from '@/src/components/ui';
import { pageHorizantalPadding } from '@/src/utils/commomCompute';
import { NotificationIcon, SearchIcon, ShoppingCartIcon, SortIcon, WalletIcon } from '@/src/utils/Svgs';
import React, { memo } from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const SearchBar = memo(() => {
    return (
        <View
            flexDirection="row"
            gap="s"
            paddingHorizontal={pageHorizantalPadding}
        >
            <View
                flex={1}
                height={48}
                backgroundColor="cardSecondaryBackground"
                borderRadius="s"
                borderWidth={1}
                borderColor="border"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                paddingHorizontal="m"
            >
                <Text
                    fontSize={16}
                    color="inputPlaceholder"
                >
                    Search
                </Text>
                <SortIcon />
            </View>
            <TouchableOpacity>
                <View
                    width={48}
                    height={48}
                    backgroundColor="primary"
                    borderRadius="s"
                    justifyContent="center"
                    alignItems="center"
                >
                    <SearchIcon />
                </View>
            </TouchableOpacity>
        </View>
    )
})

const Header = memo(() => {
    return (
        <View flexDirection="row" justifyContent="space-between" alignItems="center" paddingHorizontal={pageHorizantalPadding} >
            <View>
                <View flexDirection="row" alignItems="center">
                    <TouchableOpacity>
                        <View
                            width={48}
                            height={48}
                            backgroundColor="mainBackground"
                            borderRadius="s"
                            borderWidth={1}
                            borderColor="border"
                            justifyContent="center"
                            alignItems="center"
                            position="relative"
                        >
                            <ShoppingCartIcon />
                            <View
                                position="absolute"
                                top={8}
                                right={8}
                                width={8}
                                height={8}
                                borderRadius="s"
                                backgroundColor="primary"
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View
                            width={48}
                            height={48}
                            backgroundColor="mainBackground"
                            borderRadius="s"
                            borderWidth={1}
                            borderColor="border"
                            justifyContent="center"
                            alignItems="center"
                            position="relative"
                        >
                            <WalletIcon />
                            <View
                                position="absolute"
                                top={8}
                                right={8}
                                width={8}
                                height={8}
                                borderRadius="s"
                                backgroundColor="primary"
                            />
                        </View>
                    </TouchableOpacity>

                </View>
            </View>
            <View flexDirection="row" alignItems="center" gap="s">
                <TouchableOpacity>
                    <View
                        width={48}
                        height={48}
                        backgroundColor="mainBackground"
                        borderRadius="s"
                        borderWidth={1}
                        borderColor="border"
                        justifyContent="center"
                        alignItems="center"
                        position="relative"
                    >
                        <ShoppingCartIcon />
                        <View
                            position="absolute"
                            top={8}
                            right={8}
                            width={8}
                            height={8}
                            borderRadius="s"
                            backgroundColor="primary"
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View
                        width={48}
                        height={48}
                        backgroundColor="mainBackground"
                        borderRadius="s"
                        borderWidth={1}
                        borderColor="border"
                        justifyContent="center"
                        alignItems="center"
                        position="relative"
                    >
                        <NotificationIcon />
                        <View
                            position="absolute"
                            top={8}
                            right={8}
                            width={8}
                            height={8}
                            borderRadius="s"
                            backgroundColor="primary"
                        />
                    </View>
                </TouchableOpacity>

            </View>
        </View>
    )
})

const Title = memo(() => {
    return (
        <View flexDirection="row" alignItems="center" paddingHorizontal={pageHorizantalPadding} >
            <View flex={1}>
                <Text
                    fontSize={14}
                    fontWeight="600"
                    color="textPrimary"
                    marginBottom="xs"
                >
                    Hi Akash 👋
                </Text>
                <Text
                    fontSize={20}
                    fontWeight="bold"
                    color="textPrimary"
                >
                    Welcome To Smart CSK
                </Text>
            </View>
        </View>
    )
})

const Home = () => {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
            <Header />
            <Title />
            <SearchBar />
        </SafeAreaView>
    );
};

export default Home;

