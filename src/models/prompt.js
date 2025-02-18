async function Prompt(userPrompt) {
    try {
        const capabilities = await window.ai.languageModel.capabilities();
        if (capabilities.available === "readily") {
            const session = await self.ai.languageModel.create();
            const prompt = userPrompt;
            const result = await session.prompt(prompt);
            console.log(result); // Negative
            return (result)
        }
    } catch (e) {
        console.error(e)
        return (e)
    }
}

export default Prompt
