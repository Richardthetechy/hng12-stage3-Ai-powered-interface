import React from 'react'
import { Button } from "@/components/ui/button"
import Nav from './sections/Nav'
import './index.css'
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { Send } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from 'react'
import Welcome from './sections/Welcome'
import Prompt from './models/prompt'
import SummaryFunc from './models/summarizer'
import DetectLang from './models/detector'
import Translator from './models/translate'
import Loading from './sections/Loading'
import Scroll from './sections/Scroll'


const App = () => {
  const [userText, setUserText] = useState('')
  const [text, setText] = useState('')
  const [summarizedText, setSummarizedText] = useState('')
  const [translatedText, setTranslatedText] = useState('');
  const [isPrompting, setIsPrompting] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const onSubmit = async (data) => {
    const userInput = data.text;
    setUserText(userInput)
    reset()
    setIsPrompting(true);
    const lang = await DetectLang(userInput)
    console.log(lang);

    setSummarizedText('')
    if (lang !== "en") {
      const response = await Translator(lang, 'en', userInput)
      setText(response)
    } else {
      const response = await Prompt(userInput)
      setText(response)
    }
    // const translated = await Translator(lang, 'fr', response)
    // setTranslatedText(translated)

    setIsPrompting(false)

  }
  const shouldSummarize = text.split('').length > 150

  const handleSumarizer = async (text) => {
    console.log(text);
    setIsSummarizing(true)
    let newText = await SummaryFunc(text)
    setIsSummarizing(false)
    setSummarizedText(newText)
  }

  return (
    <div className='flex flex-col bg-[#1b1b1f] min-h-screen overflow-x-hidden text-gray-50 cursor-pointer cursor-white'>
      <Nav />
      <main className='flex-1 flex justify-center w-full container relative'>
        <div>
          {
            (!text && !isPrompting) ?
              <Welcome />
              : (isPrompting) ?
                <div>
                  <Loading />
                  <div>
                    <p>{userText}</p>

                  </div>
                </div>
                : (text && !isPrompting) ?
                  (
                    <div className='flex flex-col items-center justify-center mt-5 p-4 bg-[#202021] h-fit rounded-xl border border-[#575757]'>

                      <Scroll text={text} />
                      <div>
                        {
                          shouldSummarize && (
                            <Button onClick={() => handleSumarizer(text)}>Summarize</Button>
                          )
                        }
                      </div>
                      <div>
                        <p>{translatedText}</p>
                      </div>
                      <div className='flex flex-col gap-2'>
                        {
                          (isSummarizing) ?
                            <Loading />
                            : (
                              summarizedText && (
                                <ScrollArea className="overflow-y-auto max-h-[250px] w-[350px] bg-[#29292b] rounded-lg border border-[#08080a] p-4 mt-8">
                                  <p>{summarizedText}</p>
                                </ScrollArea>
                              )
                            )
                        }
                      </div>
                    </div>


                  )
                  : <div></div>
          }
        </div>


        <div className='absolute  bottom-0 left-0 w-full '>
          <div className='container p-8'> {/* Container for centering and padding */}
            <form onSubmit={handleSubmit(onSubmit)} className='flex w-full justify-center items-center'>
              <div className='relative border border-[#08080a] rounded-md'>
                <Input {...register("text", { required: true })}
                  autoComplete="off"
                  className="bg-[#29292b]  sm:w-[500px] md:w-[600px]" />
                {/* errors will return when field validation fails  */}
                {/* {errors.text && <span className='text-red-500 absolute'>This field is required</span>} */}
              </div>
              <Button type="submit" size="icon" className="w-14">
                <Send size={30} />
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App