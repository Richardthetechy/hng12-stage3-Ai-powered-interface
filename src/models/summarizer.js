const SummaryFunc = async (aiText) => {
    const options = {
        type: 'key-points',
        format: 'plain-text',
        length: 'short',
    };
    try {

        const available = (await window.ai.summarizer.capabilities()).available;
        let summarizer;
        if (available === 'no') {
            // The Summarizer API isn't usable.
            return;
        }
        if (available === 'readily') {
            // The Summarizer API can be used immediately .
            summarizer = await window.ai.summarizer.create(options);
        } else {
            // The Summarizer API can be used after the model is downloaded.
            summarizer = await window.ai.summarizer.create(options);
            summarizer.addEventListener('downloadprogress', (e) => {
                console.log(e.loaded, e.total);
            });
            await summarizer.ready;
        }
        const summary = await summarizer.summarize(aiText);
        console.log("summary", summary);

        return summary
    } catch (e) {
        console.log(e)
    }
}

export default SummaryFunc