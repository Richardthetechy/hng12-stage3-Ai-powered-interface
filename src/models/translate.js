const Translator = async (scr, dest, targetText) => {
    try {
        console.log(dest, src)
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
        console.error("Translation Error:", e);
        throw new Error("Translation failed");
    }
}

export default Translator