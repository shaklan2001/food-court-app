import { Text, View } from '@/src/components/ui';
import React from 'react';

const DineIn = () => {
    return (
        <View flex={1} bg="mainBackground" justifyContent="center" alignItems="center">
            <Text variant="header" color="primary">
                Dine-In Tab
            </Text>
            <Text variant="body" color="textSecondary" marginTop="s">
                Reserve your table for dining
            </Text>
        </View>
    )
}

export default DineIn;
