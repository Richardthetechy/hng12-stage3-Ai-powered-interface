const DetectLang = async (userText) => {
    console.log(userText);

    try {
        const languageDetectorCapabilities = await window.ai.languageDetector.capabilities();
        const canDetect = languageDetectorCapabilities.available;

        let detector;
        if (canDetect === 'no') {
            // The language detector isn't usable.
            return;
        }
        if (canDetect === 'readily') {
            // The language detector can immediately be used.
            detector = await self.ai.languageDetector.create();
            console.log(userText);

            const results = await detector.detect(userText);

            const bestResult = results.reduce((prev, current) =>
                prev.confidence > current.confidence ? prev : current
            );
            console.log(bestResult.detectedLanguage, bestResult.confidence);
            return bestResult.detectedLanguage;
        } else {
            // The language detector can be used after model download.
            detector = await self.ai.languageDetector.create({
                monitor(m) {
                    m.addEventListener('downloadprogress', (e) => {
                        console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                    });
                },
            });
            await detector.ready;
            const results = await detector.detect(userText);


            if (results.length === 0) return;
            const bestResult = results.reduce((prev, current) =>
                prev.confidence > current.confidence ? prev : current
            );
            // console.log(bestResult.detectedLanguage, bestResult.confidence);
            return bestResult.detectedLanguage;
        }
    } catch (e) {
        console.error("Detector error:", e);
        throw new Error("Detection failed");
    }
}
export default DetectLang