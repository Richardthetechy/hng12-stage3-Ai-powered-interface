import { ScrollArea } from "@/components/ui/scroll-area"
const Scroll = ({ text }) => {
    return (
        <div className='mt-2'>
            <ScrollArea className="overflow-y-auto max-h-[350px] w-[350px] bg-[#29292b] rounded-lg border border-[#08080a] p-4">
                <p>{text}</p>
            </ScrollArea>
        </div>
    )
}

export default Scroll