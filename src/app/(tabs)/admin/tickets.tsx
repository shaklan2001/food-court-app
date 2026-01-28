import { AntDesign } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { memo, useCallback, useState } from 'react';
import { Dimensions, ImageBackground, Pressable, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from '../../../components/ui';

const { width, height } = Dimensions.get('window');

type TicketStatus = 'Pending' | 'Completed';

interface Ticket {
    id: string;
    status: TicketStatus;
    description: string;
}

const MOCK_TICKETS: Ticket[] = [
    { id: '2323232', status: 'Pending', description: 'Application is not working properly' },
    { id: '2323232', status: 'Pending', description: 'Application is not working properly' },
    { id: '2323232', status: 'Completed', description: 'Application is not working properly' },
    { id: '2323232', status: 'Completed', description: 'Application is not working properly' },
    { id: '2323232', status: 'Pending', description: 'Application is not working properly' },
    { id: '2323232', status: 'Completed', description: 'Application is not working properly' },
    { id: '2323232', status: 'Pending', description: 'Application is not working properly' },
];

const FilterButton = ({ title, isActive, onPress }: { title: string; isActive: boolean; onPress: () => void }) => (
    <Pressable onPress={onPress}>
        <View
            paddingHorizontal="l"
            paddingVertical="m"
            borderRadius="m"
            backgroundColor={isActive ? 'primary' : 'transparent'}
            borderWidth={1}
            borderColor={isActive ? 'primary' : 'border'}
            style={isActive ? undefined : { borderColor: 'rgba(1,1,1,0.15)' }}
        >
            <Text
                fontSize={14}
                color={isActive ? 'textOnPrimary' : 'textPrimary'}
                fontFamily="Poppins-Regular"
                fontWeight="400"
            >
                {title}
            </Text>
        </View>
    </Pressable>
);

const TicketCard = ({ ticket }: { ticket: Ticket }) => (
    <Pressable
        onPress={() => router.push({
            pathname: '/admin/ticket-details',
            params: { 
                id: ticket.id,
                status: ticket.status,
                description: ticket.description
            }
        })}
    >
        <View
            backgroundColor="mainBackground"
            borderRadius="m"
            padding="m"
            marginBottom="m"
            flexDirection="row"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
            }}
        >
            {/* Left Border Indicator */}
            <View
                width={6}
                backgroundColor="primary"
                borderRadius="s"
                marginRight="m"
                style={{ height: '100%' }}
            />
            
            <View flex={1}>
                <View flexDirection="row" alignItems="center" marginBottom="xs">
                    <Text
                        fontSize={16}
                        fontWeight="600"
                        color="textPrimary"
                        fontFamily="Poppins-SemiBold"
                        marginRight="m"
                    >
                        Ticket: #{ticket.id}
                    </Text>
                    
                    
                    <View
                        paddingHorizontal="m"
                        paddingVertical="xs"
                        borderRadius="l"
                        style={{ backgroundColor: ticket.status === 'Pending' ? '#FFC107' : '#7CB342' }}
                    >
                        <Text
                            fontSize={12}
                            color="textOnPrimary"
                            fontFamily="Poppins-Medium"
                        >
                            {ticket.status}
                        </Text>
                    </View>
                </View>
                
                <Text
                    fontSize={14}
                    color="textSecondary"
                    fontFamily="Poppins-Regular"
                >
                    {ticket.description}
                </Text>
            </View>
        </View>
    </Pressable>
);

const Tickets = memo(() => {
    const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed'>('All');

    const handleBack = useCallback(() => {
        router.back();
    }, []);

    const filteredTickets = MOCK_TICKETS.filter(ticket => {
        if (filter === 'All') return true;
        return ticket.status === filter;
    });

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ImageBackground
                source={require('../../../../assets/images/primary_bg.webp')}
                style={styles.background}
                resizeMode="cover"
            >
                <StatusBar barStyle='light-content' backgroundColor="#A20538" translucent />
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <View
                            justifyContent="center"
                            alignItems="center"
                            paddingTop="xl"
                            paddingBottom="l"
                            minHeight={height * 0.15}
                        >
                            <View
                                position="absolute"
                                top={60}
                                left={24}
                                zIndex={1}
                            >
                                <Pressable onPress={handleBack}>
                                    <AntDesign name="arrow-left" size={28} color="white" />
                                </Pressable>
                            </View>
                            <Text
                                fontSize={32}
                                fontWeight="bold"
                                color="textOnPrimary"
                                textAlign="center"
                                fontFamily="Poppins-Bold"
                                lineHeight={42}
                            >
                                Tickets
                            </Text>
                        </View>

                        <View
                            backgroundColor="mainBackgroundLight"
                            style={{ borderTopLeftRadius: 60 }}
                            flex={1}
                        >
                            <View
                                flexDirection="row"
                                gap="m"
                                paddingHorizontal="l"
                                paddingTop="xl"
                                paddingBottom="l"
                            >
                                <FilterButton 
                                    title="All" 
                                    isActive={filter === 'All'} 
                                    onPress={() => setFilter('All')} 
                                />
                                <FilterButton 
                                    title="Pending" 
                                    isActive={filter === 'Pending'} 
                                    onPress={() => setFilter('Pending')} 
                                />
                                <FilterButton 
                                    title="Completed" 
                                    isActive={filter === 'Completed'} 
                                    onPress={() => setFilter('Completed')} 
                                />
                            </View>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollContent}
                            >
                                {filteredTickets.map((ticket, index) => (
                                    <TicketCard key={index} ticket={ticket} />
                                ))}
                                <View height={40} /> 
                            </ScrollView>
                        </View>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </>
    );
});

Tickets.displayName = 'Tickets';

const styles = StyleSheet.create({
    background: {
        marginTop: 12,
        width,
        height,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
});

export default Tickets;
