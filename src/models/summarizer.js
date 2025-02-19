const SummaryFunc = async (aiText) => {
    const options = {
        type: 'key-points',
        format: 'plain-text',
        length: 'short',
    };
    try {

        const available = (await window.ai.summarizer.capabilities()).available;
        if (available === 'no') {
            return "Summarization is currently unavailable.";
        }
        let summarizer = await window.ai.summarizer.create(options);
        if (available !== 'readily') {
            summarizer.addEventListener('downloadprogress', (e) => {
                console.log(e.loaded, e.total);
            });
            await summarizer.ready;
        }
        const summary = await summarizer.summarize(aiText);
        console.log("summary", summary);
        return summary;
    } catch (e) {
        console.error("Summarization error:", e);
        return "Failed to summarize. Please try again.";
    }
}

export default SummaryFunc