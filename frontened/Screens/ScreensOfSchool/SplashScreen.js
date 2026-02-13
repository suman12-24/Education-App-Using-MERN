import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

const BottomSheetDemo = () => {
    // ref
    const bottomSheetModalRef = useRef(null);

    // snap points
    const snapPoints = useMemo(() => ['25%', '50%'], []);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index) => {
        // console.log('handleSheetChanges', index);
    }, []);

    // renders
    return (
        <View style={{ flex: 1, marginTop: '10%' }}>
            <BottomSheetModalProvider>
                <Button
                    onPress={handlePresentModalPress}
                    title="Present Modal"
                    color="black"
                    accessibilityLabel="Open bottom sheet modal"
                />
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                >
                    <BottomSheetView style={styles.contentContainer}>
                        <Text>Awesome 🎉</Text>
                    </BottomSheetView>
                </BottomSheetModal>
            </BottomSheetModalProvider>
        </View>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BottomSheetDemo;
