import { useState } from 'react';
import SplashScreen from '../components/SplashScreen';

export default function AppIndex() {
    const [splashFinished, setSplashFinished] = useState(false);

    if (!splashFinished) {
        return <SplashScreen onFinish={() => setSplashFinished(true)} />;
    }

    return null;
}
