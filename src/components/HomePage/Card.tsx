import { memo } from "react";
import { View } from "../ui";

export const Card = memo(({ children, notification = false }: { children: React.ReactNode; notification?: boolean }) => {
    return (
        <View
            width={52}
            height={52}
            backgroundColor="mainBackground"
            borderRadius="m"
            borderWidth={1}
            justifyContent="center"
            alignItems="center"
            position="relative"
            borderColor="cardSecondaryBackground"
        >
            {children}
            {notification && (
                <View
                    position="absolute"
                    top={12}
                    right={12}
                    width={12}
                    height={12}
                    borderRadius="xxl"
                    backgroundColor="primary"
                    borderWidth={2}
                    borderColor="mainBackground"
                />
            )}
        </View>
    );
});


Card.displayName = 'Card';
