const Translator = async (scr, dest, targetText) => {
    try {
        const translator = await window.ai.translator.create({
            sourceLanguage: scr,
            targetLanguage: dest,
            monitor(m) {
                m.addEventListener('downloadprogress', (e) => {
                    console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                });
            },
        })
        const result = await translator.translate(targetText);
        return result
    } catch (e) {
        console.error("Translation error:", e);
        return "Translation failed. Please try again.";
    }
}

export default Translator