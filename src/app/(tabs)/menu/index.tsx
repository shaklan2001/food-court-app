import { Text, View } from '@/src/components/ui';
import React from 'react';

const Menu = () => {
    return (
        <View flex={1} bg="mainBackground" justifyContent="center" alignItems="center">
            <Text variant="header" color="primary">
                Menu Tab
            </Text>
            <Text variant="body" color="textSecondary" marginTop="s">
                Browse our delicious menu
            </Text>
        </View>
    )
}

export default Menu;
