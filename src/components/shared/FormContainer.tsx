import React, { memo } from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';
import { View } from '../ui';

interface FormContainerProps extends ScrollViewProps {
    children: React.ReactNode;
    borderTopLeftRadius?: number;
    borderTopRightRadius?: number;
    paddingHorizontal?: number;
    paddingTop?: number;
    paddingBottom?: number;
}

const FormContainer = memo(({
    children,
    borderTopLeftRadius = 60,
    borderTopRightRadius = 60,
    paddingHorizontal = 24,
    paddingTop = 32,
    paddingBottom = 40,
    ...scrollViewProps
}: FormContainerProps) => {
    return (
        <View
            backgroundColor="mainBackgroundLight"
            style={{
                borderTopLeftRadius: 60,
            }}
            flex={1}
            overflow="hidden"
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal,
                    paddingTop,
                    paddingBottom,
                    flexGrow: 1,
                }}
                style={{ flex: 1 }}
                {...scrollViewProps}
            >
                {children}
            </ScrollView>
        </View>
    );
});

FormContainer.displayName = 'FormContainer';

export default FormContainer;
