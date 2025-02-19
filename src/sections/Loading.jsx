import { Skeleton } from "@/components/ui/skeleton"
const Loading = () => {
    return (
        <div className="flex flex-col space-y-3 w-full max-w-[400px]">
            <Skeleton className="w-full h-[225px]  rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 " />
                <Skeleton className="h-4" />
            </div>
        </div>
    )
}

export default Loading