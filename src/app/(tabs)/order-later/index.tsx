import { Text, View } from '@/src/components/ui';
import React from 'react';

const OrderLater = () => {
    return (
        <View flex={1} bg="mainBackground" justifyContent="center" alignItems="center">
            <Text variant="header" color="primary">
                Order Later Tab
            </Text>
            <Text variant="body" color="textSecondary" marginTop="s">
                Schedule your orders for later
            </Text>
        </View>
    )
}

export default OrderLater;
