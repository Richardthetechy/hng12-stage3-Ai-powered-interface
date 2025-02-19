async function Prompt(userPrompt) {
    try {
        const capabilities = await window.ai.languageModel.capabilities();
        if (capabilities.available === "readily") {
            const session = await window.ai.languageModel.create();
            const prompt = userPrompt;
            const result = await session.prompt(prompt);
            console.log(result); // Negative
            return (result)
        } else {
            // Handle the case where the language model is not readily available
            console.warn("Language model is not readily available.");
            return "Language model is not readily available."; // Or return a default message
        }
    } catch (e) {
        console.error(e)
        return (e)
    }
}

export default Prompt
