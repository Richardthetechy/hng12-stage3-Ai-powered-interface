import React, { useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import Nav from './sections/Nav'
import './index.css'
import { useForm } from "react-hook-form"
import SendIcon from '@mui/icons-material/Send';
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from 'react'
import Welcome from './sections/Welcome'
import Prompt from './models/prompt'
import SummaryFunc from './models/summarizer'
import DetectLang from './models/detector'
import Translator from './models/translate'
import Loading from './sections/Loading'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
const App = () => {
    const [messages, setMessages] = useState([])
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false)
    const messagesEndRef = useRef(null)
    const [selectedLanguage, setSelectedLanguage] = useState("en"); // Default to English
    const [isTranslating, setIsTranslating] = useState(false);
    const languageMap = {
        en: "English",
        es: "Spanish",
        fr: "French",
        de: "German",
        zh: "Chinese",
        pt: "Portuguese",
        ru: "Russian",
        tr: "Turkish",
    };
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])
    const handleTranslate = async (text) => {
        if (selectedLanguage === "en") {
            // Do nothing if the selected language is English
            return;
        }

        setIsTranslating(true);

        try {
            const translatedText = await Translator("en", selectedLanguage, text); // Translate from English to selected language

            // Add the translated text as a new AI message
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now(),
                    content: translatedText,
                    isAi: true,
                    timestamp: new Date().toISOString(),
                    isTranslation: true, // Optional: Mark as a translation
                    language: selectedLanguage // Add the target language
                }
            ]);
        } catch (error) {
            console.error("Translation failed:", error);
            // Optionally, add an error message to the chat
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now(),
                    content: "Failed to translate. Please try again.",
                    isAi: true,
                    isError: true,
                    timestamp: new Date().toISOString()
                }
            ]);
        } finally {
            setIsTranslating(false);
        }
    };

    const handleSummarize = async (text) => {
        setIsSummarizing(true);

        try {
            const summarizedText = await SummaryFunc(text);

            setMessages(prev => [
                ...prev,
                {
                    id: Date.now(),
                    content: summarizedText,
                    isAi: true,
                    timestamp: new Date().toISOString(),
                    isSummary: true
                }
            ]);
        } catch (error) {
            console.error("Summarization failed:", error);
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now(),
                    content: "Failed to summarize. Please try again.",
                    isAi: true,
                    isError: true,
                    timestamp: new Date().toISOString()
                }
            ]);
        } finally {
            setIsSummarizing(false);
        }
    };
    const onSubmit = async (data) => {
        const userInput = data.text.trim()
        if (!userInput) return


        try {
            const lang = await DetectLang(userInput)
            if (!lang) throw new Error("Invalid language detection");
            // Add user message
            setMessages(prev => [...prev, {
                id: Date.now(),
                content: userInput,
                isAi: false,
                language: lang,
                timestamp: new Date().toISOString()
            }])

            reset()
            setIsProcessing(true)
            // Add loading indicator
            setMessages(prev => [...prev, {
                id: 'loading',
                content: '',
                isAi: true,
                isLoading: true,
                timestamp: new Date().toISOString()
            }])

            let aiResponse = ''

            try {
                if (lang !== "en") {
                    const aiTranslation = await Translator(lang, 'en', userInput);
                    aiResponse = await Prompt(aiTranslation);
                } else {
                    aiResponse = await Prompt(userInput);
                }
            } catch (promptError) {

                if (lang === "en") {
                    // For English input, use original text if prompt fails
                    aiResponse = userInput;
                } else {
                    // For non-English, attempt translation to selected language
                    try {
                        aiResponse = await Translator(lang, selectedLanguage, userInput);
                    } catch (translateError) {
                        aiResponse = 'An error occurred. Please try again.';
                    }
                }
            }


            setMessages(prev => prev.filter(msg => msg.id !== 'loading').concat({
                id: Date.now(),
                content: aiResponse,
                isAi: true,
                timestamp: new Date().toISOString()
            }))
        } catch (error) {
            console.error(error)
            setMessages(prev => prev.filter(msg => msg.id !== 'loading').concat({
                id: Date.now(),
                content: 'Sorry, an error occurred. Please try again.',
                isAi: true,
                isError: true,
                timestamp: new Date().toISOString()
            }))
        }
        finally {

            setIsProcessing(false)
        }
    }

    const MessageBubble = ({ message, onSummarize, onTranslate }) => (
        <div className={cn(
            "flex flex-col gap-3 p-4 max-w-[80%] rounded-2xl",
            message.isAi ? "bg-[#29292b] self-start" : "bg-[#505051] self-end",
            message.isError && "bg-red-500/20 text-red-500"
        )}>
            <div className="flex gap-3 items-center">
                {message.isAi && (
                    <Avatar className="h-6 w-6 self-start">
                        <AvatarImage src="https://avatars.githubusercontent.com/u/188351179?v=4&size=64" />
                        <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                )}
                <div className="flex-1">
                    {message.isLoading ? (
                        <Loading />
                    ) : (
                        <div className="prose prose-invert">
                            {message.content.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex gap-5 justify-between text-xs text-gray-400">
                {!message.isAi && (
                    <span>Language: {languageMap[message.language] || message.language}</span>
                )}
                <span className='block'>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
            {/* Add Summarize Button */}
            {message.isAi && !message.isSummary && message.content.split(/\s+/).length > 150 && (
                <Button
                    onClick={() => onSummarize(message.content)}
                    disabled={isSummarizing}
                    className="mt-2 self-end"
                >
                    {isSummarizing ? "Summarizing..." : "Summarize"}
                </Button>
            )}
            {message.isAi && !message.isTranslation && (
                <div className="flex bg-[#29292b] text-gray-50 gap-2 mt-2 self-end">
                    <Select onValueChange={(value) => setSelectedLanguage(value)}>
                        <SelectTrigger className="bg-[#29292b] w-[100px]">
                            <SelectValue placeholder={languageMap[selectedLanguage] || "Language"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                            <SelectItem value="pt">Portuguese</SelectItem>
                            <SelectItem value="ru">Russian</SelectItem>
                            <SelectItem value="tr">Turkish</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={() => onTranslate(message.content)}
                        disabled={isTranslating || selectedLanguage === "en"}
                    >
                        {isTranslating ? "Translating..." : "Translate"}
                    </Button>
                </div>
            )}
        </div>
    )

    return (
        <div className="flex flex-col h-screen bg-[#1b1b1f] overflow-hidden text-gray-50">
            <Nav />

            <main className="container flex-1 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1 p-4">
                    <div className="flex flex-col gap-4 min-h-full pb-8">
                        {messages.length === 0 && !isProcessing ? (
                            <Welcome />
                        ) : (
                            messages.map((message) => (
                                <MessageBubble key={message.id}
                                    message={message}
                                    onSummarize={handleSummarize}
                                    onTranslate={handleTranslate} />

                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>

                <div className="border-t border-[#333] p-4 bg-[#1b1b1f]">
                    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto flex items-center justify-center gap-2">
                        <div className="flex-1 flex gap-2">
                            <textarea
                                {...register("text", { required: true })}
                                placeholder="Type your message..."
                                disabled={isProcessing}
                                autoComplete="off"
                                className="p-3 pr-12 bg-[#29292b] border-none rounded-2xl py-5 hover:bg-[#2e2e30] focus-visible:ring-2 resize-y overflow-auto max-h-40 min-h-[50px] w-full"
                            />
                            <div>
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="h-full w-full"
                                    disabled={isProcessing}
                                >
                                    <SendIcon fontSize='large'
                                        style={{ width: "1.5rem", height: "1.5rem" }}
                                    />
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default App