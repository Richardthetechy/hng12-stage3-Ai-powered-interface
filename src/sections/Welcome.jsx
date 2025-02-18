import { Terminal } from "lucide-react"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

const Welcome = () => {
    return (
        <Alert className="w-[500px] h-[100px] bg-[#29292b] text-gray-50">
            <Terminal color="white" className="h-4 w-4" />
            <AlertTitle>Hey!</AlertTitle>
            <AlertDescription>
                What's on your Mind.
            </AlertDescription>
        </Alert>
    )
}

export default Welcome