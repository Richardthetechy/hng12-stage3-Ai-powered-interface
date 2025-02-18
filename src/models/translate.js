const Translator = async (scr, dest, targetText) => {
    try {
        const translator = await self.ai.translator.create({
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
        console.error(e)
    }
}

export default Translator